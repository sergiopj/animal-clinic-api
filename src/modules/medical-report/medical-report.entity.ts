import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IMedicalReport extends Document {
  petId: Types.ObjectId;
  veterinarianId: Types.ObjectId;
  clinicId: Types.ObjectId;
  diagnosis: string;
  treatment: string;
  date: Date;
}

const petSchema = new Schema<IMedicalReport>(
  {
    petId: {
      type: Schema.Types.ObjectId,
      ref: 'Pet',
      required: true,
      unique: true,
    },
    veterinarianId: {
      type: Schema.Types.ObjectId,
      ref: 'Veterinarian',
      required: true,
      unique: true,
    },
    clinicId: {
      type: Schema.Types.ObjectId,
      ref: 'Clinic',
      required: true,
      unique: true,
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

const MedicalReport = mongoose.model<IMedicalReport>('MedicalReport', petSchema);

export default MedicalReport;
