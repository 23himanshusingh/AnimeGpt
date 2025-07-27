/* eslint-disable */
const Watchlist = require('../models/Watchlist');

// Get the user's watchlist
exports.getWatchlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const watchlist = await Watchlist.findOne({ user: userId });
    res.json(watchlist ? watchlist.anime : []);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Add an anime to the watchlist
exports.addToWatchlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const animeData = req.body;
    let watchlist = await Watchlist.findOne({ user: userId });
    if (!watchlist) {
      watchlist = new Watchlist({ user: userId, anime: [animeData] });
    } else {
      // Prevent duplicates
      if (watchlist.anime.some(a => a.mal_id === animeData.mal_id)) {
        return res.status(400).json({ error: 'Anime already in watchlist' });
      }
      watchlist.anime.push(animeData);
    }
    await watchlist.save();
    res.status(201).json(watchlist.anime);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update status/userRating for an anime
exports.updateWatchlistAnime = async (req, res) => {
  try {
    const userId = req.user.id;
    const { mal_id } = req.params;
    const { status, userRating } = req.body;
    const watchlist = await Watchlist.findOne({ user: userId });
    if (!watchlist) return res.status(404).json({ error: 'Watchlist not found' });
    const anime = watchlist.anime.find(a => a.mal_id == mal_id);
    if (!anime) return res.status(404).json({ error: 'Anime not found' });
    if (status) anime.status = status;
    if (userRating !== undefined) anime.userRating = userRating;
    await watchlist.save();
    res.json(anime);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Remove an anime from the watchlist
exports.removeFromWatchlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { mal_id } = req.params;
    const watchlist = await Watchlist.findOne({ user: userId });
    if (!watchlist) return res.status(404).json({ error: 'Watchlist not found' });
    watchlist.anime = watchlist.anime.filter(a => a.mal_id != mal_id);
    await watchlist.save();
    res.json(watchlist.anime);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}; 