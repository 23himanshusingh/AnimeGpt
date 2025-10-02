import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addUser } from '../utils/userSlice';
import { BACKEND_URL } from '../utils/constants';

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePassword = (password) => {
  // At least 6 characters, at least one letter and one number
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);
};

const validateUsername = (username) => {
  // At least 3 characters, only letters, numbers, underscores
  return /^[A-Za-z0-9_]{3,}$/.test(username);
};

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (isSignUp && !validateUsername(form.username)) {
      newErrors.username = 'Username must be at least 3 characters and contain only letters, numbers, or underscores.';
    }
    if (!validateEmail(form.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!validatePassword(form.password)) {
      newErrors.password = 'Password must be at least 6 characters and contain at least one letter and one number.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validateForm()) return;
    setLoading(true);
    try {
      let response;
      if (isSignUp) {
        response = await fetch(`${BACKEND_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email, password: form.password })
        });
      } else {
        response = await fetch(`${BACKEND_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email, password: form.password })
        });
      }
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Authentication failed');
      localStorage.setItem('token', data.token);
      // Optionally decode JWT for user info, or fetch user info from backend
      dispatch(addUser({ email: form.email, displayName: form.username || form.email }));
      // Redirect to browse page after successful authentication
      navigate('/browse');
    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="bg-gray-900 bg-opacity-80 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-orange-400">
        <h2 className="text-2xl font-bold text-orange-400 mb-6 text-center">
          {isSignUp ? 'Sign Up' : 'Login'} to AnimeGPT
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isSignUp && (
            <div className="flex flex-col gap-1">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                className={`px-4 py-3 rounded-lg bg-gray-800 text-white border ${errors.username ? 'border-red-500' : 'border-gray-700'} focus:border-orange-400 focus:outline-none transition`}
                required
              />
              {errors.username && <span className="text-red-400 text-xs pl-1">{errors.username}</span>}
            </div>
          )}
          <div className="flex flex-col gap-1">
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className={`px-4 py-3 rounded-lg bg-gray-800 text-white border ${errors.email ? 'border-red-500' : 'border-gray-700'} focus:border-orange-400 focus:outline-none transition`}
              required
            />
            {errors.email && <span className="text-red-400 text-xs pl-1">{errors.email}</span>}
          </div>
          <div className="flex flex-col gap-1">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className={`px-4 py-3 rounded-lg bg-gray-800 text-white border ${errors.password ? 'border-red-500' : 'border-gray-700'} focus:border-orange-400 focus:outline-none transition`}
              required
            />
            {errors.password && <span className="text-red-400 text-xs pl-1">{errors.password}</span>}
          </div>
          <button
            type="submit"
            className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-3 rounded-lg shadow-md transition-all duration-200 mt-2"
            disabled={loading}
          >
            {loading ? (isSignUp ? 'Signing Up...' : 'Logging In...') : (isSignUp ? 'Sign Up' : 'Login')}
          </button>
        </form>
        {apiError && <div className="text-red-400 text-center mt-2 text-sm">{apiError}</div>}
        <div className="text-center mt-4">
          <button
            type="button"
            className="text-orange-400 hover:underline focus:outline-none"
            onClick={() => { setIsSignUp((prev) => !prev); setErrors({}); }}
          >
            {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
