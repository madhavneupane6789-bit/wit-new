import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';
import {
  createPasswordResetToken,
  getCurrentUser,
  loginUser,
  refreshSession,
  registerUser,
  resetPassword,
  changePassword,
} from './auth.service';
import { AppError } from '../middleware/errorHandler';

const baseCookieOptions = {
  httpOnly: true,
  secure: env.cookieSecure,
  sameSite: 'none' as const, // required for cross-site cookies
  path: '/',
};

const accessCookieOptions = {
  ...baseCookieOptions,
  maxAge: 1000 * 60 * 15,
};

const refreshCookieOptions = {
  ...baseCookieOptions,
  maxAge: 1000 * 60 * 60 * 24 * 7,
};

function setAuthCookies(res: Response, tokens: { accessToken: string; refreshToken: string }) {
  res.cookie('accessToken', tokens.accessToken, accessCookieOptions);
  res.cookie('refreshToken', tokens.refreshToken, refreshCookieOptions);
}

export async function registerHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password } = req.body;
    const { user, tokens } = await registerUser({ name, email, password });
    setAuthCookies(res, tokens);
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
}

export async function loginHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const { user, tokens } = await loginUser({ email, password });
    setAuthCookies(res, tokens);
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export async function logoutHandler(_req: Request, res: Response) {
  res.clearCookie('accessToken', { path: '/', sameSite: 'none', secure: env.cookieSecure });
  res.clearCookie('refreshToken', { path: '/', sameSite: 'none', secure: env.cookieSecure });
  res.json({ message: 'Logged out' });
}

export async function refreshHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const refreshToken = req.cookies?.refreshToken;
    const { user, tokens } = await refreshSession(refreshToken);
    setAuthCookies(res, tokens);
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export async function meHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }
    const user = await getCurrentUser(req.user.id);
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export async function forgotPasswordHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;
    const tokenInfo = await createPasswordResetToken(email);
    if (tokenInfo) {
      const origin = env.clientOrigin || 'https://witnea.onrender.com';
      const link = `${origin}/reset-password/${tokenInfo.token}`;
      console.log(`Password reset link for ${email}: ${link}`);
    }
    res.json({
      message: 'If an account exists, a reset link was generated. Check server logs.',
    });
  } catch (err) {
    next(err);
  }
}

export async function resetPasswordHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { token, newPassword } = req.body;
    await resetPassword({ token, newPassword });
    res.json({ message: 'Password updated' });
  } catch (err) {
    next(err);
  }
}

export async function changePasswordHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!req.user) throw new AppError(401, 'Unauthorized');
    await changePassword(req.user.id, oldPassword, newPassword);
    res.json({ message: 'Password changed' });
  } catch (err) {
    next(err);
  }
}
