import mongoose, { Document, Schema } from 'mongoose';

import { IPet } from '../pet/pet.entity.js';
import { IVeterinarian } from '../veterinarian/veterinarian.entity.js';

import { validateEmail, validateURL } from './property-validator/property.validator.js';

export interface IClinic extends Document {
  name: string;
  address: string;
  phone: string;
  email?: string;
  licenseNumber: string;
  vatNumber?: string;
  website?: string;
  createdAt?: Date;
  updatedAt?: Date;
  veterinarians?: IVeterinarian[];
  pets?: IPet[];
}

export const clinicSchema = new Schema<IClinic>(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    vatNumber: {
      type: String,
      required: true,
      unique: true,
    },
    website: {
      type: String,
      required: false,
      validate: {
        validator: (v: string) => validateURL(v),
        message: 'Invalid URL format',
      },
    },
    email: {
      type: String,
      required: false,
      validate: {
        validator: (v: string) => validateEmail(v),
        message: 'Invalid email format',
      },
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    collection: 'clinics',
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Populates
clinicSchema.virtual('veterinarians', {
  ref: 'Veterinarian',
  localField: '_id',
  foreignField: 'clinicId',
});

clinicSchema.virtual('pets', {
  ref: 'Pet',
  localField: '_id',
  foreignField: 'clinicId',
});

const Clinic = mongoose.model<IClinic>('Clinic', clinicSchema);

export default Clinic;
export { Clinic };
