import type { Types } from 'mongoose';

import type { IMedicalReport } from './medical-report.entity.js';

export interface MedicalReportWriteData {
  veterinarianId: string;
  diagnosis: string;
  treatment: string;
  date: Date;
}

export interface MedicalReportRepositoryPort {
  veterinarianBelongsToClinic(veterinarianId: string, clinicId: Types.ObjectId): Promise<boolean>;
  findByPetId(petId: Types.ObjectId, clinicId: Types.ObjectId): Promise<IMedicalReport[]>;
  create(
    petId: Types.ObjectId,
    clinicId: Types.ObjectId,
    data: MedicalReportWriteData
  ): Promise<IMedicalReport>;
  update(
    id: string,
    petId: Types.ObjectId,
    clinicId: Types.ObjectId,
    data: MedicalReportWriteData
  ): Promise<IMedicalReport | null>;
  delete(
    id: string,
    petId: Types.ObjectId,
    clinicId: Types.ObjectId
  ): Promise<IMedicalReport | null>;
}
