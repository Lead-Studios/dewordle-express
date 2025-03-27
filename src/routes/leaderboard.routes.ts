import express, { Request, Response } from 'express';
import { Leaderboard } from '../models/leaderboard';
import { paginationSchema, idSchema } from '../validators/leaderboard.validator';

const router = express.Router();

// ✅ GET all leaderboard entries with pagination
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { error, value } = paginationSchema.validate(req.query);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const { page, limit } = value;
    const skip = (page - 1) * limit;

    const entries = await Leaderboard.find().sort({ score: -1 }).skip(skip).limit(limit);
    const total = await Leaderboard.countDocuments();

    res.status(200).json({
      page,
      limit,
      total,
      data: entries
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaderboard', error: (error as Error).message });
  }
});

// ✅ GET leaderboard entry by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = idSchema.validate(req.params);
    if (error) {
      res.status(400).json({ message: 'Invalid ID format' });
      return;
    }

    const entry = await Leaderboard.findById(req.params.id);
    if (!entry) {
      res.status(404).json({ message: 'Leaderboard entry not found' });
      return;
    }

    res.status(200).json(entry);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaderboard entry', error: (error as Error).message });
  }
});

// ✅ DELETE leaderboard entry by ID
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = idSchema.validate(req.params);
    if (error) {
      res.status(400).json({ message: 'Invalid ID format' });
      return;
    }

    const entry = await Leaderboard.findByIdAndDelete(req.params.id);
    if (!entry) {
      res.status(404).json({ message: 'Leaderboard entry not found' });
      return;
    }

    res.status(200).json({ message: 'Leaderboard entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting leaderboard entry', error: (error as Error).message });
  }
});
export default router;
