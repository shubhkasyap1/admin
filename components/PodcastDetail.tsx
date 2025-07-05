'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface Podcast {
  _id: string;
  title: string;
  tag: string;
  date: string;
  url: string;
  image: string;
}

interface Props {
  podcast: Podcast;
  onBack: () => void; // ✅ Renamed from onClose
  onEdit: () => void;
  onDeleteSuccess: () => void;
}

export default function PodcastDetail({
  podcast,
  onBack,
  onEdit,
  onDeleteSuccess,
}: Props) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(
        `http://localhost:8000/api/v1/podcasts/${podcast._id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();

      if (data.success) {
        toast.success('Podcast deleted');
        onDeleteSuccess();
        onBack(); // ✅ go back after deletion
      } else {
        toast.error(data.message || 'Failed to delete');
      }
    } catch (err) {
      toast.error('Server error');
    }
  };

  const handleEdit = () => {
    onEdit(); // ✅ Triggers edit
  };

  return (
    <div
      className={`rounded-xl p-6 border shadow-md ${
        isDark
          ? 'bg-gray-800 text-white border-gray-700'
          : 'bg-white text-black border border-gray-200'
      }`}
    >
      {/* 🔙 Back Button */}
      <button
        onClick={onBack}
        className="mb-4 text-sm underline text-blue-500"
      >
        ← Back to List
      </button>

      {/* 🖼️ Podcast Info */}
      <img
        src={podcast.image}
        alt={podcast.title}
        className="w-full h-60 object-cover rounded mb-4"
      />
      <h2 className="text-2xl font-bold mb-2">{podcast.title}</h2>
      <p className="text-sm text-gray-400 mb-2">{podcast.tag}</p>
      <p className="mb-2">📅 {new Date(podcast.date).toLocaleDateString()}</p>
      <a
        href={podcast.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline text-sm"
      >
        🎧 Listen Now
      </a>

      {/* 🔘 Action Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => setShowEditDialog(true)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
        >
          ✏️ Edit
        </button>
        <button
          onClick={() => setShowDeleteDialog(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          🗑️ Delete
        </button>
      </div>

      {/* 🟡 Edit Confirmation */}
      <ConfirmDialog
        open={showEditDialog}
        onCancel={() => setShowEditDialog(false)}
        onConfirm={handleEdit}
        title="Edit this podcast?"
        description="You’ll be able to update its title, image, URL, and more."
      />

      {/* 🔴 Delete Confirmation */}
      <ConfirmDialog
        open={showDeleteDialog}
        onCancel={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Are you sure you want to delete?"
        description="This action cannot be undone and will remove this podcast permanently."
      />
    </div>
  );
}
