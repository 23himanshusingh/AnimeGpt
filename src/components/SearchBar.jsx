import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useAnimeSearch from '../hooks/useAnimeSearch';
import { FaSearch, FaTimes } from 'react-icons/fa';

const SearchBar = ({ onAnimeSelect }) => {
  const { searchTerm, setSearchTerm, clearSearch } = useAnimeSearch();
  const { searchResults, searchLoading } = useSelector(store => store.anime);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsDropdownOpen(value.length > 0);
  };

  const handleAnimeSelect = (anime) => {
    onAnimeSelect(anime);
    clearSearch();
    setIsDropdownOpen(false);
  };

  const handleClearSearch = () => {
    clearSearch();
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative flex-1 max-w-md" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          placeholder="Search anime..."
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => searchTerm.length > 0 && setIsDropdownOpen(true)}
          className="w-full px-4 py-2 pl-10 pr-10 text-white bg-black/50 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-400 placeholder-gray-400"
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        {searchTerm && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <FaTimes />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isDropdownOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-black/95 border border-gray-600 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          {searchLoading ? (
            <div className="p-4 text-center text-gray-400">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-400 mx-auto"></div>
              <p className="mt-2">Searching...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div>
              {searchResults.map((anime) => (
                <div
                  key={anime.mal_id}
                  onClick={() => handleAnimeSelect(anime)}
                  className="flex items-center p-3 hover:bg-gray-800 cursor-pointer border-b border-gray-700 last:border-b-0"
                >
                  <img
                    src={anime.images.jpg.image_url}
                    alt={anime.title}
                    className="w-12 h-16 object-cover rounded mr-3"
                  />
                  <div className="flex-1">
                    <h4 className="text-white font-medium text-sm">{anime.title}</h4>
                    <p className="text-gray-400 text-xs">{anime.type} • {anime.year || 'Unknown'}</p>
                    {anime.score && (
                      <p className="text-orange-400 text-xs">★ {anime.score}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : searchTerm.length > 0 ? (
            <div className="p-4 text-center text-gray-400">
              No anime found for "{searchTerm}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar; 