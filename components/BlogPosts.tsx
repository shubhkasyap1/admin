// components/BlogPosts.tsx
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CreateBlog from "@/components/CreateBlog";

interface Blog {
  _id: string;
  category: string;
  title: string;
  image: string;
  description: string;
  createdAt: string;
}

interface BlogPostsProps {
  onBlogSelect: (blog: Blog) => void;
}

export default function BlogPosts({ onBlogSelect }: BlogPostsProps) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("http://localhost:8000/api/v1/blogs/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.info) {
        setBlogs(data.info.blogs);
        setTotalBlogs(data.info.totalBlogs);
      } else {
        toast.error(data.message || "Failed to fetch blogs");
      }
    } catch (error) {
      toast.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">📚 Blog Posts Section</h1>
      <p className="mb-4">Here you can manage your blog posts.</p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-blue-100 text-blue-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold">Total Blogs</h2>
          <p className="text-3xl">{totalBlogs}</p>
        </div>

        <div
          onClick={() => setIsModalOpen(true)}
          className="bg-green-100 text-green-800 p-4 rounded-lg shadow cursor-pointer hover:bg-green-200 transition"
        >
          <h2 className="text-lg font-bold">Create New Blog</h2>
          <p>Click here to write a new post ✍️</p>
        </div>
      </div>

      {/* Blog List */}
      <div>
        <h2 className="text-xl font-semibold mb-3">All Blogs</h2>
        {loading ? (
          <p>Loading blogs...</p>
        ) : blogs.length === 0 ? (
          <p>No blogs found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                onClick={() => onBlogSelect(blog)}
                className="cursor-pointer border rounded-lg shadow hover:shadow-md transition p-4"
              >
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-40 object-cover rounded mb-3"
                />
                <h3 className="text-lg font-bold">{blog.title}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(blog.createdAt).toLocaleString()}
                </p>
                <p className="mt-2 text-sm line-clamp-3">
                  {blog.description}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Category: {blog.category}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Blog Modal */}
      <CreateBlog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBlogCreated={fetchBlogs}
      />
    </div>
  );
}