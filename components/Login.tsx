// components/Login.tsx
"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Toaster, toast } from "sonner";
import { Mail, Lock } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import logo from "@/public/logo.png";

interface DecodedToken {
  exp: number;
}

export default function Login({ onLogin }: { onLogin?: () => void }) {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        const now = Math.floor(Date.now() / 1000);
        if (decoded.exp > now) {
          window.location.href = "/dashboard";
        }
      } catch {
        localStorage.clear();
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      toast.error("Please fill in all fields");
      triggerShake();
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data?.message || "Login failed");
        triggerShake();
        return;
      }

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("accessToken", data.info.accessToken);
      localStorage.setItem("refreshToken", data.info.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.info.user));

      toast.success(data.message || "Login successful 🎉");
      onLogin ? onLogin() : (window.location.href = "/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again.");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
    setLoading(false);
  };

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row items-center justify-center transition-colors duration-300 px-6 relative ${
        theme === "dark"
          ? "bg-[#121212] text-white"
          : "bg-[#f4f6f8] text-gray-900"
      }`}
    >
      {/* Background blur */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-100 dark:from-[#1a1a1a] dark:via-[#0e0e0e] dark:to-[#1f1f1f] blur-[120px] opacity-40"></div>

      {/* Left Section - Logo */}
      <div className="relative z-10 w-full md:w-1/2 flex items-center justify-center p-10">
        <img
          src={logo.src}
          alt="Logo"
          className="w-[320px] md:w-[360px] lg:w-[400px] h-auto object-contain drop-shadow-xl"
        />
      </div>

      {/* Right Section - Form */}
      <div className="relative z-10 w-full md:w-1/2 flex items-center justify-center p-6">
        <form
          onSubmit={handleLogin}
          className={`w-full max-w-md md:max-w-lg xl:max-w-xl p-10 rounded-2xl backdrop-blur-lg shadow-2xl border transition ${
            theme === "dark"
              ? "bg-gray-900/80 border-gray-800"
              : "bg-white/80 border-gray-200"
          }`}
        >
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-extrabold">Sign in to your account</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Enter your credentials to continue
            </p>
          </div>

          {/* Email Field */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">Email</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Mail size={18} />
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                autoFocus
                className={`w-full pl-12 pr-4 py-3 rounded-xl border text-base outline-none shadow-sm transition ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Password</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Lock size={18} />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                className={`w-full pl-12 pr-4 py-3 rounded-xl border text-base outline-none shadow-sm transition ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                }`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Remember Me & Forgot */}
          <div className="flex items-center justify-between mb-6 text-sm">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-blue-600"
              />
              <span>Remember me</span>
            </label>
            <a href="/forgot-password" className="text-blue-500 hover:underline">
              Forgot Password?
            </a>
          </div>

          {/* Submit Button */}
          <AnimatePresence>
            <motion.div
              key={shake ? "shake" : "no-shake"}
              animate={shake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold text-lg rounded-xl shadow-md transition-all duration-300 flex justify-center items-center"
              >
                {loading ? (
                  <svg
                    className="w-5 h-5 animate-spin text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                ) : (
                  "Login"
                )}
              </motion.button>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 text-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Don&apos;t have an account?
            </span>{" "}
            <a
              href="/signup"
              className="text-blue-600 font-medium hover:underline transition-all duration-200"
            >
              Create one
            </a>
          </div>
        </form>
      </div>

      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
