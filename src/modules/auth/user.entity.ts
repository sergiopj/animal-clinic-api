import mongoose, { Document, Schema, Types } from 'mongoose';

import { UserRole } from '../../shared/auth/auth.types.js';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: UserRole;
  clinicId: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

export const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: Object.values(UserRole), required: true },
    clinicId: { type: Schema.Types.ObjectId, ref: 'Clinic', default: null },
  },
  { timestamps: true, collection: 'users' }
);

const User = mongoose.model<IUser>('User', userSchema);
export default User;
