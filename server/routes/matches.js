import express from 'express';
import Match from '../models/Match.js';
import Settings from '../models/Settings.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const settings = await Settings.findOne();
    const deadline = settings?.predictionDeadline ? new Date(settings.predictionDeadline) : null;
    const matches = await Match.find().sort({ matchDate: 1 });
    res.json({ matches, deadline, isClosed: deadline ? new Date() > deadline : false });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
