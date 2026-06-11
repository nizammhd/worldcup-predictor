import express from 'express';
import Prediction from '../models/Prediction.js';
import Match from '../models/Match.js';
import Settings from '../models/Settings.js';
import User from '../models/User.js';

const router = express.Router();

const scorePoints = (predicted1, predicted2, actual1, actual2) =>
  Number(predicted1) === Number(actual1) && Number(predicted2) === Number(actual2) ? 3 : 0;

router.get('/me/:userId', async (req, res) => {
  try {
    const predictions = await Prediction.find({ userId: Number(req.params.userId) }).populate('matchId');
    res.json(predictions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { userId, predictions } = req.body;
    const settings = await Settings.findOne();
    const deadline = settings?.predictionDeadline ? new Date(settings.predictionDeadline) : null;
    if (deadline && new Date() > deadline) {
      return res.status(400).json({ message: 'Prediction deadline has passed.' });
    }

    const user = await User.findOne({ userId: Number(userId) });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const created = [];
    for (const item of predictions) {
      const match = await Match.findById(item.matchId);
      if (!match) continue;

      const exists = await Prediction.findOne({ userId: Number(userId), matchId: item.matchId });
      if (exists) {
        exists.predicted1 = Number(item.predicted1);
        exists.predicted2 = Number(item.predicted2);
        exists.pointsAwarded = match.result1 !== null && match.result2 !== null
          ? scorePoints(item.predicted1, item.predicted2, match.result1, match.result2)
          : 0;
        await exists.save();
        created.push(exists);
        continue;
      }

      const prediction = await Prediction.create({
        userId: Number(userId),
        matchId: item.matchId,
        predicted1: Number(item.predicted1),
        predicted2: Number(item.predicted2),
        pointsAwarded: match.result1 !== null && match.result2 !== null
          ? scorePoints(item.predicted1, item.predicted2, match.result1, match.result2)
          : 0,
      });
      created.push(prediction);
    }

    const allPredictions = await Prediction.find({ userId: Number(userId) });
    const totalPoints = allPredictions.reduce((sum, item) => sum + (item.pointsAwarded || 0), 0);
    user.totalPoints = totalPoints;
    await user.save();

    res.status(201).json({ message: 'Predictions saved successfully.', predictions: created, totalPoints });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
