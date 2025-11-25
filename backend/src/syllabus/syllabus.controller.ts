import { NextFunction, Request, Response } from 'express';
import { createSection, deleteSection, getSyllabusTree, updateSection } from './syllabus.service';

export async function getSyllabusTreeHandler(_req: Request, res: Response, next: NextFunction) {
  try {
    const tree = await getSyllabusTree();
    res.json(tree);
  } catch (err) {
    next(err);
  }
}

export async function createSectionHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, content, parentId, folderId, order } = req.body;
    const section = await createSection({ title, content, parentId, folderId, order });
    res.status(201).json({ section });
  } catch (err) {
    next(err);
  }
}

export async function updateSectionHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { title, content, parentId, folderId, order } = req.body;
    const section = await updateSection(id, { title, content, parentId, folderId, order });
    res.json({ section });
  } catch (err) {
    next(err);
  }
}

export async function deleteSectionHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await deleteSection(id);
    res.json({ message: 'Section deleted' });
  } catch (err) {
    next(err);
  }
}
