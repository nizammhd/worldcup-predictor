import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { MongoMemoryServer } from 'mongodb-memory-server';

import Admin from './models/Admin.js';

import adminRoutes from './routes/admin.js';
import userRoutes from './routes/user.js';
import matchRoutes from './routes/matches.js';
import predictionRoutes from './routes/predictions.js';
import leaderboardRoutes from './routes/leaderboard.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true, message: 'World Cup Predictor API is running.' }));

app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

const startServer = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      const mongod = await MongoMemoryServer.create({ binary: { version: '7.0.5' } });
      mongoUri = await mongod.getUri();
      console.log('Using in-memory MongoDB for local development');
    }

    await mongoose.connect(mongoUri);
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash('admin123', 10);
      await Admin.create({ username: 'admin', passwordHash });
      console.log('Default admin account created');
    }
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

startServer();
