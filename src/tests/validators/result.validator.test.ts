import { describe, test, expect } from "@jest/globals";
import { resultSchema } from "../../validators/result.validator";
describe("Result Validator", () => {
  const validUserId = 123; // Ensure userId is an integer

  test("should validate a result with numeric userId", () => {
    const validResult = {
      userId: validUserId,
      word: "hello",
      attempts: 3,
      status: "completed",
      feedback: ["correct", "incorrect", "correct"],
    };

    const { error } = resultSchema.validate(validResult);
    expect(error).toBeUndefined();
  });

  test("should reject when userId is missing", () => {
    const invalidResult = {
      word: "hello",
      attempts: 3,
      status: "completed",
    };

    const { error } = resultSchema.validate(invalidResult);
    expect(error).toBeDefined();
    if (error) {
      expect(error.details[0].message).toContain("User ID is required");
    }
  });

  test("should reject when userId is not an integer", () => {
    const invalidResult = {
      userId: "abc", // Invalid userId
      word: "hello",
      attempts: 3,
      status: "completed",
    };

    const { error } = resultSchema.validate(invalidResult);
    expect(error).toBeDefined();
    if (error) {
      expect(error.details[0].message).toContain("User ID must be an integer");
    }
  });

  test("should reject when word is missing", () => {
    const invalidResult = {
      userId: validUserId,
      attempts: 3,
      status: "completed",
    };

    const { error } = resultSchema.validate(invalidResult);
    expect(error).toBeDefined();
    if (error) {
      expect(error.details[0].message).toContain("Word is required");
    }
  });

  test("should reject when attempts is not a number", () => {
    const invalidResult = {
      userId: validUserId,
      word: "hello",
      attempts: "three",
      status: "completed",
    };

    const { error } = resultSchema.validate(invalidResult);
    expect(error).toBeDefined();
    if (error) {
      expect(error.details[0].message).toContain("Attempts must be a number");
    }
  });

  test("should reject when status is invalid", () => {
    const invalidResult = {
      userId: validUserId,
      word: "hello",
      attempts: 3,
      status: "invalid-status",
    };

    const { error } = resultSchema.validate(invalidResult);
    expect(error).toBeDefined();
    if (error) {
      expect(error.details[0].message).toContain("Status must be one of");
    }
  });
});
