import { IVet } from '../models/entities/Vet.js';
import { IPet } from '../models/entities/Pet.js';

export interface ClinicDTO {
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
