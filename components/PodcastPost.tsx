// app/(dashboard)/podcast/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';
import { useTheme } from 'next-themes';
import PodcastForm from '@/components/PodcastForm';
import PodcastDetail from '@/components/PodcastDetail';

export type Podcast = {
  _id: string;
  title: string;
  tag: string;
  date: string;
  url: string;
  image: string;
};

export default function PodcastPost() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);
  const [editPodcast, setEditPodcast] = useState<Podcast | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const fetchPodcasts = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch('http://localhost:8000/api/v1/podcasts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setPodcasts(data.info || []);
      } else {
        toast.error(data.message || 'Failed to fetch podcasts');
      }
    } catch (error) {
      console.error('Error fetching podcasts:', error);
      toast.error('Server error while fetching podcasts');
    }
  };

  useEffect(() => {
    fetchPodcasts();
  }, []);

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      <Toaster position="top-right" richColors />

      {selectedPodcast ? (
        <PodcastDetail
          podcast={selectedPodcast}
          onBack={() => setSelectedPodcast(null)}
          onEdit={() => {
            setEditPodcast(selectedPodcast);
            setSelectedPodcast(null);
          }}
          onDeleteSuccess={() => {
            fetchPodcasts();
            setSelectedPodcast(null);
          }}
        />
      ) : editPodcast ? (
        <PodcastForm
          existing={editPodcast}
          onClose={() => setEditPodcast(null)}
          onSuccess={() => {
            fetchPodcasts();
            setEditPodcast(null);
          }}
        />
      ) : showForm ? (
        <PodcastForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            fetchPodcasts();
            setShowForm(false);
          }}
        />
      ) : (
        <>
          {/* Header Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className={`rounded-xl p-6 border shadow-md ${
                isDark
                  ? 'bg-gray-800 text-white border-gray-700'
                  : 'bg-white text-black border border-gray-200'
              }`}
            >
              <h2 className="text-xl font-semibold mb-2">🎧 Total Podcasts</h2>
              <p className="text-4xl font-bold text-blue-500">{podcasts.length}</p>
            </div>

            <div
              className={`rounded-xl p-6 border shadow-md flex items-center justify-between ${
                isDark
                  ? 'bg-gray-800 text-white border-gray-700'
                  : 'bg-white text-black border border-gray-200'
              }`}
            >
              <h2 className="text-xl font-semibold">➕ Add a New Podcast</h2>
              <button
                onClick={() => setShowForm(true)}
                className={`px-4 py-2 rounded-md font-medium transition ${
                  isDark
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-black'
                }`}
              >
                Create Podcast
              </button>
            </div>
          </div>

          {/* Podcast Cards */}
          {podcasts.length === 0 ? (
            <p className="text-center text-gray-500">No podcasts found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {podcasts.map((podcast) => (
                <div
                  key={podcast._id}
                  onClick={() => setSelectedPodcast(podcast)}
                  className={`cursor-pointer rounded-xl p-4 shadow-md border transition-transform hover:scale-105 ${
                    isDark
                      ? 'bg-gray-800 text-white border-gray-700'
                      : 'bg-white text-black border border-gray-200'
                  }`}
                >
                  <img
                    src={podcast.image}
                    alt={podcast.title}
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                  <h3 className="text-lg font-bold">{podcast.title}</h3>
                  <p className="text-sm text-gray-400">{podcast.tag}</p>
                  <p className="text-sm">
                    {new Date(podcast.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
