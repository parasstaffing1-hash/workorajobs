"use client";

import React, { useState } from "react";

interface SocialAuthButtonsProps {
  onGoogleClick?: () => void;
  onLinkedInClick?: () => void;
  onGitHubClick?: () => void;
  isLoading?: boolean;
  role?: "JOB_SEEKER" | "EMPLOYER";
}

export function SocialAuthButtons({
  onGoogleClick,
  onLinkedInClick,
  onGitHubClick,
  isLoading = false,
  role = "JOB_SEEKER",
}: SocialAuthButtonsProps) {
  const handleGoogle = () => {
    if (onGoogleClick) {
      onGoogleClick();
    } else {
      window.location.assign(`/api/v1/auth/oauth/google?${new URLSearchParams({ role })}`);
    }
  };

  const handleLinkedIn = () => {
    if (onLinkedInClick) {
      onLinkedInClick();
    } else {
      window.location.assign(`/api/v1/auth/oauth/linkedin?${new URLSearchParams({ role })}`);
    }
  };

  const handleGitHub = () => {
    if (onGitHubClick) {
      onGitHubClick();
    } else {
      window.location.assign(`/api/v1/auth/oauth/github?${new URLSearchParams({ role })}`);
    }
  };

  return (
    <div className="space-y-3 w-full">
      {/* Google Login Button */}
      <button
        type="button"
        onClick={handleGoogle}
        disabled={isLoading}
        className="w-full h-11 flex items-center justify-center gap-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 shadow-sm active:scale-[0.99] disabled:opacity-60 cursor-pointer"
      >
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>Continue with Google</span>
      </button>

      {/* LinkedIn Login Button */}
      <button
        type="button"
        onClick={handleLinkedIn}
        disabled={isLoading}
        className="w-full h-11 flex items-center justify-center gap-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 shadow-sm active:scale-[0.99] disabled:opacity-60 cursor-pointer"
      >
        <svg className="w-5 h-5 shrink-0 fill-[#0A66C2]" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
        <span>Continue with LinkedIn</span>
      </button>

      {/* GitHub Login Button */}
      <button
        type="button"
        onClick={handleGitHub}
        disabled={isLoading}
        className="w-full h-11 flex items-center justify-center gap-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 shadow-sm active:scale-[0.99] disabled:opacity-60 cursor-pointer"
      >
        <svg className="w-5 h-5 shrink-0 fill-slate-900 dark:fill-white" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
        <span>Continue with GitHub</span>
      </button>

      <div className="relative flex items-center justify-center my-6">
        <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
        <span className="bg-white dark:bg-slate-900 px-3 text-xs uppercase font-bold text-slate-400 shrink-0">
          Or continue with email
        </span>
      </div>
    </div>
  );
}
