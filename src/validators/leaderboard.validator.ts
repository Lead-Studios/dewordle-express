import Joi from "joi";
import type { Request, Response, NextFunction } from "express";

// Pagination validation schema
export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

// ID validation schema
export const idSchema = Joi.object({
  id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
});

export const leaderboardSchema = Joi.object({
  id: Joi.number().integer().optional(),
  userId: Joi.number().integer().required().messages({
    "any.required": "User ID is required",
    "number.base": "User ID must be a number",
    "number.integer": "User ID must be an integer",
  }),
  totalWins: Joi.number().integer().min(0).required().messages({
    "any.required": "Total wins is required",
    "number.base": "Total wins must be a number",
    "number.integer": "Total wins must be an integer",
    "number.min": "Total wins cannot be negative",
  }),
  totalAttempts: Joi.number().integer().min(0).required().messages({
    "any.required": "Total attempts is required",
    "number.base": "Total attempts must be a number",
    "number.integer": "Total attempts must be an integer",
    "number.min": "Total attempts cannot be negative",
  }),
  averageScore: Joi.number().min(0).required().messages({
    "any.required": "Average score is required",
    "number.base": "Average score must be a number",
    "number.min": "Average score cannot be negative",
  }),
  rank: Joi.number().integer().min(1).optional().messages({
    "number.base": "Rank must be a number",
    "number.integer": "Rank must be an integer",
    "number.min": "Rank must be at least 1",
  }),
  lastPlayed: Joi.date().optional(),
})
  .min(1) // Enforce at least one field
  .messages({
    "object.min": "At least one field must be provided for update",
  });

// Validation middleware for leaderboard
export const validateLeaderboard = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = leaderboardSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    return res.status(400).json({ error: errorMessage });
  }

  next();
};
