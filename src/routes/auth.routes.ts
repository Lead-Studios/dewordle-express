import express, { Request, Response } from 'express';
import { signupValidationSchema, loginValidationSchema } from '../validators/auth.validator';

const router = express.Router();

// Middleware for signup validation
const validateSignup = (req: Request, res: Response, next: Function) => {
  const { error } = signupValidationSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({ errors: error.details.map(err => err.message) });
    return;
  }
  next();
};

// Middleware for login validation
const validateLogin = (req: Request, res: Response, next: Function) => {
  const { error } = loginValidationSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({ errors: error.details.map(err => err.message) });
    return;
  }
  next();
};

// POST signup
router.post('/signup', validateSignup, async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    res.status(201).json({ message: 'User registered successfully', data: userData });
  } catch (error) {
    res.status(500).json({ message: 'Error during signup', error: (error as Error).message });
  }
});

// POST login
router.post('/login', validateLogin, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    res.status(200).json({ message: 'Login successful', user: { email } });
  } catch (error) {
    res.status(500).json({ message: 'Error during login', error: (error as Error).message });
  }
});

// GET verify token
router.get('/verify', async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: 'Token verified', valid: true });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying token', error: (error as Error).message });
  }
});

// POST logout
router.post('/logout', async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error during logout', error: (error as Error).message });
  }
});

export default router; 