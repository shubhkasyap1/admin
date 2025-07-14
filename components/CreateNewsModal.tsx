'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { X } from 'lucide-react';

type Props = {
  onClose: () => void;
  onCreated: () => void;
  newsToEdit?: {
    _id: string;
    title: string;
    author: string;
    city: string;
    image: string;
  };
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function CreateNewsModal({ onClose, onCreated, newsToEdit }: Props) {
  const isEdit = !!newsToEdit;

  const [formData, setFormData] = useState({
    title: newsToEdit?.title || '',
    author: newsToEdit?.author || '',
    city: newsToEdit?.city || '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(newsToEdit?.image || null);
  const [loading, setLoading] = useState(false);

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

  const submitNews = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return toast.error('⚠️ Please login to continue.');

    setLoading(true);

    const body = new FormData();
    body.append('title', formData.title);
    body.append('author', formData.author);
    body.append('city', formData.city);
    if (imageFile) body.append('image', imageFile);

    const endpoint = isEdit ? `/news/${newsToEdit?._id}` : '/news';
    const method = isEdit ? 'PUT' : 'POST';

    // ❗ Debug logs
    console.log('🧪 Submitting:', isEdit ? 'EDIT' : 'CREATE');
    console.log('Endpoint:', `${API_BASE}${endpoint}`);
    console.log('ID:', newsToEdit?._id);

    if (isEdit && !newsToEdit?._id) {
      toast.error('❌ Invalid news ID for update.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(`✅ News ${isEdit ? 'updated' : 'created'} successfully!`);
        onCreated();
        onClose();
      } else {
        console.error('❌ Error Response:', data);
        toast.error(data.message || 'Something went wrong.');
      }
    } catch (err) {
      console.error('❌ Fetch error:', err);
      toast.error('❌ Server error!');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitNews();
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-xl border dark:border-gray-700 shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {isEdit ? '✏️ Edit News' : '➕ Create News'}
        </h2>
        <button onClick={onClose}>
          <X className="w-6 h-6 text-gray-500 hover:text-black dark:hover:text-white" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {['title', 'author', 'city'].map((field) => (
          <div key={field}>
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type="text"
              name={field}
              value={(formData as any)[field]}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded p-2 bg-transparent text-black dark:text-white"
              placeholder={`Enter ${field}`}
              required
            />
          </div>
        ))}

        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border border-gray-300 dark:border-gray-600 rounded p-2 text-white bg-transparent"
            required={!isEdit}
          />
        </div>

        {previewUrl && (
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
              Preview
            </label>
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-64 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
            />
          </div>
        )}

        <div className="col-span-1 md:col-span-2 flex flex-wrap gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? (isEdit ? 'Updating...' : 'Creating...') : isEdit ? 'Update' : 'Create'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
