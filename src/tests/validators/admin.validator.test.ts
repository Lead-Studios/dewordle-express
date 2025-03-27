import { describe, test, expect } from "@jest/globals";
import {
  adminSchema,
  adminUpdateSchema,
} from "../../validators/admin.validator";

describe("Admin Validator", () => {
  test("should validate a valid admin object", () => {
    const validAdmin = {
      username: "adminuser",
      email: "admin@example.com",
      isSuperAdmin: true, // Required field
    };

    const { error } = adminSchema.validate(validAdmin);
    expect(error).toBeUndefined();
  });

  test("should reject when username is missing", () => {
    const invalidAdmin = {
      email: "admin@example.com",
      isSuperAdmin: true, // Required field
    };

    const { error } = adminSchema.validate(invalidAdmin);
    expect(error).toBeDefined();
    expect(error?.details?.[0]?.message).toContain("Username is required");
  });

  test("should reject when email is missing", () => {
    const invalidAdmin = {
      username: "adminuser",
      isSuperAdmin: true, // Required field
    };

    const { error } = adminSchema.validate(invalidAdmin);
    expect(error).toBeDefined();
    expect(error?.details?.[0]?.message).toContain("Email is required");
  });

  test("should reject when isSuperAdmin is missing", () => {
    const invalidAdmin = {
      username: "adminuser",
      email: "admin@example.com",
    };

    const { error } = adminSchema.validate(invalidAdmin);
    expect(error).toBeDefined();
    expect(error?.details?.[0]?.message).toContain(
      "Super admin status is required"
    );
  });

  test("should reject when email is invalid", () => {
    const invalidAdmin = {
      username: "adminuser",
      email: "invalid-email",
      isSuperAdmin: true,
    };

    const { error } = adminSchema.validate(invalidAdmin);
    expect(error).toBeDefined();
    expect(error?.details?.[0]?.message).toContain(
      "Email must be a valid email address"
    );
  });

  test("should validate a valid admin update", () => {
    const validUpdate = {
      username: "newadmin",
    };

    const { error } = adminUpdateSchema.validate(validUpdate);
    expect(error).toBeUndefined();
  });

  test("should reject an empty update object", () => {
    const emptyUpdate = {};

    const { error } = adminUpdateSchema.validate(emptyUpdate);
    expect(error).toBeDefined();
    expect(error?.details?.[0]?.message).toContain(
      "At least one field must be provided for update"
    );
  });
});
