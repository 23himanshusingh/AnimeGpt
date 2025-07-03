import React from 'react'
import { useSelector } from 'react-redux';

const Browse = () => {
  const user = useSelector((state) => state.user.user);
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user?.displayName || user?.email || 'User'}!</h1>
      <p className="text-lg">Enjoy your AnimeGPT experience.</p>
    </div>
  )
}

export default Browse
