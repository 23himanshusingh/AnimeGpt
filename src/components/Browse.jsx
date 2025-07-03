import React from 'react'
import MainContainer from './MainContainer';
import SecondaryContainer from './SecondaryContainer';
import { useTopPopularAnime } from '../hooks/useTopPopularAnime';

const Browse = () => {
  useTopPopularAnime();
  console.log('Browse component rendering');
  return (
    <div className="flex flex-col min-h-[60vh] w-full">
      <MainContainer />
      <SecondaryContainer />
    </div>
  );
};

export default Browse;
