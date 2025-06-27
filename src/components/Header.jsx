import React from 'react'

const Header = () => {
  return (
    <header className="flex items-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-8 py-4 shadow-lg border-b-2 border-orange-400 z-10 relative">
      <div className="flex items-center gap-2">
        <img src="https://m.media-amazon.com/images/I/41o03HyOYlL.png" alt="logo" className="h-12 w-12 rounded-full shadow-md border-2 border-orange-400 bg-white" />
        <span className="text-3xl font-extrabold text-orange-400 tracking-wide drop-shadow-lg">AnimeGPT</span>
      </div>
    </header>
  )
}

export default Header
