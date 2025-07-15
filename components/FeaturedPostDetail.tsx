"use client";

import React, { useState } from "react";
import { toast } from "sonner";

type FeaturedPost = {
  _id: string;
  title: string;
  image: string;
  author: string;
  description: string;
  createdAt: string;
};

type Props = {
  post: FeaturedPost;
  onBack: () => void;
  onEdit: () => void;
  onDeleteSuccess: () => void;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function FeaturedPostDetail({ post, onBack, onEdit, onDeleteSuccess }: Props) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    setDeleting(true);
    const token = localStorage.getItem("accessToken");

    try {
      const res = await fetch(`${API_BASE}/featured-posts/${post._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Post deleted successfully");
        onDeleteSuccess();
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4 border shadow rounded-xl">
      <button onClick={onBack} className="text-sm text-blue-500 hover:underline">
        ← Back to Posts
      </button>

      <img src={post.image} alt={post.title} className="w-full h-64 object-cover rounded-lg" />

      <h2 className="text-3xl font-bold">{post.title}</h2>
      <p className="text-gray-600">By {post.author}</p>
      <p className="text-sm text-gray-400">
        Posted on {new Date(post.createdAt).toLocaleDateString()}
      </p>

      <p className="mt-4 text-lg">{post.description}</p>

      <div className="flex gap-3 mt-6">
        <button
          onClick={onEdit}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}
