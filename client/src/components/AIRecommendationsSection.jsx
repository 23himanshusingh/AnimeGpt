import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import useAIRecommendations from '../hooks/useAIRecommendations';
import AnimeCard from './AnimeCard';
import { FaBrain, FaArrowRight, FaChartBar, FaLightbulb } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AIRecommendationsSection = ({ onAnimeClick, compact = true }) => {
  const navigate = useNavigate();
  const user = useSelector(store => store.user.user);
  const {
    recommendations,
    loading,
    getUserInsights,
    refreshRecommendations
  } = useAIRecommendations();

  const [showInsights, setShowInsights] = useState(false);

  const handleViewAll = () => {
    navigate('/ai-recommendations');
  };

  const handleAnimeClick = (anime) => {
    if (onAnimeClick) {
      onAnimeClick(anime);
    } else {
      navigate(`/anime/${anime.mal_id}`);
    }
  };

  // Don't show if user is not logged in
  if (!user) return null;

  // Don't show if no watchlist
  if (!recommendations || recommendations.length === 0) return null;

  if (compact) {
    return (
      <div className="bg-gradient-to-b from-gray-900 to-black py-12 w-full">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <FaBrain className="text-3xl text-orange-400" />
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">AI Recommendations</h2>
                <p className="text-gray-400 text-lg">Personalized suggestions just for you</p>
              </div>
            </div>
            
            <button
              onClick={handleViewAll}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-all duration-200 font-semibold"
            >
              View All
              <FaArrowRight />
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <QuickStatCard
              title="Total Anime"
              value={getUserInsights()?.totalAnime || 0}
              icon={FaLightbulb}
              color="text-orange-400"
            />
            <QuickStatCard
              title="Top Genre"
              value={getUserInsights()?.topGenres?.[0]?.genre || 'None'}
              icon={FaChartBar}
              color="text-blue-400"
            />
            <QuickStatCard
              title="Avg Rating"
              value={getUserInsights()?.averageRating?.toFixed(1) || '0.0'}
              icon={FaChartBar}
              color="text-green-400"
            />
            <QuickStatCard
              title="Suggestions"
              value={recommendations.length}
              icon={FaBrain}
              color="text-purple-400"
            />
          </div>

          {/* Top Recommendations Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {recommendations.slice(0, 5).map((rec) => (
              <div key={rec.animeId} className="group relative bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
                {/* AI Badge */}
                <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-orange-500 to-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <FaBrain className="text-xs" />
                  AI
                </div>
                
                {/* Confidence Score */}
                <div className="absolute top-2 right-2 z-10 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-bold">
                  {Math.round(rec.confidence * 100)}%
                </div>

                {/* Anime Card */}
                <div
                  className="relative cursor-pointer"
                  onClick={() => handleAnimeClick(rec.anime)}
                >
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <AnimeCard anime={rec.anime} />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1">
                          {rec.anime.title}
                        </h3>
                        <p className="text-orange-400 text-xs font-medium mb-2">
                          {rec.reason}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-300">
                          <span>Score: {rec.score.toFixed(1)}/10</span>
                          <span className="text-orange-400 font-semibold">AI Recommended</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-8">
            <p className="text-gray-400 mb-4">
              Want more personalized recommendations?
            </p>
            <button
              onClick={handleViewAll}
              className="bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600 text-white px-8 py-3 rounded-lg transition-all duration-200 font-semibold shadow-lg"
            >
              Explore AI Recommendations
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Full view (for when not compact)
  return (
    <div className="bg-gradient-to-b from-gray-900 to-black py-8 w-full">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <h2 className="text-2xl font-bold text-white mb-4">AI Recommendations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {recommendations.slice(0, 8).map((rec) => (
            <div key={rec.animeId} className="bg-gray-800 rounded-lg overflow-hidden">
              <AnimeCard anime={rec.anime} onClick={() => handleAnimeClick(rec.anime)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Quick Stat Card Component
const QuickStatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
    <Icon className={`text-2xl ${color} mx-auto mb-2`} />
    <div className="text-2xl font-bold text-white mb-1">{value}</div>
    <div className="text-gray-400 text-sm">{title}</div>
  </div>
);

export default AIRecommendationsSection;
