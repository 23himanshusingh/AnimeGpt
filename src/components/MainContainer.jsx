import { useSelector } from 'react-redux';
import VideoTitle from './VideoTitle';
import VideoBackground from './VideoBackground';

const MainContainer = () => {
  const animeList = useSelector((store) => store.anime?.popularAnime);
  if (!animeList || animeList.length === 0) return null;
  const mainAnime = animeList[0];
  const { title, synopsis, mal_id } = mainAnime;

  return (
    <div className="relative w-full h-[80vh] flex items-end justify-start overflow-hidden">
      <VideoBackground animeId={mal_id} />
      <VideoTitle title={title} overview={synopsis} />
    </div>
  );
};

export default MainContainer; 