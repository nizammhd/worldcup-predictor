import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
  predicted1: { type: Number, required: true },
  predicted2: { type: Number, required: true },
  pointsAwarded: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Prediction', predictionSchema);
