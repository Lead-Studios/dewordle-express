import express, { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import User from '../models/user.model';

const router = express.Router();

// ✅ Inline Joi validation schema
const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).optional(),
  email: Joi.string().email().optional(),
});

// ✅ Handler: Get all users
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({ message: 'Get all users' });
  } catch (error) {
    next(error);
  }
});

// ✅ Handler: Get user by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    res.status(200).json({ message: `Get user with ID: ${id}` });
  } catch (error) {
    next(error);
  }
});

// ✅ Handler: Create new user
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData = req.body;
    res.status(201).json({ message: 'User created successfully', data: userData });
  } catch (error) {
    next(error);
  }
});

// ✅ Handler: Update user details (PATCH)
router.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    // Joi validation
    const { error } = updateUserSchema.validate({ name, email });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Find user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check for duplicate email
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(409).json({ message: 'Email already in use' });
      }
    }

    // Update user
    if (name) user.name = name;
    if (email) user.email = email;
    await user.save();

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    next(error);
  }
});

// ✅ Handler: Delete user
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    res.status(200).json({ message: `User deleted with ID: ${id}` });
  } catch (error) {
    next(error);
  }
});

// ✅ Export router
export default router;
