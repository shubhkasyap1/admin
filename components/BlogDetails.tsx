"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { toast } from "sonner";

export interface Blog {
  _id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  createdAt: string;
}

interface BlogDetailsProps {
  isOpen: boolean;
  blog: Blog | null;
  onClose: () => void;
}

export default function BlogDetails({ isOpen, blog, onClose }: BlogDetailsProps) {
  const { theme } = useTheme();
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Prefill blog data
  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setDescription(blog.description);
      setCategory(blog.category);
      setImage(blog.image);
    }
  }, [blog]);

  // ✅ Reset state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setEditMode(false);
      setTitle("");
      setDescription("");
      setCategory("");
      setImage("");
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen || !blog) return null;

  // ✅ DELETE blog
  const handleDelete = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs/${blog._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Blog deleted successfully");
        onClose();
      } else {
        toast.error(data.message || "Failed to delete blog");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting blog");
    } finally {
      setLoading(false);
    }
  };

  // ✅ UPDATE blog
  const handleUpdate = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs/${blog._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, category, image }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Blog updated successfully");
        setEditMode(false);
        onClose(); // also refresh parent if needed
      } else {
        toast.error(data.message || "Failed to update blog");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && blog && (
        <motion.div
          key={blog._id}
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
            className={`w-full max-w-2xl rounded-xl p-6 shadow-lg border overflow-y-auto max-h-[90vh] ${
              theme === "dark"
                ? "bg-gray-900 border-gray-800 text-white"
                : "bg-white border-gray-200 text-black"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                {editMode ? "Edit Blog" : blog.title}
              </h2>
              <button
                onClick={onClose}
                className="text-sm text-red-500 hover:underline"
              >
                Close
              </button>
            </div>

            {editMode ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded border"
                  placeholder="Blog Title"
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 rounded border"
                  rows={4}
                  placeholder="Blog Description"
                />
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 rounded border"
                  placeholder="Category"
                />
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-4 py-2 rounded border"
                  placeholder="Image URL"
                />

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 rounded border"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-60 object-cover rounded mb-4"
                />
                <p className="text-sm text-gray-500 mb-2">
                  {new Date(blog.createdAt).toLocaleString()}
                </p>
                <p className="mb-3 text-sm">
                  Category: <span className="font-medium">{blog.category}</span>
                </p>
                <p className="text-base leading-relaxed whitespace-pre-wrap mb-4">
                  {blog.description}
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-4 py-2 rounded border"
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 rounded bg-red-600 text-white disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
