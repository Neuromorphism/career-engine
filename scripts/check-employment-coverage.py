#!/usr/bin/env python3
"""Validate the documented person-based cutoff and every published detailed group."""
import json, tomllib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
data = json.loads((ROOT / 'data/employment-coverage.json').read_text())
careers = tomllib.loads((ROOT / 'data/careers.toml').read_text())
occupations = {n['id'] for n in careers['nodes'] if n['kind'] == 'occupation'}
threshold = data['total_employed'] / 10_000
assert data['threshold_people'] == threshold, 'Cutoff must use employed people'
assert len(data['rows']) == 595, 'The complete published table must be audited'
assert len({r['line'] for r in data['rows']}) == len(data['rows']), 'Duplicate source row'
assert next(r for r in data['rows'] if r['kind'] == 'total')['employed_people'] == data['total_employed']
qualified = []
for row in data['rows']:
    assert row['kind'] in ('total', 'rollup', 'detailed')
    assert isinstance(row['employed_people'], int) and row['employed_people'] >= 0
    qualifies = row['kind'] == 'detailed' and row['employed_people'] > threshold
    assert row['qualifies'] == qualifies, row['label']
    assert len(row['profession_ids']) == len(set(row['profession_ids']))
    assert set(row['profession_ids']) <= occupations, row['label']
    if qualifies:
        assert row['profession_ids'] and row['mapping_note'], row['label']
        qualified.append(row)
    elif row['kind'] != 'detailed':
        assert not row['profession_ids'], 'Broad rollups cannot qualify as detailed professions'
assert len(qualified) == data['qualifying_groups'] == 490
assert len(occupations) == data['catalog_occupations'] == careers['meta']['occupation_count']
print(f'Employment audit valid: {len(qualified)} qualifying detailed groups; cutoff {threshold:,.1f} people; {len(occupations)} playable professions.')
