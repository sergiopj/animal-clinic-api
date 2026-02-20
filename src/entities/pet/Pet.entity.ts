import mongoose, { Document, Schema, Types } from 'mongoose';
import { PetSpecies } from './enums/pet-species.enum.js';
import { PetGender } from './enums/pet-gender.enum.js';
import { IMedicalReport } from '../medical-report/medical-report.entity.js';

export interface IPet extends Document {
  name: string;
  species: PetSpecies;
  breed?: string;
  gender: PetGender;
  birthdate: Date;
  weight?: number;
  color?: string;
  notes?: string;
  medicalReport?: IMedicalReport[];  isVaccinated?: boolean;
  isSterilized?: boolean;
  clinicId: Types.ObjectId;
}

const petSchema = new Schema<IPet>(
  {
    name: {
      type: String,
      required: true,
    },
    species: {
      type: String,
      enum: Object.values(PetSpecies),
      required: true,
    },
    breed: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      enum: Object.values(PetGender),
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

