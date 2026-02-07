import mongoose, { Schema, Document, Types } from 'mongoose';

export enum AppointmentType {
  Consultation = 'Consultation',
  Vaccination = 'Vaccination',
  Surgery = 'Surgery',
  Checkup = 'Checkup',
  Emergency = 'Emergency'
}

export enum AppointmentStatus {
  Scheduled = 'Scheduled',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  NoShow = 'NoShow'
}

export interface IAppointment extends Document {
  pet: Types.ObjectId;
  veterinarian: Types.ObjectId;
  clinic: Types.ObjectId;
  date: Date;
  type: AppointmentType;
  reason?: string; // Motivo de la consulta
  diagnosis?: string; // Resultado (si aplica)
  status: AppointmentStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema: Schema = new Schema({
  pet: { type: Schema.Types.ObjectId, ref: 'Pet', required: true },
  veterinarian: { type: Schema.Types.ObjectId, ref: 'Veterinarian', required: true },
  clinic: { type: Schema.Types.ObjectId, ref: 'Clinic', required: true },
  date: { type: Date, required: true },
  type: { 
    type: String, 
    enum: Object.values(AppointmentType), 
    required: true 
  },
  reason: { type: String },
  diagnosis: { type: String },
  status: { 
    type: String, 
    enum: Object.values(AppointmentStatus), 
    default: AppointmentStatus.Scheduled 
  },
  notes: { type: String }
}, {
  timestamps: true
});

export const Appointment = mongoose.model<IAppointment>('Appointment', AppointmentSchema);
