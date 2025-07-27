import React, { useEffect, useState } from 'react';
import Header from './Header';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addUser, removeUser } from '../utils/userSlice';
import { jwtDecode } from 'jwt-decode';

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Optionally, check token expiration
        if (decoded.exp && Date.now() >= decoded.exp * 1000) {
          localStorage.removeItem('token');
          dispatch(removeUser());
          if (location.pathname !== '/') navigate('/');
          setLoading(false);
          return;
        }
        dispatch(addUser({ email: decoded.email, displayName: decoded.displayName || decoded.email }));
        if (location.pathname === '/') {
          navigate('/browse');
        }
      } catch {
        // If decoding fails, remove token and log out
        localStorage.removeItem('token');
        dispatch(removeUser());
        if (location.pathname !== '/') navigate('/');
      }
    } else {
      dispatch(removeUser());
      if (location.pathname !== '/') {
        navigate('/');
      }
    }
    setLoading(false);
  }, [dispatch, navigate, location]);

  return (
    <>
      <Header />
      {loading ? (
        <div className="flex justify-center items-center min-h-[40vh] text-orange-400 text-xl font-bold">Loading...</div>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default Layout; 