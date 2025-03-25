import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { authRoutes, userRoutes, leaderboardRoutes, adminRoutes, resultRoutes } from './routes';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Register routers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/results', resultRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Hey 😎, Lets unlock the letters!');
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
