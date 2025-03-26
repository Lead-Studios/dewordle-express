import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User from "../models/user.model"
import { Types } from "mongoose" // Import Types from mongoose

// Extend the Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        email: string
        username: string
      }
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({ success: false, message: "No token, authorization denied" })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret") as { id: string }

    // Check if user exists
    const user = await User.findById(decoded.id).select("-password")

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" })
    }

    // Ensure _id is converted to string
    const userId = user._id instanceof Types.ObjectId 
      ? user._id.toString() 
      : String(user._id)

    // Add user to request
    req.user = {
      id: userId,
      email: user.email,
      username: user.username,
    }

    next()
  } catch (error) {
    console.error("Auth middleware error:", error)
    return res.status(401).json({ success: false, message: "Token is not valid" })
  }
}