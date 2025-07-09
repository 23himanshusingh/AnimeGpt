import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useAnimeDetails from '../hooks/useAnimeDetails';
import useWatchlist from '../hooks/useWatchlist';
import useAnimeTrailer from '../hooks/useAnimeTrailer';
import VideoBackground from './VideoBackground';
import { clearTrailer, clearAnimeDetails } from '../utils/movieSlice';
import { FaPlay, FaPlus, FaCheck, FaStar, FaTimes, FaHeart, FaShare, FaEye, FaCalendar, FaClock, FaUsers, FaExternalLinkAlt, FaHome } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';

const AnimeDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedAnime, recommendations, detailsLoading, trailerLoading } = useSelector(store => store.anime);
  const { fetchAnimeDetails } = useAnimeDetails();
  const { addAnimeToWatchlist, removeAnimeFromWatchlist, isInWatchlist, watchlistError } = useWatchlist();
  const { id: animeId } = useParams();
  
  // Fetch trailer for the selected anime
  useAnimeTrailer(animeId);

  useEffect(() => {
    if (animeId) {
      fetchAnimeDetails(animeId);
    }
    return () => {
      clearAnimeDetails();
      dispatch(clearTrailer());
    };
  }, [animeId, fetchAnimeDetails, dispatch]);

  if (detailsLoading || trailerLoading) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-400 mx-auto"></div>
          <p className="text-white mt-4 text-lg">Loading anime details...</p>
        </div>
      </div>
    );
  }

  if (!selectedAnime) return null;

  const handleWatchlistToggle = () => {
    if (isInWatchlist(selectedAnime.mal_id)) {
      removeAnimeFromWatchlist(selectedAnime.mal_id);
    } else {
      addAnimeToWatchlist(selectedAnime);
    }
  };

  const handleYouTubeTrailer = () => {
    if (selectedAnime.trailer?.url) {
      window.open(selectedAnime.trailer.url, '_blank');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: selectedAnime.title,
        text: `Check out ${selectedAnime.title} on AnimeGPT!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="fixed inset-0 bg-black overflow-y-auto z-50">
      <div className="relative min-h-screen">
        {/* Home Button */}
        <button
          onClick={() => navigate('/browse')}
          className="absolute top-4 left-4 z-20 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-all duration-200 flex items-center gap-2"
        >
          <FaHome size={20} />
        </button>
        {/* Close Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 z-20 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-all duration-200"
        >
          <FaTimes size={20} />
        </button>

        {/* Hero Section with Video Background */}
        <div className="relative h-screen">
          {/* Video Background - Simple reuse */}
          <VideoBackground animeId={selectedAnime.mal_id} />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          
          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
              {/* Title and Basic Info */}
              <h1 className="text-3xl md:text-6xl font-bold text-white mb-4 leading-tight">
                {selectedAnime.title}
              </h1>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-white/90">
                {selectedAnime.score && (
                  <div className="flex items-center gap-2 bg-orange-500/20 px-3 py-1 rounded-full">
                    <FaStar className="text-orange-400" />
                    <span className="font-semibold">{selectedAnime.score}/10</span>
                  </div>
                )}
                <div className="flex items-center gap-2 bg-blue-500/20 px-3 py-1 rounded-full">
                  <FaEye />
                  <span>{selectedAnime.type}</span>
                </div>
                {selectedAnime.year && (
                  <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full">
                    <FaCalendar />
                    <span>{selectedAnime.year}</span>
                  </div>
                )}
                {selectedAnime.episodes && (
                  <div className="flex items-center gap-2 bg-purple-500/20 px-3 py-1 rounded-full">
                    <FaUsers />
                    <span>{selectedAnime.episodes} episodes</span>
                  </div>
                )}
                {selectedAnime.duration && (
                  <div className="flex items-center gap-2 bg-red-500/20 px-3 py-1 rounded-full">
                    <FaClock />
                    <span>{selectedAnime.duration}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mb-2">
                {selectedAnime.trailer?.url && (
                  <button 
                    onClick={handleYouTubeTrailer}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-red-700 transition-all duration-200 font-semibold"
                  >
                    <FaPlay />
                    Watch Trailer
                    <FaExternalLinkAlt className="text-xs" />
                  </button>
                )}
                <button
                  onClick={handleWatchlistToggle}
                  className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 font-semibold ${
                    isInWatchlist(selectedAnime.mal_id)
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-600 text-white hover:bg-gray-700'
                  }`}
                >
                  {isInWatchlist(selectedAnime.mal_id) ? <FaCheck /> : <FaPlus />}
                  {isInWatchlist(selectedAnime.mal_id) ? 'In Watchlist' : 'Add to Watchlist'}
                </button>
                <button
                  onClick={handleShare}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-gray-700 transition-all duration-200 font-semibold"
                >
                  <FaShare />
                  Share
                </button>
              </div>
              {/* Watchlist Error Message */}
              {watchlistError && (
                <div className="text-red-400 bg-black/60 px-4 py-2 rounded mb-2 font-semibold">
                  {watchlistError}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-6xl mx-auto p-6 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Synopsis */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <FaPlay className="text-orange-400" />
                    Synopsis
                  </h2>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {selectedAnime.synopsis || 'No synopsis available.'}
                  </p>
                </div>

                {/* Genres */}
                {selectedAnime.genres && selectedAnime.genres.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-white mb-4">Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedAnime.genres.map((genre) => (
                        <span
                          key={genre.mal_id}
                          className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-600 transition-colors cursor-pointer"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {selectedAnime.status && (
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                        <FaEye />
                        Status
                      </h4>
                      <p className="text-gray-300">{selectedAnime.status}</p>
                    </div>
                  )}
                  {selectedAnime.rating && (
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                        <FaStar />
                        Rating
                      </h4>
                      <p className="text-gray-300">{selectedAnime.rating}</p>
                    </div>
                  )}
                  {selectedAnime.season && (
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                        <FaCalendar />
                        Season
                      </h4>
                      <p className="text-gray-300">{selectedAnime.season} {selectedAnime.year}</p>
                    </div>
                  )}
                  {selectedAnime.studios && selectedAnime.studios.length > 0 && (
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                        <FaUsers />
                        Studio
                      </h4>
                      <p className="text-gray-300">{selectedAnime.studios[0].name}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Recommendations */}
                {recommendations && recommendations.length > 0 && (
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <FaHeart className="text-red-400" />
                      You might also like
                    </h3>
                    <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
                      {recommendations.map((anime) => (
                        <div
                          key={anime.mal_id}
                          className="flex gap-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer transition-all duration-200 group"
                          onClick={() => {
                            dispatch(clearAnimeDetails());
                            dispatch(clearTrailer());
                            fetchAnimeDetails(anime.mal_id);
                          }}
                        >
                          <img
                            src={anime.images.jpg.small_image_url}
                            alt={anime.title}
                            className="w-16 h-20 object-cover rounded flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium text-sm line-clamp-2 group-hover:text-orange-400 transition-colors">
                              {anime.title}
                            </h4>
                            <p className="text-gray-400 text-xs mt-1">{anime.type}</p>
                            {anime.score && (
                              <div className="flex items-center gap-1 mt-1">
                                <FaStar className="text-yellow-400 text-xs" />
                                <span className="text-orange-400 text-xs font-medium">{anime.score}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Stats Card */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Quick Stats</h3>
                  <div className="space-y-3">
                    {selectedAnime.score && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">MAL Score</span>
                        <span className="text-orange-400 font-semibold">{selectedAnime.score}/10</span>
                      </div>
                    )}
                    {selectedAnime.rank && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Rank</span>
                        <span className="text-white font-semibold">#{selectedAnime.rank}</span>
                      </div>
                    )}
                    {selectedAnime.popularity && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Popularity</span>
                        <span className="text-white font-semibold">#{selectedAnime.popularity}</span>
                      </div>
                    )}
                    {selectedAnime.members && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Members</span>
                        <span className="text-white font-semibold">
                          {(selectedAnime.members / 1000).toFixed(1)}K
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeDetails; 