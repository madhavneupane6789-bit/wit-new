import { File, FileType } from '@prisma/client';
import { prisma } from '../config/db';
import { AppError } from '../middleware/errorHandler';
import { getFolderTree } from '../folders/folder.service';

function validateDriveUrl(url: string) {
  if (!url.includes('drive.google.com')) {
    throw new AppError(400, 'googleDriveUrl must be a Google Drive link');
  }
}

export async function createFile(params: {
  name: string;
  description?: string;
  fileType: FileType;
  googleDriveUrl: string;
  folderId?: string;
  ownerId?: string;
}): Promise<File> {
  validateDriveUrl(params.googleDriveUrl);

  if (params.folderId) {
    const exists = await prisma.folder.findUnique({ where: { id: params.folderId } });
    if (!exists) {
      throw new AppError(400, 'Folder not found');
    }
  }

  const siblingCount = await prisma.file.count({ where: { folderId: params.folderId || null } });

  return prisma.file.create({
    data: {
      name: params.name,
      description: params.description,
      fileType: params.fileType,
      googleDriveUrl: params.googleDriveUrl,
      folderId: params.folderId || null,
      ownerId: params.ownerId,
      order: siblingCount,
    },
  });
}

export async function updateFile(id: string, data: Partial<Omit<File, 'id' | 'createdAt' | 'updatedAt'>>) {
  const file = await prisma.file.findUnique({ where: { id } });
  if (!file) {
    throw new AppError(404, 'File not found');
  }

  if (data.googleDriveUrl) {
    validateDriveUrl(data.googleDriveUrl);
  }

  if (data.folderId) {
    const exists = await prisma.folder.findUnique({ where: { id: data.folderId } });
    if (!exists) {
      throw new AppError(400, 'Folder not found');
    }
  }

  return prisma.file.update({
    where: { id },
    data,
  });
}

export async function deleteFile(id: string) {
  const file = await prisma.file.findUnique({ where: { id } });
  if (!file) {
    throw new AppError(404, 'File not found');
  }
  await prisma.file.delete({ where: { id } });
  return true;
}

export async function getFileById(id: string) {
  const file = await prisma.file.findUnique({ where: { id } });
  if (!file) {
    throw new AppError(404, 'File not found');
  }
  return file;
}

export async function listFilesTree(userId?: string) {
  return getFolderTree(userId);
}

export async function listAllFiles() {
  return prisma.file.findMany({
    orderBy: { createdAt: 'desc' },
    include: { folder: true },
  });
}
