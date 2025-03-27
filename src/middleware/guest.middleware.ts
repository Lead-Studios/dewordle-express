import { Request, Response, NextFunction } from "express";
import GuestService from "../services/guest/guest.service";

declare global {
  namespace Express {
    interface Request {
      guestToken?: string;
      guestExpiry?: Date;
    }
  }
}

export const verifyGuestToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies.guestToken || req.header("X-Guest-Token") || req.query.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Guest session required",
        requireSignup: true,
      });
    }

    const { valid, expiresAt } = await GuestService.verifyGuestToken(token);
    if (!valid || (expiresAt && Date.now() > new Date(expiresAt).getTime())) {
      await GuestService.invalidateGuestToken(token);
      res.clearCookie("guestToken");

      return res.status(401).json({
        success: false,
        message: "Guest session expired - please sign up",
        requireSignup: true,
      });
    }
    const remaining = GuestService.getTimeRemaining(token);
    res.set("X-Guest-Time-Remaining", remaining.toString());

    next();
  } catch (error) {
    next(error);
  }
};

export const addRemainingTimeHeader = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.guestToken) {
      const remainingTime = await GuestService.getTimeRemaining(req.guestToken);
      res.setHeader("X-Guest-Remaining-Time", remainingTime.toString());
    }
    next();
  } catch (error) {
    console.error("Error adding remaining time header:", error);
    next();
  }
};
