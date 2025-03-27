import Joi from "joi";
import "joi-objectid";
import type { Request, Response, NextFunction } from "express";

// User validation schema
export const userSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "any.required": "Username is required",
    "string.base": "Username must be a string",
    "string.min": "Username must be at least 3 characters long",
    "string.max": "Username must be at most 30 characters long",
  }),
  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
    "string.email": "Email must be a valid email address",
    "string.base": "Email must be a string",
  }),
  password: Joi.string()
    .min(8)
    .max(100)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
    .required()
    .messages({
      "any.required": "Password is required",
      "string.base": "Password must be a string",
      "string.min": "Password must be at least 8 characters long",
      "string.max": "Password must be at most 100 characters long",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
  isActive: Joi.boolean().default(true).optional(),
});

// User update validation schema (for PATCH requests)
export const userUpdateSchema = Joi.object({
  username: Joi.string().min(3).max(30).optional().messages({
    "string.base": "Username must be a string",
    "string.min": "Username must be at least 3 characters long",
    "string.max": "Username must be at most 30 characters long",
  }),
  email: Joi.string().email().optional().messages({
    "string.email": "Email must be a valid email address",
    "string.base": "Email must be a string",
  }),
  password: Joi.string()
    .min(8)
    .max(100)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
    .optional()
    .messages({
      "string.base": "Password must be a string",
      "string.min": "Password must be at least 8 characters long",
      "string.max": "Password must be at most 100 characters long",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

// Validation middleware for user creation
export const validateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = userSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    return res.status(400).json({ error: errorMessage });
  }

  next();
};

// Validation middleware for user update
export const validateUserUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = userUpdateSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    return res.status(400).json({ error: errorMessage });
  }

  next();
};
