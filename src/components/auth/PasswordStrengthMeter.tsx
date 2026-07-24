"use client";

import React from "react";
import { Check, X } from "lucide-react";

interface PasswordStrengthMeterProps {
  password: string;
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  if (!password) return null;

  const rules = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "One uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "One lowercase letter", valid: /[a-z]/.test(password) },
    { label: "One number (0-9)", valid: /[0-9]/.test(password) },
    { label: "One special character (!@#$%^&*)", valid: /[^A-Za-z0-9]/.test(password) },
  ];

  const passedCount = rules.filter((r) => r.valid).length;

  let strengthLabel = "Weak";
  let colorClass = "bg-red-500";
  let textColor = "text-red-600";

  if (passedCount === 5) {
    strengthLabel = "Strong";
    colorClass = "bg-emerald-500";
    textColor = "text-emerald-600";
  } else if (passedCount >= 3) {
    strengthLabel = "Good";
    colorClass = "bg-amber-500";
    textColor = "text-amber-600";
  }

  return (
    <div className="space-y-2 mt-2 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-slate-600">Password Strength:</span>
        <span className={textColor}>{strengthLabel}</span>
      </div>

      {/* Progress Bars */}
      <div className="grid grid-cols-5 gap-1.5 h-1.5 w-full">
        {[1, 2, 3, 4, 5].map((step) => (
          <div
            key={step}
            className={`h-full rounded-full transition-all duration-300 ${
              step <= passedCount ? colorClass : "bg-slate-200"
            }`}
          />
        ))}
      </div>

      {/* Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1">
        {rules.map((rule, idx) => (
          <div key={idx} className="flex items-center gap-1.5 text-[11px]">
            {rule.valid ? (
              <Check className="h-3 w-3 text-emerald-600 shrink-0" />
            ) : (
              <X className="h-3 w-3 text-slate-400 shrink-0" />
            )}
            <span className={rule.valid ? "text-slate-700 font-medium" : "text-slate-400"}>
              {rule.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
