import Joi from "joi";
import type { Request, Response, NextFunction } from "express";

import "joi-objectid";

// Define status enum values
const statusEnum = ["completed", "failed", "in_progress"];

// Result validation schema
export const resultSchema = Joi.object({
  id: Joi.number().integer().optional(),
  userId: Joi.number().integer().required().messages({
    "any.required": "User ID is required",
    "number.base": "User ID must be an integer",
    "number.integer": "User ID must be an integer",
  }),
  word: Joi.string().required().messages({
    "any.required": "Word is required",
    "string.base": "Word must be a string",
  }),
  feedback: Joi.alternatives()
    .try(Joi.string(), Joi.array().items(Joi.string()))
    .optional(),
  attempts: Joi.number().integer().required().messages({
    "any.required": "Attempts is required",
    "number.base": "Attempts must be a number",
    "number.integer": "Attempts must be an integer",
  }),
  status: Joi.string()
    .valid(...statusEnum)
    .required()
    .messages({
      "any.required": "Status is required",
      "any.only": `Status must be one of: ${statusEnum.join(", ")}`,
    }),
  gameDate: Joi.date().optional(),
})
  .min(1) // Enforce at least one field
  .messages({
    "object.min": "At least one field must be provided for update",
  });

// Validation middleware for result
export const validateResult = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = resultSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    return res.status(400).json({ error: errorMessage });
  }

  next();
};
