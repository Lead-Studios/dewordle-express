import Joi from "joi"
import type { Request, Response, NextFunction } from "express"

const followUserSchema = Joi.object({
  userId: Joi.string().required().messages({
    "string.base": "User ID must be a string",
    "string.empty": "User ID is required",
    "any.required": "User ID is required",
  }),
})

const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
})

export const validateFollowUser = (req: Request, res: Response, next: NextFunction): void => {
    const { error } = followUserSchema.validate(req.body);
  
    if (error) {
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((err) => err.message),
      });
      return; 
    }
  
    return next(); 
  };
  
export const validatePagination = (req: Request, res: Response, next: NextFunction): void => {
  const { error, value } = paginationSchema.validate(req.query);

  if (error) {
    res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error.details.map((err) => err.message),
    });
    return;
  }

  // Merge validated values into req.query without reassigning it
  Object.assign(req.query, value);
  
  next();
};


