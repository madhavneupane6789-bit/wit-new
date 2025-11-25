import { File, Folder } from '@prisma/client';
import { prisma } from '../config/db';
import { AppError } from '../middleware/errorHandler';

export type FileWithMeta = File & { bookmarked?: boolean; completed?: boolean; lastOpenedAt?: Date | null };
export type SyllabusLink = { id: string; title: string };
export type FolderNode = Folder & { children: FolderNode[]; files: FileWithMeta[]; syllabusSections: SyllabusLink[] };
export type FolderTreeResponse = { tree: FolderNode[]; rootFiles: FileWithMeta[]; progress?: number };

function buildFolderTree(
  folders: Folder[],
  files: FileWithMeta[],
  syllabusByFolder: Map<string, SyllabusLink[]>,
  userMeta?: { bookmarked: Set<string>; completed: Set<string>; opened: Map<string, Date | null>; totalFiles: number },
): FolderTreeResponse {
  const folderMap = new Map<string, FolderNode>();

  folders.forEach((folder) => {
    folderMap.set(folder.id, { ...folder, children: [], files: [], syllabusSections: syllabusByFolder.get(folder.id) || [] });
  });

  const rootFiles: FileWithMeta[] = [];

  files.forEach((file) => {
    const decorated = {
      ...file,
      bookmarked: userMeta ? userMeta.bookmarked.has(file.id) : undefined,
      completed: userMeta ? userMeta.completed.has(file.id) : undefined,
      lastOpenedAt: userMeta ? userMeta.opened.get(file.id) || null : undefined,
    };
    if (file.folderId && folderMap.has(file.folderId)) {
      folderMap.get(file.folderId)!.files.push(decorated);
    } else {
      rootFiles.push(decorated);
    }
  });

  const roots: FolderNode[] = [];

  folderMap.forEach((folder) => {
    if (folder.parentId && folderMap.has(folder.parentId)) {
      folderMap.get(folder.parentId)!.children.push(folder);
    } else {
      roots.push(folder);
    }
  });

  const progress =
    userMeta && userMeta.totalFiles > 0 ? Number(((userMeta.completed.size / userMeta.totalFiles) * 100).toFixed(2)) : undefined;

  return { tree: roots, rootFiles, progress };
}

export async function getFolderTree(userId?: string): Promise<FolderTreeResponse> {
  const [folders, files, syllabusSections] = await Promise.all([
    prisma.folder.findMany({ orderBy: [{ order: 'asc' }, { name: 'asc' }] }),
    prisma.file.findMany({ orderBy: [{ order: 'asc' }, { name: 'asc' }] }),
    prisma.syllabusSection.findMany({ select: { id: true, title: true, folderId: true } }),
  ]);

  const syllabusByFolder = new Map<string, SyllabusLink[]>();
  syllabusSections.forEach((section) => {
    if (section.folderId) {
      const list = syllabusByFolder.get(section.folderId) || [];
      list.push({ id: section.id, title: section.title });
      syllabusByFolder.set(section.folderId, list);
    }
  });

  if (!userId) {
    return buildFolderTree(folders, files, syllabusByFolder);
  }

  const [bookmarks, progress] = await Promise.all([
    prisma.bookmark.findMany({ where: { userId }, select: { fileId: true } }),
    prisma.fileProgress.findMany({ where: { userId }, select: { fileId: true, completed: true, lastOpenedAt: true } }),
  ]);
  const bookmarkedSet = new Set(bookmarks.map((b) => b.fileId));
  const completedSet = new Set(progress.filter((p) => p.completed).map((p) => p.fileId));
  const openedMap = new Map(progress.map((p) => [p.fileId, p.lastOpenedAt]));

  return buildFolderTree(folders, files, syllabusByFolder, {
    bookmarked: bookmarkedSet,
    completed: completedSet,
    opened: openedMap,
    totalFiles: files.length,
  });
}

export async function createFolder(params: { name: string; description?: string; parentId?: string; userId?: string }) {
  if (params.parentId) {
    const parentExists = await prisma.folder.findUnique({ where: { id: params.parentId } });
    if (!parentExists) {
      throw new AppError(400, 'Parent folder not found');
    }
  }
  const siblingCount = await prisma.folder.count({ where: { parentId: params.parentId || null } });

  return prisma.folder.create({
    data: {
      name: params.name,
      description: params.description,
      parentId: params.parentId || null,
      createdById: params.userId,
      order: siblingCount,
    },
  });
}

export async function updateFolder(id: string, data: { name?: string; description?: string }) {
  const folder = await prisma.folder.findUnique({ where: { id } });
  if (!folder) {
    throw new AppError(404, 'Folder not found');
  }

  return prisma.folder.update({
    where: { id },
    data,
  });
}

export async function deleteFolder(id: string) {
  const childCount = await prisma.folder.count({ where: { parentId: id } });
  const fileCount = await prisma.file.count({ where: { folderId: id } });

  if (childCount > 0 || fileCount > 0) {
    throw new AppError(400, 'Folder is not empty. Remove child folders and files first.');
  }

  await prisma.folder.delete({ where: { id } });
  return true;
}
