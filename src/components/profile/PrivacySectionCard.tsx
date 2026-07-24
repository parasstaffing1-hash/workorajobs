"use client";

import React, { useState } from "react";
import { Lock, Eye, ShieldCheck, Check } from "lucide-react";
import { PrivacySettings } from "@/lib/profile/profile-types";

interface PrivacySectionCardProps {
  privacy: PrivacySettings;
  onSave: (data: Partial<PrivacySettings>) => Promise<void>;
}

export function PrivacySectionCard({ privacy, onSave }: PrivacySectionCardProps) {
  const [profileVisibility, setProfileVisibility] = useState<"PUBLIC" | "PRIVATE" | "RECRUITERS_ONLY">(
    privacy.profileVisibility || "PUBLIC"
  );
  const [resumeVisibility, setResumeVisibility] = useState<"PUBLIC" | "PRIVATE" | "APPLIED_ONLY">(
    privacy.resumeVisibility || "PUBLIC"
  );
  const [contactVisibility, setContactVisibility] = useState<"PUBLIC" | "PRIVATE" | "RECRUITERS_ONLY">(
    privacy.contactVisibility || "RECRUITERS_ONLY"
  );

  const [isSaving, setIsSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const handleChangeProfileVis = async (val: "PUBLIC" | "PRIVATE" | "RECRUITERS_ONLY") => {
    setProfileVisibility(val);
    await handleSave({ profileVisibility: val });
  };

  const handleChangeResumeVis = async (val: "PUBLIC" | "PRIVATE" | "APPLIED_ONLY") => {
    setResumeVisibility(val);
    await handleSave({ resumeVisibility: val });
  };

  const handleChangeContactVis = async (val: "PUBLIC" | "PRIVATE" | "RECRUITERS_ONLY") => {
    setContactVisibility(val);
    await handleSave({ contactVisibility: val });
  };

  const handleSave = async (updatedData: Partial<PrivacySettings>) => {
    setIsSaving(true);
    setSavedMsg(false);
    try {
      await onSave(updatedData);
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 2000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-blue-600" />
          <h2 className="text-base font-bold text-slate-900">Privacy &amp; Visibility Controls</h2>
        </div>
        {savedMsg && (
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <Check className="h-3.5 w-3.5" /> Saved
          </span>
        )}
      </div>

      <div className="space-y-4 text-xs">
        {/* Profile Visibility */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 text-sm">Profile Visibility</span>
            <span className="text-slate-500 font-semibold">{profileVisibility}</span>
          </div>
          <p className="text-slate-600">Controls who can search and view your candidate profile.</p>
          <div className="flex gap-2 pt-1">
            {[
              { id: "PUBLIC", label: "Public (All Employers)" },
              { id: "RECRUITERS_ONLY", label: "Verified Recruiters Only" },
              { id: "PRIVATE", label: "Private (Hidden)" },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleChangeProfileVis(option.id as any)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                  profileVisibility === option.id
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Resume Visibility */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 text-sm">Resume Visibility</span>
            <span className="text-slate-500 font-semibold">{resumeVisibility}</span>
          </div>
          <p className="text-slate-600">Who can view or download your uploaded Resume PDF.</p>
          <div className="flex gap-2 pt-1">
            {[
              { id: "PUBLIC", label: "Public" },
              { id: "APPLIED_ONLY", label: "Only Companies I Apply To" },
              { id: "PRIVATE", label: "Private" },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleChangeResumeVis(option.id as any)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                  resumeVisibility === option.id
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contact Visibility */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 text-sm">Contact Info Visibility</span>
            <span className="text-slate-500 font-semibold">{contactVisibility}</span>
          </div>
          <p className="text-slate-600">Controls visibility of your email address and phone number.</p>
          <div className="flex gap-2 pt-1">
            {[
              { id: "RECRUITERS_ONLY", label: "Recruiters Only" },
              { id: "PUBLIC", label: "Public" },
              { id: "PRIVATE", label: "Private" },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleChangeContactVis(option.id as any)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                  contactVisibility === option.id
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
