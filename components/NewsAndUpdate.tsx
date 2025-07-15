'use client';

import React, { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';
import { useTheme } from 'next-themes';
import Loader from '@/components/ui/Loader';
import NewsAndUpdateForm from '@/components/NewsAndUpdateForm';
import NewsAndUpdateDetail from '@/components/NewsAndUpdateDetail';

export type NewsAndUpdate = {
  _id: string;
  title: string;
  text: string;
  tag: string;
  image: string;
  createdAt: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function NewsAndUpdate() {
  const [newsList, setNewsList] = useState<NewsAndUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<NewsAndUpdate | null>(null);
  const [editNews, setEditNews] = useState<NewsAndUpdate | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/newsandupdates`);
      const data = await res.json();
      if (data.success) {
        setNewsList(data.info);
      } else {
        toast.error(data.message || 'Failed to fetch news');
      }
    } catch {
      toast.error('Server error while fetching news');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      <Toaster position="top-right" />

      {/* Section Heading */}
      <h2 className="text-3xl font-bold">📢 News & Updates</h2>

      {/* Total & Create Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Card */}
        <div
          className={`rounded-xl p-6 border shadow-md ${
            isDark
              ? 'bg-gray-800 text-white border-gray-700'
              : 'bg-white text-black border border-gray-200'
          }`}
        >
          <h2 className="text-xl font-semibold mb-2">📰 Total News</h2>
          <p className="text-4xl font-bold text-blue-500">{newsList.length}</p>
        </div>

        {/* Create Card */}
        <div
          className={`rounded-xl p-6 border shadow-md flex items-center justify-between ${
            isDark
              ? 'bg-gray-800 text-white border-gray-700'
              : 'bg-white text-black border border-gray-200'
          }`}
        >
          <h2 className="text-xl font-semibold">➕ Add a New Update</h2>
          <button
            onClick={() => {
              setShowForm(true);
              setSelectedNews(null);
              setEditNews(null);
            }}
            className={`px-4 py-2 rounded-md font-medium transition ${
              isDark
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-black'
            }`}
          >
            Create News
          </button>
        </div>
      </div>

      {/* Conditional Area (Form / Detail / Cards) */}
      {selectedNews ? (
        <NewsAndUpdateDetail
          news={selectedNews}
          onBack={() => setSelectedNews(null)}
          onEdit={() => {
            setEditNews(selectedNews);
            setSelectedNews(null);
          }}
          onDeleteSuccess={() => {
            fetchNews();
            setSelectedNews(null);
          }}
        />
      ) : editNews ? (
        <NewsAndUpdateForm
          existing={editNews}
          onClose={() => setEditNews(null)}
          onSuccess={() => {
            fetchNews();
            setEditNews(null);
          }}
        />
      ) : showForm ? (
        <NewsAndUpdateForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            fetchNews();
            setShowForm(false);
          }}
        />
      ) : loading ? (
        <Loader type="card" />
      ) : newsList.length === 0 ? (
        <p className="text-center text-gray-500">No news updates found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {newsList.map((news) => (
            <div
              key={news._id}
              onClick={() => setSelectedNews(news)}
              className={`relative cursor-pointer rounded-xl p-4 shadow-md border transition-transform hover:scale-105 ${
                isDark
                  ? 'bg-gray-800 text-white border-gray-700'
                  : 'bg-white text-black border border-gray-200'
              }`}
            >
              <div className="relative w-full h-40 mb-3 rounded overflow-hidden">
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="text-lg font-bold">{news.title}</h3>
              <p className="text-sm text-gray-400">{news.tag}</p>
              <p className="text-sm mt-1 line-clamp-2">{news.text}</p>
              <p className="text-xs mt-2 text-gray-400">
                {new Date(news.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
