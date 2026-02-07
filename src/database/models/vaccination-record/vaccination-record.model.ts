import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IVaccinationRecord extends Document {
  pet: Types.ObjectId;
  vaccine: Types.ObjectId;
  veterinarian: Types.ObjectId; // Referencia real al modelo Veterinarian
  clinic: Types.ObjectId; // Dónde se puso
  applicationDate: Date;
  nextDueDate: Date; 
  batchNumber?: string; 
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VaccinationRecordSchema: Schema = new Schema({
  pet: { type: Schema.Types.ObjectId, ref: 'Pet', required: true },
  vaccine: { type: Schema.Types.ObjectId, ref: 'Vaccine', required: true },
  veterinarian: { type: Schema.Types.ObjectId, ref: 'Veterinarian', required: true }, // Ahora es obligatorio y referenciado
  clinic: { type: Schema.Types.ObjectId, ref: 'Clinic', required: true }, // Trazabilidad del lugar
  applicationDate: { type: Date, required: true, default: Date.now },
  nextDueDate: { type: Date, required: true },
  batchNumber: { type: String },
  notes: { type: String }
}, {
  timestamps: true
});

export const VaccinationRecord = mongoose.model<IVaccinationRecord>('VaccinationRecord', VaccinationRecordSchema);
