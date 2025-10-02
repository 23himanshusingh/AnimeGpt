/* eslint-disable */
// This file is intended to be run with Node.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


const watchlistRoutes = require('./routes/watchlist');
app.use('/api/watchlist', watchlistRoutes);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// MongoDB connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI is not set in your .env file!');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log('✅ Connected to MongoDB');
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }); 