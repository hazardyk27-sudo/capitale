# CAPITALE Match List v2 V7 — original white/orange palette restored (LIVE, 2026-11-21)

## User requirement
After seeing V6 dark-navy graphic, owner explicitly rejected it as not belonging to CAPITALE. Required **restore the earlier original color theme first, then review design again**. This is intentionally **COLOR ONLY**, not another redesign.

## Changes
- Isolated source `/opt/capitale-software-en-60048de8ba8f9736466a0d5ca13594d6b9023d87/betcapitale-admin-matchlist-v2-original-colors-v7-20261121-work` copied from live V6 source. Edited `client/src/components/match-list-template-2.tsx` with **21 precise palette substitutions**. No source data, logo, title, fixture, grid geometry, typography, element order, story/post measurements or badge rules changed.
- Story/post background white/very pale gray; header white with a very subtle warm tint; title and CAPITALE brand dark navy ink, muted cool gray date, old orange (#EF7B26) line & fixture count. Card panels white with fine gray outline and soft shadow. Team names ink dark; row index orange/gray; unchanged original vivid SXF brand-specific signal colors. Metrics A/V/N/B/O now distinct light-gray softly bordered cells with dark numbers. Positive odds movement remains green on pale green; negative remains red on pale red. Time orange on light-peach pill. White crest mounts maintained.
- Still only: `#`, two crests, home-away club names, SXF signal code, A/V/N/B/O, kickoff. No betting pick/selection, independent T, source/pending labels. A/N and other fields without verified source continue to show a dash. No fabricated/placeholder live scores.

## Tests
- TypeScript check PASS, Vite build PASS, 13 deterministic Software-source join tests PASS. Full-size 1080x1920 story (verified/unavailable source) 2/2 PASS, 1080x1350 post 1/1 PASS. 10 match rows, 20/20 local crest images, fully visible club names, no unwanted extra text, no clipping or fatal browser errors.
- Same 3 browser graphic tests repeated on live `https://betcapitale.com/admin/social-media` with requests intercepted only in isolated test browser: PASS 3/3, no production records modified. Live guest route smoke `/`, `/admin`, `/admin/social-media`, `/admin/software`, `/today`, `/plans` PASS (HTTP 200, no browser JS crash or horizontal overflow). Real authenticated admin PNG download not exercised; native-size browser screenshot tested.

## Production scope & rollback
- New immutable bundle `/app/betcapitale/dist/public/assets/admin-social-media-v7-restored-colors-20261121.js` SHA256 `06a8f3cba8ad9cdf48672daa6ca1ead900074890b9aa8ecbc08a76e4552fa27f`. Previous V6 asset kept. Live `index.html` changed **one existing importmap alias** targeting Match List v2 from V6 to V7. 3 Software v16 aliases unchanged; homepage V33, payments/admin Software, backend `dist/index.cjs`, data source and other routes preserved.
- Rollback prior HTML `/app/betcapitale/rollback-matchlist-v2-restored-colors-v7-20261121/index.html` (V6, Software v16 intact). Atomically restore that HTML to revert V7. HTML pre-SHA `63e314da4a90ed94d35340d845b54b6abfb279bcb9d679f17602025bcbf95db4`, live SHA `5eecb46a5b43611eaba57af1e6cadded18199d28096108aee140f9cc1a07221f`, backend unchanged SHA `79b0bed37aed965979fc0d0bc6c093c4dcfe07a59934096cc65f2fb5c7ce3832`.

## GitHub
- `deployments/betcapitale/matchlist-v6-to-v7-restored-colors-20261121.patch`
- `deployments/betcapitale/matchlist-v7-production-importmap-20261121.patch`
- `deployments/betcapitale/matchlist-v7-original-colors-live-20261121.md`
- `tasarımcı-sohbet.md` append only, V6 history preserved.

## Next step
Owner to review current restored colors before deciding **any** future layout revisions. Do not alter structure without new instruction.

[executed on device: smartxflow (72356617-e1b7-486f-af4e-02cc4f4b23bf)]