import mongoose, { Schema, Document, Types } from 'mongoose';
import { SeverityEnum } from "./enums/severity.enum";
import { StatusEnum } from "./enums/status.enum";

export interface IPathology extends Document {
  name: string;
  diagnosisDate: Date;
  status: StatusEnum;
  severity: SeverityEnum;
  treatment?: string;
  notes?: string;
  pet: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PathologySchema: Schema = new Schema({
  name: { type: String, required: true },
  diagnosisDate: { type: Date, required: true, default: Date.now },
  status: { 
    type: String, 
    enum: [StatusEnum],
    default: 'Active' 
  },
  severity: { 
    type: String,
    enum: [SeverityEnum]
  },
  treatment: { type: String },
  notes: { type: String },
  pet: { type: Schema.Types.ObjectId, ref: 'Pet', required: true } // relation 1:N
}, {
  timestamps: true
});

export const Pathology = mongoose.model<IPathology>('Pathology', PathologySchema);
