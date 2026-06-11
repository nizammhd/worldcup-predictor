import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findOne({ userId: Number(userId) });
    if (!user) return res.status(404).json({ message: 'User ID not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/', async (_req, res) => {
  const users = await User.find().sort({ totalPoints: -1, userId: 1 });
  res.json(users);
});

export default router;
