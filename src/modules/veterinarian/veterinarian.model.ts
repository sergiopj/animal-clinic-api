export interface VeterinarianModel {
  _id: string;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  specialties?: string[];
  phone?: string;
  email: string;
  experienceYears?: number;
  clinicId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type VeterinarianWriteModel = Omit<VeterinarianModel, '_id' | 'createdAt' | 'updatedAt'>;
