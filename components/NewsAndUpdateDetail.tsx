'use client';

import React from 'react';
import { toast } from 'sonner';
import { NewsAndUpdate } from './NewsAndUpdate';

interface Props {
  news: NewsAndUpdate;
  onBack: () => void;
  onEdit: () => void;
  onDeleteSuccess: () => void;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function NewsAndUpdateDetail({ news, onBack, onEdit, onDeleteSuccess }: Props) {
  const handleDelete = async () => {
    const confirmed = confirm('Are you sure you want to delete this news item?');
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE}/newsandupdates/${news._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('News deleted successfully!');
        onDeleteSuccess();
      } else {
        toast.error(data.message || 'Failed to delete news');
      }
    } catch (err) {
      toast.error('Server error');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow max-w-3xl mx-auto">
      <button onClick={onBack} className="text-blue-500 mb-4">
        ← Back
      </button>

      <img src={news.image} alt={news.title} className="w-full rounded-lg mb-4" />
      <h2 className="text-2xl font-bold mb-2">{news.title}</h2>
      <p className="text-gray-500 italic mb-2">{news.tag}</p>
      <p className="mb-4">{news.text}</p>
      <p className="text-sm text-gray-400">
        Posted on {new Date(news.createdAt).toLocaleDateString()}
      </p>

      <div className="mt-6 flex gap-4 justify-end">
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          ✏️ Edit
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}
