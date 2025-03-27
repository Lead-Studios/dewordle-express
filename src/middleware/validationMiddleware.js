export const validateRequest = (schema) => {
    return async (req, res, next) => {
      try {
        await schema.validateAsync(req.body, { abortEarly: false });
        next();
      } catch (error) {
        const errorDetails = error.details.map(detail => ({
          message: detail.message,
          path: detail.path
        }));
  
        return res.status(400).json({
          message: 'Validation failed',
          errors: errorDetails
        });
      }
    };
  };