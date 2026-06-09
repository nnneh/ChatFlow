"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { loginUser, clearError } from "@/redux/slices/authSlice";
import toast from "react-hot-toast";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error, user } = useAppSelector((s) => s.auth);

  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    if (user) router.push("/chat");
  }, [user, router]);

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [error, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) {
      toast.success("Welcome back!");
      router.push("/chat");
    }
  };

  return (
    <div className="min-h-screen bg-cf-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cf-accent to-cf-teal flex items-center justify-center font-bold text-white shadow-lg shadow-cf-accent/30">
            CF
          </div>
          <span className="text-2xl font-semibold tracking-tight">ChatFlow</span>
        </div>

        <h1 className="text-3xl font-semibold mb-2">Welcome back</h1>
        <p className="text-white/40 mb-8">Sign in to continue your conversations</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              required
              className="w-full bg-cf-surface2 border border-white/8 rounded-xl px-4 py-3 text-white placeholder-white/25 outline-none focus:border-cf-accent transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-1.5">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              required
              className="w-full bg-cf-surface2 border border-white/8 rounded-xl px-4 py-3 text-white placeholder-white/25 outline-none focus:border-cf-accent transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cf-accent hover:bg-purple-600 text-white font-medium py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-white/40 text-sm mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-cf-accent hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}