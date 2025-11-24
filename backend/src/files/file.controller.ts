import { NextFunction, Request, Response } from 'express';
import { createFile, deleteFile, getFileById, listFilesTree, updateFile } from './file.service';

export async function listFilesHandler(_req: Request, res: Response, next: NextFunction) {
  try {
    const tree = await listFilesTree(_req.user?.id);
    res.json(tree);
  } catch (err) {
    next(err);
  }
}

export async function getFileHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const file = await getFileById(id);
    res.json({ file });
  } catch (err) {
    next(err);
  }
}

export async function createFileHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, description, fileType, googleDriveUrl, folderId } = req.body;
    const file = await createFile({
      name,
      description,
      fileType,
      googleDriveUrl,
      folderId,
      ownerId: req.user?.id,
    });
    res.status(201).json({ file });
  } catch (err) {
    next(err);
  }
}

export async function updateFileHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { name, description, fileType, googleDriveUrl, folderId } = req.body;
    const file = await updateFile(id, { name, description, fileType, googleDriveUrl, folderId });
    res.json({ file });
  } catch (err) {
    next(err);
  }
}

export async function deleteFileHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await deleteFile(id);
    res.json({ message: 'File deleted' });
  } catch (err) {
    next(err);
  }
}
