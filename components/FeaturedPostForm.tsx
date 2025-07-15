"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

type FeaturedPost = {
  _id: string;
  title: string;
  image: string;
  author: string;
  description: string;
};

type Props = {
  existing?: FeaturedPost;
  onClose: () => void;
  onSuccess: () => void;
};

export default function FeaturedPostForm({ existing, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState({
    title: existing?.title || "",
    author: existing?.author || "",
    description: existing?.description || "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(existing?.image || null);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
  const isEdit = !!existing;

  // Preview selected image
  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.description || (!imageFile && !existing?.image)) {
      toast.error("Please fill in all fields");
      return;
    }

    if (isEdit) {
      setShowConfirm(true);
    } else {
      await uploadPost();
    }
  };

  const uploadPost = async () => {
    setLoading(true);
    const token = localStorage.getItem("accessToken");

    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("author", formData.author);
      form.append("description", formData.description);
      if (imageFile) form.append("image", imageFile);

      const endpoint = isEdit ? `/featured-posts/${existing?._id}` : "/featured-posts";
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: isEdit ? "PATCH" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const data = await res.json();

      if (data.success) {
        toast.success(`✅ Post ${isEdit ? "updated" : "created"} successfully!`);
        onSuccess();
        onClose();
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Server Error");
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <div className="p-6 rounded-xl shadow-md border bg-white dark:bg-gray-900 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4">
          {isEdit ? "✏️ Edit Featured Post" : "➕ Create Featured Post"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border p-2 rounded bg-transparent dark:border-gray-600"
            required
          />

          <input
            type="text"
            name="author"
            placeholder="Author"
            value={formData.author}
            onChange={handleChange}
            className="w-full border p-2 rounded bg-transparent dark:border-gray-600"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded bg-transparent dark:border-gray-600"
            rows={4}
            required
          ></textarea>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border p-2 rounded bg-transparent dark:border-gray-600"
            required={!isEdit}
          />

          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-48 object-cover rounded border border-gray-300 dark:border-gray-600"
            />
          )}

          <div className="flex justify-end gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
            >
              {loading ? (isEdit ? "Updating..." : "Creating...") : isEdit ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white py-2 px-6 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {isEdit && (
        <ConfirmDialog
          open={showConfirm}
          onCancel={() => setShowConfirm(false)}
          onConfirm={uploadPost}
          title="Update this post?"
          description="Are you sure you want to apply these changes?"
          confirmText="Yes, Update"
          cancelText="Cancel"
        />
      )}
    </>
  );
}
