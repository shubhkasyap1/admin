"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { Plus } from "lucide-react";
import CreateNews from "./CreateNewsModal";
import NewsDetail, { NewsType } from "./NewsDetail";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

const NewsCardSkeleton = () => (
  <div className="bg-[#1e293b] rounded-lg overflow-hidden shadow animate-pulse">
    <div className="bg-gray-700 h-48 w-full" />
    <div className="p-4 space-y-2">
      <div className="h-4 bg-gray-600 rounded w-3/4"></div>
      <div className="h-3 bg-gray-700 rounded w-1/2"></div>
      <div className="h-3 bg-gray-700 rounded w-1/3"></div>
      <div className="h-2 bg-gray-800 rounded w-2/3"></div>
    </div>
  </div>
);



export default function NewsPosts() {
  const [news, setNews] = useState<NewsType[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [appliedCity, setAppliedCity] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [detailedItem, setDetailedItem] = useState<NewsType | null>(null);
  const [newsToEdit, setNewsToEdit] = useState<NewsType | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const fetchNews = async (city?: string) => {
    try {
      setLoading(true);
      const url =
        city && city !== "all"
          ? `${API_BASE}/news/city${city}`
          : `${API_BASE}/news`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.success && Array.isArray(data.info)) {
        setNews(data.info);
      } else {
        toast.error(data.message || "Failed to fetch news");
        window.alert(data.message || "Failed to fetch news");
        setNews([]);
      }
    } catch (err) {
      toast.error("Something went wrong while fetching news");
      window.alert("Something went wrong while fetching news");
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const res = await fetch(`${API_BASE}/news`);
      const data = await res.json();

      if (data.success && Array.isArray(data.info)) {
        const uniqueCities = Array.from(
          new Set((data.info as NewsType[]).map((n) => n.city))
        ) as string[];

        setCities(uniqueCities);
      }
    } catch (err) {
      toast.error("Error fetching cities.");
      window.alert("Error fetching cities.");
    }
  };

  useEffect(() => {
    fetchNews(appliedCity);
  }, [appliedCity]);

  useEffect(() => {
    fetchNews();
    fetchCities();
  }, []);

  return (
    <div className="p-6 text-white max-w-6xl mx-auto">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div className="bg-gray-800 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-2">📊 Total News</h2>
          <p className="text-4xl">{news.length}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-md flex flex-col justify-between items-start">
          <h2 className="text-xl font-bold mb-2">📝 Create New</h2>
          <button
            onClick={() => {
              setNewsToEdit(null);
              setDetailedItem(null);
              setIsCreating(true);
            }}
            className="flex items-center gap-2 bg-white text-black font-semibold px-4 py-2 mt-2 rounded shadow hover:bg-gray-200"
          >
            <Plus className="w-4 h-4" /> Create News
          </button>
        </div>
      </div>

      {/* City Filter */}
      {!detailedItem && !isCreating && (
        <div className="bg-gray-800 p-4 rounded-lg mb-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <label htmlFor="city" className="text-sm font-medium block mb-1">
              🌆 Filter by City
            </label>
            <select
              id="city"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-gray-900 text-white border border-gray-600 p-2 rounded"
            >
              <option value="all">All Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city.charAt(0).toUpperCase() + city.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setAppliedCity(selectedCity)}
            className="bg-white text-black py-2 px-5 rounded font-semibold hover:bg-gray-200"
          >
            Apply
          </button>
        </div>
      )}

      {/* Main Content Area Logic */}
      {isCreating || newsToEdit ? (
        <CreateNews
          newsToEdit={newsToEdit ?? undefined}
          onClose={() => {
            setIsCreating(false);
            setNewsToEdit(null);
          }}
          onCreated={() => {
            toast.success(newsToEdit ? "News updated!" : "News created!");
            fetchNews(appliedCity);
            setIsCreating(false);
            setNewsToEdit(null);
          }}
        />
      ) : detailedItem ? (
        <NewsDetail
          item={detailedItem}
          onBack={() => setDetailedItem(null)}
          onEdit={() => {
            setNewsToEdit(detailedItem);
            setDetailedItem(null);
          }}
          onDeleted={() => {
            setDetailedItem(null);
            fetchNews(appliedCity);
          }}
        />
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <NewsCardSkeleton key={idx} />
          ))}
        </div>
      ) : news.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <div
              key={item._id}
              onClick={() => setDetailedItem(item)}
              className="cursor-pointer bg-[#1e293b] rounded-lg overflow-hidden shadow hover:shadow-xl transition"
            >
              <Image
                src={item.image}
                alt={item.title}
                width={500}
                height={300}
                className="object-cover h-48 w-full"
              />
              <div className="p-4 space-y-1">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-400">🖋 {item.author}</p>
                <p className="text-sm text-gray-500">📍 {item.city}</p>
                <p className="text-xs text-gray-600">
                  🕒 {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 mt-6">No news found.</p>
      )}
    </div>
  );
}
