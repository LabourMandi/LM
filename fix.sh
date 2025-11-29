#!/usr/bin/env bash
set -euo pipefail
echo "== fix.sh: start =="
ROOT=$(pwd)
BACKUP_DIR="$ROOT/.fix_backups_$(date +%s)"
mkdir -p "$BACKUP_DIR"

# Helper to backup a file if exists
backup() {
  if [ -f "$1" ]; then
    echo "Backing up $1 -> $BACKUP_DIR/$(basename "$1").bak"
    cp "$1" "$BACKUP_DIR/$(basename "$1").bak"
  fi
}

# 1) Fix nullable avatar src usage in JobDetail.tsx and similar files
echo "--> Fixing profileImageUrl null-safe usages..."
FILES_TO_PATCH=$(grep -RIl "profileImageUrl" client || true)
if [ -z "$FILES_TO_PATCH" ]; then
  echo "No files found referencing profileImageUrl under client/. Skipping this step."
else
  for f in $FILES_TO_PATCH; do
    backup "$f"
    # Replace occurrences like {x?.profileImageUrl} -> {x?.profileImageUrl ?? undefined}
    # and {x?.profileImageUrl || ''} remains.
    sed -E -i.bak -e 's/\(\{([[:alnum:]_:.?]+profileImageUrl)\}\)/{\1 ?? undefined}/g' "$f" || true
    # Another common pattern: src={bid.worker?.profileImageUrl}
    sed -E -i -e 's/src=\{([[:alnum:]_.?]+profileImageUrl)\}/src={\1 ?? undefined}/g' "$f" || true
    # Keep also a safe fallback for direct Avatar usage where undefined is expected
  done
  echo "Patched files: "
  echo "$FILES_TO_PATCH"
fi

# 2) Fix Profile.tsx totalReviews display (safe fallback)
echo "--> Fixing totalReviews display usage..."
PROFILE_FILE="client/src/pages/Profile.tsx"
if [ -f "$PROFILE_FILE" ]; then
  backup "$PROFILE_FILE"
  # Replace occurrences like user?.totalReviews with (user as any)?.totalReviews ?? 0
  # but keep typed code minimal — add fallback at render points.
  sed -E -i.bak -e 's/(\buser\?\.[[:alnum:]_]+totalReviews\b)/((user as any)?.totalReviews ?? 0)/g' "$PROFILE_FILE" || true
  echo "Patched $PROFILE_FILE"
else
  echo "No Profile.tsx found at $PROFILE_FILE; skipping."
fi

# 3) Add a robust WebSocket helper if not present
WS_HELPER="client/src/lib/ws-helper.ts"
if [ ! -f "$WS_HELPER" ]; then
  mkdir -p "$(dirname "$WS_HELPER")"
  cat > "$WS_HELPER" <<'TS'
export function buildWebSocketUrl(path = "", token = ""): string {
  try {
    const loc = window.location;
    const scheme = loc.protocol === "https:" ? "wss" : "ws";
    // prefer environment var if provided
    // fallback to window.location.host and default port 5000 if not specified
    const host = (loc.hostname || "localhost");
    const port = (loc.port && loc.port !== "") ? loc.port : "5000";
    let url = `${scheme}://${host}:${port}${path}`;
    if (token) {
      const joiner = url.includes("?") ? "&" : "?";
      url = `${url}${joiner}token=${encodeURIComponent(token)}`;
    }
    return url;
  } catch (e) {
    return "ws://localhost:5000";
  }
}
TS
  echo "Created WebSocket helper at $WS_HELPER"
else
  echo "WebSocket helper already exists at $WS_HELPER"
fi

# 4) Try to auto-fix occurrences of new WebSocket(...) by injecting fallback wrapper
echo "--> Searching for 'new WebSocket' occurrences..."
WS_OCCURS=$(grep -RIn "new WebSocket" client || true)
if [ -z "$WS_OCCURS" ]; then
  echo "No 'new WebSocket' occurrences in client/ found."
else
  echo "Found WebSocket uses:"
  echo "$WS_OCCURS"
  echo "Note: script did NOT modify code that constructs WebSocket directly. Please replace direct usage with buildWebSocketUrl from client/src/lib/ws-helper.ts where appropriate."
fi

# 5) Run TypeScript check
echo "--> Running TypeScript check (no emit)..."
npx tsc --noEmit || echo "TypeScript reported errors (see output above)."

echo "== fix.sh: done =="
