import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import User from './models/user.model';
import { signupValidationSchema, loginValidationSchema } from './validators/auth.validator';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Middleware for signup validation
const validateSignup = (req: Request, res: Response, next: NextFunction) => {
  const { error } = signupValidationSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({ errors: error.details.map(err => err.message) });
    return;
  }
  next();
};

// Middleware for login validation
const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { error } = loginValidationSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({ errors: error.details.map(err => err.message) });
    return;
  }
  next();
};

// Signup Route
app.post('/signup', validateSignup, async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'Email is already in use' });
      
    }
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: (error as Error).message });
  }
});

// Login Route
app.post('/login', validateLogin, async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }
    res.json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: (error as Error).message });
  }
});

// default route example 
app.get('/', (req, res) => {
  res.send('Hey 😎, Lets unlock the letters !');
});

//default server 
app.listen(PORT, () => {
  console.log(`🚀 Server is running `);
});
