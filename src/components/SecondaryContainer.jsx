import { useSelector } from 'react-redux';
import AnimeList from './AnimeList';

const SecondaryContainer = ({ onAnimeClick }) => {
  const topAiringAnime = useSelector((store) => store.anime?.topAiringAnime);
  const nowPlayingAnime = useSelector((store) => store.anime?.nowPlayingAnime);
  const topRatedAnime = useSelector((store) => store.anime?.topRatedAnime);
  const topAnimeMovies = useSelector((store) => store.anime?.topAnimeMovies);

  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-black py-8 w-full">
      <div className="w-full">
        {/* Top Airing Anime */}
        {topAiringAnime && topAiringAnime.length > 0 && (
          <AnimeList title="Top Airing" anime={topAiringAnime} onAnimeClick={onAnimeClick} />
        )}
        
        {/* Now Playing Anime */}
        {nowPlayingAnime && nowPlayingAnime.length > 0 && (
          <AnimeList title="Now Playing" anime={nowPlayingAnime} onAnimeClick={onAnimeClick} />
        )}
        
        {/* Top Rated Anime */}
        {topRatedAnime && topRatedAnime.length > 0 && (
          <AnimeList title="Top Rated" anime={topRatedAnime} onAnimeClick={onAnimeClick} />
        )}
        
        {/* Top Anime Movies */}
        {topAnimeMovies && topAnimeMovies.length > 0 && (
          <AnimeList title="Top Anime Movies" anime={topAnimeMovies} onAnimeClick={onAnimeClick} />
        )}
      </div>
    </div>
  );
};

export default SecondaryContainer; 