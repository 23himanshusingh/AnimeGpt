/* eslint-disable */
// This file is intended to be run with Node.js
const mongoose = require('mongoose');

const animeSchema = new mongoose.Schema({
  mal_id: { type: Number, required: true },
  title: { type: String, required: true },
  image: { type: String },
  url: { type: String },
  status: {
    type: String,
    enum: ['Watching', 'Completed', 'On-Hold', 'Dropped', 'Plan to Watch'],
    default: 'Plan to Watch'
  },
  userRating: {
    type: Number,
    min: 0, // 0 for unrated
    max: 10,
    default: 0
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const watchlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  anime: [animeSchema]
});

module.exports = mongoose.model('Watchlist', watchlistSchema); 