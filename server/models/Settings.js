import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  predictionDeadline: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.model('Settings', settingsSchema);
