"use client";

import React, { useState } from "react";
import { User, Phone, Calendar, MapPin, Edit2, Save, X, Image as ImageIcon } from "lucide-react";
import { PersonalInformation } from "@/lib/profile/profile-types";
import { FormInput } from "@/components/auth/FormInput";

interface PersonalSectionCardProps {
  personal: PersonalInformation;
  onSave: (data: Partial<PersonalInformation>) => Promise<void>;
}

export function PersonalSectionCard({ personal, onSave }: PersonalSectionCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: personal.name || "",
    phone: personal.phone || "",
    photoUrl: personal.photoUrl || "",
    dateOfBirth: personal.dateOfBirth || "",
    gender: personal.gender || "",
    location: personal.location || "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600" />
          <h2 className="text-base font-bold text-slate-900">Personal Information</h2>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Edit Personal Info"
          >
            <Edit2 className="h-4 w-4" />
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {!isEditing ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-500 block">Full Name</span>
            <span className="font-semibold text-slate-900 text-sm">{personal.name || "Not set"}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Email Address</span>
            <span className="font-semibold text-slate-900 text-sm">{personal.email}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Phone Number</span>
            <span className="font-semibold text-slate-900">{personal.phone || "Not provided"}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Current Location</span>
            <span className="font-semibold text-slate-900">{personal.location || "Not specified"}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Date of Birth</span>
            <span className="font-semibold text-slate-900">{personal.dateOfBirth || "Not specified"}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Gender</span>
            <span className="font-semibold text-slate-900">{personal.gender || "Not specified"}</span>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormInput
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <FormInput
              label="Phone Number"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <FormInput
              label="Profile Photo URL"
              placeholder="https://..."
              value={formData.photoUrl}
              onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
            />
            <FormInput
              label="Current Location"
              placeholder="City, State, Country"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <FormInput
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            />
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:border-blue-600"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 h-9 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 h-9 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm cursor-pointer disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
