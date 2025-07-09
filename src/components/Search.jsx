import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import SearchBar from './SearchBar';
import AnimeDetails from './AnimeDetails';
import Watchlist from './Watchlist';
import { FaSearch, FaBookmark, FaArrowLeft, FaStar, FaEye, FaCalendar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const [currentView, setCurrentView] = useState('search'); // 'search' or 'watchlist'
  const { searchResults, searchLoading } = useSelector(store => store.anime);
  const navigate = useNavigate();

  const handleAnimeSelect = (anime) => {
    navigate(`/anime/${anime.mal_id}`);
  };

  const handleShowWatchlist = () => {
    setCurrentView(currentView === 'watchlist' ? 'search' : 'watchlist');
  };

  const handleBackToBrowse = () => {
    navigate('/browse');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Header */}
      <div className="sticky top-0 bg-black/90 backdrop-blur-sm border-b border-gray-700 px-6 py-4 z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBackToBrowse}
            className="text-white hover:text-orange-400 transition-colors p-2 rounded-lg hover:bg-gray-800"
          >
            <FaArrowLeft size={20} />
          </button>
          
          <div className="flex-1 max-w-2xl">
            <SearchBar onAnimeSelect={handleAnimeSelect} />
          </div>

          <button
            onClick={handleShowWatchlist}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              currentView === 'watchlist'
                ? 'bg-orange-400 text-white'
                : 'text-white hover:bg-gray-700'
            }`}
          >
            <FaBookmark />
            Watchlist
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {currentView === 'search' ? (
          <div>
            {/* Search Results */}
            {searchLoading ? (
              <div className="flex justify-center items-center py-16">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-400 mx-auto mb-4"></div>
                  <p className="text-white text-xl">Searching anime...</p>
                  <p className="text-gray-400 mt-2">Finding the best matches for you</p>
                </div>
              </div>
            ) : searchResults.length > 0 ? (
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <FaSearch className="text-orange-400 text-2xl" />
                  <h2 className="text-3xl font-bold text-white">
                    Search Results
                  </h2>
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {searchResults.length} found
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {searchResults.map((anime) => (
                    <div
                      key={anime.mal_id}
                      className="group relative bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl"
                      onClick={() => handleAnimeSelect(anime)}
                    >
                      <div className="relative">
                        <img
                          src={anime.images.jpg.image_url}
                          alt={anime.title}
                          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                          <div className="p-4 w-full">
                            <div className="flex items-center gap-2 mb-2">
                              <FaSearch className="text-white text-lg" />
                              <span className="text-white text-sm font-medium">View Details</span>
                            </div>
                          </div>
                        </div>

                        {/* Score Badge */}
                        {anime.score && (
                          <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <FaStar className="text-yellow-300" />
                            {anime.score}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <h3 className="text-white font-semibold text-sm line-clamp-2 mb-2 group-hover:text-orange-400 transition-colors">
                          {anime.title}
                        </h3>
                        
                        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                          <div className="flex items-center gap-1">
                            <FaEye />
                            <span>{anime.type}</span>
                          </div>
                          {anime.year && (
                            <div className="flex items-center gap-1">
                              <FaCalendar />
                              <span>{anime.year}</span>
                            </div>
                          )}
                        </div>

                        {/* Genres */}
                        {anime.genres && anime.genres.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {anime.genres.slice(0, 2).map((genre) => (
                              <span
                                key={genre.mal_id}
                                className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs"
                              >
                                {genre.name}
                              </span>
                            ))}
                            {anime.genres.length > 2 && (
                              <span className="text-gray-500 text-xs">+{anime.genres.length - 2}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-gray-400 text-8xl mb-6">🔍</div>
                <h2 className="text-3xl font-bold text-white mb-4">Search for Anime</h2>
                <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
                  Use the search bar above to discover your favorite anime. Find detailed information, ratings, and recommendations.
                </p>
                <div className="flex justify-center gap-4 text-gray-500">
                  <div className="text-center">
                    <FaSearch className="text-2xl mx-auto mb-2" />
                    <p className="text-sm">Search by title</p>
                  </div>
                  <div className="text-center">
                    <FaStar className="text-2xl mx-auto mb-2" />
                    <p className="text-sm">View ratings</p>
                  </div>
                  <div className="text-center">
                    <FaBookmark className="text-2xl mx-auto mb-2" />
                    <p className="text-sm">Save to watchlist</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Watchlist />
        )}
      </div>
    </div>
  );
};

export default Search; 