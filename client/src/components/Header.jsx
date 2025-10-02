import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { removeUser } from '../utils/userSlice';
import { FaSearch, FaBookmark, FaHome, FaBrain } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(removeUser());
    navigate('/');
  };

  const handleSearchClick = () => {
    navigate('/search');
  };

  const handleWatchlistClick = () => {
    if (location.pathname === '/search') {
      // If on search page, toggle watchlist view
      // This will be handled by the Search component
      return;
    }
    // If on browse page, navigate to search page with watchlist
    navigate('/search');
  };

  const handleAIRecommendationsClick = () => {
    navigate('/ai-recommendations');
  };

  return (
    <header className="sticky top-0 flex items-center bg-gradient-to-r from-black via-gray-900 to-black px-8 py-4 shadow-lg border-b-2 border-orange-400 z-50">
      <div
        className="flex items-center gap-2 flex-1 cursor-pointer hover:opacity-80 transition-opacity duration-200"
        onClick={() => navigate('/browse')}
      >
        <img src="https://m.media-amazon.com/images/I/41o03HyOYlL.png" alt="logo" className="h-12 w-12 rounded-full shadow-md border-2 border-orange-400 bg-white" />
        <span className="text-3xl font-extrabold text-orange-400 tracking-wide drop-shadow-lg">AnimeGPT</span>
      </div>
      
      {user && (
        <div className="flex items-center gap-4">
          {/* Search Button */}
          <button
            onClick={handleSearchClick}
            className="flex items-center gap-2 px-4 py-2 text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
          >
            <FaSearch />
            Search
          </button>

          {/* Watchlist Button */}
          <button
            onClick={handleWatchlistClick}
            className="flex items-center gap-2 px-4 py-2 text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
          >
            <FaBookmark />
            Watchlist
          </button>

          {/* AI Recommendations Button */}
          <button
            onClick={handleAIRecommendationsClick}
            className="flex items-center gap-2 px-4 py-2 text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
          >
            <FaBrain />
            AI Recommendations
          </button>
          
          <img
            src={user.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.displayName || user.email) + '&background=orange&color=fff'}
            alt="user"
            className="h-10 w-10 rounded-full border-2 border-orange-400 bg-white shadow"
          />
          <span className="text-white font-semibold text-lg">{user.displayName || user.email}</span>
          <button
            onClick={handleLogout}
            className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-200"
          >
            Log Out
          </button>
        </div>
      )}
    </header>
  )
}

export default Header
