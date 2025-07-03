"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

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

  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setDescription(blog.description);
      setCategory(blog.category);
      setImage(blog.image);
    }
  }, [blog]);

  if (!isOpen || !blog) return null;

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`http://localhost:8000/api/v1/blogs/${blog._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        alert("Blog deleted successfully");
        onClose();
      } else {
        alert(data.message || "Failed to delete blog");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting blog");
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`http://localhost:8000/api/v1/blogs/${blog._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, category, image }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Blog updated successfully");
        setEditMode(false);
        onClose();
      } else {
        alert(data.message || "Failed to update blog");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating blog");
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
              theme === 'dark' ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-black'
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{editMode ? "Edit Blog" : blog.title}</h2>
              <button onClick={onClose} className="text-sm text-red-500 hover:underline">Close</button>
            </div>

            {editMode ? (
              <div className="space-y-4">
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 rounded border" />
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2 rounded border" rows={4} />
                <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2 rounded border" />
                <input type="text" value={image} onChange={(e) => setImage(e.target.value)} className="w-full px-4 py-2 rounded border" />

                <div className="flex justify-end gap-2">
                  <button onClick={() => setEditMode(false)} className="px-4 py-2 rounded border">Cancel</button>
                  <button onClick={handleUpdate} className="px-4 py-2 rounded bg-blue-600 text-white">Update</button>
                </div>
              </div>
            ) : (
              <>
                <img src={blog.image} alt={blog.title} className="w-full h-60 object-cover rounded mb-4" />
                <p className="text-sm text-gray-500 mb-2">{new Date(blog.createdAt).toLocaleString()}</p>
                <p className="mb-3 text-sm">Category: <span className="font-medium">{blog.category}</span></p>
                <p className="text-base leading-relaxed whitespace-pre-wrap mb-4">{blog.description}</p>

                <div className="flex justify-end gap-3">
                  <button onClick={() => setEditMode(true)} className="px-4 py-2 rounded border">Edit</button>
                  <button onClick={handleDelete} className="px-4 py-2 rounded bg-red-600 text-white">Delete</button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
