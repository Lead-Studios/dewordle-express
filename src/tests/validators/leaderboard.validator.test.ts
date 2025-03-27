import { describe, test, expect } from "@jest/globals";
import { leaderboardSchema } from "../../validators/leaderboard.validator";
import { ObjectId } from "mongodb";

describe("Leaderboard Validator", () => {
  const validUserId = 6;

  test("should validate a valid leaderboard object", () => {
    const validLeaderboard = {
      userId: validUserId,
      totalWins: 10,
      totalAttempts: 20,
      averageScore: 4.5,
    };

    const { error } = leaderboardSchema.validate(validLeaderboard);
    expect(error).toBeUndefined();
  });

  test("should validate a valid leaderboard with optional fields", () => {
    const validLeaderboard = {
      userId: validUserId,
      totalWins: 10,
      totalAttempts: 20,
      averageScore: 4.5,
      rank: 5,
      lastPlayed: new Date(),
    };

    const { error } = leaderboardSchema.validate(validLeaderboard);
    expect(error).toBeUndefined();
  });

  test("should reject when userId is missing", () => {
    const invalidLeaderboard = {
      totalWins: 10,
      totalAttempts: 20,
      averageScore: 4.5,
    };

    const { error } = leaderboardSchema.validate(invalidLeaderboard);
    if (!error) {
      throw new Error("Expected validation to fail but it succeeded");
    }
    expect(error.details[0].message).toContain("User ID is required");
  });

  test("should reject when totalWins is negative", () => {
    const invalidLeaderboard = {
      userId: 3,
      totalWins: -5,
      totalAttempts: 20,
      averageScore: 4.5,
    };

    const { error } = leaderboardSchema.validate(invalidLeaderboard);
    if (!error) {
      throw new Error("Expected validation to fail but it succeeded");
    }
    expect(error.details[0].message).toContain("Total wins cannot be negative");
  });

  test("should reject when rank is less than 1", () => {
    const invalidLeaderboard = {
      userId: validUserId,
      totalWins: 10,
      totalAttempts: 20,
      averageScore: 4.5,
      rank: 0,
    };

    const { error } = leaderboardSchema.validate(invalidLeaderboard);
    if (!error) {
      throw new Error("Expected validation to fail but it succeeded");
    }
    expect(error.details[0].message).toContain("Rank must be at least 1");
  });
});
