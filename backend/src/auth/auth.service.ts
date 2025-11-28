import { Prisma, Role } from '@prisma/client';
import crypto from 'crypto';
import { prisma } from '../config/db';
import { env } from '../config/env';
import { comparePassword, hashPassword } from '../utils/password';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/token';
import { AppError } from '../middleware/errorHandler';

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

function toPublicUser(
  user: Prisma.UserGetPayload<{
    select: {
      id: true;
      name: true;
      email: true;
      role: true;
      status: true;
      subscriptionStartDate: true;
      subscriptionEndDate: true;
      subscriptionStatus: true;
      lastLoginDate: true;
    };
  }>,
) {
  return user;
}

function issueTokens(user: { id: string; role: Role }): AuthTokens {
  return {
    accessToken: signAccessToken({ userId: user.id, role: user.role }),
    refreshToken: signRefreshToken({ userId: user.id, role: user.role }),
  };
}

export async function registerUser(params: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  school?: string;
  preparingFor?: string;
  avatarUrl?: string;
}) {
  const existing = await prisma.user.findUnique({ where: { email: params.email } });
  if (existing) {
    throw new AppError(400, 'Email already in use');
  }

  const passwordHash = await hashPassword(params.password);
  const user = await prisma.user.create({
    data: {
      name: params.name,
      email: params.email,
      passwordHash,
      role: Role.USER,
      status: 'PENDING', // Default status for new users
      subscriptionStatus: 'FREE', // Default subscription status
      subscriptionStartDate: new Date(),
      subscriptionEndDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), // 1 month free trial
      phone: params.phone,
      school: params.school,
      preparingFor: params.preparingFor,
      avatarUrl: params.avatarUrl,
    },
    select: { id: true, name: true, email: true, role: true, status: true, subscriptionStartDate: true, subscriptionEndDate: true, subscriptionStatus: true, lastLoginDate: true, avatarUrl: true },
  });

  const tokens = issueTokens(user);
  return { user: toPublicUser(user), tokens };
}

export async function loginUser(params: { email: string; password: string }) {
  const user = await prisma.user.findUnique({
    where: { email: params.email },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      passwordHash: true,
      status: true,
      subscriptionStartDate: true,
      subscriptionEndDate: true,
      subscriptionStatus: true,
      lastLoginDate: true,
    },
  });

  if (!user) {
    throw new AppError(400, 'Invalid credentials');
  }

  const valid = await comparePassword(params.password, user.passwordHash);
  if (!valid) {
    throw new AppError(400, 'Invalid credentials');
  }

  if (user.status === 'PENDING') {
    throw new AppError(403, 'Your account is pending activation. Please wait for an administrator to approve it.');
  }

  if (user.status === 'INACTIVE') {
    throw new AppError(403, 'Your account is inactive. Please contact support.');
  }

  // Update lastLoginDate
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginDate: new Date() },
  });

  const tokens = issueTokens({ id: user.id, role: user.role });
  return {
    user: toPublicUser({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      subscriptionStartDate: user.subscriptionStartDate,
      subscriptionEndDate: user.subscriptionEndDate,
      subscriptionStatus: user.subscriptionStatus,
      lastLoginDate: new Date(), // Return the updated lastLoginDate
    }),
    tokens,
  };
}

export async function refreshSession(refreshToken: string | undefined) {
  if (!refreshToken) {
    throw new AppError(401, 'Unauthorized');
  }

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (err) {
    throw new AppError(401, 'Unauthorized');
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      subscriptionStartDate: true,
      subscriptionEndDate: true,
      subscriptionStatus: true,
      lastLoginDate: true,
    },
  });

  if (!user) {
    throw new AppError(401, 'Unauthorized');
  }

  const tokens = issueTokens({ id: user.id, role: user.role });
  return { user: toPublicUser(user), tokens };
}

export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      subscriptionStartDate: true,
      subscriptionEndDate: true,
      subscriptionStatus: true,
      lastLoginDate: true,
      avatarUrl: true,
      phone: true,
      school: true,
      preparingFor: true,
    },
  });
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  return toPublicUser(user);
}

export async function changePassword(userId: string, oldPassword: string, newPassword: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError(404, 'User not found');
  const valid = await comparePassword(oldPassword, user.passwordHash);
  if (!valid) throw new AppError(400, 'Old password incorrect');
  const passwordHash = await hashPassword(newPassword);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
  return true;
}

export async function createPasswordResetToken(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return null;
  }

  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

  await prisma.passwordResetToken.create({
    data: {
      tokenHash,
      userId: user.id,
      expiresAt,
    },
  });

  return {
    token,
    userId: user.id,
  };
}

export async function resetPassword(params: { token: string; newPassword: string }) {
  const tokenHash = crypto.createHash('sha256').update(params.token).digest('hex');
  const resetToken = await prisma.passwordResetToken.findFirst({
    where: {
      tokenHash,
      used: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!resetToken) {
    throw new AppError(400, 'Invalid or expired reset token');
  }

  const passwordHash = await hashPassword(params.newPassword);
  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { used: true },
    }),
  ]);

  return true;
}
