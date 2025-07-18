"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import CKEditor wrapper
const WordEditor = dynamic(() => import("./WordEditor"), { ssr: false });

type CreateBlogProps = {
  onClose: () => void;
  onBlogCreated: () => void;
};

export default function CreateBlog({ onClose, onBlogCreated }: CreateBlogProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !category || !image || !description) {
      alert("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("image", image);
    formData.append("description", description);

    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert("Blog Created Successfully!");
        setTitle("");
        setCategory("");
        setImage(null);
        setDescription("");
        onBlogCreated(); // Notify parent to refresh
        onClose();       // Close form
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Error submitting blog:", err);
    }
  };

  const handleCancel = () => {
    setTitle("");
    setCategory("");
    setImage(null);
    setDescription("");
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-3xl mx-auto p-6 border rounded-lg shadow bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Create New Blog</h1>
        <button
          type="button"
          onClick={handleCancel}
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
        >
          Cancel
        </button>
      </div>

      <div>
        <label className="block font-medium mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Category</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="w-full bg-white dark:bg-gray-800 dark:text-white"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Description</label>
        <div className="rounded border dark:border-gray-700 bg-white dark:bg-gray-800">
          <WordEditor value={description} onChange={setDescription} />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Submit Blog
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
