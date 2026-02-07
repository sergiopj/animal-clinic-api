import mongoose, { Schema, Document, Types } from 'mongoose';
import { SpeciesEnum } from './enums/species.enum';
import { GenderEnum } from './enums/gender.enum';

// presentation layer interface
export interface IPet extends Document {
  name: string;
  species: SpeciesEnum;
  breed?: string; // Raza
  gender: GenderEnum;
  weight?: number;
  color?: string;
  img?: string;
  notes?: string;
  isVaccinated?: boolean; 
  isSterilized?: boolean;
  birthdate: Date;
  pathologies: Types.ObjectId[];
  vaccinationRecords: Types.ObjectId[]; // Historial de vacunaciones
  createdAt: Date;
  updatedAt: Date;
}

const PetSchema: Schema = new Schema({
  name: { type: String, required: true },
  species: { 
    type: String, 
    enum: Object.values(SpeciesEnum),
    required: true 
  },
  breed: { type: String },
  gender: { 
    type: String, 
    enum: Object.values(GenderEnum),
    required: true 
  },
  weight: { type: Number },
  color: { type: String },
  img: { type: String },
  notes: { type: String },
  isVaccinated: { type: Boolean, default: false },
  isSterilized: { type: Boolean, default: false },
  birthdate: { type: Date, required: true },
  pathologies: [{ type: Schema.Types.ObjectId, ref: 'Pathology' }],
  vaccinationRecords: [{ type: Schema.Types.ObjectId, ref: 'VaccinationRecord' }] // Relación 1:N
}, {
  timestamps: true
});

export const Pet = mongoose.model<IPet>('Pet', PetSchema);
