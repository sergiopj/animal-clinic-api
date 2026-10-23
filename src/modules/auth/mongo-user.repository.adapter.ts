import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';

import type { IUser } from './user.entity.js';
import type { CreateUserRecord, UserRepositoryPort } from './user.repository.port.js';

@Injectable()
export class MongoUserRepositoryAdapter implements UserRepositoryPort {
  constructor(@InjectModel('User') private readonly userModel: Model<IUser>) {}

  findByEmail(email: string): Promise<IUser | null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).select('+passwordHash').exec();
  }

  create(data: CreateUserRecord): Promise<IUser> {
    return new this.userModel(data).save();
  }
}
