/* eslint-disable */
const express = require('express');
const router = express.Router();
const watchlistController = require('../controllers/watchlistController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', watchlistController.getWatchlist);
router.post('/', watchlistController.addToWatchlist);
router.put('/:mal_id', watchlistController.updateWatchlistAnime);
router.delete('/:mal_id', watchlistController.removeFromWatchlist);

module.exports = router; 