// Imports
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const methodOverride = require('method-override');

// APP + Configurations
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI);

// Mongoose connection event listener
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});

// Import Mongoose models
const Movie = require("./models/movies");

// Set view engine
app.set("view engine", "ejs");

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

// Landing Page - Home page
app.get("/", (req, res) => {
  res.render("index");
});

// New Movie Route - GET - /movies/new
app.get("/movies/new", (req, res) => {
  res.render("movies/new");
});

// Movies index route - GET - /movies
app.get('/movies', async (req, res) => {
  try {
    const allMovies = await Movie.find();
    res.render("movies/index", { movies: allMovies });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

// Create Movie Route - POST - /movies
app.post("/movies", async (req, res) => {
  if (req.body.isAvailable) {
    req.body.isAvailable = true;
  } else {
    req.body.isAvailable = false;
  }

  try {
    await Movie.create(req.body);
    res.redirect("/movies");
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Show Route - GET - /movies/:id
app.get('/movies/:id', async (req, res) => {
  try {
    const movieToShow = await Movie.findById(req.params.id);
    res.render('movies/show', { movie: movieToShow });
  } catch (err) {
    console.log(err);
    res.redirect('/movies');
  }
});

// Edit Route - GET - /movies/:id/edit
app.get('/movies/:id/edit', async (req, res) => {
  try {
    const movieToEdit = await Movie.findById(req.params.id);
    res.render('movies/edit', { movie: movieToEdit });
  } catch (err) {
    console.log(err);
    res.redirect('/movies');
  }
});

// Update Route - PUT - /movies/:id
app.put('/movies/:id', async (req, res) => {
  if (req.body.isAvailable) {
    req.body.isAvailable = true;
  } else {
    req.body.isAvailable = false;
  }

  try {
    await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.redirect(`/movies/${req.params.id}`);
  } catch (err) {
    console.log(err);
    res.redirect(`/movies/${req.params.id}/edit`);
  }
});

// Delete Route - DELETE - /movies/:id
app.delete('/movies/:id', async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.redirect('/movies');
  } catch (err) {
    console.log(err);
    res.redirect('/movies');
  }
});

// Server handler
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
