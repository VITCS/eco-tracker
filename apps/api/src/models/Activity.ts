import { Schema, model, Types } from 'mongoose';

const ActivitySchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', index: true, required: true },
    type: { type: String, required: true },
    data: { type: Schema.Types.Mixed, required: true },
    emissionsKgCO2e: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Activity = model('Activity', ActivitySchema);

