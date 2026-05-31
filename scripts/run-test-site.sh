#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PORT="${1:-8080}"

cd "$REPO_ROOT"

echo "Regenerating site manifest..."
node scripts/generate-site-content.js

echo "Starting local static server on http://localhost:${PORT}/"
echo "Press Ctrl+C to stop."
python3 -m http.server "$PORT" --bind 127.0.0.1
