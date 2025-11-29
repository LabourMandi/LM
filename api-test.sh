#!/usr/bin/env bash
set -euo pipefail
BASE_URL="http://localhost:5000"
echo "== api-test.sh starting =="
echo "Using base URL: $BASE_URL"

# helper
call() {
  echo "-> $1 $2"
  curl -sS -X $1 "$BASE_URL$2" -H "Content-Type: application/json" | jq || true
  echo -e "\n"
}

# 1. Jobs list
call GET "/api/jobs" || echo "jobs endpoint failed"

# 2. Job detail (test id placeholder)
call GET "/api/jobs/00000000-0000-0000-0000-000000000000" || echo "job detail endpoint test (use real id)"

# 3. Workers
call GET "/api/workers" || echo "workers list failed"

# 4. Marketplace / tools
call GET "/api/tools" || echo "tools endpoint test"

# 5. Rewards / wallet history (if ext route exists)
call GET "/api/ext/rewards/history" || echo "rewards history test (may be auth protected)"

# 6. Machinery endpoints
call GET "/api/ext/machinery" || echo "machinery list test"
call POST "/api/ext/machinery" - <<< '{"title":"Test Machine","description":"Test created by script","owner_id":"00000000-0000-0000-0000-000000000000"}' || echo "machinery create test (may need auth)"

echo "== api-test.sh done =="
