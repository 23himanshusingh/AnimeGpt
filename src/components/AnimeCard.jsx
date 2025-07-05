import React from 'react';
import { PLACEHOLDER_IMAGES } from '../utils/constants';

const AnimeCard = ({ anime }) => {
  if (!anime) return null;

  const { images } = anime;
  const posterPath = images?.jpg?.image_url || images?.webp?.image_url;

  return (
    <div className="relative group cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:z-10">
      {/* Anime Poster */}
      <div className="relative overflow-hidden rounded-md">
        <img
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
          src={posterPath}
          alt="anime"
          onError={(e) => {
            e.target.src = PLACEHOLDER_IMAGES.ANIME_CARD;
          }}
        />
        
        {/* Subtle hover overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  );
};

export default AnimeCard; 