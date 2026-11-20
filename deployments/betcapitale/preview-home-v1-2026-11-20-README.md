# CAPITALE — Password-protected homepage staging preview

**Status: LIVE PRIVATE PREVIEW (2026-11-20).**

Preview URL: **https://betcapitale.com/preview/home-v1** (302 redirect to `/preview/home-v1/`).

This is a separate compiled **React** homepage, not an image or a Codex design. It currently uses the existing live landing page as a design baseline. The preview is served from an **isolated directory**, rather than replacing any live Betcapitale page or backend.

## Access and security

- Nginx basic authentication via a dedicated `capitale-preview` account.
- The actual password and hashed authentication data are **not** stored in GitHub. The owner receives the password privately.
- All preview files, including bundled JS/CSS, are protected by the same authentication requirement.
- Page and asset requests without authentication returned HTTP **401**; authorized requests returned **200**.
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

Nginx authentication and static alias snippet:
`/etc/nginx/snippets/capitale-home-preview-v1.conf`

Nginx site configuration:
`/etc/nginx/sites-available/betcapitale`, with **one include added inside its HTTPS server block**. Backup:
`/etc/nginx/sites-available/betcapitale.before-preview-home-v1-20261120`.

Password hash (never expose contents):
`/etc/nginx/.capitale-preview-home-v1.htpasswd`

To publish a *design revision* to the preview only: edit the isolated React worktree, type-check and rebuild it, stage the generated `dist/public` content, back up the existing preview directory, and replace **only** `/srv/capitale-preview/home-v1`. Verify the page and assets using the preview credentials and confirm public homepage remains unchanged.

**Do not deploy preview source or build assets to `/app/betcapitale/dist` until the owner explicitly says "Canlıya al".** Subsequent design work should be submitted to this preview URL first.

## Validation

- TypeScript `tsc --noEmit`: passed.
- Isolated Vite build with `--base=/preview/home-v1/`: passed (main JS and CSS are served under the preview prefix).
- Authorized HTML/JS/CSS requests: HTTP 200.
- Unauthenticated HTML and JS requests: HTTP 401.
- Nginx configuration syntax test: passed; Nginx was reloaded, not restarted.
- Live public homepage remained HTTP 200; `betcapitale-web.service`, Nginx and Desktop Commander remained active.
- A real signed-in/graphical browser screenshot comparison was **not** performed. Verify desktop/mobile design in a browser before approval.

## Future workflow

1. Make design changes **only** in the preview worktree.
2. Rebuild and upload **only** the preview static directory.
3. Owner reviews `https://betcapitale.com/preview/home-v1` in desktop/mobile browsers.
4. Revise until approved.
5. After explicit owner approval, port the agreed source changes into a newly tested, backed-up live frontend release. The live backend, member records, payment logic and other APIs must be preserved.

No actual homepage design changes were requested or made in this setup task.
