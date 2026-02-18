import mongoose, { Document, Schema } from 'mongoose';

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
  veterinarians?: any[];
  pets?: any[];
}

// TODO sacar los validatos a otro fichero
const clinicSchema = new Schema<IClinic>(
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
      required: false,
    },
    website: {
      type: String,
      required: false,
      validate: {
        validator: (v: string) => /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-]*)*\/?$/.test(v),
        message: 'Invalid URL format',
      },
    },
    email: {
      type: String,
      required: false,
      validate: {
        validator: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
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
    timestamps: true,
    collection: 'clinics',
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Populates
clinicSchema.virtual('veterinarians', {
  ref: 'Vet',
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

