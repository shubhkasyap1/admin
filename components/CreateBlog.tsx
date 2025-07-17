// app/components/CreateBlog.tsx
"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import CKEditor wrapper
const WordEditor = dynamic(() => import("./WordEditor"), { ssr: false });

export default function CreateBlog() {
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
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Error submitting blog:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-semibold">Create New Blog</h1>

      <div>
        <label className="block font-medium mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Category</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="w-full"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Description</label>
        <WordEditor value={description} onChange={setDescription} />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Submit Blog
      </button>
    </form>
  );
}
