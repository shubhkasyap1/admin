'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { motion, useScroll } from 'framer-motion';

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    setMounted(true);
    return scrollY.onChange(() => {
      setScrolled(scrollY.get() > 10);
    });
  }, [scrollY]);

  if (!mounted) return null;

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'sticky top-0 z-50 w-full backdrop-blur-md',
        scrolled
          ? theme === 'dark'
            ? 'bg-[#010409]/80 text-gray-100 shadow-lg shadow-black/30'
            : 'bg-white/90 text-gray-900 shadow-lg shadow-gray-300/30'
          : theme === 'dark'
          ? 'bg-transparent text-gray-100'
          : 'bg-transparent text-gray-900'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold hover:opacity-90 transition">
            GharPadharo
          </Link>

          {/* Right Controls: Language + Theme */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <select
              className={cn(
                'px-3 py-2 rounded border transition text-sm font-medium',
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700'
                  : 'bg-gray-100 border-gray-200 text-gray-900 hover:bg-gray-200'
              )}
              defaultValue="en"
              onChange={(e) => alert(`Language changed to ${e.target.value}`)}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="mr">मराठी</option>
              <option value="gu">ગુજરાતી</option>
              <option value="bn">বাংলা</option>
            </select>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={cn(
                'px-3 py-2 rounded transition flex items-center gap-2 border',
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700'
                  : 'bg-gray-100 border-gray-200 text-gray-900 hover:bg-gray-200'
              )}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
