'use client';

import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Login from './login/page';
import Dashboard from './dashboard/page';

export default function Home() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`min-h-screen pt-2 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-black via-gray-900 to-black text-gray-100'
          : 'bg-gradient-to-br from-white via-gray-100 to-white text-gray-900'
      }`}
    >
      <Navbar />

      <main className="container mx-auto px-4 py-12 text-center">
        {/* {isLoggedIn ? (
          <Dashboard />
        ) : (
          <Login onLogin={() => setIsLoggedIn(true)} />
        )} */}
        <Dashboard/>
      </main>
    </motion.div>
  );
}
