import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import dbConnection from "./src/config/database";
import { 
  userRoutes, 
  authRoutes, 
  leaderboardRoutes, 
  adminRoutes, 
  resultRoutes 
} from "./src/routes";

// Configure dotenv
dotenv.config();

// Create express app
const app = express();

// Middleware
app.use(cors());
dbConnection();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Register routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/results", resultRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to ChainVerse Academy");
});

// 404 handler middleware
app.use((req, res, next) => {
  const error = new Error("Not found");
  res.status(404);
  next(error);
});

// Error handling middleware
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(res.statusCode || 500).json({
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack
  });
});

// Port configuration
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

