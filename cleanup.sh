#!/usr/bin/env bash
set -euo pipefail
echo "== cleanup.sh starting =="
ROOT=$(pwd)
ARCHIVE="$ROOT/.archive_clean_$(date +%s)"
mkdir -p "$ARCHIVE"

# 1) Move audit logs created earlier
for f in audit-*.log audit-*.txt; do
  [ -f "$f" ] && mv "$f" "$ARCHIVE/" && echo "Archived $f"
done

# 2) Move mock files (search for 'mock' usage)
MOCK_FILES=$(grep -RIl "mock" client || true)
if [ -z "$MOCK_FILES" ]; then
  echo "No mock references found in client/."
else
  echo "Archiving mock files..."
  for f in $MOCK_FILES; do
    mkdir -p "$(dirname "$ARCHIVE/$f")"
    mv "$f" "$ARCHIVE/$f"
    echo "Moved $f -> $ARCHIVE/$f"
  done
fi

# 3) Move leftover Next.js-style app/ artifacts if any (we prefer Vite structure)
if find . -path "*/app/*" -type f | grep -q .; then
  echo "Found Next.js-style app/* artifacts — archiving to keep repo clean."
  find . -path "*/app/*" -type f -print0 | xargs -0 -I{} bash -c 'mkdir -p "'"$ARCHIVE/{}"'" && mv "{}" "'"$ARCHIVE/{}"'" && echo "Archived {}" || true'
else
  echo "No app/* Next-style artifacts found."
fi

# 4) Remove node_modules audit-only (NOT deleting node_modules)
echo "Listing large files and node_modules size for review..."
du -hs node_modules || true

echo "== cleanup.sh done =="
echo "Archived files are in: $ARCHIVE"
