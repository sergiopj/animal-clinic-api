import { IPet } from "../../pet.entity.js";
import { IVeterinarian } from "../../../veterinarian/veterinarian.entity.js";

export interface ResponsePetDTO {
  _id: string;
  name: string;
  species: string;
  breed?: string;
  gender: string;
  birthdate: Date;
  weight?: number;
  color?: string;
  notes?: string;
  medicalReport?: string[];
  isVaccinated?: boolean;
  isSterilized?: boolean;
  clinicId: string;
  createdAt: Date;
  updatedAt: Date;
  veterinarians?: IVeterinarian[];
  pets?: IPet[];
}
