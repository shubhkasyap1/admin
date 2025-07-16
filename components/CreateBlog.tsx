'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';

const EditorWithToolbar = dynamic(() => import('./EditorWithToolbar'), { ssr: false });

interface Props {
  onClose: () => void;
  onBlogCreated: () => void;
}

export default function CreateBlog({ onClose, onBlogCreated }: Props) {
  const { theme } = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTitle('');
    setDescription('');
    setCategory('');
    setImageFile(null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !category || !imageFile) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('image', imageFile);

      const accessToken = localStorage.getItem('accessToken');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data?.message || 'Failed to create blog');
        return;
      }

      toast.success(data.message || 'Blog created successfully!');
      onBlogCreated();
    } catch (err) {
      console.error('Blog create error:', err);
      toast.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`w-full max-w-6xl mx-auto rounded-2xl p-8 shadow-xl border ${
        theme === 'dark'
          ? 'bg-gray-900 border-gray-800 text-white'
          : 'bg-white border-gray-200 text-black'
      }`}
    >
      <h2 className="text-3xl font-bold mb-6">📝 Create New Blog</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full px-5 py-4 text-lg rounded-xl border ${
            theme === 'dark'
              ? 'bg-gray-800 border-gray-700 text-white'
              : 'bg-gray-100 border-gray-300 text-black'
          }`}
        />

        <EditorWithToolbar content={description} onChange={setDescription} />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`w-full px-5 py-4 text-lg rounded-xl border ${
            theme === 'dark'
              ? 'bg-gray-800 border-gray-700 text-white'
              : 'bg-gray-100 border-gray-300 text-black'
          }`}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className={`w-full px-5 py-4 rounded-xl border file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold ${
            theme === 'dark'
              ? 'bg-gray-800 border-gray-700 text-white file:bg-blue-600 file:text-white hover:file:bg-blue-700'
              : 'bg-gray-100 border-gray-300 text-black file:bg-blue-600 file:text-white hover:file:bg-blue-700'
          }`}
        />

        {imageFile && (
          <img
            src={URL.createObjectURL(imageFile)}
            alt="Preview"
            className="w-full max-h-[250px] object-cover rounded-xl mt-3"
          />
        )}

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className={`px-5 py-3 rounded-xl text-base font-medium border ${
              theme === 'dark'
                ? 'text-white border-gray-600 hover:bg-gray-700'
                : 'text-black border-gray-300 hover:bg-gray-200'
            }`}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl text-base font-semibold text-white bg-blue-600 hover:bg-blue-700"
          >
            {loading ? 'Posting...' : 'Post Blog'}
          </button>
        </div>
      </form>
    </div>
  );
}
