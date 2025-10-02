const VideoTitle = ({ title, overview }) => {
  return (
    <div className="absolute left-0 bottom-0 z-20 w-1/4 h-full flex flex-col justify-end p-12 bg-gradient-to-r from-black/90 via-black/60 to-transparent">
      <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-2 drop-shadow-2xl tracking-tight leading-tight">
        {title}
      </h1>
      <p className="hidden md:block text-xs text-gray-200 mb-8 drop-shadow-md line-clamp-3 tracking-wide">
        {overview}
      </p>
      <div className="flex gap-4 mt-2">
        <button className="bg-gray-700 text-white py-2 px-8 text-xl rounded-lg font-bold bg-opacity-70 hover:bg-opacity-90 shadow-md hidden md:flex items-center gap-2">
          <span>ℹ️</span> More Info
        </button>
      </div>
    </div>
  );
};
export default VideoTitle; 