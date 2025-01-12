// /models/movies.js

const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  director: String,
  genre: String,
  releaseYear: Number,
  rating: Number,
  isAvailable: { type: Boolean, default: true },
});

module.exports = mongoose.model('Movie', movieSchema);
