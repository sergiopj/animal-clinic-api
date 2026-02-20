import { IPet } from "../../../../entities/pet/Pet.entity.js";
import { IVeterinarian } from "../../../../entities/veterinarian/Veterinarian.entity.js";

export interface ResponseClinicDTO {
  _id: string;
  name: string;
  address: string;
  phone: string;
  email?: string;
  website?: string;
  vatNumber?: string;
  licenseNumber: string;
  veterinarians?: IVeterinarian[];
  pets?: IPet[];
  createdAt: Date;
  updatedAt: Date;
}
