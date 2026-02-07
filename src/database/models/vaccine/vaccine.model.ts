import mongoose, { Schema, Document } from 'mongoose';
import { TypeEnum } from './enums/type.enum';

export interface IVaccine extends Document {
  name: string; // Nombre comercial o genérico
  type: TypeEnum; // Tipo de vacuna (Rabia, Moquillo, etc.)
  manufacturer?: string;
  validityMonths: number; // Duración de la inmunidad en meses
  isMandatory: boolean; // Si es obligatoria por ley
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VaccineSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  type: { 
    type: String, 
    enum: Object.values(TypeEnum),
    required: true 
  },
  manufacturer: { type: String },
  validityMonths: { type: Number, required: true, default: 12 },
  isMandatory: { type: Boolean, default: false },
  description: { type: String }
}, {
  timestamps: true
});

export const Vaccine = mongoose.model<IVaccine>('Vaccine', VaccineSchema);
