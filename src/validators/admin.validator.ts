import Joi from "joi";
import type { Request, Response, NextFunction } from "express";

import "joi-objectid";

// Admin validation schema
export const adminSchema = Joi.object({
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

  isSuperAdmin: Joi.boolean().required().messages({
    "any.required": "Super admin status is required",
    "boolean.base": "Super admin status must be a boolean",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

// Admin update validation schema (for PATCH requests)
export const adminUpdateSchema = Joi.object({
  username: Joi.string().min(3).max(30).optional().messages({
    "string.base": "Username must be a string",
    "string.min": "Username must be at least 3 characters long",
    "string.max": "Username must be at most 30 characters long",
  }),
  email: Joi.string().email().optional().messages({
    "string.email": "Email must be a valid email address",
    "string.base": "Email must be a string",
  }),

  isSuperAdmin: Joi.boolean().optional().messages({
    "boolean.base": "Super admin status must be a boolean",
  }),
})
  .min(1) // Enforce at least one field
  .messages({
    "object.min": "At least one field must be provided for update",
  });

// Validation middleware for admin creation
export const validateAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = adminSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    return res.status(400).json({ error: errorMessage });
  }

  next();
};

// Validation middleware for admin update
export const validateAdminUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = adminUpdateSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    return res.status(400).json({ error: errorMessage });
  }

  next();
};
