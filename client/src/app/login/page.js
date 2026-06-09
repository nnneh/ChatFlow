"use client"
import { useState } from 'react';
import { Link, Navigate } from 'next/link';
// import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
//   const { login, user } = useAuth();

//   if (user) return <Navigate to="/chat" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(formData.email, formData.password);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-primary mb-2">
          ChatFlow
        </h1>
        <p className="text-center text-gray-600 mb-6">Login to start chatting</p>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-indigo-600 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          <Link to="/register" className="text-primary hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;