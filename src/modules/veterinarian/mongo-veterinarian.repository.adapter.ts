import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';

import type { IVeterinarian } from './veterinarian.entity.js';
import type { VeterinarianWriteModel } from './veterinarian.model.js';
import type { VeterinarianRepositoryPort } from './veterinarian.repository.port.js';

@Injectable()
export class MongoVeterinarianRepositoryAdapter implements VeterinarianRepositoryPort {
  constructor(
    @InjectModel('Veterinarian') private readonly veterinarianModel: Model<IVeterinarian>
  ) {}

  public async findAll(): Promise<IVeterinarian[]> {
    return this.veterinarianModel.find().populate('specialties').exec() as Promise<IVeterinarian[]>;
  }

  public async findById(id: string): Promise<IVeterinarian | null> {
    return this.veterinarianModel
      .findById(id)
      .populate('specialties')
      .exec() as Promise<IVeterinarian | null>;
  }

  public async create(data: VeterinarianWriteModel): Promise<IVeterinarian> {
    const veterinarian = new this.veterinarianModel(data);
    return veterinarian.save() as Promise<IVeterinarian>;
  }

  public async update(id: string, data: VeterinarianWriteModel): Promise<IVeterinarian | null> {
    return this.veterinarianModel
      .findByIdAndUpdate(id, data, { new: true })
      .populate('specialties')
      .exec() as Promise<IVeterinarian | null>;
  }

  public async delete(id: string): Promise<IVeterinarian | null> {
    return this.veterinarianModel.findByIdAndDelete(id).exec() as Promise<IVeterinarian | null>;
  }
}
