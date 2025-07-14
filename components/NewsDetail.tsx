'use client';

import Image from 'next/image';
import { Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export type NewsType = {
  _id: string;
  city: string;
  title: string;
  author: string;
  image: string;
  createdAt: string;
};

type Props = {
  item: NewsType;
  onBack: () => void;
  onEdit: () => void;
  onDeleted: () => void;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://ghardpadharo-blog-backend.onrender.com/api/v1';

export default function NewsDetail({
  item,
  onBack,
  onEdit,
  onDeleted,
}: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return toast.error('❌ Unauthorized: Please login first.');

    try {
      setIsDeleting(true);
      const res = await fetch(`${API_BASE}/news/${item._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        toast.success('🗑️ News deleted successfully!');
        onDeleted();
      } else {
        toast.error(data.message || '❌ Failed to delete news.');
      }
    } catch (error) {
      toast.error('⚠️ Something went wrong while deleting!');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-[#0f172a] p-6 rounded-xl shadow-lg text-white max-w-4xl mx-auto space-y-6">
      <div className="w-full rounded-xl overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          width={1000}
          height={500}
          className="w-full h-64 object-cover"
          priority
        />
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-2">{item.title}</h1>
        <div className="text-gray-400 space-y-1">
          <p>🖋️ Author: <span className="text-white">{item.author}</span></p>
          <p>📍 City: <span className="text-white">{item.city}</span></p>
          <p className="text-sm text-gray-500 mt-2">
            🕒 Published: {new Date(item.createdAt).toLocaleString('en-IN', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-4">
        <button
          onClick={onBack}
          className="bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <button
          onClick={onEdit}
          className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <Pencil className="w-4 h-4" />
          Edit
        </button>

        <button
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg flex items-center gap-2 transition disabled:opacity-60"
          disabled={isDeleting}
        >
          <Trash2 className="w-4 h-4" />
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}
