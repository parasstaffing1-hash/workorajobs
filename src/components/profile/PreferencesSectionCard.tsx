"use client";

import React, { useState } from "react";
import { Sliders, Edit2, X, Plus } from "lucide-react";
import { CareerPreferences } from "@/lib/profile/profile-types";

interface PreferencesSectionCardProps {
  preferences: CareerPreferences;
  onSave: (data: Partial<CareerPreferences>) => Promise<void>;
}

export function PreferencesSectionCard({ preferences, onSave }: PreferencesSectionCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [preferredJobTitles, setPreferredJobTitles] = useState<string[]>(
    preferences.preferredJobTitles || []
  );
  const [roleInput, setRoleInput] = useState("");
  const [salaryExpectation, setSalaryExpectation] = useState<number | "">(
    preferences.salaryExpectation || ""
  );
  const [workMode, setWorkMode] = useState<"Remote" | "Hybrid" | "On-site">(
    preferences.workMode || "Remote"
  );
  const [jobType, setJobType] = useState<"Full-time" | "Part-time" | "Contract" | "Internship">(
    preferences.jobType || "Full-time"
  );
  const [noticePeriod, setNoticePeriod] = useState<
    "Immediate" | "15 Days" | "30 Days" | "60 Days" | "90 Days"
  >(preferences.noticePeriod || "Immediate");
  const [willRelocate, setWillRelocate] = useState<boolean>(preferences.willRelocate || false);
  const [preferredLocations, setPreferredLocations] = useState<string[]>(
    preferences.preferredLocations || []
  );
  const [locInput, setLocInput] = useState("");

  const handleAddRole = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (("key" in e && e.key === "Enter") || e.type === "click") {
      e.preventDefault();
      if (roleInput.trim() && !preferredJobTitles.includes(roleInput.trim())) {
        setPreferredJobTitles([...preferredJobTitles, roleInput.trim()]);
        setRoleInput("");
      }
    }
  };

  const handleAddLoc = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (("key" in e && e.key === "Enter") || e.type === "click") {
      e.preventDefault();
      if (locInput.trim() && !preferredLocations.includes(locInput.trim())) {
        setPreferredLocations([...preferredLocations, locInput.trim()]);
        setLocInput("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({
        preferredJobTitles,
        salaryExpectation: salaryExpectation !== "" ? Number(salaryExpectation) : undefined,
        workMode,
        jobType,
        noticePeriod,
        willRelocate,
        preferredLocations,
      });
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="h-5 w-5 text-blue-600" />
          <h2 className="text-base font-bold text-slate-900">Career Preferences</h2>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Edit Preferences"
          >
            <Edit2 className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {!isEditing ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-500 block">Preferred Job Roles</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {preferences.preferredJobTitles.map((role) => (
                <span key={role} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-semibold">
                  {role}
                </span>
              ))}
              {preferences.preferredJobTitles.length === 0 && (
                <span className="text-slate-400 italic">No roles specified</span>
              )}
            </div>
          </div>

          <div>
            <span className="text-slate-500 block">Preferred Locations</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {preferences.preferredLocations.map((loc) => (
                <span key={loc} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-semibold">
                  {loc}
                </span>
              ))}
              {preferences.preferredLocations.length === 0 && (
                <span className="text-slate-400 italic">Any Location / Worldwide</span>
              )}
            </div>
          </div>

          <div>
            <span className="text-slate-500 block">Work Mode</span>
            <span className="font-bold text-slate-900">{preferences.workMode}</span>
          </div>

          <div>
            <span className="text-slate-500 block">Job Type</span>
            <span className="font-bold text-slate-900">{preferences.jobType}</span>
          </div>

          <div>
            <span className="text-slate-500 block">Notice Period</span>
            <span className="font-bold text-slate-900">{preferences.noticePeriod}</span>
          </div>

          <div>
            <span className="text-slate-500 block">Willing to Relocate</span>
            <span className="font-bold text-slate-900">{preferences.willRelocate ? "Yes" : "No"}</span>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-xs">
          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Preferred Job Roles
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="e.g. Frontend Lead, Full Stack Developer..."
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                onKeyDown={handleAddRole}
                className="flex-1 h-9 px-3 rounded-lg border text-xs focus:outline-none focus:border-blue-600"
              />
              <button
                type="button"
                onClick={handleAddRole}
                className="px-3 h-9 rounded-lg bg-slate-900 text-white font-semibold text-xs"
              >
                Add Role
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {preferredJobTitles.map((role) => (
                <span key={role} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 font-bold">
                  {role}
                  <button type="button" onClick={() => setPreferredJobTitles(preferredJobTitles.filter((r) => r !== role))}>
                    <X className="h-3 w-3 text-blue-600 hover:text-red-600" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Work Mode
              </label>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value as any)}
                className="w-full h-10 px-3 rounded-xl border bg-white text-xs focus:outline-none focus:border-blue-600"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Notice Period
              </label>
              <select
                value={noticePeriod}
                onChange={(e) => setNoticePeriod(e.target.value as any)}
                className="w-full h-10 px-3 rounded-xl border bg-white text-xs focus:outline-none focus:border-blue-600"
              >
                <option value="Immediate">Immediate</option>
                <option value="15 Days">15 Days</option>
                <option value="30 Days">30 Days</option>
                <option value="60 Days">60 Days</option>
                <option value="90 Days">90 Days</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Expected Annual Salary ($)
              </label>
              <input
                type="number"
                placeholder="120000"
                value={salaryExpectation}
                onChange={(e) => setSalaryExpectation(e.target.value ? Number(e.target.value) : "")}
                className="w-full h-10 px-3 rounded-xl border text-xs focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Willing to Relocate
              </label>
              <select
                value={willRelocate ? "true" : "false"}
                onChange={(e) => setWillRelocate(e.target.value === "true")}
                className="w-full h-10 px-3 rounded-xl border bg-white text-xs focus:outline-none focus:border-blue-600"
              >
                <option value="true">Yes, willing to relocate</option>
                <option value="false">No, not willing to relocate</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 h-9 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 h-9 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 cursor-pointer disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save Preferences"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
