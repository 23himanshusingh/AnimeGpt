import React from 'react';
import { PLACEHOLDER_IMAGES } from '../utils/constants';

const AnimeCardPlaceholder = () => (
  <div className="w-full h-full flex items-center justify-center bg-gray-800 rounded-md">
    <svg width="60" height="80" viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-40">
      <rect width="60" height="80" rx="10" fill="#23272F" />
      <ellipse cx="30" cy="60" rx="18" ry="6" fill="#353945" />
      <rect x="15" y="20" width="30" height="24" rx="5" fill="#353945" />
      <rect x="20" y="30" width="20" height="10" rx="2" fill="#23272F" />
      <circle cx="30" cy="35" r="4" fill="#FF9900" />
    </svg>
  </div>
);

const AnimeCard = ({ anime, onClick }) => {
  const [imgError, setImgError] = React.useState(false);

  if (!anime) return null;

  const { images } = anime;
  const posterPath = images?.jpg?.image_url || images?.webp?.image_url;

  const handleClick = () => {
    if (onClick) {
      onClick(anime);
    }
  };

  return (
    <div 
      className="relative group cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:z-10"
      onClick={handleClick}
      style={{ aspectRatio: '3/4', minHeight: 0 }}
    >
      {/* Anime Poster or Placeholder */}
      <div className="relative overflow-hidden rounded-xl border border-gray-700 shadow-lg bg-gray-900 w-full h-full" style={{ aspectRatio: '3/4' }}>
        {!imgError && posterPath ? (
          <img
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            src={posterPath}
            alt="anime"
            onError={() => setImgError(true)}
            style={{ aspectRatio: '3/4', minHeight: 0 }}
          />
        ) : (
          <AnimeCardPlaceholder />
        )}
        {/* Subtle hover overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
      </div>
    </div>
  );
};

export default AnimeCard; 