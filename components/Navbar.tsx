'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { Sun, Moon, UserCircle, LogOut, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);

    if (loggedIn) {
      const user = localStorage.getItem('user');
      if (user) {
        try {
          const parsed = JSON.parse(user);
          setUserEmail(parsed.email || '');
        } catch (err) {
          console.error('Invalid user data');
        }
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    router.push('/login');
  };

  if (!mounted) return null;

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 shadow-md transition-all',
        theme === 'dark'
          ? 'bg-[#0d1117] text-white shadow-black/40'
          : 'bg-white text-black shadow-gray-200'
      )}
    >
      <Link href="/" className="text-xl font-bold hover:opacity-80">
        GharPadharo Admin
      </Link>

      <div className="flex items-center gap-3 relative">

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className={cn(
            'px-3 py-1 rounded border transition',
            theme === 'dark'
              ? 'bg-gray-800 border-gray-700 text-white'
              : 'bg-gray-100 border-gray-300 text-black'
          )}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* User Dropdown — Show only if logged in */}
        {isLoggedIn && userEmail && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={cn(
                'flex items-center gap-2 px-3 py-1 rounded border transition',
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700'
                  : 'bg-gray-100 border-gray-300 text-black hover:bg-gray-200'
              )}
            >
              <UserCircle size={18} />
              <span className="hidden sm:inline text-sm font-medium">{userEmail.split('@')[0]}</span>
              <ChevronDown size={14} />
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div
                className={cn(
                  'absolute right-0 mt-2 w-40 rounded-md shadow-lg py-2 z-50',
                  theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black border border-gray-200'
                )}
              >
                <button
                  onClick={() => router.push('/profile')}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700 hover:text-white dark:hover:bg-gray-700"
                >
                  <UserCircle size={14} className="inline mr-2" />
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-red-100 dark:hover:bg-red-600 dark:hover:text-white"
                >
                  <LogOut size={14} className="inline mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
