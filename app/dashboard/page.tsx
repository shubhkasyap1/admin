// app/dashboard/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import BlogPosts from '@/components/BlogPosts';
import NewsPosts from '@/components/NewsPost';
import BlogDetails, { Blog } from "@/components/BlogDetails";
import PodcastPost from '@/components/PodcastPost'; 

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (loggedIn !== 'true') {
      router.push('/login');
    }
  }, [router]);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <h1 className="text-3xl font-semibold">Welcome to your Dashboard 🎉</h1>;
      case 'blog':
        return (
          <BlogPosts
            onBlogSelect={(blog) => {
              setSelectedBlog(blog);
              setActiveTab('blog-details');
            }}
          />
        );
      case 'blog-details':
        return (
          <BlogDetails
            isOpen={true}
            blog={selectedBlog}
            onClose={() => setActiveTab('blog')}
          />
        );
      case 'news':
        return <NewsPosts />;
      case 'podcasts':
        return <PodcastPost />;
      default:
        return <h1 className="text-2xl font-semibold">Welcome!</h1>;
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-[#0d1117] text-black dark:text-white">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-8">{renderContent()}</main>
    </div>
  );
}
