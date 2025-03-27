import express, { Request, Response, NextFunction } from "express";
import GuestService from "../services/guest/guest.service";
import {
  verifyGuestToken,
  addRemainingTimeHeader,
} from "../middleware/guest.middleware";

const router = express.Router();
router.post("/token", async (req: Request, res: Response) => {
  try {
    const { token, expiresAt } = await GuestService.generateGuestToken();

    res.cookie("guestToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 10 * 60 * 1000,
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "Guest token generated successfully",
      data: {
        token,
        expiresAt,
        expiresIn: 600,
      },
    });
  } catch (error) {
    console.error("Error generating guest token:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate guest token",
    });
  }
});

router.get(
  "/verify",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token =
        req.header("X-Guest-Token") ||
        (req.query.token as string) ||
        req.cookies?.guestToken;

      if (!token) {
        res.status(400).json({
          success: false,
          message: "Token is required",
        });
        return;
      }

      const { valid, expiresAt } = await GuestService.verifyGuestToken(token);

      if (!valid) {
        res.status(401).json({
          success: false,
          message: "Guest session has expired. Please sign up to continue.",
          requireSignup: true,
        });
        return;
      }

      const remainingTime = await GuestService.getTimeRemaining(token);

      res.status(200).json({
        success: true,
        message: "Token is valid",
        data: {
          token,
          expiresAt,
          remainingTime,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/data",
  verifyGuestToken as express.RequestHandler,
  addRemainingTimeHeader,
  (req: Request, res: Response): void => {
    res.status(200).json({
      success: true,
      message: "Guest data retrieved successfully",
      data: {
        message: "This is protected guest data",
        expiresAt: req.guestExpiry,
      },
    });
  }
);

export default router;
