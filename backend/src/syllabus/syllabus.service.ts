import { Prisma } from '@prisma/client';
import { prisma } from '../config/db';
import { AppError } from '../middleware/errorHandler';

export type SyllabusNode = {
  id: string;
  title: string;
  content: string;
  order: number;
  folderId: string | null;
  parentId?: string | null;
  children: SyllabusNode[];
};

function buildTree(sections: { id: string; title: string; content: string; order: number; parentId: string | null; folderId: string | null }[]) {
  const map = new Map<string, SyllabusNode>();

  sections.forEach((s) => {
    map.set(s.id, { ...s, children: [] });
  });

  const roots: SyllabusNode[] = [];
  map.forEach((node) => {
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  });

  const sortRecursive = (nodes: SyllabusNode[]) => {
    nodes.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
    nodes.forEach((n) => sortRecursive(n.children));
  };
  sortRecursive(roots);

  return roots;
}

export async function getSyllabusTree() {
  const sections = await prisma.syllabusSection.findMany({
    orderBy: [{ order: 'asc' }, { title: 'asc' }],
  });

  return { tree: buildTree(sections) };
}

export async function createSection(data: { title: string; content: string; parentId?: string | null; folderId?: string | null; order?: number }) {
  if (data.parentId) {
    const parent = await prisma.syllabusSection.findUnique({ where: { id: data.parentId } });
    if (!parent) throw new AppError(400, 'Parent section not found');
  }
  const siblingCount = await prisma.syllabusSection.count({ where: { parentId: data.parentId || null } });
  const section = await prisma.syllabusSection.create({
    data: {
      title: data.title,
      content: data.content,
      parentId: data.parentId || null,
      folderId: data.folderId || null,
      order: data.order ?? siblingCount,
    },
  });
  return section;
}

export async function updateSection(
  id: string,
  data: Partial<{ title: string; content: string; parentId: string | null; folderId: string | null; order: number }>,
) {
  const existing = await prisma.syllabusSection.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, 'Section not found');

  if (data.parentId === id) {
    throw new AppError(400, 'A section cannot be its own parent');
  }

  if (data.parentId) {
    const parent = await prisma.syllabusSection.findUnique({ where: { id: data.parentId } });
    if (!parent) throw new AppError(400, 'Parent section not found');
  }

  const payload = {
    title: data.title,
    content: data.content,
    parentId: data.parentId ?? data.parentId === null ? data.parentId : undefined,
    folderId: data.folderId ?? data.folderId === null ? data.folderId : undefined,
    order: data.order,
  };

  const section = await prisma.syllabusSection.update({
    where: { id },
    data: payload,
  });
  return section;
}

export async function deleteSection(id: string) {
  const childCount = await prisma.syllabusSection.count({ where: { parentId: id } });
  if (childCount > 0) {
    throw new AppError(400, 'Section has child sections. Remove children first.');
  }
  await prisma.syllabusSection.delete({ where: { id } });
  return true;
}
