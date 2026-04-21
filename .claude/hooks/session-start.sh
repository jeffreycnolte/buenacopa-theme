#!/bin/bash
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

if ! command -v shopify >/dev/null 2>&1; then
  # Pin major version so CI and web sessions stay aligned. Bump
  # deliberately; a CLI breaking change should not silently break both
  # environments at once.
  npm install -g @shopify/cli@3
fi

shopify version >/dev/null 2>&1 || true
