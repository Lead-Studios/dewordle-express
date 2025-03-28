const mongoose = require("mongoose");

const UserStatsSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  totalGamesPlayed: { type: Number, default: 0 },
  gamesWon: { type: Number, default: 0 },
  gamesLost: { type: Number, default: 0 },
  winStreak: { type: Number, default: 0 },
  maxWinStreak: { type: Number, default: 0 },
  avgAttemptsPerWin: { type: Number, default: 0 },
});

module.exports = mongoose.model("UserStats", UserStatsSchema);