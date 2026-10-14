#!/usr/bin/env python3
import argparse,hashlib,json,math,tomllib
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def compile_world():
 source=(ROOT/'data/world.toml').read_bytes();data=tomllib.loads(source.decode())
 careers=tomllib.loads((ROOT/'data/careers.toml').read_text())
 occupations={n['id'] for n in careers['nodes'] if n['kind']=='occupation'}
 if set(data['role_profiles'])!=occupations:raise ValueError('Every shared career must have exactly one world role profile')
 capabilities=set(data['capabilities']);services={s['id'] for s in data['services']}
 if len(services)!=len(data['services']):raise ValueError('Duplicate world service')
 def weights(items):
  if not items or set(items)-capabilities or any(not isinstance(x,(int,float)) or not math.isfinite(x) or x<=0 for x in items.values()):raise ValueError('Invalid capability weights')
 for profile in data['role_profiles'].values():
  weights(profile['capabilities'])
  if profile['service_id'] not in services:raise ValueError('Unknown profile service')
  if abs(sum(profile['capabilities'].values())-1)>1e-9:raise ValueError('Citizen capability allocations must sum to one')
 for service in data['services']:weights(service['requirements'])
 if len({p['id'] for p in data['projects']})!=len(data['projects']):raise ValueError('Duplicate project')
 for project in data['projects']:
  weights(project['requirements'])
  if not project.get('eligible_roles') or set(project['eligible_roles'])-occupations:raise ValueError('Unknown or missing qualified project roles')
  if any(not any(data['role_profiles'][role]['capabilities'].get(capability,0)>0 for role in project['eligible_roles']) for capability in project['requirements']):raise ValueError('Project lacks an eligible role for a required capability')
  if project['service_id'] not in services or not 0<project['facility_bonus']<=1:raise ValueError('Invalid project service or benefit')
 for key in ['baseline_coverage','facility_capacity','reliability','experience_bonus_cap','experience_bonus_per_milestone']:
  if not 0<=data['scenario'][key]<=1:raise ValueError('Invalid world balance parameter')
 if data['scenario']['baseline_population']<1 or data['scenario']['competence_mastery']<=0:raise ValueError('Invalid world scale')
 return '// Generated from data/world.toml. Run npm run compile; do not edit.\n// Source SHA-256: '+hashlib.sha256(source).hexdigest()+'\nexport const worldData = '+json.dumps(data,ensure_ascii=False,indent=2)+';\n'
def main():
 parser=argparse.ArgumentParser();parser.add_argument('--check',action='store_true');args=parser.parse_args();text=compile_world();target=ROOT/'world/world-data.js'
 if args.check:
  if not target.exists() or target.read_text()!=text:raise ValueError('Generated world data is stale; run npm run compile')
 else:target.write_text(text)
 print('World source valid: all career profiles, six services, seven shared projects.')
if __name__=='__main__':main()
