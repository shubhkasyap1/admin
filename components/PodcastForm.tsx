// components/PodcastForm.tsx

'use client';

import { useState } from 'react';
import { toast } from 'sonner';

interface PodcastFormProps {
  onClose: () => void;
  onSuccess: () => void;
  existing?: {
    _id: string;
    title: string;
    tag: string;
    date: string;
    url: string;
    image: string;
  };
}

export default function PodcastForm({ onClose, onSuccess, existing }: PodcastFormProps) {
  const [formData, setFormData] = useState({
    title: existing?.title || '',
    tag: existing?.tag || '',
    date: existing?.date?.slice(0, 10) || '',
    url: existing?.url || '',
    image: existing?.image || '',
  });

  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(existing);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('accessToken');

    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/podcasts${isEdit ? `/${existing?._id}` : ''}`,
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success(`✅ Podcast ${isEdit ? 'updated' : 'created'}!`);
        onSuccess();
        onClose();
      } else {
        toast.error(data.message || `❌ Failed to ${isEdit ? 'update' : 'create'} podcast`);
      }
    } catch (error) {
      console.error(error);
      toast.error('❌ Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl p-6 border shadow-md bg-white dark:bg-gray-800 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-4">
        {isEdit ? '✏️ Edit Podcast' : '➕ Create Podcast'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['title', 'tag', 'url', 'image'].map((field) => (
          <input
            key={field}
            type={field === 'url' || field === 'image' ? 'url' : 'text'}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={(formData as any)[field]}
            onChange={handleChange}
            className="w-full border p-2 rounded bg-transparent dark:border-gray-600"
            required
          />
        ))}
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full border p-2 rounded bg-transparent dark:border-gray-600"
          required
        />
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
          >
            {loading ? (isEdit ? 'Updating...' : 'Creating...') : isEdit ? 'Update' : 'Create'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white py-2 px-6 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
