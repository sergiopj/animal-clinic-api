import mongoose, { Schema, Document } from 'mongoose';

// presentation layer interface
// TODO añadir nuevos campos
export interface IPet extends Document {
  name: string;
  species: string;
  gender: string;
  birthdate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PetSchema: Schema = new Schema({
  name: { type: String, required: true },
  species: { type: String, required: true },
  gender: { type: String, required: true },
  birthdate: { type: Date, required: true }
}, {
  timestamps: true
});

export const Pet = mongoose.model<IPet>('Pet', PetSchema);
