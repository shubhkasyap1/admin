'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // ⛔ Prevent hydration mismatch

  const isDark = theme === 'dark';

  return (
    <aside
      className={`w-64 min-h-screen p-6 transition-colors duration-300 border-r ${
        isDark ? 'bg-[#0d1117] text-white border-gray-800' : 'bg-white text-black border-gray-200'
      }`}
    >
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>
      <ul className="space-y-3">
        {[
          { id: 'home', label: 'Home' },
          { id: 'blog', label: 'Blog Posts' },
          { id: 'news', label: 'News Posts' },
          { id: 'podcasts', label: 'Podcasts Posts' },
        ].map(({ id, label }) => (
          <li key={id}>
            <button
              onClick={() => setActiveTab(id)}
              className={`w-full text-left px-3 py-2 rounded-lg font-medium transition ${
                activeTab === id
                  ? isDark
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-100 text-black'
                  : isDark
                  ? 'hover:bg-gray-800'
                  : 'hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
