import { ResponseMedicalReportDTO } from '../../../medical-report/dto/Response/response-medical-report.dto.js';

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
  medicalReport?: ResponseMedicalReportDTO[];
  isVaccinated?: boolean;
  isSterilized?: boolean;
  clinicId: string;
  createdAt: Date;
  updatedAt: Date;
}
