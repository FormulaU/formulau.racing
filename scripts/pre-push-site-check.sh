#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$REPO_ROOT"

echo "[1/2] Regenerating site manifest..."
node scripts/generate-site-content.js

echo "[2/2] Checking pending website changes..."
git status --short js/site-content.js img/sponsorship_logos img/media_gallery vid

echo
echo "Pre-push site check complete."
echo "Review changes above, commit them, then push to master."
