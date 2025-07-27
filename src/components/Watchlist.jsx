import React, { useState } from 'react';
import useWatchlist from '../hooks/useWatchlist';
import AnimeCard from './AnimeCard';
import { FaHeart, FaTrash, FaPlay, FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const STATUS_OPTIONS = [
  'Watching',
  'Completed',
  'On-Hold',
  'Dropped',
  'Plan to Watch',
];

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
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-400 mx-auto"></div>
          <p className="mt-4 text-lg">Loading your watchlist...</p>
        </div>
      </div>
    );
  }

  if (!watchlist || watchlist.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <FaHeart className="text-6xl text-gray-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Your Watchlist is Empty</h1>
          <p className="text-gray-400 text-lg mb-6">
            Start adding your favorite anime to keep track of what you want to watch!
          </p>
          <div className="flex items-center justify-center gap-2 text-orange-400">
            <FaPlay />
            <span>Browse anime and add them to your watchlist</span>
          </div>
          <button
            onClick={handleHome}
            className="mt-8 flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-200"
          >
            <FaHome /> Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <FaHeart className="text-red-500" />
              My Watchlist
            </h1>
            <p className="text-gray-400 text-lg">
              {watchlist.length} anime in your collection
            </p>
          </div>
          <button
            onClick={handleHome}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-200"
          >
            <FaHome /> Home
          </button>
        </div>

        {/* Watchlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {watchlist.map((anime) => {
            const isEditing = editState[anime.mal_id]?.editing;
            return (
              <div key={anime.mal_id} className="relative group cursor-pointer bg-gray-900 rounded-xl shadow-lg p-2">
                <div
                  className="transition-transform duration-300 ease-in-out hover:scale-105 h-80 w-48 md:w-60 mx-auto"
                  onClick={() => handleAnimeClick(anime)}
                >
                  <AnimeCard 
                    anime={anime} 
                  />
                </div>
                {/* Remove Button */}
                <button
                  onClick={(e) => handleRemoveFromWatchlist(e, anime.mal_id)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700 z-10"
                  title="Remove from watchlist"
                >
                  <FaTrash size={12} />
                </button>
                {/* Status and Rating Controls */}
                <div className="mt-2 px-2">
                  {isEditing ? (
                    <>
                      <select
                        className="w-full px-2 py-1 rounded bg-gray-800 text-white border border-gray-700 focus:border-orange-400 focus:outline-none mb-2"
                        value={editState[anime.mal_id].status}
                        onChange={e => handleEditChange(anime.mal_id, 'status', e.target.value)}
                      >
                        {STATUS_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min={0}
                        max={10}
                        value={editState[anime.mal_id].userRating}
                        onChange={e => handleEditChange(anime.mal_id, 'userRating', Number(e.target.value))}
                        className="w-full px-2 py-1 rounded bg-gray-800 text-white border border-gray-700 focus:border-orange-400 focus:outline-none mb-2"
                      />
                      <span className="text-gray-400 text-xs block mb-2">0 = Unrated, 1-10 = Your score</span>
                      <button
                        onClick={() => handleEditSave(anime)}
                        className="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold py-1 rounded mb-1"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditState({ ...editState, [anime.mal_id]: { ...editState[anime.mal_id], editing: false } })}
                        className="w-full bg-gray-700 hover:bg-gray-800 text-white font-bold py-1 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">Status:</span>
                        <span className="text-sm font-semibold text-orange-300">{anime.status || 'Plan to Watch'}</span>
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">Your Rating:</span>
                        <span className="text-sm font-semibold text-orange-300">{anime.userRating || 0}/10</span>
                      </div>
                      <button
                        onClick={() => handleEdit(anime)}
                        className="w-full bg-gray-700 hover:bg-orange-400 text-white font-bold py-1 rounded mt-1"
                      >
                        Edit
                      </button>
                    </>
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