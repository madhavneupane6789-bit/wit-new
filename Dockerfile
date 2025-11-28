# Root-level Dockerfile to build and run the backend service
# Uses the backend/ directory as source; frontend has its own Dockerfile.

FROM node:18-alpine AS builder
WORKDIR /app

# Copy backend manifests and source
COPY backend/package*.json ./backend/
COPY backend/tsconfig.json ./backend/
COPY backend/prisma ./backend/prisma
COPY backend/src ./backend/src
COPY backend/start.sh ./backend/start.sh
COPY backend/scripts ./backend/scripts

WORKDIR /app/backend
RUN npm install
RUN npm run prisma:generate
RUN npm run build

FROM node:18-alpine
WORKDIR /app

COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/dist ./dist
COPY backend/package*.json ./
COPY backend/prisma ./prisma
COPY backend/start.sh ./start.sh

RUN chmod +x start.sh


CMD ["./start.sh"]
