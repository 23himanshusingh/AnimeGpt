import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { removeUser } from '../utils/userSlice';
import { auth } from '../utils/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    dispatch(removeUser());
    navigate('/');
  };

  return (
    <header className="flex items-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-8 py-4 shadow-lg border-b-2 border-orange-400 z-10 relative">
      <div className="flex items-center gap-2 flex-1">
        <img src="https://m.media-amazon.com/images/I/41o03HyOYlL.png" alt="logo" className="h-12 w-12 rounded-full shadow-md border-2 border-orange-400 bg-white" />
        <span className="text-3xl font-extrabold text-orange-400 tracking-wide drop-shadow-lg">AnimeGPT</span>
      </div>
      {user && (
        <div className="flex items-center gap-4">
          <img
            src={user.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.displayName || user.email) + '&background=orange&color=fff'}
            alt="user"
            className="h-10 w-10 rounded-full border-2 border-orange-400 bg-white shadow"
          />
          <span className="text-white font-semibold text-lg">{user.displayName || user.email}</span>
          <button
            onClick={handleLogout}
            className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-200"
          >
            Log Out
          </button>
        </div>
      )}
    </header>
  )
}

export default Header
