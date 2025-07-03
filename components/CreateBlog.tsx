// components/CreateBlogModal.tsx
'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onBlogCreated: () => void;
}

export default function CreateBlogModal({ isOpen, onClose, onBlogCreated }: Props) {
  const { theme } = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setCategory('');
      setImageFile(null);
    }
  }, [isOpen]);

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
      const res = await fetch('http://localhost:8000/api/v1/blogs/', {
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
      onClose();
    } catch (err) {
      console.error('Blog create error:', err);
      toast.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`w-full max-w-xl rounded-xl p-6 shadow-lg border ${
              theme === 'dark' ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-black'
            }`}
          >
            <h2 className="text-2xl font-bold mb-4">Create Blog</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-100 border-gray-300 text-black'
                }`} />

              <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-100 border-gray-300 text-black'
                }`} rows={4} />

              <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-100 border-gray-300 text-black'
                }`} />

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className={`w-full px-4 py-3 rounded-lg border file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold
                  ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-white file:bg-blue-600 file:text-white hover:file:bg-blue-700'
                      : 'bg-gray-100 border-gray-300 text-black file:bg-blue-600 file:text-white hover:file:bg-blue-700'
                  }`}
              />

              <div className="flex justify-end gap-3">
                <button type="button" onClick={onClose} className={`px-4 py-2 rounded border ${
                  theme === 'dark' ? 'text-white border-gray-600 hover:bg-gray-700' : 'text-black border-gray-300 hover:bg-gray-200'
                }`}>Cancel</button>

                <button type="submit" disabled={loading} className="px-6 py-2 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700">
                  {loading ? 'Posting...' : 'Post Blog'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}