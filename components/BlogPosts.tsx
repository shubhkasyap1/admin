"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import CreateBlog from "@/components/CreateBlog";
import BlogDetailsInline from "@/components/BlogDetailsInline";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "@/components/ui/Loader";

export interface Blog {
  _id: string;
  category: string;
  title: string;
  image: string;
  description: string;
  createdAt: string;
}

export interface BlogPostsProps {
  onBlogSelect?: (blog: Blog) => void; // ✅ Accepts this prop optionally
}

export default function BlogPosts({ onBlogSelect }: BlogPostsProps) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs`, {
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
    <motion.div
      className="p-6 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h1 className="text-2xl font-semibold">📚 Blog Posts Section</h1>
        <p className="mb-4">Here you can manage your blog posts.</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-blue-100 text-blue-800 p-4 rounded-lg shadow"
        >
          <h2 className="text-lg font-bold">Total Blogs</h2>
          <p className="text-3xl">{totalBlogs}</p>
        </motion.div>

        <motion.div
          onClick={() => setIsModalOpen(true)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-green-100 text-green-800 p-4 rounded-lg shadow cursor-pointer hover:bg-green-200 transition"
        >
          <h2 className="text-lg font-bold">Create New Blog</h2>
          <p>Click here to write a new post ✍️</p>
        </motion.div>
      </div>

      {/* Blog List or Blog Details */}
      <div>
        <h2 className="text-xl font-semibold mb-3">All Blogs</h2>

        {loading ? (
          <Loader type="list" />
        ) : blogs.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            No blogs found.
          </motion.p>
        ) : (
          <AnimatePresence mode="wait">
            {!onBlogSelect && selectedBlog ? (
              // ✅ Inline Blog Detail View
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
              >
                <BlogDetailsInline
                  blog={selectedBlog}
                  onClose={() => setSelectedBlog(null)}
                  onChange={(action) => {
                    setSelectedBlog(null);
                    fetchBlogs();
                    setTimeout(() => {
                      toast.success(`Blog ${action}d successfully!`);
                    }, 250);
                  }}
                />
              </motion.div>
            ) : (
              // ✅ Blog Cards Grid
              <motion.div
                key="grid"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {blogs.map((blog, i) => (
                  <motion.div
                    key={blog._id}
                    onClick={() => {
                      if (onBlogSelect) {
                        onBlogSelect(blog); // external handler (e.g. Dashboard)
                      } else {
                        setSelectedBlog(blog); // internal inline view
                      }
                    }}
                    className="cursor-pointer border rounded-lg shadow hover:shadow-md transition p-4 bg-white dark:bg-gray-900"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + i * 0.08 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-40 object-cover rounded mb-3"
                    />
                    <h3 className="text-lg font-bold">{blog.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {new Date(blog.createdAt).toLocaleString()}
                    </p>
                    <p className="mt-2 text-sm line-clamp-3">
                      {blog.description}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Category: {blog.category}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Create Blog Modal */}
      <CreateBlog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBlogCreated={fetchBlogs}
      />
    </motion.div>
  );
}
