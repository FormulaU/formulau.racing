# Formula U Website Content Guide

This GitHub Pages site is fully static. Content is rendered from `js/site-content.js`, which is generated from the media folders.

## Add Or Update Sponsors

1. Open `img/sponsorship_logos`.
2. Pick the tier folder:
   - `0platinum`
   - `1gold`
   - `2silver`
   - `3bronze`
   - `4supporter`
3. Upload a logo image into that folder (`.png`, `.jpg`, `.jpeg`, `.webp`, or `.svg`).
4. (Optional) Name the file as the sponsor domain (example: `mycompany.com.png`) so the logo links to `https://mycompany.com` automatically.

## Add Or Update Photos

1. Open `img/media_gallery`.
2. Upload a photo.
3. Commit and push to `master`.

## Add Or Update Videos

1. Open `vid`.
2. Upload an `.mp4` or `.webm` file.
3. Commit and push to `master`.

## Notes

- No GitHub API calls are used in production rendering.
- A GitHub Action updates `js/site-content.js` after the GitHub Pages deployment workflow completes.
- GitHub Pages serves directly from the `master` branch.
- For local testing before pushing, run: `node scripts/generate-site-content.js`.
- After pushing changes to `master`, GitHub Pages updates the live site.
- Very large media files may load slowly. Prefer web-optimized sizes when possible.
