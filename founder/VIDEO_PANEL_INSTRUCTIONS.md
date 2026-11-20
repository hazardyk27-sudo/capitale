# CAPITALE Reel: actual video Gemini persona test

## Your supplied video
- Original ChatGPT upload: `1106(4).mp4` (28.282 seconds, 1080x1920, includes audio).
- A full-resolution 1080x1920 H.264/AAC review copy is prepared for upload as `CAPITALE_Reels_Gemini_Test.mp4`. It contains the same clip and audio but is compressed (~5.1MB).
- The chat upload is **not automatically visible inside GitHub Actions**. A file transfer step is necessary before Gemini can see the actual media.

## One-time upload: user action

1. Download the compressed video attached to the ChatGPT reply.
2. Open https://github.com/hazardyk27-sudo/capitale/upload/main/founder/videos
3. Upload **CAPITALE_Reels_Gemini_Test.mp4**, making sure to preserve the exact filename. Commit to main. Do not upload `.zip` or a storyboard instead.
4. If your repo is public, this video will be public too. Only upload content you are authorized and willing to publish.

## Run in GitHub
1. Open https://github.com/hazardyk27-sudo/capitale/actions/workflows/capitale_gemini_reels_video_panel.yml
2. Run workflow with panel_size=10, dry_run=true. This validates the MP4 path but makes **zero Gemini requests**.
3. Then run panel_size=10, dry_run=false. The runner uploads the **actual MP4 (video+audio)** to Gemini's Files API ONCE, then sends the same video reference with ten distinct frozen Italian male personas to separate Gemini `generateContent` API calls.
4. If ten succeed, choose panel_size=100, dry_run=false. This issues up to 100 separate calls; quota failures/partial runs are recorded, not hidden. **100 valid replies are not guaranteed on a free Gemini account.**

## What is recorded per fictional person?

- Hook: 0-3s `stops/maybe/scrolls` and a grounded reason
- Whether they would hypothetically finish, and possible drop-off window
- Curiosity, excitement and trust on subjective **0-10 ordinal scales**
- Whether excitement is reported and what triggered it
- Whether this fictional viewer *believes the software works* (`yes/uncertain/no`), with a reason. **This is not a verification of results.**
- Whether profit claims are verifiable just from the video
- Instagram follow and Telegram join scenarios with objections
- Exact memorable video moment, proof required, one recommended edit, Italian-language response

The report lists persons who report **both excitement and perceived belief**, those excited but unconvinced, those hooked but unconvinced, and immediate scrollers. Every validated original answer stays in `answers/Pxxx.json`, with `responses.csv`, `report.md` and `manifest.json` downloadable under the GitHub run's Artifacts.

## Interpretation

All 100 personas are **fictional**, generated from the fixed file `founder/italy_male_personas_100.json`. They are not 100 human video viewers. Calls are isolated but use the same Gemini model; results share its biases. Even 100 positive 'software works' perceptions cannot verify performance or predict Instagram reach, real trust, follow/Telegram conversion, or Italy gambling-marketing legal compliance.

The Gemini Files API supports reusing a video file across multiple requests. Documentation: https://ai.google.dev/gemini-api/docs/video-understanding and https://ai.google.dev/gemini-api/docs/files .

GitHub Actions Artifacts are retained 30 days; source video remains in the repo until deleted. The Gemini upload is deleted on completion when possible.
