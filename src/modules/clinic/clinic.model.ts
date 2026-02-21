import { IPet } from '../pet/pet.entity.js';
import type { IVeterinarian } from '../veterinarian/veterinarian.entity.js';

export interface ClinicModel {
  _id: string;
  name: string;
  address: string;
  phone: string;
  email?: string;
  website?: string;
  vatNumber: string;
  licenseNumber: string;
  veterinarians?: IVeterinarian[];
  pets?: IPet[];
  createdAt: Date;
  updatedAt: Date;
}
