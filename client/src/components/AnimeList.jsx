import React, { useState, useEffect } from 'react';
import AnimeCard from './AnimeCard';
import { CSS_CLASSES } from '../utils/constants';

const AnimeList = ({ title, anime, onAnimeClick }) => {
  const [uniqueAnime, setUniqueAnime] = useState([]);

  useEffect(() => {
    if (anime && anime.length > 0) {
      // Filter out duplicates within this list based on mal_id
      const seenIds = new Set();
      const filtered = anime.filter(animeItem => {
        if (!animeItem || !animeItem.mal_id) return false;
        if (seenIds.has(animeItem.mal_id)) return false;
        seenIds.add(animeItem.mal_id);
        return true;
      });
      setUniqueAnime(filtered);
    } else {
      setUniqueAnime([]);
    }
  }, [anime]);

  if (!uniqueAnime || uniqueAnime.length === 0) return null;

  return (
    <div className="mb-8">
      {/* List Title */}
      <h2 className="text-white text-xl md:text-2xl font-bold mb-4 px-4 md:px-8">
        {title}
      </h2>
      
      {/* Horizontal Scrollable Anime Cards - Full Width */}
      <div className="relative">
        <div className={`flex gap-4 overflow-x-auto ${CSS_CLASSES.SCROLLBAR_HIDE} px-4 md:px-8 pb-4`}>
          {uniqueAnime.map((animeItem, index) => {
            return (
              <div key={`${animeItem.mal_id}-${index}`} className="flex-shrink-0 w-40 md:w-48">
                <AnimeCard 
                  anime={animeItem} 
                  onClick={onAnimeClick}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnimeList; 