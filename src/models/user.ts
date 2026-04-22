import mongoose, { Document, Schema } from 'mongoose';

export type Gender = 'male' | 'female';

export interface IUser extends Document {
  phone: string;
  countryCode: string;
  name: string;
  username?: string;
  firstname: string;
  lastname?: string;
  gender?: Gender;
  birthday?: Date;
  avatar?: string;
  isProfileComplete: boolean;
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
  memberSince: Date;
  badges: string[];
  rating: number;
  totalReviews: number;
  eventsJoined: number;
  eventsCreated: number;
  isActive: boolean;
  isBanned: boolean;
}

const UserSchema = new Schema<IUser>(
  {
    phone: { type: String, required: true, unique: true },
    countryCode: { type: String, required: true, default: '+998' },
    name: { type: String, default: '' },
    username: {
      type: String,
      sparse: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    firstname: { type: String, default: '', trim: true },
    lastname: { type: String, trim: true },
    gender: { type: String, enum: ['male', 'female'] },
    birthday: { type: Date },
    avatar: String,
    isProfileComplete: { type: Boolean, default: false },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] },
    },
    memberSince: { type: Date, default: Date.now },
    badges: { type: [String], default: [] },
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    eventsJoined: { type: Number, default: 0 },
    eventsCreated: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isBanned: { type: Boolean, default: false },
  },
  { timestamps: true },
);

UserSchema.index({ location: '2dsphere' });

export const User = mongoose.model<IUser>('User', UserSchema);
