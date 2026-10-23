export interface AIQueryModel {
  petId: number;
  query: string;
  context?: string;
}

export interface PetCareProfile {
  id: string;
  name: string;
  species: string;
  breed?: string;
  gender: string;
  birthdate: Date | string;
  weight?: number;
  isVaccinated?: boolean;
  isSterilized?: boolean;
  medicalReport?: Array<{
    date: Date | string;
    diagnosis: string;
    treatment: string;
  }>;
}

export interface AIResponseDTO {
  petId: string;
  petName: string;
  age: string;
  breed: string;
  query: string;
  analysis: string;
  recommendations?: string[];
  timestamp: Date;
}

export type AIResponseModel = AIResponseDTO;
