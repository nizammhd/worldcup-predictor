import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  team1: { type: String, required: true },
  team2: { type: String, required: true },
  matchDate: { type: Date, required: true },
  result1: { type: Number, default: null },
  result2: { type: Number, default: null },
  status: { type: String, default: 'upcoming' }
}, { timestamps: true });

export default mongoose.model('Match', matchSchema);
