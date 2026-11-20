# CAPITALE — 50 Gemini + 50 Codex video panel

**Status: EXPERIMENTAL — two-model synthetic audience-critique workflow.**
These are not real Italian users. Two model families can expose additional hypotheses, but no result proves real impressions, retention, follow/Telegram conversions, software performance or profits.

## API keys and costs

- **Gemini 50**: Uses the existing GitHub secret GEMINI_API_KEY and the existing Gemini API free-tier quota, if available. No payment promise; 50 video requests may exceed an account's free quota.
- **Codex 50**: Use the Codex CLI signed in **with your existing ChatGPT account**, not an OPENAI_API_KEY. This draws from your ChatGPT plan's Codex allowance and normally has no extra per-API-call charge within the plan. Rate limits apply; you may need to pause and resume.
- **Do not create an OPENAI_API_KEY just for this workflow**. If you elect to use OpenAI's paid API or Agents API instead, API token usage is billed separately.
- **Important technical separation:** GitHub Actions executes the Gemini half. The Codex half is executed **locally or in an authorized Codex workspace with ChatGPT login**. GitHub Actions does NOT automatically share the local ChatGPT/Codex login. Do not copy cookies, OAuth tokens, API keys, or Codex auth files into GitHub Secrets.

Official instructions: https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan
Billing distinction: https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex

## Frozen split

Assignments are fixed in founder/hybrid_panel_assignments.json and refer to the frozen identities in founder/italy_male_personas_100.json:

- 50 unique Gemini IDs, 50 unique Codex IDs. No profile is assigned twice.
- Each of the six persona segments is split exactly in half.
- Total panel 10 = Gemini 5 + Codex 5.
- Total panel 20 = Gemini 10 + Codex 10.
- Total panel 100 = Gemini 50 + Codex 50.

Because different fictional people are assigned to each provider, a difference between the two is **not a controlled estimate of model quality**. An additional paired-model test on the SAME people would be required to study model-specific differences.

## Media prerequisite

**The original uploaded chat MP4 is not present inside the repo until you upload it.** Use exactly:

founder/videos/CAPITALE_Reels_Gemini_Test.mp4

Upload at https://github.com/hazardyk27-sudo/capitale/upload/main/founder/videos. Only add a clip you have permission to put in the repository; if public the clip will be public. The earlier failed GitHub Actions run was due to this file being absent.

All model results must refer to the same MP4 SHA256. The merger rejects mismatching videos.

## Step 1 — Gemini half, in GitHub

https://github.com/hazardyk27-sudo/capitale/actions/workflows/capitale_gemini_reels_video_panel.yml

Run workflow settings:
- panel_size=10 for the first pilot; later 100 for the full study (these are TOTAL personas).
- hybrid_split=true — required for 50/50.
- dry_run=true for the no-API setup test, then dry_run=false for genuine Gemini calls.
- model=gemini-3.5-flash-lite, delay_seconds=10 initially.

The pilot makes **5** real Gemini calls, while a full study makes **50** Gemini calls. Download the artifact ZIP after it finishes; check manifest.json for completed number. Failed calls are not filled with synthetic text.

## Step 2 — Codex half, using ChatGPT sign-in

In a local copy of the same CAPITALE repository with the same MP4 available:

1. Install the Codex CLI, according to official Codex instructions: https://developers.openai.com/codex/
2. Run codex login and choose **Sign in with ChatGPT**. Do NOT select API-key auth.
3. Install Python >=3.11 and ffmpeg for local video frame extraction.
4. Pilot: python scripts/codex_reels_hybrid_panel.py --n 5
5. Full: python scripts/codex_reels_hybrid_panel.py --n 50

Each persona is sent to a distinct codex exec process in a fresh session with schema-validated JSON. The runner saves each response individually under founder/hybrid_runs/codex/answers/Pxxx.json; rerunning reuses validated answers to avoid needlessly spending plan allowance.

**Codex-media limitation:** Unlike Gemini's direct video+audio processing, this current Codex runner supplies video JPG frames sampled every 2 seconds. If the user provides a verified transcript next to the MP4 as CAPITALE_Reels_Gemini_Test.transcript.txt, the prompt supplies it; otherwise it explicitly tells Codex NOT to invent spoken dialogue. The inputs are not perfectly identical in modality, and this must be stated in comparisons.

If Codex cannot use an image viewing tool in the environment or only returns generic descriptions, stop and improve the visual pathway before treating the answer as valid media review. The scripts have NOT yet been tested against real Codex login in this environment.

## Step 3 — Merge both results into one report

Download and unzip the Gemini run artifact. It contains a directory of the form founder/video_runs/RUN_ID-ATTEMPT.

From the repository directory:

python scripts/merge_hybrid_reels_results.py --gemini-dir "path/to/unzipped/founder/video_runs/RUN_ID-ATTEMPT" --codex-dir founder/hybrid_runs/codex --out founder/hybrid_runs/combined

The report contains real-model **fictional** reactions split by model:
- Would stop in first 3 seconds, watch to end, feel excited.
- Perceived belief that CAPITALE's software works, explicitly NOT proof.
- Hypothetical follow and Telegram reactions.
- Doubts, objections and people who are both excited and personally persuaded.
- Per-model response totals, missing IDs, and media limitations.

The report declares COMPLETE only with **50 verified Gemini + 50 verified Codex** answers for the same clip. No fake completed users.

## Next validation

1. Confirm video is actually uploaded.
2. Pilot 5/5 with the same asset.
3. Audit whether both model types actually saw the images and whether their answers cite on-screen moments.
4. Only then proceed to 50/50.

To test against *real viewers*, use genuine Italian Instagram analytics and voluntarily provided feedback, not LLM hypothetical percentages.
