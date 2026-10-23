import type { UserRole } from '../../shared/auth/auth.types.js';

import type { IUser } from './user.entity.js';

export interface CreateUserRecord {
  email: string;
  passwordHash: string;
  role: UserRole;
  clinicId: string | null;
}

export interface UserRepositoryPort {
  findByEmail(email: string): Promise<IUser | null>;
  create(data: CreateUserRecord): Promise<IUser>;
}
