#!/usr/bin/env python3
"""Offline-only disaster restore for CAPITALE's immutable 2026 SXF club crest library.
Never performs HTTP requests, API calls, or DB writes. By default prints actions;
use --apply to restore missing files, preserving newer live manifest entries.
"""
from pathlib import Path
import argparse,json,hashlib,shutil,os
parser=argparse.ArgumentParser();parser.add_argument('--apply',action='store_true');args=parser.parse_args()
archive=Path('/app/betcapitale/asset-library/sxf-34-leagues-20261122');destination=Path('/app/betcapitale/dist/public/team-logos')
expected=json.loads((archive/'sha256-manifest.json').read_text());missing=[]
for basename,digest in expected.items():
 source=archive/'team-logos'/basename
 if not source.is_file() or hashlib.sha256(source.read_bytes()).hexdigest()!=digest:raise RuntimeError('Archive integrity failure: '+basename)
 target=destination/basename
 if not target.is_file():missing.append((source,target))
 elif hashlib.sha256(target.read_bytes()).hexdigest()!=digest:raise RuntimeError('Existing logo differs; refusing overwrite: '+basename)
print('OFFLINE_RESTORE_CHECK',{'assetsInArchive':len(expected),'missingAtRuntime':len(missing),'apply':args.apply})
if args.apply:
 destination.mkdir(parents=True,exist_ok=True)
 for source,target in missing:
  with target.open('xb') as out:out.write(source.read_bytes())
  target.chmod(0o644)
 previous=json.loads((archive/'current-fixture-coverage-auto.json').read_text())
 manifest=destination/'current-fixture-coverage-auto.json'
 if manifest.is_file():
  live=json.loads(manifest.read_text())
  if len(live.get('logos',{}))>=len(previous['logos']):
   assert all(live['logos'].get(k)==v for k,v in previous['logos'].items()),'Live manifest conflict, do not overwrite'
   print('MANIFEST_PRESERVED',len(live['logos']))
  else:raise RuntimeError('Partial live manifest exists: manual review required before overwrite')
 else:
  temp=destination/('.manifest.restore.'+str(os.getpid())+'.tmp')
  temp.write_text(json.dumps(previous,ensure_ascii=False,indent=2)+'\n');temp.chmod(0o644);os.replace(temp,manifest)
 print('RESTORED',len(missing))