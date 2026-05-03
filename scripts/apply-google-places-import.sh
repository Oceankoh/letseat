#!/usr/bin/env sh
set -eu

SQL_FILE="${1:-/imports/google-places-import.sql}"

docker compose exec -T db psql \
  -v ON_ERROR_STOP=1 \
  -U "${POSTGRES_USER:-letseat}" \
  -d "${POSTGRES_DB:-letseat}" \
  -f "$SQL_FILE"
