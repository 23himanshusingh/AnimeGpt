import { useSelector } from 'react-redux';

const getYouTubeVideoId = (embedUrl) => {
  if (!embedUrl) return null;
  // Accept both /embed/ and /watch?v= formats
  const embedMatch = embedUrl.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];
  const watchMatch = embedUrl.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];
  return null;
};

const VideoBackground = ({ animeId }) => {
  const trailerData = useSelector((store) => store.anime.trailerData);
  const currentTrailerId = useSelector((store) => store.anime.currentTrailerId);
  const trailerLoading = useSelector((store) => store.anime.trailerLoading);

  const videoId = getYouTubeVideoId(trailerData?.embed_url);

  // Debug logging
  console.log({ trailerData, currentTrailerId, animeId, videoId });

  // Accept string/number comparison for IDs
  const idsMatch = String(currentTrailerId) === String(animeId);

  // Show loader if trailer is loading
  if (trailerLoading) {
    return (
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden flex items-center justify-center">
        <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <span className="text-white text-lg bg-black/60 px-6 py-3 rounded-lg animate-pulse">Loading trailer...</span>
        </div>
      </div>
    );
  }

  // Only show the trailer if the data is for the current anime and we have a videoId
  if (!videoId || !idsMatch) {
    return (
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden flex items-center justify-center">
        <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <span className="text-white text-lg bg-black/60 px-6 py-3 rounded-lg">No trailer available for this anime.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
      <iframe
        key={videoId}
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}`}
        allow="autoplay; encrypted-media"
        allowFullScreen
        className="w-full h-full object-cover"
        title="Anime Trailer"
        frameBorder="0"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
    </div>
  );
};

export default VideoBackground;
 