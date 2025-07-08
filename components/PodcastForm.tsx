'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

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
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(existing?.image || null);
  const [loading, setLoading] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const isEdit = Boolean(existing);

  // 🔄 Update preview when imageFile changes
  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  };

  const submitPodcast = async () => {
    setLoading(true);
    const token = localStorage.getItem('accessToken');

    try {
      const body = new FormData();
      body.append('title', formData.title);
      body.append('tag', formData.tag);
      body.append('date', formData.date);
      body.append('url', formData.url);

      if (imageFile) {
        body.append('image', imageFile);
      }

      const res = await fetch(
        `http://localhost:8000/api/v1/podcasts${isEdit ? `/${existing?._id}` : ''}`,
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body,
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
      setShowUpdateDialog(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      setShowUpdateDialog(true);
    } else {
      submitPodcast();
    }
  };

  return (
    <>
      <div className="rounded-xl p-6 border shadow-md bg-white dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4">
          {isEdit ? '✏️ Edit Podcast' : '➕ Create Podcast'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {['title', 'tag', 'url'].map((field) => (
            <input
              key={field}
              type="text"
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

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border p-2 rounded bg-transparent dark:border-gray-600"
            required={!isEdit}
          />

          {/* 🖼️ Image Preview */}
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-48 object-cover rounded border border-gray-300 dark:border-gray-600"
            />
          )}

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

      {/* 🔒 Confirm Update Dialog */}
      {isEdit && (
        <ConfirmDialog
          open={showUpdateDialog}
          onCancel={() => setShowUpdateDialog(false)}
          onConfirm={submitPodcast}
          title="Update this podcast?"
          description="Are you sure you want to apply these changes?"
          confirmText="Yes, Update"
          cancelText="Cancel"
        />
      )}
    </>
  );
}
