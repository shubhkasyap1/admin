'use client';

import React from 'react';
import { useTheme } from 'next-themes';

type Podcast = {
  _id: string;
  title: string;
  tag: string;
  date: string;
  url: string;
  image: string;
};

type Props = {
  podcast: Podcast;
  isSelected: boolean;
  onToggle: (id: string) => void;
};

export default function PodcastCard({ podcast, isSelected, onToggle }: Props) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      onClick={() => onToggle(podcast._id)}
      className={`rounded-xl p-4 shadow-md border cursor-pointer transition-all duration-300 ${
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

      {isSelected && (
        <div className="mt-4 space-y-2 text-sm">
          <p><strong>Tag:</strong> {podcast.tag}</p>
          <p><strong>Date:</strong> {new Date(podcast.date).toDateString()}</p>
          <a
            href={podcast.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            🎧 Listen Now
          </a>
        </div>
      )}
    </div>
  );
}
