import mongoose, { Schema, Document, Model } from 'mongoose';
import { GameStatus } from '../enum/gamestatus.enum';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

// User Schema
const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);






// Create models
// export const User = mongoose.model<IUser>('User', UserSchema);
// export const Result = mongoose.model<IResult>('Result', ResultSchema);
// export const Leaderboard = mongoose.model<ILeaderboard>(
//   'Leaderboard',
//   LeaderboardSchema,
// );
