import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import MainContainer from './MainContainer';
import SecondaryContainer from './SecondaryContainer';
import useAnimeData from '../hooks/useAnimeData';

const Browse = () => {
  const [mainContainerReady, setMainContainerReady] = useState(false);
  const topRatedAnime = useSelector((store) => store.anime?.topRatedAnime);
  
  useAnimeData();
  
  useEffect(() => {
    if (topRatedAnime && topRatedAnime.length > 0) {
      setMainContainerReady(true);
    }
  }, [topRatedAnime]);

  return (
    <div className="flex flex-col min-h-[60vh] w-full">
      <MainContainer />
      {mainContainerReady && <SecondaryContainer />}
    </div>
  );
};

export default Browse;
