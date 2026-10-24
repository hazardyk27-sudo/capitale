#!/bin/sh
# Install the GitHub-pinned Whop one-time-plan protection on Hetzner.
# Run as root on the betcapitale.com web server; changes no Whop subscriptions.
set -eu

REPO="https://raw.githubusercontent.com/hazardyk27-sudo/capitale/019bee6954ffd7c20ccfba06ea87ca8023a24737/deployments/betcapitale"
DEST="/opt/betcapitale-whop"
APP="/app/betcapitale/dist/index.cjs"
UNIT="/etc/systemd/system/betcapitale-web.service.d/30-one-time-whop-guard.conf"

if [ "$(id -u)" -ne 0 ]; then echo "Run as root" >&2; exit 1; fi
if [ ! -f "$APP" ]; then echo "Missing live BetCapitale application bundle" >&2; exit 1; fi
command -v curl >/dev/null
command -v python3 >/dev/null
command -v node >/dev/null
mkdir -p "$DEST"

curl --proto '=https' --tlsv1.2 -fsSL "$REPO/ensure_one_time.py" -o "$DEST/ensure_one_time.py.download"
curl --proto '=https' --tlsv1.2 -fsSL "$REPO/whop_one_time_plans.json" -o "$DEST/whop_one_time_plans.json.download"
python3 -m py_compile "$DEST/ensure_one_time.py.download" 2>/dev/null || true
python3 -m json.tool "$DEST/whop_one_time_plans.json.download" >/dev/null

mv "$DEST/ensure_one_time.py.download" "$DEST/ensure_one_time.py"
mv "$DEST/whop_one_time_plans.json.download" "$DEST/whop_one_time_plans.json"
chmod 0644 "$DEST/ensure_one_time.py" "$DEST/whop_one_time_plans.json"
python3 -m py_compile "$DEST/ensure_one_time.py"

# First patch/check: keep rollback copy, fail on unknown app formats.
python3 "$DEST/ensure_one_time.py" --ensure "$APP"

mkdir -p "$(dirname "$UNIT")"
cat > "$UNIT" <<'EOF'
[Service]
ExecStartPre=/usr/bin/python3 /opt/betcapitale-whop/ensure_one_time.py --ensure /app/betcapitale/dist/index.cjs
EOF
chmod 0644 "$UNIT"
systemctl daemon-reload
systemctl restart betcapitale-web.service
systemctl is-active --quiet betcapitale-web.service

python3 - <<'PY'
import json
from pathlib import Path
from urllib.request import urlopen
expected=json.loads(Path('/opt/betcapitale-whop/whop_one_time_plans.json').read_text())
ids=[expected['trial']['id']]+[p['new_id'] for p in expected['plans']]
for uri in ('http://127.0.0.1:5000/api/whop/plans',
            'https://betcapitale.com/api/whop/plans'):
    with urlopen(uri,timeout=20) as response:
        assert response.status==200
        actual=json.load(response)
        assert [p['id'] for p in actual]==ids,uri
        assert all(actual[i+1]['days']==p['days'] and actual[i+1]['price']==p['price']
                   for i,p in enumerate(expected['plans'])),uri
    print('PASS:',uri,'9/9 plans and prices/durations matched')
PY

echo "Installed: source-pinned, restart-time Whop plan guard; old memberships untouched."
