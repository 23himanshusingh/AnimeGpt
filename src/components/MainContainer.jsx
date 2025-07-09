import { useSelector } from 'react-redux';
import VideoTitle from './VideoTitle';
import VideoBackground from './VideoBackground';
import useAnimeTrailer from '../hooks/useAnimeTrailer';

const MainContainer = () => {
  const animeList = useSelector((store) => store.anime?.topRatedAnime);
  
  // Get main anime or use fallback
  const mainAnime = animeList?.[0];
  const { title, synopsis, mal_id } = mainAnime || {};

  // Fetch trailer for the main anime (hook must be called before any returns)
  useAnimeTrailer(mal_id);
  
  if (!animeList || animeList.length === 0) {
    return (
      <div className="relative w-full h-[80vh] flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <div className="text-white text-xl">Loading anime data...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[80vh] flex items-end justify-start overflow-hidden">
      <VideoBackground animeId={mal_id} />
      <VideoTitle title={title} overview={synopsis} />
    </div>
  );
};

export default MainContainer; 