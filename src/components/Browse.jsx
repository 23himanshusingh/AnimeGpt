import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MainContainer from './MainContainer';
import SecondaryContainer from './SecondaryContainer';
import AnimeDetails from './AnimeDetails';
import useAnimeData from '../hooks/useAnimeData';

const Browse = () => {
  const [mainContainerReady, setMainContainerReady] = useState(false);
  const topRatedAnime = useSelector((store) => store.anime?.topRatedAnime);
  const navigate = useNavigate();
  
  useAnimeData();
  
  useEffect(() => {
    if (topRatedAnime && topRatedAnime.length > 0) {
      setMainContainerReady(true);
    }
  }, [topRatedAnime]);

  const handleAnimeClick = (anime) => {
    navigate(`/anime/${anime.mal_id}`);
  };

  return (
    <div className="flex flex-col min-h-[60vh] w-full">
      <MainContainer />
      {mainContainerReady && (
        <SecondaryContainer onAnimeClick={handleAnimeClick} />
      )}
      
    </div>
  );
};

export default Browse;
