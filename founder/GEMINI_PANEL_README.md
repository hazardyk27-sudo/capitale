# CAPITALE — Gemini Italy Synthetic Audience Panel

**Status: EXPERIMENTAL.** This is an AI roleplay panel, not market research, a study of real Italian consumers, real Meta analytics, or a prediction of follower/Telegram conversion rates.

## One-time setup (owner action)

1. Obtain a Gemini API key from https://aistudio.google.com/api-keys (choose a project/model that supports the free tier).
2. In https://github.com/hazardyk27-sudo/capitale/settings/secrets/actions select **New repository secret**.
3. Secret **Name:** GEMINI_API_KEY. Paste the key into **Secret** and save it. **Do not send the key to ChatGPT or put it in committed files.** Do not enable paid billing unless you intend to pay. Verify the available model and quotas at https://aistudio.google.com/rate-limit
4. Open https://github.com/hazardyk27-sudo/capitale/actions/workflows/capitale_gemini_italy_panel.yml and choose **Run workflow**.
5. Start with **panel_size=10, dry_run=true** to verify configuration with **zero Gemini calls**. Then run **panel_size=10, dry_run=false** to request ten separate model evaluations. If successful, select 20 or 100.

## How it works

- Reuses the original unchanged Founder Skill persona-dealing code from \`.claude/skills/founder-consumer/panel.py\` plus the CAPITALE target assumptions in \`founder/customer.json\`.
- Every synthetic persona sees the **same** text from \`founder/pitch.md\` and has a fresh independent Gemini API *request*. Responses share model bias; they are **not** separate humans or 100 different AIs.
- Gemini is asked for follow and Telegram interest on a three-level **fictional** scale with a short explanation and a categorized objection.
- JSON responses are checked against the expected unique persona ID and required fields before saving.
- Any missing, invalid or rate-limited answer is explicitly marked incomplete. No missing response is made up or counted.
- The GitHub workflow is manually triggered. It does **not** send any real Instagram data or visit Instagram, nor does it alter SXF/ANALYST/NEWS/POLY/FINAL files.

## Results

On the completed GitHub Actions run, open **Artifacts** and download \`capitale-gemini-panel-...\`.

The archive contains:

- \`personas.json\` — reproducibly assigned synthetic Italian profiles
- \`answers/P001.json\` and so on — one validated model response file per successfully completed call
- \`manifest.json\` — requested vs actually completed, attempts, model, seed and source hash
- \`errors.json\` — failures, without inventing substitute opinions
- \`responses.csv\` — tabular answers
- \`report.md\` — aggregate summaries with prominent simulation limitations

Artifacts expire after **30 days**. They are not automatically committed to the GitHub source tree. Archive only verified reports after reviewing them.

**No Reel video has been supplied to this workflow.** Therefore it intentionally does not evaluate first-three-second viewing, retention or the Instagram discovery algorithm. It evaluates only the provided profile description and optional free Telegram proposition.

## Costs / quotas

The default model is \`gemini-3.5-flash-lite\`, which currently has a Gemini Developer API Free tier. Model availability, per-minute/day quotas and terms can change. 100 successful API calls on free tier are **not guaranteed**. See https://ai.google.dev/gemini-api/docs/pricing and https://ai.google.dev/gemini-api/docs/rate-limits.

The workflow pauses between requests and retries transient failures. A persistent 429 may result in a **partial** run; consult the manifest rather than describing 100 calls as completed.

Google's Gemini free-tier inputs may be used for product improvement under its terms. Do not send private user/customer data or unpublished business secrets in \`founder/pitch.md\`.

## Important legal and interpretation safeguards

CAPITALE's content concerns football betting. Do not treat these simulated reactions as evidence that gambling promotion is lawful in Italy, that Meta will approve it, or that Instagram will recommend it. Compliance requires separate review.

Do not use synthetic quotes as genuine Italian customer testimonials. Counts of YES/CONDITIONAL/NO are **model-generated scenario counts**, not conversion rates or representative polling.

## Local check

Python 3.11+, standard library only:

\`\`\`sh
python -m unittest discover -s tests -p 'test_gemini_italy_panel.py' -v
python scripts/gemini_italy_panel.py --n 10 --dry-run
\`\`\`

To run with real API calls locally, set \`GEMINI_API_KEY\` privately in the shell and remove \`--dry-run\`.
