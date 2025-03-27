import { describe, test, expect } from "@jest/globals"
import { userSchema, userUpdateSchema } from "../../validators/user.validator"

describe("User Validator", () => {
  test("should validate a valid user object", () => {
    const validUser = {
      username: "testuser",
      email: "test@example.com",
      password: "Password123!",
      isActive: true,
    }

    const { error } = userSchema.validate(validUser)
    expect(error).toBeUndefined()
  })

  test("should validate a valid user with optional fields", () => {
    const validUser = {
      username: "testuser",
      email: "test@example.com",
      password: "Password123!",
      isActive: true,
    }

    const { error } = userSchema.validate(validUser)
    expect(error).toBeUndefined()
  })

  test("should reject when username is too short", () => {
    const invalidUser = {
      username: "te",
      email: "test@example.com",
      password: "Password123!",
    }

    const { error } = userSchema.validate(invalidUser)
    if (!error) {
      throw new Error('Expected validation to fail but it succeeded');
    }
    expect(error.details[0].message).toContain("Username must be at least 3 characters long")
  })

  test("should reject when email is invalid", () => {
    const invalidUser = {
      username: "testuser",
      email: "invalid-email",
      password: "Password123!",
    }

    const { error } = userSchema.validate(invalidUser)
    if (!error) {
      throw new Error('Expected validation to fail but it succeeded');
    }
    expect(error.details[0].message).toContain("Email must be a valid email address")
  })

  test("should reject when password does not meet requirements", () => {
    const invalidUser = {
      username: "testuser",
      email: "test@example.com",
      password: "password",
    }

    const { error } = userSchema.validate(invalidUser)
    if (!error) {
      throw new Error('Expected validation to fail but it succeeded');
    }
    expect(error.details[0].message).toContain("Password must contain at least one uppercase letter")
  })

  test("should validate a valid user update", () => {
    const validUpdate = {
      username: "newusername",
    }

    const { error } = userUpdateSchema.validate(validUpdate)
    expect(error).toBeUndefined()
  })

  test("should reject an empty update object", () => {
    const emptyUpdate = {}

    const { error } = userUpdateSchema.validate(emptyUpdate)
    if (!error) {
      throw new Error('Expected validation to fail but it succeeded');
    }
    expect(error.details[0].message).toContain("At least one field must be provided for update")
  })
})