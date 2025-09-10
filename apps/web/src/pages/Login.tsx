import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { api } from "../lib/api";
import { setToken } from "../lib/auth";
import { motion } from "framer-motion";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = useMutation({
    mutationFn: async () => {
      const res = await api.post("/api/v1/auth/login", { email, password });
      return res.data as { token: string };
    },
    onSuccess: (data) => {
      setToken(data.token);
      nav("/dashboard");
    },
    onError: () => setError("Invalid credentials"),
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-gray-950 dark:to-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-sm bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-2xl shadow-lg p-6 sm:p-8 space-y-5 border border-emerald-100 dark:border-gray-800"
      >
        <div className="space-y-1 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            EcoTracker
          </h1>
          <p className="text-sm text-gray-600">
            Sign in to continue your journey
          </p>
        </div>
        {error && (
          <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded px-3 py-2">
            {error}
          </p>
        )}
        <div className="space-y-3">
          <input
            className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[.99] text-white rounded-lg py-2.5 font-medium transition shadow-sm"
          onClick={() => login.mutate()}
          disabled={login.isPending}
        >
          {login.isPending ? "Signing in..." : "Sign In"}
        </button>
        <p className="text-sm text-gray-600 text-center">
          No account?{" "}
          <Link to="/register" className="text-emerald-700 hover:underline">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
