#!/usr/bin/env python3
"""Validate the TOML source and generate dependency-free browser data."""
import argparse, ast, hashlib, json, math, operator, sys, tomllib
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'data/careers.toml'
TARGET = ROOT / 'src/career-data.js'
OPS = {ast.Add: operator.add, ast.Sub: operator.sub, ast.Mult: operator.mul, ast.Div: operator.truediv, ast.Pow: operator.pow}
def evaluate(expression, parameters):
 def walk(node):
  if isinstance(node,ast.Expression):return walk(node.body)
  if isinstance(node,ast.Constant) and type(node.value) in (int,float):return node.value
  if isinstance(node,ast.Name) and node.id in parameters:return parameters[node.id]
  if isinstance(node,ast.BinOp) and type(node.op) in OPS:
   left,right=walk(node.left),walk(node.right)
   if isinstance(node.op,ast.Pow) and abs(right)>1000:raise ValueError('Exponent exceeds model bounds')
   return OPS[type(node.op)](left,right)
  raise ValueError('Only numeric parameters and bounded arithmetic are allowed in model expressions')
 result=walk(ast.parse(expression,mode='eval'))
 if not math.isfinite(result) or result<0:raise ValueError('Impact estimate must be finite and nonnegative')
 return result

def compile_data(data):
 def indexed(records,label):
  result={item['id']:item for item in records}
  if len(result)!=len(records):raise ValueError(f'Duplicate {label} ID')
  return result
 nodes=indexed(data['nodes'],'node'); sources=indexed(data['sources'],'source'); routes=indexed(data['routes'],'route'); groups=indexed(data['soc_major_groups'],'SOC group')
 models=indexed(data['impact_models'],'impact model');indexed(data['transitions'],'transition')
 if len(groups)!=23:raise ValueError('Expected all 23 SOC major groups')
 for record in data['routes']+data['transitions']+data.get('life_path_examples',[]):
  if any(ref not in sources for ref in record.get('source_ids',[])):raise ValueError('Unknown provenance source')
 for edge in data['transitions']:
  if edge['from_id'] not in nodes or edge['to_id'] not in nodes:raise ValueError('Dangling career transition')
  if edge['automatic_unlock']:raise ValueError('Lateral transitions must retain explicit prerequisites')
 for example in data.get('life_path_examples',[]):
  if any(ref not in routes for ref in example['related_route_ids']):raise ValueError('Unknown biographical route')
  if any(ref not in nodes for ref in example['related_node_ids']):raise ValueError('Unknown biographical occupation')
 choice_ids=set()
 def validate_choices(choices, owner, training=False):
  if not 2 <= len(choices) <= 3:raise ValueError(f'{owner} needs two or three action choices')
  if len({choice['title'] for choice in choices}) != len(choices):raise ValueError(f'{owner} needs distinct choice titles')
  subjects=[choice.get('task_subject') for choice in choices]
  if any(not isinstance(subject,str) or not subject.strip() for subject in subjects):raise ValueError('Missing task subject')
  if len({subject.strip().casefold() for subject in subjects}) != len(choices):raise ValueError(f'{owner} needs different task subjects')
  for choice in choices:
   if choice['title'].startswith(('Investigate:','Rehearse together:','Improve the evidence for:','Prepare a team for:','Start:','Plan:','Practice:','Verify:','Adapt:','Lead a program:','Build a lasting institution:')):raise ValueError('Repeated task approach template')
   if training and choice['title'].startswith(('Record a trial of ','Find failure cases in ','Document the outcome of ','Review lessons from ','Scope a ')):raise ValueError('Training titles need scenario-specific actions')
   aliases=choice.get('title_aliases',[])
   if not isinstance(aliases,list) or any(not isinstance(alias,str) or not alias.strip() for alias in aliases):raise ValueError('Invalid training title alias')
   if choice['id'] in choice_ids:raise ValueError('Duplicate action choice ID')
   choice_ids.add(choice['id'])
   if not choice['description']:raise ValueError('Missing choice description')
   for key in (['reward_multiplier','rate_multiplier'] if training else ['reward','rate']):
    if not isinstance(choice[key],(int,float)) or not math.isfinite(choice[key]) or choice[key] <= 0:raise ValueError('Invalid choice reward')
   if choice.get('model_id') and choice['model_id'] not in models:raise ValueError('Unknown choice impact model')
 tree=[];curricula={};occupied=set();impact_ids=set()
 mapping={'decision_label':'decisionLabel','job_title':'jobTitle','work_label':'workLabel','work_description':'workDescription','impact_actions':'impactActions','entry_route_ids':'entryRouteIds','progression_route_ids':'progressionRouteIds','continuity_route_ids':'continuityRouteIds','credential_note':'credentialNote','onet_soc_code':'onetSocCode','mapping_precision':'mappingPrecision'}
 game_nodes={}
 for nid,node in nodes.items():
  if node['parent_id'] and node['parent_id'] not in nodes:raise ValueError(f'Missing parent: {nid}')
  lineage=set();ancestor=nid
  while ancestor:
   if ancestor in lineage:raise ValueError(f'Tree cycle: {nid}')
   lineage.add(ancestor);ancestor=nodes[ancestor]['parent_id']
  track=node['curriculum'];curricula[nid]=track
  if len(track['activities'])<4:raise ValueError(f'Insufficient curriculum: {nid}')
  for activity in track['activities']:validate_choices(activity.get('choices',[]),nid,training=True)
  progression_titles={}
  for activity in track['activities']:
   for choice in activity['choices']:
    subject=choice['task_subject']
    if ': ' in subject and subject.split(': ',1)[0] in ('Explore','Plan','Practice','Verify','Adapt'):subject=subject.split(': ',1)[1]
    titles=progression_titles.setdefault(subject,set())
    if choice['title'] in titles:raise ValueError(f'{nid} repeats a title across a work progression')
    titles.add(choice['title'])
  if not node['projects']:raise ValueError(f'Missing applied project: {nid}')
  out={mapping.get(k,k):v for k,v in node.items() if k not in ['parent_id','curriculum','kind','source_ids','soc_major_group','mapping_status','work_settings']}
  if node['kind']=='occupation':
   if node['soc_major_group'] not in groups:raise ValueError(f'Unknown SOC group: {nid}')
   occupied.add(node['soc_major_group'])
   if not node.get('job_title') or not node['evidence']:raise ValueError(f'Missing occupation evidence: {nid}')
   if any(ref not in sources for ref in node['source_ids']):raise ValueError(f'Unknown occupation source: {nid}')
   for key in ['entry_route_ids','progression_route_ids','continuity_route_ids']:
    if any(r not in routes for r in node[key]):raise ValueError(f'Unknown route: {nid}')
   actions=out.get('impactActions',[])
   if len(actions)!=3:raise ValueError(f'Expected three impact missions: {nid}')
   if [a['requirement'] for a in actions]!=sorted(a['requirement'] for a in actions):raise ValueError(f'Mission thresholds out of order: {nid}')
   for action in actions:
    if action['id'] in impact_ids:raise ValueError('Duplicate impact action')
    impact_ids.add(action['id'])
    if action.get('model_id') and action['model_id'] not in models:raise ValueError('Unknown impact model')
    validate_choices(action.get('choices',[]),action['id'])
    for choice in action['choices']:choice['modelId']=choice.pop('model_id',None)
    action['modelId']=action.pop('model_id',None)
  game_nodes[nid]=out
 for nid,node in nodes.items():
  out=game_nodes[nid]
  if node['parent_id']:
   parent=game_nodes[node['parent_id']];parent.setdefault('children',[]).append(out)
  else:tree.append(out)
 for nid,node in nodes.items():
  if node['kind']=='occupation' and game_nodes[nid].get('children'):raise ValueError(f'Occupation unexpectedly has tree children: {nid}')
 model_output={}
 for mid,model in models.items():
  metrics={output['label']:evaluate(output['expression'],model['parameters']) for output in model['outputs']}
  if len(metrics)!=len(model['outputs']):raise ValueError('Duplicate impact metric')
  model_output[mid]={**model,'metrics':metrics}
 stats={'fields':len(tree),'nodes':len(nodes),'occupations':sum(n['kind']=='occupation' for n in nodes.values()),'impactActions':len(impact_ids),'actionChoices':len(choice_ids),'routes':len(routes),'transitions':len(data['transitions']),'socGroupsRepresented':len(occupied),'documentedLifePaths':len(data.get('life_path_examples',[]))}
 if data['meta']['occupation_count']!=stats['occupations']:raise ValueError('Metadata occupation count is stale')
 return dict(careerTree=tree,curricula=curricula,impactModels=model_output,careerRoutes=routes,careerTransitions=data['transitions'],careerSources=data['sources'],careerStats=stats,careerExamples=data.get('life_path_examples',[]))

def render(source_bytes):
 payload=compile_data(tomllib.loads(source_bytes.decode()))
 checksum=hashlib.sha256(source_bytes).hexdigest()
 return '// Generated from data/careers.toml. Run npm run compile; do not edit.\n'+f'// Source SHA-256: {checksum}\n'+''.join(f'export const {key} = {json.dumps(value,ensure_ascii=False,indent=2)};\n\n' for key,value in payload.items()).rstrip()+'\n',payload['careerStats']

def main():
 parser=argparse.ArgumentParser();parser.add_argument('--check',action='store_true');args=parser.parse_args()
 text,stats=render(SOURCE.read_bytes())
 if args.check:
  if not TARGET.exists() or TARGET.read_text()!=text:raise ValueError('Generated career data is stale; run npm run compile')
 else:TARGET.write_text(text)
 print(json.dumps(stats))
if __name__=='__main__':
 try:main()
 except (ValueError,KeyError,tomllib.TOMLDecodeError) as exc:print(f'Career source error: {exc}',file=sys.stderr);sys.exit(1)
