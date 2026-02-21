export interface VeterinarianModel {
  _id: string;
  name: string;
  specialization?: string;
  phone: string;
  email?: string;
  experienceYears?: number;
  clinicId: string;
  createdAt: Date;
  updatedAt: Date;
}
