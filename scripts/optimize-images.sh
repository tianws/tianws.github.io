#!/usr/bin/env bash
# Compatibility entry point; npm run optimize:img calls the Node script directly.
set -euo pipefail
exec node "$(dirname "$0")/optimize-images.mjs" "$@"
