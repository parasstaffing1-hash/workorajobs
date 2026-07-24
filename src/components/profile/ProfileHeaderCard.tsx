"use client";

import React from "react";
import {
  MapPin,
  Mail,
  Phone,
  Briefcase,
  Globe,
  Lock,
  Eye,
  Calendar,
  User,
  Edit3,
} from "lucide-react";
import { CompleteJobSeekerProfile } from "@/lib/profile/profile-types";

interface ProfileHeaderCardProps {
  profile: CompleteJobSeekerProfile;
  onEditClick: () => void;
}

export function ProfileHeaderCard({ profile, onEditClick }: ProfileHeaderCardProps) {
  const { personal, professional, preferences, privacy } = profile;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
        {/* Avatar & Main Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          {/* Avatar Photo */}
          <div className="relative shrink-0">
            {personal.photoUrl ? (
              <img
                src={personal.photoUrl}
                alt={personal.name}
                className="w-24 h-24 rounded-full object-cover border-2 border-slate-200 shadow-sm"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-3xl flex items-center justify-center shadow-md shadow-blue-500/20">
                {personal.name ? personal.name.charAt(0).toUpperCase() : "U"}
              </div>
            )}
            <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" title="Active Candidate" />
          </div>

          {/* Details */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-3 justify-center sm:justify-start flex-wrap">
              <h1 className="text-2xl font-bold text-slate-900">{personal.name || "Candidate Name"}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                {privacy.profileVisibility === "PUBLIC"
                  ? "Public Profile"
                  : privacy.profileVisibility === "RECRUITERS_ONLY"
                  ? "Recruiters Only"
                  : "Private Profile"}
              </span>
            </div>

            <p className="text-sm font-semibold text-blue-600">
              {professional.headline || "Add professional headline (e.g. Senior Software Engineer)"}
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap justify-center sm:justify-start pt-1">
              {personal.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  {personal.location}
                </span>
              )}
              {personal.email && (
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  {personal.email}
                </span>
              )}
              {personal.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  {personal.phone}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Edit Action */}
        <button
          onClick={onEditClick}
          className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors shadow-sm cursor-pointer shrink-0 self-center sm:self-start"
        >
          <Edit3 className="h-4 w-4 text-blue-600" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Highlights Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
          <span className="text-slate-500 block text-[11px]">Notice Period</span>
          <span className="font-bold text-slate-900">{preferences.noticePeriod || "Immediate"}</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
          <span className="text-slate-500 block text-[11px]">Work Mode</span>
          <span className="font-bold text-slate-900">{preferences.workMode || "Remote"}</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
          <span className="text-slate-500 block text-[11px]">Job Type</span>
          <span className="font-bold text-slate-900">{preferences.jobType || "Full-time"}</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
          <span className="text-slate-500 block text-[11px]">Expected Salary</span>
          <span className="font-bold text-slate-900">
            {preferences.salaryExpectation ? `$${preferences.salaryExpectation.toLocaleString()}/yr` : "Not specified"}
          </span>
        </div>
      </div>
    </div>
  );
}
