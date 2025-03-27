import mongoose from 'mongoose';

const leaderboardSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    score: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);
