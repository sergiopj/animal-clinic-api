import { IPet } from '../../entities/pet/Pet.entity.js';
import { IVet } from '../../entities/veterinarian/Veterinarian.entity.js';

export interface ClinicModel {
  _id: string;
  name: string;
  address: string;
  phone: string;
  email?: string;
  website?: string;
  vatNumber: string;
  licenseNumber: string;
  veterinarians?: IVet[];
  pets?: IPet[];
  createdAt: Date;
  updatedAt: Date;
}
