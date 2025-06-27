import React, { useState } from 'react';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add login/signup logic here
    alert(isSignUp ? 'Sign Up' : 'Login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-orange-400">
        <h2 className="text-2xl font-bold text-orange-400 mb-6 text-center">
          {isSignUp ? 'Sign Up' : 'Login'}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isSignUp && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className="px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-orange-400 focus:outline-none transition"
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-orange-400 focus:outline-none transition"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-orange-400 focus:outline-none transition"
            required
          />
          <button
            type="submit"
            className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-3 rounded-lg shadow-md transition-all duration-200 mt-2"
          >
            {isSignUp ? 'Sign Up' : 'Login'}
          </button>
        </form>
        <div className="text-center mt-4">
          <button
            type="button"
            className="text-orange-400 hover:underline focus:outline-none"
            onClick={() => setIsSignUp((prev) => !prev)}
          >
            {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
