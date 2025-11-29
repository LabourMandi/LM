#!/usr/bin/env bash
set -euo pipefail
echo "== machinery-setup.sh: start =="
ROOT=$(pwd)
BACKUP_DIR="$ROOT/.mach_backups_$(date +%s)"
mkdir -p "$BACKUP_DIR"

backup() {
  [ -f "$1" ] && cp "$1" "$BACKUP_DIR/$(basename "$1").bak"
}

# 1) Server: storage helper
STORAGE_FILE="server/storage/machinery.ts"
if [ ! -f "$STORAGE_FILE" ]; then
  mkdir -p "$(dirname "$STORAGE_FILE")"
  cat > "$STORAGE_FILE" <<'TS'
/**
 * Simple machinery storage helpers (Drizzle-compatible placeholders).
 * These functions use the existing server/storage pattern — adapt queries to drizzle accordingly.
 */
import { sql } from "drizzle-orm"; // adjust import to your storage setup
import { db } from "../db";

export async function listMachinery(limit = 50, offset = 0) {
  // Placeholder using raw SQL — replace with Drizzle queries if preferred
  const res = await db.query(`SELECT * FROM ext_machinery ORDER BY created_at DESC LIMIT $1 OFFSET $2`, [limit, offset]);
  return res.rows || res;
}

export async function getMachineryById(id: string) {
  const res = await db.query(`SELECT * FROM ext_machinery WHERE id = $1`, [id]);
  return res.rows?.[0] || null;
}

export async function createMachinery(payload: any) {
  const { title, description, owner_id } = payload;
  const res = await db.query(
    `INSERT INTO ext_machinery (title, description, owner_id, created_at) VALUES ($1, $2, $3, now()) RETURNING *`,
    [title, description, owner_id]
  );
  return res.rows?.[0] || null;
}
TS
  echo "Created $STORAGE_FILE"
else
  echo "$STORAGE_FILE already exists; skipping."
fi

# 2) Server: route module
ROUTE_FILE="server/ext/machinery.ts"
if [ ! -f "$ROUTE_FILE" ]; then
  mkdir -p "$(dirname "$ROUTE_FILE")"
  cat > "$ROUTE_FILE" <<'TS'
import express from "express";
import { listMachinery, getMachineryById, createMachinery } from "../storage/machinery";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const items = await listMachinery();
    res.json({ ok: true, items });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const item = await getMachineryById(req.params.id);
    if (!item) return res.status(404).json({ ok: false, message: "Not found" });
    res.json({ ok: true, item });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

router.post("/", async (req, res) => {
  try {
    const payload = req.body;
    const item = await createMachinery(payload);
    res.status(201).json({ ok: true, item });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

export default router;
TS
  echo "Created $ROUTE_FILE"

  # register route in server/ext/index.ts if the pattern exists
  INDEX_FILE="server/ext/index.ts"
  if [ -f "$INDEX_FILE" ]; then
    backup "$INDEX_FILE"
    if ! grep -q "ext/machinery" "$INDEX_FILE"; then
      echo "// ADDED BY machinery-setup.sh" >> "$INDEX_FILE"
      echo "import machinery from './machinery';" >> "$INDEX_FILE"
      echo "// register machinery route (adjust to your router register function)" >> "$INDEX_FILE"
      echo "router.use('/api/ext/machinery', machinery);" >> "$INDEX_FILE"
      echo "Appended registration to $INDEX_FILE - please verify import ordering in that file."
    else
      echo "Index file already references machinery. Skipping registration change."
    fi
  else
    echo "No server/ext/index.ts found — create route registration manually: import and use '/api/ext/machinery'."
  fi
else
  echo "$ROUTE_FILE already exists; skipping."
fi

# 3) Shared schema: add ext_machinery table if not present
SCHEMA_FILE="shared/ext-schema.ts"
if [ -f "$SCHEMA_FILE" ]; then
  if ! grep -q "ext_machinery" "$SCHEMA_FILE"; then
    backup "$SCHEMA_FILE"
    cat >> "$SCHEMA_FILE" <<'TS'

// ext_machinery table (added by machinery-setup.sh)
export const ext_machinery = pgTable("ext_machinery", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  owner_id: uuid("owner_id").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});
TS
    echo "Appended ext_machinery table to $SCHEMA_FILE - run migrations as needed."
  else
    echo "ext_machinery already present in $SCHEMA_FILE"
  fi
else
  echo "$SCHEMA_FILE not found; please add ext_machinery table to your schema manually."
fi

# 4) Client-side: simple page + components (placeholders)
CLIENT_PAGE="client/src/pages/Machinery.tsx"
if [ ! -f "$CLIENT_PAGE" ]; then
  mkdir -p "$(dirname "$CLIENT_PAGE")"
  cat > "$CLIENT_PAGE" <<'TSX'
import React, { useEffect, useState } from "react";

export default function MachineryPage() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/ext/machinery")
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
      .catch(() => setItems([]));
  }, []);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Machinery / Equipment</h1>
      <div className="mt-4 space-y-4">
        {items.length === 0 ? <div>No machinery items yet</div> : items.map((it) => (
          <div key={it.id} className="p-3 border rounded">
            <h3 className="font-semibold">{it.title}</h3>
            <p>{it.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
TSX
  echo "Created client page: $CLIENT_PAGE"
else
  echo "$CLIENT_PAGE exists, skipping."
fi

echo "== machinery-setup.sh: done =="
