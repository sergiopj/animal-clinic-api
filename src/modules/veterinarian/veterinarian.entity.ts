import mongoose, { Document, Schema, Types } from 'mongoose';
import { ISpecialty } from '../specialty/specialty.entity.js';

export interface IVeterinarian extends Document {
  firstName: string;
  lastName: string;
  licenseNumber: string;
  specialties?: ISpecialty[];
  phone?: string;
  email: string;
  experienceYears?: number;
  clinicId: Types.ObjectId;
}


// TODO crear entidad especialidades y enums etc
// organizar bien los directorios
const vetSchema = new Schema<IVeterinarian>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
    },
    specialties: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Specialty',
        required: false,
      },
    ],
    phone: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: 'Invalid email format',
      },
    },
    experienceYears: {
      type: Number,
      required: false,
    },
    clinicId: {
      type: Schema.Types.ObjectId,
      ref: 'Clinic',
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'veterinarians',
  }
);

const Vet = mongoose.model<IVeterinarian>('Veterinarian', vetSchema);

export default Vet;
export { Vet };

