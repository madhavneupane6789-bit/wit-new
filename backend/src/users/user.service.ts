import { Role, UserStatus, SubscriptionStatus } from '@prisma/client';
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
      isApproved: true,
      isActive: true,
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

export async function createUser(data: { name: string; email: string; password: string; role?: Role; isApproved?: boolean; isActive?: boolean }) {
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
      status: data.role === Role.ADMIN ? UserStatus.ACTIVE : UserStatus.PENDING, // Admins are active by default
      isApproved: data.isApproved ?? (data.role === Role.ADMIN ? true : false),
      isActive: data.isActive ?? true, // Default to true
      subscriptionStatus: SubscriptionStatus.FREE,
      subscriptionStartDate: new Date(),
      subscriptionEndDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      isApproved: true,
      isActive: true,
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
  // Accept Partial<User> for flexibility, allowing any subset of user fields to be updated
  data: Partial<{
    name: string;
    email: string;
    status: UserStatus;
    isApproved: boolean;
    isActive: boolean;
    subscriptionStartDate: Date;
    subscriptionEndDate: Date;
    subscriptionStatus: SubscriptionStatus;
    role: Role;
    phone: string;
    school: string;
    preparingFor: string;
    avatarUrl: string;
  }>,
) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError(404, 'User not found');

  // Prevent changing the last admin's role or deactivating them
  if (user.role === Role.ADMIN) {
    const adminCount = await prisma.user.count({ where: { role: Role.ADMIN, isActive: true } });
    // If this is the only active admin and we're trying to deactivate or change role
    if (adminCount === 1 && (data.isActive === false || data.role !== Role.ADMIN)) {
      throw new AppError(400, 'Cannot deactivate or change role of the last active admin.');
    }
  }

  // Basic validation for dates
  if (data.subscriptionStartDate && data.subscriptionEndDate) {
    if (data.subscriptionEndDate < data.subscriptionStartDate) {
      throw new AppError(400, 'Subscription end date cannot be before start date.');
    }
  }

  return prisma.user.update({
    where: { id },
    data: {
      ...data,
      // Ensure specific fields are correctly typed if needed, e.g., Date objects
      subscriptionStartDate: data.subscriptionStartDate ? new Date(data.subscriptionStartDate) : data.subscriptionStartDate,
      subscriptionEndDate: data.subscriptionEndDate ? new Date(data.subscriptionEndDate) : data.subscriptionEndDate,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      isApproved: true,
      isActive: true,
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

export async function deleteUser(id: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError(404, 'User not found');
  if (user.role === Role.ADMIN) {
    const adminCount = await prisma.user.count({ where: { role: Role.ADMIN, isActive: true } });
    if (adminCount === 1) {
      throw new AppError(400, 'Cannot delete the last active admin.');
    }
  }

  await prisma.$transaction([
    // Clean up dependent records first to avoid FK violations
    prisma.passwordResetToken.deleteMany({ where: { userId: id } }),
    prisma.bookmark.deleteMany({ where: { userId: id } }),
    prisma.fileProgress.deleteMany({ where: { userId: id } }),
    prisma.file.updateMany({ where: { ownerId: id }, data: { ownerId: null } }),
    prisma.folder.updateMany({ where: { createdById: id }, data: { createdById: null } }),
    prisma.user.delete({ where: { id } }),
  ]);

  return true;
}

export async function fetchUserProgressSummary() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      _count: {
        select: {
          bookmarks: true,
          progress: {
            where: {
              completed: true
            }
          }
        }
      }
    }
  });

  const totalFiles = await prisma.file.count();

  const summaries = users.map(user => {
    const completed = user._count.progress;
    const bookmarks = user._count.bookmarks;
    const percent = totalFiles > 0 ? parseFloat(((completed / totalFiles) * 100).toFixed(2)) : 0;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      completed,
      bookmarks,
      percent
    };
  });

  return { summaries };
}

export async function fetchUserDetails(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      _count: {
        select: {
          bookmarks: true,
          progress: {
            where: {
              completed: true
            }
          }
        }
      }
    }
  });

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const totalFiles = await prisma.file.count();
  const completedCount = user._count.progress;
  const bookmarks = user._count.bookmarks;
  const percent = totalFiles > 0 ? parseFloat(((completedCount / totalFiles) * 100).toFixed(2)) : 0;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    completedCount,
    bookmarks,
    percent
  };
}
