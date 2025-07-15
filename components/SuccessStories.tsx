"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Plus, X } from "lucide-react";
import SuccessStoryForm from "@/components/SuccessStoriesForm";
import { toast } from "sonner";

interface SuccessStory {
  _id: string;
  personName: string;
  quote: string;
  designation: string;
  image: string;
  createdAt: string;
}

const API_URL =
  "https://ghardpadharo-blog-backend.onrender.com/api/v1/success-stories/";

export default function SuccessStories() {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedStory, setSelectedStory] = useState<SuccessStory | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const fetchStories = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data.success) setStories(data.info);
    } catch (err) {
      console.error("Error fetching stories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this story?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (result.success) {
        alert("✅ Deleted successfully!");
        setSelectedStory(null);
        fetchStories();
      } else {
        alert("❌ Delete failed.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Server error");
    }
  };

  return (
    <div className="p-4 md:p-8 relative">
      {/* Create Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-2xl shadow-lg">
            <SuccessStoryForm
              onSuccess={() => {
                fetchStories();
                setShowForm(false);
              }}
              onClose={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {/* Edit Form */}
      {showEditForm && selectedStory && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-2xl shadow-lg">
            <SuccessStoryForm
              existing={selectedStory}
              onSuccess={() => {
                fetchStories();
                toast.success("✅ Story updated successfully!");
                setShowEditForm(false);
                setSelectedStory(null);
              }}
              onClose={() => {
                setShowEditForm(false);
                setSelectedStory(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Detail Card */}
      {selectedStory && !showEditForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-xl shadow-lg relative">
            <button
              onClick={() => setSelectedStory(null)}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-xl"
            >
              <X />
            </button>

            <div className="w-full h-56 relative mb-4 rounded overflow-hidden">
              <Image
                src={selectedStory.image}
                alt={selectedStory.personName}
                fill
                className="object-cover"
              />
            </div>

            <h3 className="text-xl font-semibold mb-1">
              {selectedStory.personName}
            </h3>
            <p className="text-gray-500 mb-2">{selectedStory.designation}</p>
            <p className="mb-4 text-gray-700 dark:text-gray-300 italic">
              "{selectedStory.quote}"
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowEditForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDelete(selectedStory._id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                🗑 Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 shadow rounded-xl">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Total Success Stories
          </h3>
          <span className="text-4xl font-bold text-blue-600">
            {stories.length}
          </span>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 shadow rounded-xl flex flex-col items-start justify-between">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Want to share your journey?
          </h3>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            <Plus className="w-5 h-5" />
            Create Success Story
          </button>
        </div>
      </div>

      {/* Stories Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="animate-spin text-blue-600 w-8 h-8" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <div
              key={story._id}
              onClick={() => setSelectedStory(story)}
              className="cursor-pointer bg-white dark:bg-gray-800 shadow-md rounded-xl overflow-hidden hover:shadow-lg transition duration-200"
            >
              <div className="relative w-full h-52">
                <Image
                  src={story.image}
                  alt={story.personName}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {story.personName}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {story.designation}
                </p>
                <span className="inline-block mt-2 text-blue-500 hover:underline text-sm">
                  ▶️ View Quote
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
