import jwt from 'jsonwebtoken';
import { env } from '../config/env';

type TokenPayload = {
  userId: string;
  role: 'USER' | 'ADMIN';
};

export function signAccessToken(payload: TokenPayload) {
  return jwt.sign(payload, env.jwtAccessSecret as jwt.Secret, {
    expiresIn: env.accessTokenExpiresIn as jwt.SignOptions['expiresIn'],
  });
}

export function signRefreshToken(payload: TokenPayload) {
  return jwt.sign(payload, env.jwtRefreshSecret as jwt.Secret, {
    expiresIn: env.refreshTokenExpiresIn as jwt.SignOptions['expiresIn'],
  });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, env.jwtAccessSecret) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, env.jwtRefreshSecret) as TokenPayload;
}
