"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import {
  FaArrowRight,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaImage,
  FaLock,
  FaUser,
} from "react-icons/fa6";

// ✅ Moved OUTSIDE Signup so it's not re-created on every render
interface StyledInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ComponentType<{ className?: string }>;
  error?: string;
  rightElement?: React.ReactNode;
}

const StyledInput = React.forwardRef<HTMLInputElement, StyledInputProps>(
  ({ icon: Icon, error, rightElement, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <div className="relative flex items-center">
          <div className="absolute left-4 text-slate-400">
            <Icon className="text-lg" />
          </div>
          <input
            ref={ref}
            {...props}
            className={`w-full pl-12 pr-12 py-3 rounded-xl bg-slate-50 border transition-all outline-none text-slate-700 placeholder:text-slate-400 ${
              error
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
            }`}
          />
          {rightElement && (
            <div className="absolute right-4 text-slate-400">{rightElement}</div>
          )}
        </div>
        {error && <p className="text-xs text-red-500 pl-2">{error}</p>}
      </div>
    );
  }
);
StyledInput.displayName = "StyledInput";

const Signup = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const password = watch("password");

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    // ✅ Only append avatar if user selected one
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/register`,
        formData
      );

      if (response.status === 201) {
        toast.success(response.data.message);
        router.push("/login");
      }
    } catch (error: any) {
      console.error("Error during sign up:", error);
      // ✅ Fixed: correctly read message from error.response.data
      const message = error.response?.data?.message || "Some error occurred";

      if (error.response) {
        if ([400, 409, 500].includes(error.response.status)) {
          toast.error(message);
        }
      } else {
        toast.error("Network error. Please try again.");
      }
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-emerald-50 flex items-center justify-center p-4">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: "1rem",
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(10px)",
            fontSize: "0.875rem",
          },
        }}
      />

      {/* Floating pastel blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-80 h-80 bg-pink-200/40 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-200/40 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute top-[40%] right-[20%] w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "2s" }}
      />

      {/* Glass card */}
      <div className="relative w-full max-w-md bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-pink-100/40 border border-white/60 p-8 sm:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
            ChatFlow
          </h1>
          <p className="text-sm text-slate-500">
            Connect with friends and the world
          </p>
        </div>

        <h2 className="text-lg font-semibold text-slate-700 text-center mb-6">
          Create your account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Avatar Upload */}
          <div className="flex justify-center mb-2">
            <label className="relative cursor-pointer group">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-pink-300 group-hover:border-pink-400 transition-all">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaImage className="text-2xl text-pink-400" />
                )}
              </div>
              <div className="absolute bottom-0 right-0 w-7 h-7 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white text-xs font-bold">+</span>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setAvatarFile(file);
                  if (file) {
                    setPreviewUrl(URL.createObjectURL(file));
                  }
                }}
              />
            </label>
          </div>

          {/* Username */}
          <StyledInput
            icon={FaUser}
            type="text"
            placeholder="Username"
            error={errors.username?.message as string}
            {...register("username", {
              required: "Username is required",
              minLength: {
                value: 3,
                message: "Username must be at least 3 characters",
              },
            })}
          />

          {/* Email */}
          <StyledInput
            icon={FaEnvelope}
            type="email"
            placeholder="Email address"
            error={errors.email?.message as string}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />

          {/* Password */}
          <StyledInput
            icon={FaLock}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            error={errors.password?.message as string}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <FaEyeSlash className="text-lg" />
                ) : (
                  <FaEye className="text-lg" />
                )}
              </button>
            }
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />

          {/* Confirm Password */}
          <StyledInput
            icon={FaLock}
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm password"
            error={errors.confirmPassword?.message as string}
            rightElement={
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="focus:outline-none"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <FaEyeSlash className="text-lg" />
                ) : (
                  <FaEye className="text-lg" />
                )}
              </button>
            }
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-400 to-purple-400 text-white font-semibold shadow-lg shadow-pink-200/50 hover:shadow-xl hover:shadow-pink-200/60 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Join ChatFlow
                <FaArrowRight className="text-sm" />
              </>
            )}
          </button>

          {/* Login link */}
          <p className="text-center text-sm text-slate-500 pt-2">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-pink-500 hover:text-pink-600 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400">Made with 🌸</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;