import React, { useEffect } from 'react';
import Header from './Header';
import { Outlet, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { useDispatch } from 'react-redux';
import { addUser, removeUser } from '../utils/userSlice';

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        let displayName = user.displayName;
        let photoURL = user.photoURL;
        // If displayName or photoURL is missing, try to reload the user
        if (!displayName || !photoURL) {
          try {
            await user.reload();
            displayName = user.displayName;
            photoURL = user.photoURL;
          } catch {/* ignore reload error */}
        }
        // If photoURL is still missing, set a default one
        if (!photoURL) {
          photoURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || user.email)}&background=orange&color=fff`;
          try {
            await updateProfile(user, { photoURL });
          } catch {/* ignore updateProfile error */}
        }
        dispatch(addUser({
          uid: user.uid,
          email: user.email,
          displayName: displayName,
          photoURL: photoURL,
        }));
        navigate('/browse');
      } else {
        dispatch(removeUser());
        navigate('/');
      }
    });
    return () => unsubscribe();
  }, [dispatch, navigate]);

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default Layout; 