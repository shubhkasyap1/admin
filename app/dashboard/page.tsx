"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import BlogPosts from "@/components/BlogPosts";
import NewsPosts from "@/components/NewsPost";
import PodcastPost from "@/components/PodcastPost";
import QuestionAns from "@/components/QuestionAns";
import BlogDetailsInline from "@/components/BlogDetailsInline";
import SuccessStories from "@/components/SuccessStories";
import type { Blog } from "@/components/BlogPosts";
import { jwtDecode } from "jwt-decode";
import Loader from "@/components/ui/Loader";
import FeaturedPost from "@/components/FeaturedPost";
import NewsAndUpdatePost from "@/components/NewsAndUpdate";

interface DecodedToken {
  exp: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("home");
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);

      if (decoded.exp < now) {
        localStorage.clear();
        router.push("/login");
      } else {
        setCheckingAuth(false);
      }
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.clear();
      router.push("/login");
    }
  }, [router]);

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <h1 className="text-3xl font-semibold">
            Welcome to your Dashboard 🎉
          </h1>
        );
      case "blog":
        return (
          <BlogPosts
            onBlogSelect={(blog: Blog) => {
              setSelectedBlog(blog);
              setActiveTab("blog-details");
            }}
          />
        );
      case "blog-details":
        return (
          <BlogDetailsInline
            blog={selectedBlog!}
            onClose={() => {
              setSelectedBlog(null);
              setActiveTab("blog");
            }}
            onChange={() => {
              setSelectedBlog(null);
              setActiveTab("blog");
            }}
          />
        );
      case "news":
        return <NewsPosts />;
      case "podcasts":
        return <PodcastPost />;
      case "question-ans":
        return <QuestionAns />;
      case "success-stories":
        return <SuccessStories />;
      case "featured-posts":
        return <FeaturedPost />;
      case "NewsAndUpdate":
        return <NewsAndUpdatePost />;
      default:
        return <h1 className="text-2xl font-semibold">Welcome!</h1>;
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#0d1117]">
        <Loader type="dashboard" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-[#0d1117] text-black dark:text-white">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-8 overflow-y-auto">{renderContent()}</main>
    </div>
  );
}
