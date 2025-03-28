const UserStats = require("../models/UserStats");

// Fetch player stats
exports.getUserStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const stats = await UserStats.findOne({ userId });

    if (!stats) {
      return res.status(404).json({ message: "User stats not found" });
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats", error });
  }
};

// Update player stats after a game
exports.updateUserStats = async (req, res) => {
  try {
    const { userId, won, attempts } = req.body;

    let stats = await UserStats.findOne({ userId });

    if (!stats) {
      stats = new UserStats({ userId });
    }

    stats.totalGamesPlayed += 1;

    if (won) {
      stats.gamesWon += 1;
      stats.winStreak += 1;
      stats.avgAttemptsPerWin =
        stats.avgAttemptsPerWin === 0
          ? attempts
          : (stats.avgAttemptsPerWin + attempts) / 2;
      
      if (stats.winStreak > stats.maxWinStreak) {
        stats.maxWinStreak = stats.winStreak;
      }
    } else {
      stats.gamesLost += 1;
      stats.winStreak = 0;
    }

    await stats.save();
    res.json({ message: "Stats updated successfully", stats });
  } catch (error) {
    res.status(500).json({ message: "Error updating stats", error });
  }
};