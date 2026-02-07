import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IClinic extends Document {
  name: string;
  address: string;
  phone: string;
  email?: string;
  licenseNumber: string; // Número de registro de la clínica
  veterinarians: Types.ObjectId[]; // Staff médico
  createdAt: Date;
  updatedAt: Date;
}

const ClinicSchema: Schema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  licenseNumber: { type: String, required: true, unique: true },
  veterinarians: [{ type: Schema.Types.ObjectId, ref: 'Veterinarian' }]
}, {
  timestamps: true
});

export const Clinic = mongoose.model<IClinic>('Clinic', ClinicSchema);
