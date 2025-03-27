import { Request, Response, NextFunction } from "express";

interface AuthRequest extends Request {
  user?: any;
}

const roleMiddleware = (role: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden" });
    }
  };
};

export default roleMiddleware;
