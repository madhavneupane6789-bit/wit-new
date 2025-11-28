import { Role } from '@prisma/client';
import { prisma } from '../config/db';
import { AppError } from '../middleware/errorHandler';
import { hashPassword } from '../utils/password';

export async function listUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
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
      createdAt: true,
      phone: true,
      school: true,
      preparingFor: true,
      avatarUrl: true,
    },
  });
}

export async function createUser(data: { name: string; email: string; password: string; role?: Role }) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new AppError(400, 'Email already exists');
  }
  const passwordHash = await hashPassword(data.password);
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role || Role.USER,
      status: 'PENDING',
      subscriptionStatus: 'FREE',
      subscriptionStartDate: new Date(),
      subscriptionEndDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    },
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
      phone: true,
      school: true,
      preparingFor: true,
      avatarUrl: true,
    },
  });
}

export async function updateUser(
  id: string,
  data: {
    status?: 'PENDING' | 'ACTIVE' | 'INACTIVE';
    subscriptionStartDate?: Date;
    subscriptionEndDate?: Date;
    subscriptionStatus?: 'FREE' | 'BASIC' | 'PREMIUM';
    role?: Role;
  },
) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError(404, 'User not found');

  if (user.role === Role.ADMIN && data.status === 'INACTIVE') {
    throw new AppError(400, 'Cannot deactivate admin');
  }

  if (data.subscriptionStartDate && data.subscriptionEndDate && data.subscriptionEndDate < data.subscriptionStartDate) {
    throw new AppError(400, 'Subscription end date cannot be before start date');
  }

  return prisma.user.update({
    where: { id },
    data: {
      status: data.status,
      subscriptionStartDate: data.subscriptionStartDate,
      subscriptionEndDate: data.subscriptionEndDate,
      subscriptionStatus: data.subscriptionStatus,
      role: data.role,
    },
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
}

export async function deleteUser(id: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError(404, 'User not found');
  if (user.role === Role.ADMIN) {
    throw new AppError(400, 'Cannot delete admin');
  }

  await prisma.$transaction([
    prisma.bookmark.deleteMany({ where: { userId: id } }),
    prisma.fileProgress.deleteMany({ where: { userId: id } }),
    prisma.user.delete({ where: { id } }),
  ]);

  return true;
}
