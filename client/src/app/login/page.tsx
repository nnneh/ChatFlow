"use client";
import { loadUserInfo } from "@/lib/redux/features/userSlice";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { set, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { FaEnvelope, FaLock, FaArrowRight, FaFacebook, FaGoogle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Loader2 } from "lucide-react";


const LoginForm = () => {
  const dispatch = useDispatch();
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleLogin = async (data) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}/login`, data, {
        withCredentials: true,
      });

      if (response.status === 200) {
        const { message, user } = response.data;
        dispatch(loadUserInfo(user))
        toast.success(message + " to " + user.username);
        router.push("/chatflow/chat");
      }
    } catch (error) {
      const { message } = error.response.data;
      if (error.response) {
        if (error.response.status === 404) {
          toast.error(message);
        }

        if (error.response.status === 401) {
          toast.error(message);
        }
        if (error.response.status === 500) {
          toast.error(message);
        }
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#FFE5EC] via-[#FFF0F5] to-[#E0E7FF] px-4 py-10">
      {/* Soft floating blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-pink-200/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-indigo-200/60 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 right-1/4 h-40 w-40 rounded-full bg-emerald-200/50 blur-3xl" />

      <Toaster position="top-center" />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl bg-white/80 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(168,85,247,0.25)] border border-white/70 overflow-hidden">
          {/* Header */}
          <div className="relative px-8 pt-10 pb-8 text-center bg-gradient-to-br from-[#FBCFE8] via-[#DDD6FE] to-[#A7F3D0]">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/70 shadow-md backdrop-blur">
              <span className="text-2xl">💬</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-800">
              ChatFlow
            </h1>
            <p className="mt-1 text-sm text-slate-600">Welcome back, friend ✨</p>
          </div>

          {/* Body */}
          <div className="px-8 py-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">
              Sign in to your account
            </h2>

            <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
              {/* Email */}
              <div>
                <div className="group relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400 group-focus-within:text-pink-500 transition" />
                  <input
                    type="email"
                    placeholder="Email address"
                    {...register("email", { required: "Email is required" })}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-pink-50/60 border border-pink-100 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-300/60 focus:border-pink-300 transition"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 ml-2 text-xs text-rose-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="group relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-indigo-500 transition" />
                  <input
                    type="password"
                    placeholder="Password"
                    {...register("password", { required: "Password is required" })}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300/60 focus:border-indigo-300 transition"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 ml-2 text-xs text-rose-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember / Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="h-4 w-4 rounded border-pink-300 text-pink-500 focus:ring-pink-300"
                  />
                  <span className="text-slate-600">Remember me</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="font-medium text-indigo-500 hover:text-indigo-600"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl text-white font-semibold bg-gradient-to-r from-pink-400 via-fuchsia-400 to-indigo-400 shadow-lg shadow-pink-200/60 hover:shadow-xl hover:shadow-indigo-200/60 hover:-translate-y-0.5 active:translate-y-0 transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Sign in
                    <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* Create account */}
            <p className="mt-6 text-center text-sm text-slate-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-pink-500 hover:text-pink-600"
              >
                Create account
              </Link>
            </p>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
              <span className="text-xs uppercase tracking-wider text-slate-400">
                or continue with
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            </div>

            {/* Social */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 py-2.5 rounded-2xl border border-slate-200 bg-white/70 hover:bg-blue-50 hover:border-blue-200 transition">
                <FaFacebook className="text-blue-500 text-lg" />
                <span className="text-sm text-slate-600">Facebook</span>
              </button>
              <button className="flex items-center justify-center gap-2 py-2.5 rounded-2xl border border-slate-200 bg-white/70 hover:bg-rose-50 hover:border-rose-200 transition">
                <FaGoogle className="text-rose-500 text-lg" />
                <span className="text-sm text-slate-600">Google</span>
              </button>
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-slate-400">
          Made with 🌸 for cozy conversations
        </p>
      </div>
    </div>
  );
};

export default LoginForm;