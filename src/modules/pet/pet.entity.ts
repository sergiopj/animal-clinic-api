import mongoose, { Document, Schema, Types } from 'mongoose';
import { IMedicalReport } from '../medical-report/medical-report.entity.js';
import { PetGenderEnum } from './enums/pet-gender.enum.js';
import { PetSpeciesEnum } from './enums/pet-species.enum.js';

export interface IPet extends Document {
  name: string;
  species: PetSpeciesEnum;
  breed?: string;
  gender: PetGenderEnum;
  birthdate: Date;
  weight?: number;
  color?: string;
  notes?: string;
  medicalReport?: IMedicalReport[];  isVaccinated?: boolean;
  isSterilized?: boolean;
  clinicId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const petSchema = new Schema<IPet>(
  {
    name: {
      type: String,
      required: true,
    },
    species: {
      type: String,
      enum: Object.values(PetSpeciesEnum),
      required: true,
    },
    breed: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      enum: Object.values(PetGenderEnum),
      required: true,
    },
    birthdate: {
      type: Date,
      required: true,
    },
    weight: {
      type: Number,
      required: false,
    },
    color: {
      type: String,
      required: false,
    },
    notes: {
      type: String,
      required: false,
    },
    medicalReport: {
      type: [Schema.Types.ObjectId],
      ref: 'MedicalReport',
      required: false,
    },
    isVaccinated: {
      type: Boolean,
      default: false,
    },
    isSterilized: {
      type: Boolean,
      default: false,
    },
    clinicId: {
      type: Schema.Types.ObjectId,
      ref: 'Clinic',
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'pets',
  }
);

const Pet = mongoose.model<IPet>('Pet', petSchema);

export default Pet;
export { Pet };

