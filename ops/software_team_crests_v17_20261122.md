# CAPITALE Software V17 — Verified Team Logo Coverage (22 November 2026)

## Scope
The active read-only Software feed was queried on 2026-11-22 and returned **85 distinct fixtures / 170 distinct team names**. The previous V16 production frontend had 108 team names mapped to validated local PNGs, 23 names using ESPN remote logos, and 39 names without any matching crest.

**Result: 170/170 current team names now resolve to a validated local PNG.** We obtained and inspected 62 source logo images (23 ESPN and 39 team-specific FotMob IDs), reusing valid existing files where they already existed under the right team-name slug rather than overwriting them. All 62 source images were PNG, had adequate resolution, and had distinct SHA-256 hashes. The exact club ID and competition were checked before accepting abbreviations, women's teams and reserve teams.

## Live release
- Site URL: https://betcapitale.com/admin/software?v=17
- Frontend chunk: `/app/betcapitale/dist/public/assets/admin-software-v17-170-team-logos-20261122.js`
- Assets directory: `/app/betcapitale/dist/public/team-logos/`
- Live HTML: `/app/betcapitale/dist/public/index.html`
- Importmap: only the three legacy Software route module specifiers redirect to the versioned V17 chunk. Other page modules and V33 homepage stay unchanged.
- Previous HTML backup: `/app/betcapitale/dist/public/index.html.before-software-v17-170-team-logos-20261122.bak`
- Operational package and complete fixture/team/source/hash manifest: `/srv/capitale-ops/software-logo-v17-20261122/`.

## Behavior
The existing logo order (home crest + home name — away name + away crest), one team name per side, percentage-only odds changes, A/N visual display, English-only Software UI and demo-v3 dark “Behind the signal” animations were preserved.

The V17 resolver supports 170 explicit current-team aliases, retains the broader ESPN name lookup for other known clubs, and for future unknown names tries a normalized local filename before displaying a neutral generic crest. It never substitutes a fuzzy-matched unrelated club.

## Verification
- Real Linux Chrome, against the **live site origin**, with a read-only snapshot of all 85 current fixture names injected as isolated API test data: 5 pagination pages (20 + 20 + 20 + 20 + 5 matches); **170/170 loaded images, zero broken/missing logos, zero JavaScript errors**.
- The same complete test passed both in the preflight preview and after publishing on the original `/admin/software?v=17` URL.
- The inline “Behind the signal” panel remained clickable, with the original navy background and CSS animation; odds were percentage-only and A/N cells remained populated.
- The homepage `/`, sign-in `/giris` and Software `/admin/software` each returned HTTP 200 and rendered successfully in Chrome.
- Old immutable-cached main JavaScript bundle was simulated as a browser response; the V17 route mapping still loaded and rendered fresh crests correctly, including `Man City (W)` and `Tottenham (W)`.

## Limits and deployment notes
The tests used **real current fixture identities**, but a mocked authenticated Software JSON response rather than a user's admin browser session. This is a compiled asset/importmap production hotfix; the canonical source frontend and release pipeline still need to incorporate the resolver and mapping to ensure new deployments do not accidentally revert the change. New fixture teams introduced after this snapshot may require fresh logo discovery; unmapped names show the neutral shield instead of a false crest.
