export interface PetModel {
  _id: string;
  name: string;
  species: string;
  breed?: string;
  age?: number;
  ownerName: string;
  ownerContact: string;
  clinicId: string;
  veterinarianId?: string;
  createdAt: Date;
  updatedAt: Date;
}
