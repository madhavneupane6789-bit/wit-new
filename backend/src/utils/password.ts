import bcrypt from 'bcryptjs';
import { env } from '../config/env';

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(env.bcryptSaltRounds);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
