import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ISpecialty extends Document {
  name: string;
  description?: string;
  veterinarians?: Types.ObjectId[];
}

export const specialtySchema = new Schema<ISpecialty>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    veterinarians: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Veterinarian',
        required: true,
      },
    ],
  },
  {
    timestamps: true,
    collection: 'Specialties',
  }
);

const Specialty = mongoose.model<ISpecialty>('Specialty', specialtySchema);

export default Specialty;
export { Specialty };
