import mongoose, { Schema, Document } from "mongoose";

export interface IGuestUser extends Document {
  token: string;
  createdAt: Date;
  expiresAt: Date;
}

const guestSchema: Schema = new Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }, // This will automatically remove documents when they expire
  },
});

const GuestUser = mongoose.model<IGuestUser>("GuestUser", guestSchema);

export default GuestUser;
