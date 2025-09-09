import { Schema, model } from 'mongoose';

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true, select: false },
    name: { type: String },
    preferences: { type: Schema.Types.Mixed },
    goals: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const User = model('User', UserSchema);

