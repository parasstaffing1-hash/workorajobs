"use client";

import React, { useState } from "react";
import {
  Briefcase,
  Eye,
  Save,
  Plus,
  Trash2,
  HelpCircle,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { FormInput } from "@/components/auth/FormInput";
import { JobPostInput } from "@/lib/jobs/job-validation-schemas";
import { JobPreviewModal } from "./JobPreviewModal";

interface JobPostFormProps {
  initialValues?: Partial<JobPostInput>;
  companyName?: string;
  isEditing?: boolean;
  onSubmit: (data: JobPostInput, status: string) => Promise<void>;
}

export function JobPostForm({
  initialValues = {},
  companyName = "My Company",
  isEditing = false,
  onSubmit,
}: JobPostFormProps) {
  const [formData, setFormData] = useState<JobPostInput>({
    title: initialValues.title || "",
    department: initialValues.department || "",
    type: initialValues.type || "FULL_TIME",
    workMode: initialValues.workMode || "Remote",
    location: initialValues.location || "San Francisco, CA",
    salaryMin: initialValues.salaryMin || 100000,
    salaryMax: initialValues.salaryMax || 150000,
    salary: initialValues.salary || 150000,
    experience: initialValues.experience || "Mid Level",
    education: initialValues.education || "Bachelor's Degree",
    skillsRequired: initialValues.skillsRequired || ["React", "TypeScript", "Next.js", "Node.js"],
    openingsCount: initialValues.openingsCount || 1,
    noticePeriod: initialValues.noticePeriod || "Immediate",
    benefits: initialValues.benefits || ["Health Insurance", "401(k) Matching", "Remote Work Stipend"],
    description: initialValues.description || "",
    responsibilities: initialValues.responsibilities || "",
    requirements: initialValues.requirements || "",
    screeningQuestions: initialValues.screeningQuestions || [
      { id: "q1", question: "How many years of commercial React/Next.js experience do you have?", required: true },
    ],
    externalApplyUrl: initialValues.externalApplyUrl || "",
    deadlineAt: initialValues.deadlineAt || "",
    scheduledPublishAt: initialValues.scheduledPublishAt || "",
    status: initialValues.status || "PUBLISHED",
  });

  const [newSkill, setNewSkill] = useState("");
  const [newBenefit, setNewBenefit] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: keyof JobPostInput, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    if (!formData.skillsRequired.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, newSkill.trim()],
      }));
    }
    setNewSkill("");
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter((s) => s !== skill),
    }));
  };

  const handleAddBenefit = () => {
    if (!newBenefit.trim()) return;
    setFormData((prev) => ({
      ...prev,
      benefits: [...prev.benefits, newBenefit.trim()],
    }));
    setNewBenefit("");
  };

  const handleRemoveBenefit = (b: string) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((item) => item !== b),
    }));
  };

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) return;
    const qObj = {
      id: `q-${Date.now()}`,
      question: newQuestion.trim(),
      required: true,
    };
    setFormData((prev) => ({
      ...prev,
      screeningQuestions: [...(prev.screeningQuestions || []), qObj],
    }));
    setNewQuestion("");
  };

  const handleRemoveQuestion = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      screeningQuestions: (prev.screeningQuestions || []).filter((q) => q.id !== id),
    }));
  };

  const handleSubmit = async (targetStatus: string) => {
    if (!formData.title.trim()) {
      setError("Please enter a job title.");
      return;
    }
    if (!formData.description.trim()) {
      setError("Please enter a detailed job description.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await onSubmit({ ...formData, status: targetStatus as any }, targetStatus);
    } catch (err: any) {
      setError(err.message || "Error saving job posting.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {isEditing ? "Edit Job Posting" : "Create Enterprise Job Posting"}
          </h2>
          <p className="text-xs text-slate-600">
            Fill in posting details, screening questions, and requirements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 h-10 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <Eye className="h-4 w-4 text-purple-600" />
            <span>Preview Posting</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubmit("DRAFT")}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-4 h-10 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
          >
            <Save className="h-4 w-4 text-amber-600" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubmit("PUBLISHED")}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-5 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 disabled:opacity-60 cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>{isSubmitting ? "Publishing..." : isEditing ? "Save & Publish" : "Publish Job Live"}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Sections */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
        {/* Section 1: Basic Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
            1. Role &amp; Location Overview
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Job Title"
              placeholder="e.g. Senior Full-Stack Engineer"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              required
            />

            <FormInput
              label="Department / Team"
              placeholder="e.g. Engineering / Product"
              value={formData.department || ""}
              onChange={(e) => handleChange("department", e.target.value)}
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Employment Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleChange("type", e.target.value as any)}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-xs font-semibold"
              >
                <option value="FULL_TIME">Full-time</option>
                <option value="PART_TIME">Part-time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="FREELANCE">Freelance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Work Mode
              </label>
              <select
                value={formData.workMode}
                onChange={(e) => handleChange("workMode", e.target.value as any)}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-xs font-semibold"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>

            <FormInput
              label="Location"
              placeholder="e.g. San Francisco, CA or Remote"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              required
            />

            <FormInput
              label="Openings Count"
              type="number"
              value={formData.openingsCount}
              onChange={(e) => handleChange("openingsCount", parseInt(e.target.value, 10))}
            />
          </div>
        </div>

        {/* Section 2: Compensation & Requirements */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
            2. Compensation &amp; Qualifications
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              label="Salary Min ($/year)"
              type="number"
              placeholder="100000"
              value={formData.salaryMin || ""}
              onChange={(e) => handleChange("salaryMin", parseInt(e.target.value, 10))}
            />

            <FormInput
              label="Salary Max ($/year)"
              type="number"
              placeholder="160000"
              value={formData.salaryMax || ""}
              onChange={(e) => handleChange("salaryMax", parseInt(e.target.value, 10))}
            />

            <FormInput
              label="Experience Level"
              placeholder="e.g. Mid-Senior Level (3-5 yrs)"
              value={formData.experience}
              onChange={(e) => handleChange("experience", e.target.value)}
            />
          </div>

          {/* Required Skills Tagging */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Required Skills
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Add skill (e.g. React, Next.js, Python)..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                className="h-9 px-3 rounded-xl border border-slate-300 text-xs flex-1"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 h-9 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Add Skill
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {formData.skillsRequired.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200"
                >
                  <span>{skill}</span>
                  <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-red-600">
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Rich Text Description */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
            3. Job Description, Responsibilities &amp; Requirements
          </h3>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              About the Role (Overview)
            </label>
            <textarea
              rows={5}
              placeholder="Provide a comprehensive summary of the job opportunity and impact..."
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full p-3.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-blue-600"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Key Responsibilities
              </label>
              <textarea
                rows={5}
                placeholder="• Lead architecture design...&#10;• Collaborate with cross-functional teams..."
                value={formData.responsibilities || ""}
                onChange={(e) => handleChange("responsibilities", e.target.value)}
                className="w-full p-3.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-blue-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Requirements &amp; Qualifications
              </label>
              <textarea
                rows={5}
                placeholder="• 4+ years React/TypeScript...&#10;• Strong PostgreSQL knowledge..."
                value={formData.requirements || ""}
                onChange={(e) => handleChange("requirements", e.target.value)}
                className="w-full p-3.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-blue-600 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Screening Questions */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
            4. Applicant Screening Questions
          </h3>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Add custom screening question for applicants..."
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddQuestion();
                }
              }}
              className="h-9 px-3 rounded-xl border border-slate-300 text-xs flex-1"
            />
            <button
              type="button"
              onClick={handleAddQuestion}
              className="px-3 h-9 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              Add Question
            </button>
          </div>

          <div className="space-y-2">
            {(formData.screeningQuestions || []).map((q, idx) => (
              <div key={q.id || idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">{idx + 1}. {q.question}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(q.id)}
                  className="text-slate-400 hover:text-red-600 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Preview Modal */}
      <JobPreviewModal
        job={formData}
        companyName={companyName}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
}
