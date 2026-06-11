import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const users = await User.find().sort({ totalPoints: -1, userId: 1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
