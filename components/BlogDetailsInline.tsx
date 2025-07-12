'use client';

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import type { Blog } from "./BlogPosts";
import { toast } from "sonner"; // ✅ using sonner for better UX

interface Props {
  blog: Blog;
  onClose: () => void;
  onChange: (action: "update" | "delete") => void;
}

export default function BlogDetailsInline({ blog, onClose, onChange }: Props) {
  const { theme } = useTheme();
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(blog.title);
  const [description, setDescription] = useState(blog.description);
  const [category, setCategory] = useState(blog.category);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState(blog.image);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);

  useEffect(() => {
    setTitle(blog.title);
    setDescription(blog.description);
    setCategory(blog.category);
    setPreviewImage(blog.image);
    setImageFile(null);
  }, [blog]);

  const handleUpdate = async () => {
    const token = localStorage.getItem("accessToken");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await fetch(`http://localhost:8000/api/v1/blogs/${blog._id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("accessToken");

    try {
      const res = await fetch(`http://localhost:8000/api/v1/blogs/${blog._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
    }
  };

  return (
    <div className={`w-full rounded-lg p-6 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">{editMode ? "Edit Blog" : blog.title}</h2>
        <button
          onClick={onClose}
          className={`text-sm font-medium px-3 py-1 rounded ${theme === "dark" ? "text-red-400 hover:bg-gray-800" : "text-red-600 hover:bg-gray-100"}`}
        >
          ✖ Close
        </button>
      </div>

      {editMode ? (
        <>
          <div className="space-y-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full px-4 py-2 rounded border"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              rows={5}
              className="w-full px-4 py-2 rounded border"
            />
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category"
              className="w-full px-4 py-2 rounded border"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImageFile(file);
                  setPreviewImage(URL.createObjectURL(file));
                }
              }}
              className="w-full px-4 py-2 rounded border"
            />
          </div>

          {previewImage && (
            <img src={previewImage} alt="Preview" className="w-full max-h-[400px] object-cover rounded-lg mt-4" />
          )}

          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setEditMode(false)} className="px-4 py-2 rounded border">
              Cancel
            </button>
            <button onClick={() => setShowUpdateConfirm(true)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Update
            </button>
          </div>
        </>
      ) : (
        <>
          <img src={blog.image} alt={blog.title} className="w-full max-h-[400px] object-cover rounded-lg mb-4" />
          <p className="text-sm mb-2">
            <span className="font-semibold">Created At:</span> {new Date(blog.createdAt).toLocaleString()}
          </p>
          <p className="text-sm mb-6">
            <span className="font-semibold">Category:</span> {blog.category}
          </p>
          <p className="text-base leading-relaxed whitespace-pre-wrap mb-6">{blog.description}</p>
          <div className="flex justify-end gap-4 mt-4">
            <button onClick={() => setEditMode(true)} className="px-4 py-2 rounded border">
              ✏️ Edit
            </button>
            <button onClick={() => setShowDeleteConfirm(true)} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
              🗑️ Delete
            </button>
          </div>
        </>
      )}

      {/* 🔴 Delete Confirmation Dialog */}
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

      {/* 🔵 Update Confirmation Dialog */}
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
