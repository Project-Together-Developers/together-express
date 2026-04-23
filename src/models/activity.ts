import mongoose, { Document, Schema } from 'mongoose';
import { Types } from 'mongoose';

export interface IActivity extends Document {
  _id: Types.ObjectId;
  name: string;
  icon: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema = new Schema<IActivity>(
  {
    name: { type: String, required: true },
    icon: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Activity = mongoose.model<IActivity>('Activity', ActivitySchema);
