import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: process.env.PORT || '4000',
  databaseUrl: process.env.DATABASE_URL || '',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'accesssecret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'refreshsecret',
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  cookieSecure: process.env.COOKIE_SECURE === 'true',
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS || 10),
};
