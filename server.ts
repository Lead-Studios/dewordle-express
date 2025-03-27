import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import dbConnection from "./src/config/database";
import {
  userRoutes,
  authRoutes,
  leaderboardRoutes,
  adminRoutes,
  resultRoutes,
} from "./src/routes";
import subAdminRoutes from "./src/routes/subAdmin.routes";

// Configure dotenv
dotenv.config();

// Create express app
const app = express();

// ✅ Connect to Database before setting up middleware
dbConnection();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ✅ Register routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/sub-admin", subAdminRoutes);
app.use("/api/results", resultRoutes);

// ✅ Root route
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Dewordle Express");
});

// ✅ 404 Not Found Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});


// Error handling middleware
app.use(
  (
    error: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.status(res.statusCode || 500).json({
      message: error.message,
      stack: process.env.NODE_ENV === "production" ? "🥞" : error.stack,
    });
  }
);

// ✅ Error Handling Middleware
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(res.statusCode >= 400 ? res.statusCode : 500).json({
    message: error.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : error.stack,
  });
});


// ✅ Port Configuration
const PORT = process.env.PORT || 3000;

// ✅ Start Server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});



// ✅ Graceful Shutdown (For Production)
process.on("SIGINT", () => {
  console.log("🛑 Server shutting down...");
  server.close(() => {
    console.log("🔌 Database disconnected");
    process.exit(0);
  });
});

