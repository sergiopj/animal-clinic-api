import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IVeterinarian extends Document {
  firstName: string;
  lastName: string;
  licenseNumber: string; // Número de colegiado
  specialties?: string[]; // e.g., ["Cirugía", "Dermatología"]
  phone?: string;
  email: string;
  clinic: Types.ObjectId; // Clínica donde trabaja (asumiendo que trabaja en una principal)
  createdAt: Date;
  updatedAt: Date;
}

const VeterinarianSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  licenseNumber: { type: String, required: true, unique: true },
  specialties: [{ type: String }],
  phone: { type: String },
  email: { type: String, required: true, unique: true },
  clinic: { type: Schema.Types.ObjectId, ref: 'Clinic', required: true }
}, {
  timestamps: true
});

export const Veterinarian = mongoose.model<IVeterinarian>('Veterinarian', VeterinarianSchema);
