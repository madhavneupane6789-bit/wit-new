#!/bin/sh
set -e

# Load local env file inside container if present (fallback for Prisma CLI)
if [ -f .env ]; then
  # shellcheck disable=SC2046
  export $(grep -v '^#' .env | xargs)
fi

# Fallback DATABASE_URL for compose/dev if not provided
if [ -z "$DATABASE_URL" ]; then
  export DATABASE_URL="postgresql://edu_user:edu_password@db:5432/edu_platform?schema=public"
  echo "DATABASE_URL not set, using default for compose: $DATABASE_URL"
fi

echo "Pushing database schema..."
until npx prisma db push --accept-data-loss; do
  echo "Database push failed, retrying in 3 seconds..."
  sleep 3
done

echo "Seeding database..."
node dist/prisma/seed.js || true

echo "Starting server..."
node dist/src/server.js
