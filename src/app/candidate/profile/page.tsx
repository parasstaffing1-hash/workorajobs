"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, UserCheck, ShieldCheck, Sparkles } from "lucide-react";
import { CompleteJobSeekerProfile } from "@/lib/profile/profile-types";
import { calculateProfileCompletion } from "@/lib/profile/profile-completion";
import { ProfileHeaderCard } from "@/components/profile/ProfileHeaderCard";
import { ProfileCompletionWidget } from "@/components/profile/ProfileCompletionWidget";
import { PersonalSectionCard } from "@/components/profile/PersonalSectionCard";
import { ProfessionalSectionCard } from "@/components/profile/ProfessionalSectionCard";
import { PreferencesSectionCard } from "@/components/profile/PreferencesSectionCard";
import { PrivacySectionCard } from "@/components/profile/PrivacySectionCard";
import { AuthAlert } from "@/components/auth/AuthAlert";

export default function CandidateProfilePage() {
  const [profile, setProfile] = useState<CompleteJobSeekerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/candidate/profile");
      const data = await res.json();
      if (data.success && data.profile) {
        setProfile(data.profile);
      } else {
        throw new Error(data.error || "Failed to load candidate profile.");
      }
    } catch (err: any) {
      setAlert({
        type: "error",
        message: err.message || "Error loading candidate profile.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateSection = async (section: "personal" | "professional" | "preferences" | "privacy", data: any) => {
    setAlert(null);
    try {
      const res = await fetch("/api/v1/candidate/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, data }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || "Failed to update profile section.");
      }

      setProfile(result.profile);
      setAlert({
        type: "success",
        message: "Profile section updated successfully!",
      });
      setTimeout(() => setAlert(null), 3000);
    } catch (err: any) {
      setAlert({
        type: "error",
        message: err.message || "Failed to update profile section.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">Loading candidate profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4">
          <AuthAlert type="error" message="Unable to load candidate profile." />
          <button
            onClick={fetchProfile}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  const completionReport = calculateProfileCompletion(profile);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Job Search</span>
          </Link>

          <Link
            href="/candidate/sessions"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Security &amp; Device Sessions</span>
          </Link>
        </div>

        {alert && <AuthAlert type={alert.type} message={alert.message} />}

        {/* Profile Header */}
        <ProfileHeaderCard
          profile={profile}
          onEditClick={() => {
            window.scrollTo({ top: 400, behavior: "smooth" });
          }}
        />

        {/* Grid Layout: Main content + Sidebar Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main 2-Column Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <PersonalSectionCard
              personal={profile.personal}
              onSave={(data) => handleUpdateSection("personal", data)}
            />

            {/* Professional Experience & Skills */}
            <ProfessionalSectionCard
              professional={profile.professional}
              onSave={(data) => handleUpdateSection("professional", data)}
            />

            {/* Career Preferences */}
            <PreferencesSectionCard
              preferences={profile.preferences}
              onSave={(data) => handleUpdateSection("preferences", data)}
            />

            {/* Privacy Controls */}
            <PrivacySectionCard
              privacy={profile.privacy}
              onSave={(data) => handleUpdateSection("privacy", data)}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Completion Progress Widget */}
            <ProfileCompletionWidget
              report={completionReport}
              onFixField={(field) => {
                window.scrollTo({ top: 400, behavior: "smooth" });
              }}
            />

            {/* ATS Match Preview Callout */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white space-y-3 shadow-md shadow-blue-500/20">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-300" />
                <h3 className="text-base font-bold">ATS Resume Match AI</h3>
              </div>
              <p className="text-xs text-blue-100 leading-relaxed">
                Your profile skills and experience are automatically scanned against enterprise job postings to highlight 90%+ matching roles.
              </p>
              <Link
                href="/ats-analyzer"
                className="inline-flex items-center justify-center w-full h-10 rounded-xl bg-white text-blue-700 font-bold text-xs hover:bg-blue-50 transition-colors shadow-sm"
              >
                Run ATS Match Score &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
