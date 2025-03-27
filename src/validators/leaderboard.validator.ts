import Joi from 'joi';

// Pagination validation schema
export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

// ID validation schema
export const idSchema = Joi.object({
  id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
});
