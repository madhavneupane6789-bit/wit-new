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
      isApproved: true,
      isActive: true,
      createdAt: true,
      phone: true,
      school: true,
      preparingFor: true,
      avatarUrl: true,
    },
  });
}

export async function createUser(data: { name: string; email: string; password: string; role?: Role; isApproved?: boolean }) {
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
      isApproved: data.isApproved ?? true,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isApproved: true,
      isActive: true,
      phone: true,
      school: true,
      preparingFor: true,
      avatarUrl: true,
    },
  });
}

export async function updateUser(id: string, data: { isApproved?: boolean; isActive?: boolean; role?: Role }) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError(404, 'User not found');
  if (user.role === Role.ADMIN && data.isActive === false) {
    throw new AppError(400, 'Cannot deactivate admin');
  }
  return prisma.user.update({
    where: { id },
    data,
    select: { id: true, name: true, email: true, role: true, isApproved: true, isActive: true },
  });
}

export async function deleteUser(id: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError(404, 'User not found');
  if (user.role === Role.ADMIN) {
    throw new AppError(400, 'Cannot delete admin');
  }
  await prisma.bookmark.deleteMany({ where: { userId: id } });
  await prisma.fileProgress.deleteMany({ where: { userId: id } });
  await prisma.user.delete({ where: { id } });
  return true;
}
