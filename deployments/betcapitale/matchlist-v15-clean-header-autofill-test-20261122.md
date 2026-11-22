# CAPITALE Match List v2 V15 — Clean header, autonomous resolver E2E verification · LIVE 22 Nov 2026

## Request
User saw screenshot with large orange `SAMPLE DATA · DEMO` at the right side of the poster header, asked how to test the permanent AutoFill/crest resolver and that the demo label no longer appear **there**. The existing fixture names, times, logo designs, metrics console and V14 automation must remain unchanged.

## Design change
- Copied V14 into isolated source `/opt/capitale-software-en-60048de8ba8f9736466a0d5ca13594d6b9023d87/betcapitale-admin-matchlist-v2-clean-header-v15-20261122-work`. Changed only `client/src/components/match-list-template-2.tsx`.
- Removed the header's upper/right `SAMPLE DATA · DEMO` text entirely. Header now contains only CAPITALE logo, headline, date and fixture count.
- Retained data transparency by relocating a small, unobtrusive gray `ILLUSTRATIVE VALUES` note in the poster **bottom/footer** only when generated example values are switched on. **Verified real Software mode has no illustrative note.** This avoids presenting synthetic betting signals as verified SXF findings without recreating the conspicuous header text.
- All V12/V13 pure white embossed 3D cards, crest sizing, colors, real fixture names/kickoffs, results mode, match count and poster layout remain identical.

## Verified AutoFill end-to-end trial without production database modification
- Queried third-party football logo provider for an independent **Juventus** club as a real network/provider test, whose name was absent from V3 catalog.
- The **unchanged production worker logic** was copied into an **isolated `/tmp/capitale-crest-autofill-e2e-v1/` worktree**, changing only its output catalog/cache directory and fixture test source (hardcoded `Juventus`) so no live today_match records, live logo catalog or worker timer were affected.
- First run: `VERIFIED Juventus` (real PNG 20,669 bytes), atomic local test catalog went from 138→139 entries. Second run: `attempted:0, added:0`, confirming previously downloaded PNG reuse and no duplicate provider calls. Neither operation wrote to production DB.
- Live `capitale-crest-autofill.timer` remained **enabled+active** and its production service returned success on repeated three-minute scans of the DB's real today_matches fixtures.

## Code and live QA
- `tsc --noEmit` PASS, Vite production build PASS, 13 deterministic fixture/SXF matcher tests PASS.
- Native Puppeteer staging test **5/5 PASS** and live HTTPS browser-local mock-data test **5/5 PASS** for auto-cached Metz+Boulogne, nine-fixture Story, nine-fixture Post, fifteen-fixture Post, and sample mode disabled in genuine-Software fallback. In every mode: no demo text in header, logos 18/18 or 30/30 loaded; bottom `ILLUSTRATIVE VALUES` only on samples, disappears on real mode, 1080×1920 or 1080×1350 dimension, no overflow or JS errors.
- No authenticated admin user's actual PNG-download click tested, but native full-resolution export DOM screenshotted. **No backend, DB/Supabase or real SXF records mutated.**

## Safe live publishing
- Added immutable `/assets/admin-social-media-v15-clean-header-20261122.js`, sha `d32bbc905796f8115d2d675c6032e73ac8d335486912fd14a055f4396f65abb4`.
- Live `index.html` changed only one social importmap alias V14→V15; other three **Software V17** aliases, V33 homepage, backend unchanged.
- Prior HTML SHA `35f7ac865c8d28332539c9edcfb3acf06358ef3eab948dd9d8a5067fda3cfff3`; V15 live HTML `87fded449abab8c554c87ac074b5d901900b23088af0a98e6c4eca450f1a3c1e`. Backend SHA `79b0bed37aed965979fc0d0bc6c093c4dcfe07a59934096cc65f2fb5c7ce3832`.
- Rollback exact prior HTML `/app/betcapitale/rollback-matchlist-v2-clean-header-v15-20261122/index.html` (V14, timer remains active).

## User self-test procedure
1. Open `/admin` → Social Media → Match List v2.
2. For a match already introduced by the existing coupon sync, wait up to one timer interval (3 minutes) for logo resolver (and up to 90s for open page refresh).
3. Verify the crest appears if an exact soccer-club match exists; otherwise original team initials stay, never guessed. Real source and fixture names/kickoff stay stable.
4. Turn off `Fill with demo values` to show only verified Software values. Turn on for *clearly illustrative* sample artwork.

## GitHub records
- `deployments/betcapitale/matchlist-v14-to-v15-clean-header-20261122.patch`
- `deployments/betcapitale/matchlist-v15-production-importmap-20261122.patch`
- `deployments/betcapitale/matchlist-v15-clean-header-autofill-test-20261122.md`
- `tasarımcı-sohbet.md` updated.

[executed on device: smartxflow (72356617-e1b7-486f-af4e-02cc4f4b23bf)]