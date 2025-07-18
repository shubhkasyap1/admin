'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import { NewsAndUpdate } from './NewsAndUpdate';

interface NewsFormProps {
  existing?: NewsAndUpdate;
  onClose: () => void;
  onSuccess: () => void;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

// Dynamically import CKEditor or any WordEditor
const WordEditor = dynamic(() => import('./WordEditor'), { ssr: false });

export default function NewsAndUpdateForm({ existing, onClose, onSuccess }: NewsFormProps) {
  const [title, setTitle] = useState(existing?.title || '');
  const [text, setText] = useState(existing?.text || '');
  const [tag, setTag] = useState(existing?.tag || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!title || !text || !tag || (!existing && !imageFile)) {
      toast.error('All fields including image are required');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('text', text);
    formData.append('tag', tag);
    if (imageFile) formData.append('image', imageFile);

    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(
        existing ? `${API_BASE}/newsandupdates/${existing._id}` : `${API_BASE}/newsandupdates`,
        {
          method: existing ? 'PATCH' : 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const data = await res.json();
      if (res.ok) {
        toast.success(`News ${existing ? 'updated' : 'created'} successfully!`);
        onSuccess();
      } else toast.error(data.message || 'Operation failed');
    } catch {
      toast.error('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-900 border rounded-xl p-6 mt-6 space-y-4 shadow-md max-w-3xl mx-auto"
    >
      <h2 className="text-xl font-semibold">
        {existing ? '✏️ Edit News & Update' : '➕ Create News & Update'}
      </h2>

      <div>
        <label className="block mb-1 font-medium">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 rounded border dark:bg-gray-800"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Text</label>
        <WordEditor value={text} onChange={setText} />
      </div>

      <div>
        <label className="block mb-1 font-medium">Tag</label>
        <input
          type="text"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="w-full px-3 py-2 rounded border dark:bg-gray-800"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="w-full"
        />
        {existing?.image && !imageFile && (
          <img src={existing.image} alt="Current" className="mt-2 w-40 rounded shadow" />
        )}
      </div>

      <div className="flex gap-4 justify-end">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:opacity-80"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? '⏳ Saving...' : existing ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
