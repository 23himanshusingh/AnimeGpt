import React, { useState } from 'react';
import useWatchlist from '../hooks/useWatchlist';
import AnimeCard from './AnimeCard';
import { FaHeart, FaTrash, FaPlay, FaHome, FaEdit, FaStar, FaEye, FaCalendar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const STATUS_OPTIONS = [
  'Watching',
  'Completed',
  'On-Hold',
  'Dropped',
  'Plan to Watch',
];

const STATUS_COLORS = {
  'Watching': 'bg-blue-500',
  'Completed': 'bg-green-500',
  'On-Hold': 'bg-yellow-500',
  'Dropped': 'bg-red-500',
  'Plan to Watch': 'bg-gray-500',
};

const Watchlist = () => {
  const { watchlist, watchlistLoading, removeAnimeFromWatchlist, fetchWatchlist } = useWatchlist();
  const navigate = useNavigate();
  const [editState, setEditState] = useState({}); // { [mal_id]: { status, userRating, editing } }

  const handleAnimeClick = (anime) => {
    navigate(`/anime/${anime.mal_id}`);
  };

  const handleRemoveFromWatchlist = (e, animeId) => {
    e.stopPropagation();
    removeAnimeFromWatchlist(animeId);
  };

  const handleHome = () => {
    navigate('/browse');
  };

  const handleEdit = (anime) => {
    setEditState({
      ...editState,
      [anime.mal_id]: {
        status: anime.status || 'Plan to Watch',
        userRating: anime.userRating || 0,
        editing: true,
      },
    });
  };

  const handleEditChange = (mal_id, field, value) => {
    setEditState({
      ...editState,
      [mal_id]: {
        ...editState[mal_id],
        [field]: value,
      },
    });
  };

  const handleEditSave = async (anime) => {
    const { status, userRating } = editState[anime.mal_id];
    await fetch(`/api/watchlist/${anime.mal_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ status, userRating }),
    });
    setEditState({ ...editState, [anime.mal_id]: { ...editState[anime.mal_id], editing: false } });
    fetchWatchlist();
  };

  if (watchlistLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-400 mx-auto"></div>
          <p className="mt-4 text-lg">Loading your watchlist...</p>
        </div>
      </div>
    );
  }

  if (!watchlist || watchlist.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <FaHeart className="text-8xl text-gray-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">Your Watchlist is Empty</h1>
          <p className="text-gray-400 text-lg mb-8">
            Start adding your favorite anime to keep track of what you want to watch!
          </p>
          <div className="flex items-center justify-center gap-2 text-orange-400 mb-8">
            <FaPlay />
            <span>Browse anime and add them to your watchlist</span>
          </div>
          <button
            onClick={handleHome}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg transition-all duration-200 mx-auto"
          >
            <FaHome /> Browse Anime
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 flex items-center gap-3">
              <FaHeart className="text-red-500" />
              My Watchlist
            </h1>
            <p className="text-gray-400 text-lg">
              {watchlist.length} anime in your collection
            </p>
          </div>
          <button
            onClick={handleHome}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 self-start sm:self-auto"
          >
            <FaHome /> Browse
          </button>
        </div>

        {/* Watchlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {watchlist.map((anime) => {
            const isEditing = editState[anime.mal_id]?.editing;
            const status = anime.status || 'Plan to Watch';
            const userRating = anime.userRating || 0;
            
            return (
              <div key={anime.mal_id} className="group relative bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
                {/* Anime Card */}
                <div
                  className="relative cursor-pointer"
                  onClick={() => handleAnimeClick(anime)}
                >
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <AnimeCard anime={anime} />
                    {/* Overlay with info */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-semibold text-sm line-clamp-2 mb-2">
                          {anime.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-300">
                          {anime.type && (
                            <div className="flex items-center gap-1">
                              <FaEye />
                              <span>{anime.type}</span>
                            </div>
                          )}
                          {anime.year && (
                            <div className="flex items-center gap-1">
                              <FaCalendar />
                              <span>{anime.year}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={(e) => handleRemoveFromWatchlist(e, anime.mal_id)}
                  className="absolute top-3 right-3 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-700 z-10 shadow-lg"
                  title="Remove from watchlist"
                >
                  <FaTrash size={12} />
                </button>

                {/* Status and Rating Info */}
                <div className="p-4">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-1">Status</label>
                        <select
                          className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-orange-400 focus:outline-none text-sm"
                          value={editState[anime.mal_id].status}
                          onChange={e => handleEditChange(anime.mal_id, 'status', e.target.value)}
                        >
                          {STATUS_OPTIONS.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-1">Your Rating</label>
                        <input
                          type="number"
                          min={0}
                          max={10}
                          value={editState[anime.mal_id].userRating}
                          onChange={e => handleEditChange(anime.mal_id, 'userRating', Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-orange-400 focus:outline-none text-sm"
                        />
                        <span className="text-gray-400 text-xs">0 = Unrated, 1-10 = Your score</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditSave(anime)}
                          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditState({ ...editState, [anime.mal_id]: { ...editState[anime.mal_id], editing: false } })}
                          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Status Badge */}
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-xs font-medium">Status</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${STATUS_COLORS[status]}`}>
                          {status}
                        </span>
                      </div>
                      
                      {/* Rating */}
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-xs font-medium">Your Rating</span>
                        <div className="flex items-center gap-1">
                          <FaStar className="text-yellow-400 text-xs" />
                          <span className="text-white font-semibold text-sm">{userRating}/10</span>
                        </div>
                      </div>
                      
                      {/* Edit Button */}
                      <button
                        onClick={() => handleEdit(anime)}
                        className="w-full bg-gray-700 hover:bg-orange-500 text-white font-semibold py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                      >
                        <FaEdit size={12} />
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Watchlist; 