# Railway Deployment Notes (Backend)

## Service Layout
- Backend runs as its own Railway service.
- Set the repository root directory to `backend` when configuring the service.
- Postgres must be in the **same** Railway project.

## Database
- Add a Railway PostgreSQL service: **New → Database → PostgreSQL**.
- Find `DATABASE_URL` in the DB service **Connect** tab.
- Use the internal host inside Railway, for example:  
  `postgres://<user>:<password>@postgres.railway.internal:5432/railway`
- Do **not** use internal host locally; use a local DB for development.

## Required Environment Variables (Backend service)
- `DATABASE_URL` = value from DB Connect tab.
- `NODE_ENV=production`
- `PORT=4000`
- `JWT_ACCESS_SECRET` = secure random string
- `JWT_REFRESH_SECRET` = secure random string
- `ACCESS_TOKEN_EXPIRES_IN=15m`
- `REFRESH_TOKEN_EXPIRES_IN=7d`
- `CLIENT_ORIGINS` = comma-separated allowed origins (e.g. `https://neawit.com,https://backend-production-aa6c6.up.railway.app,http://localhost:5173`)
- `COOKIE_SECURE=true`
- `BCRYPT_SALT_ROUNDS=10`

## How migrations are run on Railway
- Deploy steps: `npm install` → `npm run build` → `npm run start:prod`.
- `npm run start:prod` executes `scripts/start-with-migrations.sh`, which runs `npx prisma migrate deploy` before starting the app.
- Alternatively, you can run `npx prisma migrate deploy` manually from a Railway shell if needed.

## Start command for Railway
- Set Start Command to: `npm run start:prod`

## Notes
- `postgres.railway.internal` works **only inside Railway**. For local development, use the sample `DATABASE_URL` in `backend/.env.example`.
- Ensure CORS origins include the frontend domain.
