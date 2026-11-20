# CAPITALE Home Design Preview v1

**Current status (2026-11-20): LIVE PUBLIC PREVIEW — NO LOGIN REQUIRED.**

The owner requested that the login prompt be removed. The preview is now openly accessible without a CAPITALE admin session, separate preview username, or password:

**https://betcapitale.com/preview/home-v1/**

This remains a **separate, read-only, noindex design preview** of the original landing page. It is not a deployment of a revised homepage. The main website and administrator authentication remain unchanged.

## Deployment

- Isolated source worktree: `/opt/capitale-software-en-60048de8ba8f9736466a0d5ca13594d6b9023d87/betcapitale-home-preview-v1-work`
- Preview static files: `/srv/capitale-preview/home-v1/`
- Nginx snippet: `/etc/nginx/snippets/capitale-home-preview-v1.conf`
- Parent HTTPS virtual host includes this snippet from `/etc/nginx/sites-available/betcapitale`.
- The preview files are served directly from the isolated static folder; no production `dist/public/index.html` replacement was made.
- A backup of the previous protected Nginx snippet is stored at `/etc/nginx/snippets/capitale-home-preview-v1.conf.before-public-20261120`; the unused password hash file was removed.

## Access and safety

- **No authentication requirement for the preview URL**. The owner explicitly chose this over the earlier password prompt.
- HTTP `GET` and `HEAD` are served; write methods under the preview path are denied in Nginx.
- The isolated React preview code blocks non-GET/HEAD fetch/XHR, intercepts forms and external navigation, and displays a read-only preview banner. This is a client-side protection for the preview app, not a substitute for the live backend's access controls.
- Live admin-only API endpoints still require authentication; verified that anonymous `GET /api/admin/software` returns **401**.
- The static preview has `X-Robots-Tag: noindex, nofollow, noarchive` and corresponding HTML robots meta. **Noindex is not access control:** anyone with the link may view the preview.
- Advertising/tracking pixels were excluded from the preview HTML, and the preview has its own bundled JS/CSS.

## Verification

After removing Nginx `auth_basic` and reloading Nginx:

| Request (without login) | Status |
|---|---|
| `GET /preview/home-v1/` | **200** (HTML) |
| `GET /preview/home-v1/assets/index-5mE8Q36U.js` | **200** (JavaScript) |
| `GET /preview/home-v1/assets/index-DEhu_p5g.css` | **200** (CSS) |
| `GET /` | **200** (main site unaffected) |
| `GET /api/admin/software` | **401** (admin protection preserved) |

Nginx configuration test passed and services were active. The user previously observed a 401 with the separate authentication prompt; that prompt is now removed. Graphical cross-device browser testing remains the owner's next check.

## Preview-first workflow

1. Edit the isolated preview worktree only.
2. Type-check: `/opt/capitale-software-en-60048de8ba8f9736466a0d5ca13594d6b9023d87/node_modules/.bin/tsc --noEmit`.
3. Build: `/opt/capitale-software-en-60048de8ba8f9736466a0d5ca13594d6b9023d87/node_modules/.bin/vite build --base=/preview/home-v1/`.
4. Publish only to `/srv/capitale-preview/home-v1/`, preserving a rollback copy. Confirm anonymous HTML/JS/CSS requests work.
5. Ask the owner to review the URL before changing the real site.

**Do not deploy preview design changes to the live main site until the owner explicitly authorizes publication.**
