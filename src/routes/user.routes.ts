import express, { Request, Response } from 'express';

const router = express.Router();

// GET all users
router.get('/', async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: 'Get all users' });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: (error as Error).message });
  }
});

// GET user by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    res.status(200).json({ message: `Get user with ID: ${id}` });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: (error as Error).message });
  }
});

// POST create new user
router.post('/', async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    res.status(201).json({ message: 'User created successfully', data: userData });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: (error as Error).message });
  }
});

// PUT update user
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    res.status(200).json({ message: `User updated with ID: ${id}`, data: updateData });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: (error as Error).message });
  }
});

// DELETE user
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    res.status(200).json({ message: `User deleted with ID: ${id}` });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: (error as Error).message });
  }
});

export default router; 