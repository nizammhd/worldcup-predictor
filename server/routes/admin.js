import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import User from '../models/User.js';
import Match from '../models/Match.js';
import Prediction from '../models/Prediction.js';
import Settings from '../models/Settings.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

const ensureSettings = async () => {
  const settings = await Settings.findOne();
  if (!settings) return Settings.create({ predictionDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
  return settings;
};

const scorePoints = (predicted1, predicted2, actual1, actual2) =>
  Number(predicted1) === Number(actual1) && Number(predicted2) === Number(actual2) ? 3 : 0;

const recalculateMatchPoints = async (matchId) => {
  const match = await Match.findById(matchId);
  if (!match) return;

  const predictions = await Prediction.find({ matchId });
  for (const prediction of predictions) {
    const newPoints = scorePoints(prediction.predicted1, prediction.predicted2, match.result1, match.result2);
    const oldPoints = prediction.pointsAwarded || 0;
    if (newPoints !== oldPoints) {
      await User.updateOne({ userId: prediction.userId }, { $inc: { totalPoints: newPoints - oldPoints } });
      prediction.pointsAwarded = newPoints;
      await prediction.save();
    }
  }
};

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ message: 'Invalid admin credentials' });

    const isValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isValid) return res.status(401).json({ message: 'Invalid admin credentials' });

    const token = jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '8h' });
    return res.json({ token, admin: { id: admin._id, username: admin.username } });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/seed', async (_req, res) => {
  try {
    const existing = await Admin.findOne({ username: 'admin' });
    if (!existing) {
      const passwordHash = await bcrypt.hash('admin123', 10);
      await Admin.create({ username: 'admin', passwordHash });
    }
    res.json({ message: 'Admin seed complete' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/users', authMiddleware, async (_req, res) => {
  const users = await User.find().sort({ totalPoints: -1, userId: 1 });
  res.json(users);
});

router.post('/users', authMiddleware, async (req, res) => {
  try {
    const { userId, name } = req.body;
    const exists = await User.findOne({ userId });
    if (exists) return res.status(400).json({ message: 'User ID already exists' });
    const user = await User.create({ userId, name, totalPoints: 0 });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/users/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/users/:id', authMiddleware, async (req, res) => {
  try {
    await Prediction.deleteMany({ userId: (await User.findById(req.params.id)).userId });
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/matches', authMiddleware, async (_req, res) => {
  const matches = await Match.find().sort({ matchDate: 1 });
  res.json(matches);
});

router.post('/matches', authMiddleware, async (req, res) => {
  try {
    const match = await Match.create(req.body);
    res.status(201).json(match);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/matches/:id', authMiddleware, async (req, res) => {
  try {
    const match = await Match.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(match);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/matches/:id', authMiddleware, async (req, res) => {
  try {
    await Prediction.deleteMany({ matchId: req.params.id });
    await Match.findByIdAndDelete(req.params.id);
    res.json({ message: 'Match deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/settings', authMiddleware, async (_req, res) => {
  const settings = await ensureSettings();
  res.json(settings);
});

router.put('/settings', authMiddleware, async (req, res) => {
  try {
    const settings = await ensureSettings();
    settings.predictionDeadline = req.body.predictionDeadline || settings.predictionDeadline;
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/results/:id', authMiddleware, async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ message: 'Match not found' });

    match.result1 = req.body.result1;
    match.result2 = req.body.result2;
    match.status = 'finished';
    await match.save();

    await recalculateMatchPoints(match._id);

    res.json(match);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/predictions', authMiddleware, async (_req, res) => {
  const predictions = await Prediction.find().populate('matchId');
  res.json(predictions);
});

export default router;
