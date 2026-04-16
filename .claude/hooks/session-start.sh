#!/bin/bash
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

if ! command -v shopify >/dev/null 2>&1; then
  npm install -g @shopify/cli @shopify/theme
fi

shopify version >/dev/null 2>&1 || true
