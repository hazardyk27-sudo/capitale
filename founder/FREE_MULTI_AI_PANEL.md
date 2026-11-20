# CAPITALE — FREE multi-AI Italian male video panel

**Status: EXPERIMENTAL.** The current active experimental multi-model solution replaces Codex for this experiment without deleting historical files. It does NOT collect real survey responses or validate software profitability.

## Model selection and free-only split

For the fixed 100 fictional adult Italian male profiles at founder/italy_male_personas_100.json:

| Provider | Model | People in 100 study | People in 20 pilot | People in 10 pilot | Input actually sent |
|---|---|---:|---:|---:|---|
| Google Gemini Developer API | gemini-3.5-flash-lite | 40 | 8 | 4 | Actual MP4 video + audio, Files API |
| GroqCloud FREE PLAN | qwen/qwen3.8-27b | 30 | 6 | 3 | Three silent MP4 frames: 0.5, 3, 12 seconds |
| OpenRouter FREE | nvidia/nemotron-3.5-super-vl:free | 30 | 6 | 3 | Eight silent MP4 frames: 0.5, 1.5, 3, 5, 9, 15, 21, 27 seconds |

Each provider receives DIFFERENT fictional people, with fixed segment quotas. The 40/30/30 split is stored under founder/free_multi_ai_assignments.json. Models also see DIFFERENT visual/audio input coverage, so claims such as "Gemini is more trustworthy than Qwen" cannot be inferred from this experiment.

The same video MP4 filename and SHA256 are used as the source asset for all providers. Groq has a documented three-image limit per request.

All three models are from distinct model families (Gemini / Qwen / NVIDIA Nemotron), not merely different hostnames for the same weights.

## Set up three free API keys yourself (NEVER paste secrets into chat)

1. Gemini: Existing GitHub secret GEMINI_API_KEY should be retained; you previously tested it successfully.
2. Groq: https://console.groq.com/keys — create an API key for your Free Plan organization, save in repository secret GROQ_API_KEY. Avoid upgrading the account to a paid billing plan.
3. OpenRouter: https://openrouter.ai/settings/keys — create a key and save under OPENROUTER_API_KEY. The script only uses the explicit :free NVIDIA model, checks the model catalog for zero prompt/output pricing before a request, and will NOT fall back to a paid model.

Save the two new secrets at:
https://github.com/hazardyk27-sudo/capitale/settings/secrets/actions

Use ONLY these exact secret names; don't share values. Configuring a secret does NOT prove the key is valid: only a real API response can verify it.

## Required MP4 upload

The previously supplied 28.28-second video was uploaded to the ChatGPT conversation but not automatically to GitHub. Check that the real video is present on the default branch as:

founder/videos/CAPITALE_Reels_Gemini_Test.mp4

If not, upload it using:
https://github.com/hazardyk27-sudo/capitale/upload/main/founder/videos

**Warning:** Uploading the file to a public GitHub repo exposes the video publicly. Only upload content you own/are authorized to disclose.

## Start first real pilot

Open:
https://github.com/hazardyk27-sudo/capitale/actions/workflows/capitale_free_multi_ai_reels.yml

1. First run panel_size=10 and dry_run=true (no API requests). The MP4 must be uploaded, because the workflow verifies the file path.
2. Then panel_size=10, dry_run=false. That requests **4 Gemini**, **3 Groq**, **3 OpenRouter** separate genuine API calls; with the same source MP4 but different modality coverage.
3. Download the Artifacts ZIP and inspect manifest.json. Verify counts by provider; missing keys/quota errors must be visible under errors.json.
4. After inspecting actual video-specific answers, you may run panel_size=100, dry_run=false. That requests up to 40/30/30. Free quotas can end the run early; failures are never fabricated into completed responses.

The new workflow runs Python tests automatically on GitHub push with ZERO API calls. Actual calls only occur for explicit manual workflow_dispatch with dry_run=false.

## Cost protection

- No OpenAI/Codex API usage.
- OpenRouter model name MUST end with :free. The runner also checks that the public model catalog reports zero input/output prices; if this cannot be verified, OpenRouter calls stop.
- Groq key must belong to a Free Plan account and no paid billing should be enabled. The code only asks for a documented public vision model; account settings still govern charges.
- Gemini Developer API free quota depends on your account; avoid enabling paid billing if you want a strictly no-spend run.
- Requests can fail from rate limits, availability, capacity, expired keys, model changes or API-policy restrictions. A "complete" report requires 100 validated model responses. Do not describe mock tests or dry runs as real video evaluations.

## Per-person report fields

Each response is independently saved under founder/free_multi_ai_runs/RUN_ID/answers/Pxxx.json with source provider, model name, modalities and video SHA256.

Each user-fiction evaluation covers first 3s stopping, excitement, trust, perception that the CAPITALE software is working (NOT actual verification), watching to end, potentially skipping, Instagram follow and Telegram interest, main doubts, specific on-video moments, and concrete edit recommendations.

The report:
- Keeps model groups separated and counts actual validated responses.
- Names fictional respondents who become excited and personally believe the performance story.
- Does not interpret fictional response fractions as conversion, view-through, or actual money results.
- Distinguishes model-family differences from unequal media exposure and unverified personas.

Use real Instagram analytics and voluntarily collected feedback for actual validation.

## Verified documentation as of 2026-11-20

- Groq vision Qwen model and max three images: https://console.groq.com/docs/vision
- Groq free-plan and per-model rate limits: https://console.groq.com/docs/rate-limits
- OpenRouter free model list and :free: https://openrouter.ai/collections/free-models
- OpenRouter free 50 requests/day, 20/min, and limits: https://openrouter.ai/pricing
- NVIDIA free vision model: https://openrouter.ai/nvidia/nemotron-3.5-super-vl:free
- Gemini free tier varies by model: https://ai.google.dev/gemini-api/docs/pricing

Mistral also provides a free monthly usage budget and image-vision endpoints, but API availability for the owner's plan is not verified. It is a **future optional fourth provider**, not counted in the active 100-person test:
https://docs.mistral.ai/admin/billing-usage/subscriptions
https://docs.mistral.ai/inference/conversations/vision
