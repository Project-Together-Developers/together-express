import mongoose, { Document, Schema } from 'mongoose';
import { Types } from 'mongoose';

export type Difficulty = 'beginner' | 'medium' | 'pro';
export type Transport = 'need-ride' | 'has-seats' | 'public';
export type EventStatus = 'pending' | 'approved' | 'rejected';

export interface IEvent extends Document {
  _id: Types.ObjectId;
  activity: Types.ObjectId;
  organizer: Types.ObjectId;
  location: string;
  dateFrom: Date;
  dateTo?: Date;
  difficulty: Difficulty;
  spots: number;
  spotsFilled: number;
  alreadyGoing: number;
  transport: Transport;
  budget?: number;
  description?: string;
  status: EventStatus;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    activity: { type: Schema.Types.ObjectId, ref: 'Activity', required: true },
    organizer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    location: { type: String, required: true },
    dateFrom: { type: Date, required: true },
    dateTo: { type: Date },
    difficulty: { type: String, enum: ['beginner', 'medium', 'pro'], required: true },
    spots: { type: Number, required: true },
    spotsFilled: { type: Number, default: 0 },
    alreadyGoing: { type: Number, default: 0 },
    transport: { type: String, enum: ['need-ride', 'has-seats', 'public'], required: true },
    budget: { type: Number },
    description: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true },
);

export const Event = mongoose.model<IEvent>('Event', EventSchema);
