"use client";

import React, { useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  isPassword?: boolean;
  helperText?: string;
}

export function FormInput({
  label,
  error,
  isPassword = false,
  helperText,
  id,
  className = "",
  ...props
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || props.name || Math.random().toString(36).substring(2, 9);
  const inputType = isPassword ? (showPassword ? "text" : "password") : props.type || "text";

  return (
    <div className="space-y-1.5 w-full">
      <div className="flex items-center justify-between">
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
        >
          {label}
        </label>
      </div>

      <div className="relative rounded-xl shadow-sm">
        <input
          id={inputId}
          type={inputType}
          className={`w-full h-11 px-3.5 rounded-xl border bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
              : "border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-blue-600/20"
          } ${isPassword ? "pr-10" : ""} ${className}`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 focus:outline-none cursor-pointer"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>

      {error ? (
        <div className="flex items-center gap-1.5 text-xs font-medium text-red-600 mt-1">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : helperText ? (
        <p className="text-xs text-slate-500 mt-1">{helperText}</p>
      ) : null}
    </div>
  );
}
