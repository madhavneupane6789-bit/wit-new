#!/usr/bin/env bash
set -e

echo "Running Prisma migrate deploy..."
npx prisma migrate deploy
echo "Starting app..."
node dist/server.js

# To make this executable locally:
# chmod +x scripts/start-with-migrations.sh
