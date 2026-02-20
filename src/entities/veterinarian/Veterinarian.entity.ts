import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IVet extends Document {
  firstName: string;
  lastName: string;
  licenseNumber: string;
  specialties?: string[];
  phone?: string;
  email: string;
  clinicId: Types.ObjectId;
}


// TODO crear entidad especialidades y enums etc
// organizar bien los directorios
const vetSchema = new Schema<IVet>(
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
    specialties: {
      type: [String],
      required: false,
    },
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

const Vet = mongoose.model<IVet>('Vet', vetSchema);

export default Vet;

