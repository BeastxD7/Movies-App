var express = require('express');
var router = express.Router();
const { Movie } = require('../db');
const { Op } = require('sequelize');



router.get('/', async (req, res) => {
  try {
    const movies = await Movie.findAll();
    res.render('home', { title: 'Home', movies });
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).send('Error fetching movies');
  }
});

router.get('/addmovie', function(req, res, next) {
  res.render('addmovie',{title: 'Movies | Add Movie'});
});

router.get('/search', async function(req, res, next) {
  try {
    const movies = await Movie.findAll();
    res.render('search', { title: 'Search', movies });
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).send('Error fetching movies');
  }
});

// GET route to handle the search query
router.get('/search-movie', async (req, res) => {
  const { query } = req.query;
  try {
      // Search for movies by name (case-insensitive)
      const movies = await Movie.findAll({
          where: {
              name: {
                  [Op.iLike]: `%${query}%`
              }
          }
      });
      res.render('search', { title: 'Movie | Search Result ', movies });
  } catch (error) {
      console.error('Error searching movies:', error);
      res.status(500).send('Error searching movies');
  }
});



router.get('/deletemovie', async function(req, res, next) {
  try {
    const movies = await Movie.findAll();
    res.render('deletemovie', { title: 'Delete', movies });
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).send('Error fetching movies');
  }
});

// Add this route handler to your routes/index.js file
router.post('/deletemovie/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Find the movie by its ID
    const movieToDelete = await Movie.findByPk(id);
    if (!movieToDelete) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    // Delete the movie
    await movieToDelete.destroy();
    res.status(200).redirect('/');
  } catch (error) {
    console.error('Error deleting movie:', error);
    res.status(500).json({ error: 'Failed to delete movie' });
  }
});


router.get('/db', async function(req, res, next) {
  try {
    const allMovies = await Movie.findAll();
    res.json(allMovies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

router.post('/addmovie', async (req, res) => {
  try {
    const { name, description, rating, image } = req.body;
    // console.log("Received data:", name, description, rating, image); 
    if (!name || !description || !rating || !image) {
      return res.status(400).json({ error: 'Name, description, and rating are required' });
    }
    const newMovie = await Movie.create({ name, description, rating, image });
    res.status(201).redirect('/')
   
  } catch (error) {
    console.error('Error adding movie:', error);
    res.status(500).json({ error: 'Failed to add movie' });
  }
});

module.exports = router;