import express, { Request, Response } from 'express';

const router = express.Router();

// GET all leaderboard entries
router.get('/', async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: 'Get all leaderboard entries' });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaderboard', error: (error as Error).message });
  }
});

// GET leaderboard entry by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    res.status(200).json({ message: `Get leaderboard entry with ID: ${id}` });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaderboard entry', error: (error as Error).message });
  }
});

// POST create new leaderboard entry
router.post('/', async (req: Request, res: Response) => {
  try {
    const entryData = req.body;
    res.status(201).json({ message: 'Leaderboard entry created successfully', data: entryData });
  } catch (error) {
    res.status(500).json({ message: 'Error creating leaderboard entry', error: (error as Error).message });
  }
});

// PUT update leaderboard entry
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    res.status(200).json({ message: `Leaderboard entry updated with ID: ${id}`, data: updateData });
  } catch (error) {
    res.status(500).json({ message: 'Error updating leaderboard entry', error: (error as Error).message });
  }
});

// DELETE leaderboard entry
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    res.status(200).json({ message: `Leaderboard entry deleted with ID: ${id}` });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting leaderboard entry', error: (error as Error).message });
  }
});

export default router; 