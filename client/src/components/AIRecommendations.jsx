import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import useAIRecommendations from '../hooks/useAIRecommendations';
import AnimeCard from './AnimeCard';
import { FaBrain, FaChartBar, FaLightbulb, FaRedo, FaCog, FaStar, FaEye, FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AIRecommendations = () => {
  const navigate = useNavigate();
  const user = useSelector(store => store.user.user);
  const {
    recommendations,
    loading,
    error,
    recommendationType,
    changeRecommendationType,
    getUserInsights,
    refreshRecommendations
  } = useAIRecommendations();

  const [showInsights, setShowInsights] = useState(false);
  const [selectedLimit, setSelectedLimit] = useState(10);

  const handleAnimeClick = (anime) => {
    navigate(`/anime/${anime.mal_id}`);
  };

  const handleRecommendationTypeChange = (type) => {
    changeRecommendationType(type);
  };

  const getRecommendationTypeInfo = (type) => {
    switch (type) {
      case 'content':
        return {
          name: 'Content-Based',
          description: 'Based on genres, themes, and anime you\'ve watched',
          icon: FaEye,
          color: 'text-blue-400'
        };
      case 'collaborative':
        return {
          name: 'Collaborative',
          description: 'Based on similar users\' preferences and ratings',
          icon: FaHeart,
          color: 'text-pink-400'
        };
      case 'hybrid':
        return {
          name: 'Hybrid AI',
          description: 'Combines both approaches for optimal recommendations',
          icon: FaBrain,
          color: 'text-purple-400'
        };
      default:
        return {
          name: 'AI Recommendations',
          description: 'Personalized suggestions just for you',
          icon: FaBrain,
          color: 'text-orange-400'
        };
    }
  };

  const currentTypeInfo = getRecommendationTypeInfo(recommendationType);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <FaBrain className="text-6xl text-orange-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">AI Recommendations</h2>
          <p className="text-gray-400">Please log in to get personalized recommendations</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FaBrain className="text-4xl text-orange-400" />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">AI Recommendations</h1>
              <p className="text-gray-400 text-lg">Discover anime tailored to your taste</p>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4 bg-gray-800/50 p-4 rounded-lg">
            {/* Recommendation Type Selector */}
            <div className="flex items-center gap-2">
              <span className="text-gray-300">Algorithm:</span>
              <div className="flex bg-gray-700 rounded-lg p-1">
                {['content', 'collaborative', 'hybrid'].map((type) => {
                  const typeInfo = getRecommendationTypeInfo(type);
                  const Icon = typeInfo.icon;
                  const isActive = recommendationType === type;
                  
                  return (
                    <button
                      key={type}
                      onClick={() => handleRecommendationTypeChange(type)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
                        isActive 
                          ? 'bg-orange-500 text-white' 
                          : 'text-gray-300 hover:text-white hover:bg-gray-600'
                      }`}
                    >
                      <Icon className="text-sm" />
                      <span className="text-sm font-medium">{typeInfo.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Limit Selector */}
            <div className="flex items-center gap-2">
              <span className="text-gray-300">Show:</span>
              <select
                value={selectedLimit}
                onChange={(e) => setSelectedLimit(Number(e.target.value))}
                className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-orange-400 focus:outline-none"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </select>
            </div>

            {/* Refresh Button */}
            <button
              onClick={refreshRecommendations}
              disabled={loading}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              <FaRedo className={`text-sm ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            {/* Insights Toggle */}
            <button
              onClick={() => setShowInsights(!showInsights)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                showInsights 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
            >
              <FaChartBar />
              {showInsights ? 'Hide' : 'Show'} Insights
            </button>
          </div>
        </div>

        {/* User Insights Panel */}
        {showInsights && (
          <div className="mb-8 bg-gray-800/50 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FaLightbulb className="text-yellow-400" />
              Your Anime Profile
            </h3>
            <UserInsightsPanel insights={getUserInsights()} />
          </div>
        )}

        {/* Current Algorithm Info */}
        <div className="mb-6 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <currentTypeInfo.icon className={`text-2xl ${currentTypeInfo.color}`} />
            <div>
              <h3 className="text-xl font-semibold">{currentTypeInfo.name}</h3>
              <p className="text-gray-300">{currentTypeInfo.description}</p>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mb-8">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-400 mx-auto mb-4"></div>
                <p className="text-white text-xl">AI is analyzing your preferences...</p>
                <p className="text-gray-400 mt-2">Finding the perfect anime for you</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="text-red-400 text-6xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong</h3>
              <p className="text-gray-400 mb-4">{error}</p>
              <button
                onClick={refreshRecommendations}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-all duration-200"
              >
                Try Again
              </button>
            </div>
          ) : recommendations.length > 0 ? (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-3xl font-bold">Recommended for You</h2>
                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {recommendations.length} suggestions
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {recommendations.slice(0, selectedLimit).map((rec) => (
                  <div key={rec.animeId} className="group relative bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    {/* AI Recommendation Badge */}
                    <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-orange-500 to-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <FaBrain className="text-xs" />
                      AI
                    </div>
                    
                    {/* Confidence Score */}
                    <div className="absolute top-3 right-3 z-10 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-bold">
                      {Math.round(rec.confidence * 100)}%
                    </div>

                    {/* Anime Card */}
                    <div
                      className="relative cursor-pointer"
                      onClick={() => handleAnimeClick(rec.anime)}
                    >
                      <div className="aspect-[3/4] relative overflow-hidden">
                        <AnimeCard anime={rec.anime} />
                        
                        {/* Overlay with recommendation reason */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h3 className="text-white font-semibold text-sm line-clamp-2 mb-2">
                              {rec.anime.title}
                            </h3>
                            <p className="text-orange-400 text-xs font-medium mb-2">
                              {rec.reason}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-300">
                              {rec.anime.score && (
                                <div className="flex items-center gap-1">
                                  <FaStar className="text-yellow-400" />
                                  <span>{rec.anime.score}</span>
                                </div>
                              )}
                              {rec.anime.type && (
                                <div className="flex items-center gap-1">
                                  <FaEye />
                                  <span>{rec.anime.type}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recommendation Score */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-xs font-medium">AI Score</span>
                        <span className="text-orange-400 font-semibold text-sm">
                          {rec.score.toFixed(2)}/10
                        </span>
                      </div>
                      
                      {/* Score Bar */}
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-orange-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(rec.score / 10) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <FaBrain className="text-8xl text-gray-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">No Recommendations Yet</h2>
              <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
                Add some anime to your watchlist to get personalized AI recommendations!
              </p>
              <button
                onClick={() => navigate('/browse')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg transition-all duration-200"
              >
                Browse Anime
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// User Insights Panel Component
const UserInsightsPanel = ({ insights }) => {
  if (!insights) {
    return (
      <div className="text-center text-gray-400">
        <p>Add anime to your watchlist to see insights</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Anime */}
      <div className="bg-gray-700/50 rounded-lg p-4 text-center">
        <div className="text-3xl font-bold text-orange-400 mb-2">{insights.totalAnime}</div>
        <div className="text-gray-300 text-sm">Total Anime</div>
      </div>

      {/* Average Rating */}
      <div className="bg-gray-700/50 rounded-lg p-4 text-center">
        <div className="text-3xl font-bold text-green-400 mb-2">
          {insights.averageRating.toFixed(1)}
        </div>
        <div className="text-gray-300 text-sm">Avg Rating</div>
      </div>

      {/* Top Genres */}
      <div className="bg-gray-700/50 rounded-lg p-4">
        <h4 className="text-lg font-semibold mb-3 text-center">Top Genres</h4>
        <div className="space-y-2">
          {insights.topGenres.slice(0, 3).map((genre, index) => (
            <div key={genre.genre} className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">{genre.genre}</span>
              <span className="text-orange-400 font-semibold text-sm">{genre.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Types */}
      <div className="bg-gray-700/50 rounded-lg p-4">
        <h4 className="text-lg font-semibold mb-3 text-center">Preferred Types</h4>
        <div className="space-y-2">
          {insights.topTypes.map((type, index) => (
            <div key={type.type} className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">{type.type}</span>
              <span className="text-purple-400 font-semibold text-sm">{type.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIRecommendations;
