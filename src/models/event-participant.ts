import mongoose, { Document, Schema } from 'mongoose';
import { Types } from 'mongoose';

export interface IEventParticipant extends Document {
  _id: Types.ObjectId;
  event: Types.ObjectId;
  user: Types.ObjectId;
  joinedAt: Date;
}

const EventParticipantSchema = new Schema<IEventParticipant>(
  {
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: false },
);

EventParticipantSchema.index({ event: 1, user: 1 }, { unique: true });

export const EventParticipant = mongoose.model<IEventParticipant>('EventParticipant', EventParticipantSchema);
