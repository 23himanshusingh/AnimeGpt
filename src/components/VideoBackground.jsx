import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import useAnimeTrailer from '../hooks/useAnimeTrailer';
import { loadYouTubeAPI } from '../utils/loadYouTubeAPI';

const getYouTubeVideoId = (embedUrl) => {
  const match = embedUrl?.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
};

const VideoBackground = ({ animeId }) => {
  const trailer = useSelector((store) => store.anime?.animeTrailer);
  const iframeRef = useRef(null);

  useAnimeTrailer(animeId);

  useEffect(() => {
    const initPlayer = async () => {
      if (!trailer?.embed_url) return;

      const YT = await loadYouTubeAPI();
      const videoId = getYouTubeVideoId(trailer.embed_url);

      if (!videoId) return;

      new YT.Player(iframeRef.current, {
        videoId,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          loop: 1,
          rel: 0,
          playlist: videoId,
        },
        events: {
          onReady: (event) => {
            event.target.playVideo();
          },
        },
      });
    };

    initPlayer();
  }, [trailer]);

  if (!trailer?.embed_url) return null;

  return (
    <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
      <div
        id="youtube-player"
        ref={iframeRef}
        className="w-full h-full object-cover"
      ></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
    </div>
  );
};

export default VideoBackground;
