export interface VeterinarianModel {
  _id: string;
  name: string;
  specialization?: string;
  phone: string;
  email?: string;
  clinicId: string;
  createdAt: Date;
  updatedAt: Date;
}
