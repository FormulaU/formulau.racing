# Formula U Racing Site (Internal)

This document is for Formula U team members maintaining the website.

## Quick Workflow Before Pushing

1. Add or update files in media/sponsor folders.
2. Run the pre-push helper:
   - `./scripts/pre-push-site-check.sh`
3. Preview locally (also regenerates manifest):
   - `./scripts/run-test-site.sh`
   - open `http://localhost:8080/`
4. Commit all changes together, including `js/site-content.js`.
5. Push to `master`.

## Sponsor Handling

Current sponsors are shown on the site and are tiered.

- `img/sponsorship_logos/0title`
- `img/sponsorship_logos/1main`
- `img/sponsorship_logos/2prime`
- `img/sponsorship_logos/3spark`
- `img/sponsorship_logos/4collaboration`

Old sponsors are internal archive only (not shown publicly):

- `img/sponsorship_logos/archive`

## Media Handling

Photos shown in the gallery:

- `img/media_gallery`

Videos shown in the video section:

- `vid`

Supported video formats in the site are `.mp4` and `.webm`.

## Scripts

- `./scripts/pre-push-site-check.sh`
   - Regenerates `js/site-content.js`.
   - Shows current website-related file changes before push.

- `./scripts/run-test-site.sh`
   - Regenerates `js/site-content.js`.
   - Starts local static preview at port `8080` by default.
   - Optional custom port: `./scripts/run-test-site.sh 9000`

- `node scripts/generate-site-content.js`
   - Regenerates only the manifest (no server).

This updates:

- `js/site-content.js`

## GitHub Actions Notes

A workflow exists at `.github/workflows/deploy-gh-pages.yml`.

- It runs on pushes to `master` when sponsor/media/video folders change.
- It regenerates `js/site-content.js` and commits only if needed.
- Running the generator locally before pushing helps avoid extra bot commits/deploy loops.

## Theme And UI Notes

- Theme switcher (light/dark) is in the site navbar.
- Media images open in an in-page popup gallery viewer.

## Troubleshooting

If content does not appear:

1. Verify file is in the correct folder.
2. Re-run `./scripts/pre-push-site-check.sh`.
3. Confirm `js/site-content.js` changed and is committed.
4. Hard refresh browser cache.
