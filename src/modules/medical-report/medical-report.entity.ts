import mongoose, { Document, Schema, Types } from 'mongoose';

import type { IVeterinarian } from '../veterinarian/veterinarian.entity.js';

export interface IMedicalReport extends Document {
  petId: Types.ObjectId;
  veterinarianId: Types.ObjectId | IVeterinarian;
  clinicId: Types.ObjectId;
  diagnosis: string;
  treatment: string;
  date: Date;
}

export const medicalReportSchema = new Schema<IMedicalReport>(
  {
    petId: {
      type: Schema.Types.ObjectId,
      ref: 'Pet',
      required: true,
    },
    veterinarianId: {
      type: Schema.Types.ObjectId,
      ref: 'Veterinarian',
      required: true,
    },
    clinicId: {
      type: Schema.Types.ObjectId,
      ref: 'Clinic',
      required: true,
    },
    diagnosis: {
      type: String,
      required: true,
    },
    treatment: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'MedicalReports',
  }
);

const MedicalReport = mongoose.model<IMedicalReport>('MedicalReport', medicalReportSchema);

export default MedicalReport;
