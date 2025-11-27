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
CLIENT_ORIGIN=https://witnea.onrender.com
COOKIE_SECURE=false
BCRYPT_SALT_ROUNDS=10
```

### Frontend `.env` (./frontend/.env)
```
VITE_API_BASE_URL=https://witback.onrender.com   # override with your backend URL; for local dev set to http://localhost:4000 if you run backend locally
```

### SPA routing (Render static site)
If you deploy the frontend as a Render Static Site, add a rewrite so every path serves `index.html`:
- Source: `/*`
- Destination: `/index.html`
- Type: `rewrite`

You can also use the included `render.yaml` which defines the static site with this rewrite rule.

## Run with Docker (local)
```bash
docker-compose up --build
```
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000 (local dev) / your deployed backend URL in prod
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

## Vercel Deploy (frontend)
- In `frontend/`, `npm install && npm run build` to verify.
- Add a Vercel project pointing to `frontend/`. Framework: Vite; Output dir: `dist`; Build command: `npm run build`.
- Ensure `VITE_API_BASE_URL` env on Vercel points to your deployed backend (see `frontend/vercel.json` for example).
- Root has `vercel.json` for SPA routing.

## Deploying to Railway
1. Push this repo to GitHub.
2. Create a Railway project and add a PostgreSQL database.
3. Backend service:
   - Deploy from GitHub, set root to `backend/`.
   - Start command: `npm run start:prod`.
   - Vars: `DATABASE_URL` (from DB Connect), `PORT=4000`, `NODE_ENV=production`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `ACCESS_TOKEN_EXPIRES_IN=15m`, `REFRESH_TOKEN_EXPIRES_IN=7d`, `CLIENT_ORIGINS` (comma-separated frontend/backends), `COOKIE_SECURE=true`, `BCRYPT_SALT_ROUNDS=10`.
4. Frontend service (optional):
   - Deploy from GitHub, root `frontend/`.
   - Build: `npm run build`; Start: `npm run preview`.
   - Vars: `VITE_API_BASE_URL=https://<backend-public-url>`.
5. Ensure backend CORS allows the frontend URL(s).
