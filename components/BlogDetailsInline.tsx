"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import type { Blog } from "./BlogPosts";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { toast } from "sonner";
import dynamic from "next/dynamic";

const WordEditor = dynamic(() => import("./WordEditor"), { ssr: false });

interface Props {
  blog: Blog;
  onClose: () => void;
  onChange: (action: "update" | "delete") => void;
}

export default function BlogDetailsInline({ blog, onClose, onChange }: Props) {
  const { theme } = useTheme();

  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);

  useEffect(() => {
    setTitle(blog.title);
    setDescription(blog.description);
    setCategory(blog.category);
    setPreviewImage(blog.image);
    setImageFile(null);
  }, [blog]);

  useEffect(() => {
    return () => {
      if (previewImage?.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const handleUpdate = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return toast.error("You are not authorized");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    if (imageFile) formData.append("image", imageFile);

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs/${blog._id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Blog updated successfully ✅");
        setEditMode(false);
        onChange("update");
      } else {
        toast.error(data.message || "Failed to update blog");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong during update");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return toast.error("You are not authorized");

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs/${blog._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Blog deleted successfully 🗑️");
        onChange("delete");
      } else {
        toast.error(data.message || "Failed to delete blog");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong during delete");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle(blog.title);
    setDescription(blog.description);
    setCategory(blog.category);
    setPreviewImage(blog.image);
    setImageFile(null);
    setEditMode(false);
  };

  return (
    <div className={`p-6 rounded-xl shadow border ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">
          {editMode ? "✏️ Edit Blog" : blog.title}
        </h2>
        <button
          onClick={onClose}
          className="text-sm text-red-500 hover:underline"
        >
          ❌ Close
        </button>
      </div>

      {editMode ? (
        <>
          <div className="space-y-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              placeholder="Title"
            />

            <WordEditor value={description} onChange={setDescription} />

            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              placeholder="Category"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (previewImage?.startsWith("blob:")) URL.revokeObjectURL(previewImage);
                  setImageFile(file);
                  setPreviewImage(URL.createObjectURL(file));
                }
              }}
              className="w-full"
            />

            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="w-full max-h-80 object-cover rounded-lg"
              />
            )}
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button onClick={resetForm} className="px-4 py-2 border rounded">
              Cancel
            </button>
            <button
              onClick={() => setShowUpdateConfirm(true)}
              disabled={loading}
              className={`px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </>
      ) : (
        <>
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full max-h-80 object-cover rounded-lg mb-4"
          />
          <p className="text-sm text-gray-500">
            🕒 {new Date(blog.createdAt).toLocaleString()}
          </p>
          <p className="mb-2">
            📂 <span className="font-medium">Category:</span> {blog.category}
          </p>
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.description }}
          />

          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setEditMode(true)} className="px-4 py-2 border rounded">
              ✏️ Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              {loading ? "Deleting..." : "🗑️ Delete"}
            </button>
          </div>
        </>
      )}

      <ConfirmDialog
        open={showDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          handleDelete();
          setShowDeleteConfirm(false);
        }}
        title="Delete this blog?"
        description="This action cannot be undone. The blog will be permanently deleted."
        confirmText="Yes, Delete"
        cancelText="Cancel"
      />

      <ConfirmDialog
        open={showUpdateConfirm}
        onCancel={() => setShowUpdateConfirm(false)}
        onConfirm={() => {
          handleUpdate();
          setShowUpdateConfirm(false);
        }}
        title="Update this blog?"
        description="Are you sure you want to apply these changes?"
        confirmText="Yes, Update"
        cancelText="Cancel"
      />
    </div>
  );
}
