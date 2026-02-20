import mongoose, { Document, Schema, Types } from 'mongoose';
import { PetSpecies } from './enums/pet-species.enum.js';
import { PetGender } from './enums/pet-gender.enum.js';

export interface IPet extends Document {
  name: string;
  species: PetSpecies;
  breed?: string;
  gender: PetGender;
  birthdate: Date;
  weight?: number;
  color?: string;
  notes?: string;
  medicalHistory?: string; // Entidad con las enfermedades o consultas, a su vez la enfermedad tendra su entidad tratamiento
  isVaccinated?: boolean; // Entidad vacuna con su fecha de vacunacion, etc
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
    medicalHistory: {
      type: String,
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

