# CAPITALE — Password-protected homepage staging preview

**Status: LIVE PRIVATE PREVIEW (2026-11-20).**

Preview URL: **https://betcapitale.com/preview/home-v1** (302 redirect to `/preview/home-v1/`).

This is a separate compiled **React** homepage, not an image or a Codex design. It currently uses the existing live landing page as a design baseline. The preview is served from an **isolated directory**, rather than replacing any live Betcapitale page or backend.

## Access and security

- Nginx `auth_request` to the **existing authenticated CAPITALE admin session** via the internal backend `GET /api/admin/me` endpoint. No separate preview password is required. A valid session with `isAdmin=true` is required.
- All preview files, including bundled JS/CSS, are protected by the same admin-session check, using forwarded session cookies.
- Unauthenticated HTML/JS requests returned HTTP **401**. An actual browser check with a logged-in admin session has **not yet been performed**; the original basic-auth deployment's static files previously passed 200 checks, and the production admin endpoint's session guard was inspected.
- The initial temporary basic-auth credential files were deleted after switching to admin-session authentication.
- `X-Robots-Tag: noindex, nofollow, noarchive`; HTML also includes `meta name="robots" content="noindex,nofollow,noarchive"`.
- No Google/Meta/Reddit tracking scripts from the live HTML are included in the preview HTML.
- The preview React entrypoint blocks non-GET/HEAD fetch and XHR and form submission, and intercepts anchor navigation, to avoid accidentally triggering live purchases, signup, logout, mutation requests, or navigation to live pages while reviewing a design. Existing GET-only public metrics may still be displayed.
- A clear private/read-only preview banner appears above the existing homepage.
- HTTPS is provided by the site's existing production certificate. There is no separate domain, server or database.

## Deployment topology

Preview source (isolated worktree):
`/opt/capitale-software-en-60048de8ba8f9736466a0d5ca13594d6b9023d87/betcapitale-home-preview-v1-work`

Standalone Vite build command from the source worktree:

```bash
/opt/capitale-software-en-60048de8ba8f9736466a0d5ca13594d6b9023d87/node_modules/.bin/tsc --noEmit
/opt/capitale-software-en-60048de8ba8f9736466a0d5ca13594d6b9023d87/node_modules/.bin/vite build --base=/preview/home-v1/
```

Compiled preview served at:
`/srv/capitale-preview/home-v1`

Nginx admin-session authentication subrequest and static alias snippet:
`/etc/nginx/snippets/capitale-home-preview-v1.conf`

Nginx site configuration:
`/etc/nginx/sites-available/betcapitale`, with **one include added inside its HTTPS server block**. Backup:
`/etc/nginx/sites-available/betcapitale.before-preview-home-v1-20261120`.

Admin access is checked through the existing session cookie; there is no standalone preview password or htpasswd file.

To publish a *design revision* to the preview only: edit the isolated React worktree, type-check and rebuild it, stage the generated `dist/public` content, back up the existing preview directory, and replace **only** `/srv/capitale-preview/home-v1`. Verify the page and assets from a logged-in CAPITALE admin browser, confirm anonymous access is denied, and confirm public homepage remains unchanged.

**Do not deploy preview source or build assets to `/app/betcapitale/dist` until the owner explicitly says "Canlıya al".** Subsequent design work should be submitted to this preview URL first.

## Validation

- TypeScript `tsc --noEmit`: passed.
- Isolated Vite build with `--base=/preview/home-v1/`: passed (main JS and CSS are served under the preview prefix).
- Static HTML/JS/CSS were previously checked at HTTP 200 with the initial temporary basic-auth setup; the final access method is the existing CAPITALE admin session.
- After switching to admin-session authentication, unauthenticated HTML and JS requests: HTTP 401. A signed-in admin browser verification is still required.
- Nginx configuration syntax test: passed; Nginx was reloaded, not restarted.
- Live public homepage remained HTTP 200; `betcapitale-web.service`, Nginx and Desktop Commander remained active.
- A real signed-in/graphical browser session could not be used from the server. Verify that an authenticated CAPITALE admin can open and navigate the desktop/mobile preview before approving any design.

## Future workflow

1. Make design changes **only** in the preview worktree.
2. Rebuild and upload **only** the preview static directory.
3. Owner reviews `https://betcapitale.com/preview/home-v1` in desktop/mobile browsers.
4. Revise until approved.
5. After explicit owner approval, port the agreed source changes into a newly tested, backed-up live frontend release. The live backend, member records, payment logic and other APIs must be preserved.

No actual homepage design changes were requested or made in this setup task.
