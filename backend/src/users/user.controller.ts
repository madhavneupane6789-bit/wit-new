import { NextFunction, Request, Response } from 'express';
import { createUser, deleteUser, listUsers, updateUser } from './user.service';

export async function listUsersHandler(_req: Request, res: Response, next: NextFunction) {
  try {
    const users = await listUsers();
    res.json({ users });
  } catch (err) {
    next(err);
  }
}

export async function createUserHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password, role } = req.body;
    const user = await createUser({ name, email, password, role });
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
}

export async function updateUserHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const user = await updateUser(id, req.body);
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export async function deleteUserHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await deleteUser(id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    next(err);
  }
}
