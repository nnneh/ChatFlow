"use client";
import { loadUserInfo } from "@/lib/redux/features/userSlice";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { FaEnvelope, FaLock, FaArrowRight, FaFacebook, FaGoogle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import Cookies from "js-cookie";

interface LoginFormInput {
  email: string;
  password?: string;
}

const LoginForm = () => {
  const dispatch = useDispatch();
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInput>();

  // const handleLogin: SubmitHandler<LoginFormInput> = async (data) => {
  //   try {
  //     const response = await axios.post(
  //       `${process.env.NEXT_PUBLIC_API_URL}/login`,
  //       data,
  //       { withCredentials: true }
  //     );

  //     if (response.status === 200) {
  //       const { message, user, accessToken, refreshToken } = response.data;

  //       if (accessToken) {
  //         localStorage.setItem("accessToken", accessToken);
  //         Cookies.set("accessToken", accessToken, { 
  //           expires: 1, 
  //           secure: process.env.NODE_ENV === "production", 
  //           sameSite: "strict" 
  //         });
  //       }
  //       if (refreshToken) {
  //         localStorage.setItem("refreshToken", refreshToken);
  //       }

  //       dispatch(loadUserInfo(user));
  //       toast.success(`${message} to ${user.username}`);

  //       setTimeout(() => {
  //         router.push("/chatflow/chat");
  //       }, 50);
  //     }
  //   } catch (error) {
  //     let errorMessage = "Could not connect to the server. Please try again.";
  //     if (axios.isAxiosError(error)) {
  //       errorMessage = error.response?.data?.message || errorMessage;
  //     } else if (error instanceof Error) {
  //       errorMessage = error.message;
  //     }
  //     toast.error(errorMessage);
  //   }
  // };

  const handleLogin: SubmitHandler<LoginFormInput> = async (data) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/login`,
      data,
      { withCredentials: true } // ✅ lets server set httpOnly cookies
    );

    if (response.status === 200) {
      const { message, user } = response.data;
      // ✅ No localStorage — cookies are set by server automatically
      // ✅ No manual Cookies.set — server already did it httpOnly
      dispatch(loadUserInfo(user));
      toast.success(`${message} to ${user.username}`);
      router.push("/chatflow/chat");
      // window.location.href = "/chatflow/chat";
      // router.push("/chatflow");
      // window.location.href = "/chatflow"

    }
  } catch (error) {
    let errorMessage = "Could not connect to the server. Please try again.";
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    toast.error(errorMessage);
  }
};

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#FFE5EC] via-[#FFF0F5] to-[#E0E7FF] px-4 py-10">
      <Toaster position="top-center" />
      <div className="relative w-full max-w-md">
        <div className="rounded-3xl bg-white/80 backdrop-blur-xl shadow-xl border border-white/70 overflow-hidden">
          <div className="relative px-8 pt-10 pb-8 text-center bg-gradient-to-br from-[#FBCFE8] via-[#DDD6FE] to-[#A7F3D0]">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/70 shadow-md">
              <Image className="object-contain" src="/Pastel Chatflow Logo.png" alt="Logo" width={120} height={120} priority />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-800">ChatFlow</h1>
            <p className="mt-1 text-sm text-slate-600">Welcome back, friend ✨</p>
          </div>

          <div className="px-8 py-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">Sign in to your account</h2>
            <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
              <div>
                <div className="group relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400" />
                  <input type="email" placeholder="Email address" {...register("email", { required: "Email is required" })} className="w-full pl-11 pr-4 py-3 rounded-2xl bg-pink-50/60 border border-pink-100 text-slate-700 outline-none" />
                </div>
                {errors.email && <p className="mt-1 ml-2 text-xs text-rose-500">{errors.email.message as string}</p>}
              </div>

              <div>
                <div className="group relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" />
                  <input type={showPassword ? "text" : "password"} placeholder="Password" {...register("password", { required: "Password is required" })} className="w-full pl-11 pr-11 py-3 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-slate-700 outline-none" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-indigo-500">
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 ml-2 text-xs text-rose-500">{errors.password.message as string}</p>}
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} className="h-4 w-4 rounded border-pink-300 text-pink-500" />
                  <span className="text-slate-600">Remember me</span>
                </label>
                <Link href="/forgot-password" className="font-medium text-indigo-500">Forgot password?</Link>
              </div>

              <button type="submit" disabled={isSubmitting} className="group w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl text-white font-semibold bg-gradient-to-r from-pink-400 via-fuchsia-400 to-indigo-400 shadow-lg disabled:opacity-70">
                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Sign in <FaArrowRight /></>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;