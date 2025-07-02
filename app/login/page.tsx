'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Login({ onLogin }: { onLogin?: () => void }) {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (email === 'admin@example.com' && password === 'admin123') {
      toast.success('Login successful 🎉');
      localStorage.setItem('isLoggedIn', 'true');

      if (onLogin) {
        onLogin(); // Use prop method
      } else {
        window.location.href = '/dashboard'; // fallback for direct route use
      }
    } else {
      toast.error('Invalid email or password');
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row transition-colors duration-300 ${
        theme === 'dark' ? 'bg-[#010409] text-white' : 'bg-gray-100 text-gray-900'
      }`}
    >
      {/* Left Illustration */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full md:w-1/2 flex items-center justify-center p-6 bg-gradient-to-br"
      >
        <div className="text-center px-6">
          <img
            src="https://illustrations.popsy.co/gray/web-design.svg"
            alt="Login Illustration"
            className="mt-8 max-w-full h-auto drop-shadow-xl"
          />
        </div>
      </motion.div>

      {/* Right Login Form */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full md:w-1/2 flex items-center justify-center p-10"
      >
        <motion.form
          onSubmit={handleLogin}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className={`w-full min-h-[500px] max-w-xl p-10 rounded-xl shadow-2xl border transition ${
            theme === 'dark'
              ? 'bg-gray-900 border-gray-800'
              : 'bg-white border-gray-200'
          }`}
        >
          <h2 className="text-4xl font-bold mb-8 text-center">Login</h2>

          <div className="mb-6">
            <label className="block mb-2 font-medium text-sm">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className={`w-full px-5 py-4 rounded-lg border outline-none transition text-base ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring focus:ring-blue-500'
                  : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring focus:ring-blue-500'
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </div>

          <div className="mb-8">
            <label className="block mb-2 font-medium text-sm">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className={`w-full px-5 py-4 rounded-lg border outline-none transition text-base ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring focus:ring-blue-500'
                  : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring focus:ring-blue-500'
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className={`w-full py-4 rounded-lg font-semibold text-lg transition ${
              theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            Login
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
}
