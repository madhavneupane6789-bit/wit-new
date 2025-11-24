import { NextFunction, Request, Response } from 'express';
import { createFolder, deleteFolder, getFolderTree, updateFolder } from './folder.service';
import { AppError } from '../middleware/errorHandler';

export async function getFolderTreeHandler(_req: Request, res: Response, next: NextFunction) {
  try {
    const tree = await getFolderTree(_req.user?.role === 'USER' ? _req.user.id : undefined);
    res.json(tree);
  } catch (err) {
    next(err);
  }
}

export async function createFolderHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, description, parentId } = req.body;
    const folder = await createFolder({ name, description, parentId, userId: req.user?.id });
    res.status(201).json({ folder });
  } catch (err) {
    next(err);
  }
}

export async function updateFolderHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const folder = await updateFolder(id, { name, description });
    res.json({ folder });
  } catch (err) {
    next(err);
  }
}

export async function deleteFolderHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!id) throw new AppError(400, 'Folder id is required');
    await deleteFolder(id);
    res.json({ message: 'Folder deleted' });
  } catch (err) {
    next(err);
  }
}
