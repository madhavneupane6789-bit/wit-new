# Education Hub

Full-stack educational content platform with JWT auth, role-based admin tools, and a nested library UI. Runs fully via Docker Compose.

## Stack
- Backend: Node.js, TypeScript, Express, Prisma (PostgreSQL), JWT (access + refresh via HTTP-only cookies), bcrypt, Zod validation.
- Frontend: React + TypeScript, Vite, Tailwind CSS, Framer Motion (Apple-inspired liquid UI).
- Infra: Docker Compose (backend, frontend, Postgres).

## Prerequisites
- Docker + Docker Compose installed.

## Environment Setup
Create environment files from the provided examples.

### Backend `.env` (./backend/.env)
```
PORT=4000
DATABASE_URL=postgresql://edu_user:edu_password@db:5432/edu_platform?schema=public
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
COOKIE_SECURE=false
BCRYPT_SALT_ROUNDS=10
```

### Frontend `.env` (./frontend/.env)
```
VITE_API_BASE=http://localhost:4000   # use http://backend:4000 inside Docker
```

## Run with Docker
```bash
docker-compose up --build
```
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000
- Postgres: port 5432 (local)

The backend container runs `prisma db push`, seeds the default admin, and starts the API automatically.

## Default Credentials
- Admin: `admin@example.com` / `Admin123!` (seeded)

## Auth & Password Reset
- Register, login, logout, refresh, and `GET /api/auth/me` return/set tokens via HTTP-only cookies.
- Forgot password generates a one-time token stored in the DB and logs a reset link to the backend container logs (no email service).

## Content Management
- Nested folders + files (video/pdf) with Google Drive view links.
- Admin-only CRUD routes under `/api/admin/*`; user routes under `/api/*`.
- Folder deletion is blocked if children/files are present (non-cascading).

## Development Notes
- Refresh tokens live in HTTP-only cookies; ensure `withCredentials`/`credentials` are enabled on client requests (handled in `frontend/src/services/apiClient.ts`).
- Frontend is served via Nginx in production; SPA routing is configured in `frontend/nginx.conf`.

## Quick Scripts (local, optional)
From `backend/`:
```bash
npm install
npm run dev           # starts Express with ts-node-dev
npx prisma db push    # sync schema
npm run prisma:seed   # seeds admin
```

From `frontend/`:
```bash
npm install
npm run dev           # starts Vite dev server on 5173
```
