import express, { Request, Response } from 'express';

const router = express.Router();

// GET all results
router.get('/', async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: 'Get all game results' });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching results', error: (error as Error).message });
  }
});

// GET result by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    res.status(200).json({ message: `Get game result with ID: ${id}` });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching result', error: (error as Error).message });
  }
});

// GET results by user ID
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    res.status(200).json({ message: `Get all game results for user with ID: ${userId}` });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user results', error: (error as Error).message });
  }
});

// POST create new result
router.post('/', async (req: Request, res: Response) => {
  try {
    const resultData = req.body;
    res.status(201).json({ message: 'Game result created successfully', data: resultData });
  } catch (error) {
    res.status(500).json({ message: 'Error creating result', error: (error as Error).message });
  }
});

// PUT update result
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    res.status(200).json({ message: `Game result updated with ID: ${id}`, data: updateData });
  } catch (error) {
    res.status(500).json({ message: 'Error updating result', error: (error as Error).message });
  }
});

// DELETE result
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    res.status(200).json({ message: `Game result deleted with ID: ${id}` });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting result', error: (error as Error).message });
  }
});

export default router; 