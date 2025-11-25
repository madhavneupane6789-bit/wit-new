import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: process.env.PORT || '4000',
  databaseUrl: process.env.DATABASE_URL || '',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'accesssecret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'refreshsecret',
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  clientOrigins: (
    process.env.CLIENT_ORIGINS ||
    process.env.CLIENT_ORIGIN ||
    'https://witnea.onrender.com,http://localhost:5173,http://127.0.0.1:5173'
  )
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),
  cookieSecure: process.env.COOKIE_SECURE === 'true',
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS || 10),
  googleServiceEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '',
  googleServicePrivateKey: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
    ? process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n')
    : '',
};
