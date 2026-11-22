#!/usr/bin/env python3
"""Reproduce Software V22 local SXF crest module from the exact immutable V21 source.
Never modifies the live importmap, API, records or the upstream Software V21 file.
"""
from pathlib import Path
import hashlib
ROOT=Path('/opt/capitale-software-sxf-shared-crests-v22-20261122')
OLD=Path('/app/betcapitale/dist/public/assets/admin-software-v21-mobile-matchlist-20261122.js')
NEW=ROOT/'admin-software-v22-shared-sxf-crest-library-20261122.js'
original=OLD.read_bytes()
assert hashlib.sha256(original).hexdigest()=='abd5f32c5a8f7b607c4c997251e96577dfa1016fbf0e030c08b16c89fd42eee5','Unexpected V21 source; abort'
s=original.decode('utf-8')
start=s.index('function capitaleCrest(name)')
stop=s.index('const capitaleFlowCSS=',start)
assert 550<stop-start<1300
newfn=(ROOT/'capitale-shared-crest-component.js').read_text()
compiled=s[:start]+newfn+s[stop:]
assert 'CAPITALE_ESPN_AUTO[key]' not in compiled
assert compiled.count('function capitaleCrest(name)')==1
assert compiled.count('const capitaleFlowCSS=')==1
assert compiled.count('capitaleCrest(')==s.count('capitaleCrest(')
assert hashlib.sha256(compiled.encode()).hexdigest()=='b0cccb6e7ac5f171f74b1eed66567d291ce6226ec77aec2c3cf0f5d0b82f3734'
NEW.write_text(compiled)
print('REPRODUCIBLE_SXF_SOFTWARE_V22',len(compiled),hashlib.sha256(compiled.encode()).hexdigest())