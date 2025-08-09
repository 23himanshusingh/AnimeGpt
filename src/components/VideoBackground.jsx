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

const AnimePlaceholderSVG = () => (
  <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-60">
    <rect width="180" height="180" rx="32" fill="#23272F" />
    <ellipse cx="90" cy="110" rx="50" ry="18" fill="#353945" />
    <rect x="45" y="40" width="90" height="60" rx="12" fill="#353945" />
    <rect x="60" y="55" width="60" height="30" rx="6" fill="#23272F" />
    <circle cx="90" cy="70" r="10" fill="#FF9900" />
    <rect x="80" y="120" width="20" height="8" rx="4" fill="#FF9900" />
    <text x="90" y="170" textAnchor="middle" fill="#888" fontSize="14" fontFamily="sans-serif">No Preview</text>
  </svg>
);

const VideoBackground = ({ animeId }) => {
  const trailerData = useSelector((store) => store.anime.trailerData);
  const currentTrailerId = useSelector((store) => store.anime.currentTrailerId);
  const trailerLoading = useSelector((store) => store.anime.trailerLoading);
  const selectedAnime = useSelector((store) => store.anime.selectedAnime);
  const topRatedAnime = useSelector((store) => store.anime.topRatedAnime);

  const videoId = getYouTubeVideoId(trailerData?.embed_url);

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

  // Get background image from anime data
  const getBackgroundImage = () => {
    // First try to get from selected anime (for detailed views)
    if (selectedAnime && selectedAnime.mal_id === animeId) {
      const backgroundImage = selectedAnime.images?.jpg?.large_image_url || 
                             selectedAnime.images?.webp?.large_image_url ||
                             selectedAnime.images?.jpg?.image_url || 
                             selectedAnime.images?.webp?.image_url;
      return backgroundImage;
    }
    
    // Then try to get from top rated anime (for main container)
    if (topRatedAnime && topRatedAnime.length > 0) {
      const mainAnime = topRatedAnime.find(anime => anime.mal_id === animeId) || topRatedAnime[0];
      if (mainAnime) {
        const backgroundImage = mainAnime.images?.jpg?.large_image_url || 
                               mainAnime.images?.webp?.large_image_url ||
                               mainAnime.images?.jpg?.image_url || 
                               mainAnime.images?.webp?.image_url;
        return backgroundImage;
      }
    }
    
    return null;
  };

  // Only show the trailer if the data is for the current anime and we have a videoId
  if (!videoId || !idsMatch) {
    // Try to show background image if available
    const backgroundImage = getBackgroundImage();
    if (backgroundImage) {
      return (
        <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
          <img
            src={backgroundImage}
            alt="Anime Background"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center' }}
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
      );
    }
    
    // Try to show an image from trailer data if available
    const imageUrl = trailerData?.images?.jpg?.image_url || trailerData?.images?.webp?.image_url;
    if (imageUrl) {
      return (
        <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
          <img
            src={imageUrl}
            alt="Anime Poster"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center' }}
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
      );
    }
    
    // Fallback to SVG placeholder
    return (
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <AnimePlaceholderSVG />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
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
 