#!/bin/sh
set -e

echo "Waiting for database to be ready..."
until npx prisma db push; do
  echo "Database not ready, retrying in 3 seconds..."
  sleep 3
done

echo "Seeding database..."
node dist/prisma/seed.js || true

echo "Starting server..."
node dist/src/server.js
