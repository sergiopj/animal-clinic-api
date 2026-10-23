import type { IVeterinarian } from './veterinarian.entity.js';
import type { VeterinarianWriteModel } from './veterinarian.model.js';

export interface VeterinarianRepositoryPort {
  findAll(): Promise<IVeterinarian[]>;
  findById(id: string): Promise<IVeterinarian | null>;
  create(data: VeterinarianWriteModel): Promise<IVeterinarian>;
  update(id: string, data: VeterinarianWriteModel): Promise<IVeterinarian | null>;
  delete(id: string): Promise<IVeterinarian | null>;
}
