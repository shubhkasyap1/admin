"use client";

import React, { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { useTheme } from "next-themes";
import Loader from "@/components/ui/Loader";
import FeaturedPostForm from "@/components/FeaturedPostForm";
import FeaturedPostDetail from "@/components/FeaturedPostDetail";

export type FeaturedPost = {
  _id: string;
  title: string;
  image: string;
  author: string;
  description: string;
  createdAt: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function FeaturedPost() {
  const [posts, setPosts] = useState<FeaturedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedPost, setSelectedPost] = useState<FeaturedPost | null>(null);
  const [editPost, setEditPost] = useState<FeaturedPost | null>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const fetchFeaturedPosts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE}/featured-posts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        const formatted = data.info.map((item: any) => ({
          _id: item._id,
          title: item.title,
          image: item.image,
          author: item.author,
          description: item.description,
          createdAt: item.createdAt,
        }));
        setPosts(formatted);
      } else {
        toast.error(data.message || "Failed to fetch featured posts");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Server error while fetching featured posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedPosts();
  }, []);

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      <Toaster position="top-right" />

      {selectedPost ? (
        <FeaturedPostDetail
          post={selectedPost}
          onBack={() => setSelectedPost(null)}
          onEdit={() => {
            setEditPost(selectedPost);
            setSelectedPost(null);
          }}
          onDeleteSuccess={() => {
            fetchFeaturedPosts();
            setSelectedPost(null);
          }}
        />
      ) : editPost ? (
        <FeaturedPostForm
          existing={editPost}
          onClose={() => setEditPost(null)}
          onSuccess={() => {
            fetchFeaturedPosts();
            setEditPost(null);
          }}
        />
      ) : showForm ? (
        <FeaturedPostForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            fetchFeaturedPosts();
            setShowForm(false);
          }}
        />
      ) : loading ? (
        <Loader type="card" />
      ) : (
        <>
          {/* Header Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className={`rounded-xl p-6 border shadow-md ${
                isDark
                  ? "bg-gray-800 text-white border-gray-700"
                  : "bg-white text-black border border-gray-200"
              }`}
            >
              <h2 className="text-xl font-semibold mb-2">📢 Total Featured Posts</h2>
              <p className="text-4xl font-bold text-blue-500">{posts.length}</p>
            </div>

            <div
              className={`rounded-xl p-6 border shadow-md flex items-center justify-between ${
                isDark
                  ? "bg-gray-800 text-white border-gray-700"
                  : "bg-white text-black border border-gray-200"
              }`}
            >
              <h2 className="text-xl font-semibold">➕ Add New Featured Post</h2>
              <button
                onClick={() => setShowForm(true)}
                className={`px-4 py-2 rounded-md font-medium transition ${
                  isDark
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-black"
                }`}
              >
                Create Post
              </button>
            </div>
          </div>

          {/* Featured Post Cards */}
          {posts.length === 0 ? (
            <p className="text-center text-gray-500">No featured posts available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {posts.map((post) => (
                <div
                  key={post._id}
                  onClick={() => setSelectedPost(post)}
                  className={`relative rounded-xl p-4 shadow-md border transition-transform hover:scale-105 cursor-pointer ${
                    isDark
                      ? "bg-gray-800 text-white border-gray-700"
                      : "bg-white text-black border border-gray-200"
                  }`}
                >
                  <div className="relative w-full h-40 mb-3 rounded overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-bold">{post.title}</h3>
                  <p className="text-sm text-gray-400">By: {post.author}</p>
                  <p className="text-sm line-clamp-2">{post.description}</p>
                  <p className="text-sm mt-2 text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
