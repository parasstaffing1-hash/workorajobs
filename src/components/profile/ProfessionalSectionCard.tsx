"use client";

import React, { useState } from "react";
import {
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Globe,
  FolderGit2,
  FileText,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  PlusCircle,
} from "lucide-react";
import { ProfessionalDetails, ExperienceItem, EducationItem, ProjectItem, CertificationItem, LanguageItem } from "@/lib/profile/profile-types";
import { FormInput } from "@/components/auth/FormInput";

interface ProfessionalSectionCardProps {
  professional: ProfessionalDetails;
  onSave: (data: Partial<ProfessionalDetails>) => Promise<void>;
}

export function ProfessionalSectionCard({ professional, onSave }: ProfessionalSectionCardProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "experience" | "education" | "skills" | "projects" | "certifications">("summary");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [headline, setHeadline] = useState(professional.headline || "");
  const [summary, setSummary] = useState(professional.summary || "");
  const [resumeUrl, setResumeUrl] = useState(professional.resumeUrl || "");
  const [skills, setSkills] = useState<string[]>(professional.skills || []);
  const [skillInput, setSkillInput] = useState("");
  const [experiences, setExperiences] = useState<ExperienceItem[]>(professional.experience || []);
  const [educations, setEducations] = useState<EducationItem[]>(professional.education || []);
  const [projects, setProjects] = useState<ProjectItem[]>(professional.projects || []);
  const [certifications, setCertifications] = useState<CertificationItem[]>(professional.certifications || []);
  const [languages, setLanguages] = useState<LanguageItem[]>(professional.languages || []);

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (("key" in e && e.key === "Enter") || e.type === "click") {
      e.preventDefault();
      if (skillInput.trim() && !skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
        setSkillInput("");
      }
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleAddExperience = () => {
    const newItem: ExperienceItem = {
      id: Math.random().toString(36).substring(2, 9),
      title: "Software Engineer",
      company: "Company Name",
      startDate: "2023-01",
      isCurrent: true,
      description: "Described key responsibilities and accomplishments...",
    };
    setExperiences([newItem, ...experiences]);
  };

  const handleAddEducation = () => {
    const newItem: EducationItem = {
      id: Math.random().toString(36).substring(2, 9),
      institution: "University Name",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      startDate: "2019-09",
      endDate: "2023-05",
    };
    setEducations([newItem, ...educations]);
  };

  const handleAddProject = () => {
    const newItem: ProjectItem = {
      id: Math.random().toString(36).substring(2, 9),
      title: "New Project",
      description: "Project description and technical highlights...",
      technologies: ["React", "TypeScript", "Node.js"],
    };
    setProjects([newItem, ...projects]);
  };

  const handleAddCertification = () => {
    const newItem: CertificationItem = {
      id: Math.random().toString(36).substring(2, 9),
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      issueDate: "2024-01",
    };
    setCertifications([newItem, ...certifications]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({
        headline,
        summary,
        resumeUrl,
        skills,
        experience: experiences,
        education: educations,
        projects,
        certifications,
        languages,
      });
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
      {/* Header Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-blue-600" />
          <h2 className="text-base font-bold text-slate-900">Professional Experience &amp; Skills</h2>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <Edit2 className="h-3.5 w-3.5 text-blue-600" />
            <span>Edit Details</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="px-4 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 cursor-pointer disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save All"}
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold border-b border-slate-100 scrollbar-none">
        {[
          { id: "summary", label: "Bio & Resume", icon: FileText },
          { id: "experience", label: `Experience (${experiences.length})`, icon: Briefcase },
          { id: "education", label: `Education (${educations.length})`, icon: GraduationCap },
          { id: "skills", label: `Skills (${skills.length})`, icon: Code },
          { id: "projects", label: `Projects (${projects.length})`, icon: FolderGit2 },
          { id: "certifications", label: `Certifications (${certifications.length})`, icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-blue-50 border-blue-200 text-blue-700 font-bold"
                  : "bg-white border-transparent text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {activeTab === "summary" && (
        <div className="space-y-4 text-xs">
          <div>
            <span className="text-slate-500 block font-semibold mb-1">Headline</span>
            {isEditing ? (
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Senior Full-Stack Engineer | React, Node.js, AWS"
                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-blue-600"
              />
            ) : (
              <p className="font-bold text-slate-900 text-sm">
                {headline || "No headline added yet."}
              </p>
            )}
          </div>

          <div>
            <span className="text-slate-500 block font-semibold mb-1">About / Summary</span>
            {isEditing ? (
              <textarea
                rows={4}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Write a brief background summary of your career accomplishments, technologies, and interests..."
                className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-blue-600"
              />
            ) : (
              <p className="text-slate-700 leading-relaxed">
                {summary || "No summary written yet. Add a brief bio to catch recruiter attention."}
              </p>
            )}
          </div>

          <div>
            <span className="text-slate-500 block font-semibold mb-1">Resume PDF Link</span>
            {isEditing ? (
              <input
                type="text"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="https://drive.google.com/... or cloud storage URL"
                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-blue-600"
              />
            ) : resumeUrl ? (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-blue-600 font-bold hover:underline"
              >
                <FileText className="h-4 w-4" />
                <span>View Uploaded Resume PDF</span>
              </a>
            ) : (
              <p className="text-slate-400 italic">No resume uploaded yet.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === "skills" && (
        <div className="space-y-4 text-xs">
          {isEditing && (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add skill (e.g. Next.js, PostgreSQL, Docker)..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                className="flex-1 h-10 px-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-blue-600"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 h-10 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 cursor-pointer"
              >
                Add Skill
              </button>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 font-bold text-xs"
              >
                {skill}
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-blue-500 hover:text-red-600 cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </span>
            ))}
            {skills.length === 0 && (
              <p className="text-slate-400 italic">No skills added yet.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === "experience" && (
        <div className="space-y-4 text-xs">
          {isEditing && (
            <button
              type="button"
              onClick={handleAddExperience}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-bold border border-blue-200 hover:bg-blue-100 cursor-pointer"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Experience Position</span>
            </button>
          )}

          <div className="space-y-3">
            {experiences.map((exp, idx) => (
              <div key={exp.id || idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                {isEditing ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => {
                        const copy = [...experiences];
                        copy[idx].title = e.target.value;
                        setExperiences(copy);
                      }}
                      className="h-9 px-3 rounded-lg border text-xs"
                      placeholder="Role Title"
                    />
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => {
                        const copy = [...experiences];
                        copy[idx].company = e.target.value;
                        setExperiences(copy);
                      }}
                      className="h-9 px-3 rounded-lg border text-xs"
                      placeholder="Company Name"
                    />
                    <textarea
                      rows={2}
                      value={exp.description}
                      onChange={(e) => {
                        const copy = [...experiences];
                        copy[idx].description = e.target.value;
                        setExperiences(copy);
                      }}
                      className="sm:col-span-2 p-2 rounded-lg border text-xs"
                      placeholder="Key achievements..."
                    />
                    <button
                      type="button"
                      onClick={() => setExperiences(experiences.filter((_, i) => i !== idx))}
                      className="text-red-600 font-semibold flex items-center gap-1 text-xs hover:underline"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove Position
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-sm">{exp.title}</h4>
                      <span className="text-slate-500 font-medium text-[11px]">{exp.startDate} - {exp.endDate || "Present"}</span>
                    </div>
                    <p className="font-semibold text-blue-600">{exp.company}</p>
                    <p className="text-slate-600 mt-1 leading-relaxed">{exp.description}</p>
                  </div>
                )}
              </div>
            ))}
            {experiences.length === 0 && <p className="text-slate-400 italic">No work experience listed.</p>}
          </div>
        </div>
      )}

      {activeTab === "education" && (
        <div className="space-y-4 text-xs">
          {isEditing && (
            <button
              type="button"
              onClick={handleAddEducation}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-bold border border-blue-200 hover:bg-blue-100 cursor-pointer"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Education</span>
            </button>
          )}

          <div className="space-y-3">
            {educations.map((edu, idx) => (
              <div key={edu.id || idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                {isEditing ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => {
                        const copy = [...educations];
                        copy[idx].institution = e.target.value;
                        setEducations(copy);
                      }}
                      className="h-9 px-3 rounded-lg border text-xs"
                      placeholder="University / College"
                    />
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => {
                        const copy = [...educations];
                        copy[idx].degree = e.target.value;
                        setEducations(copy);
                      }}
                      className="h-9 px-3 rounded-lg border text-xs"
                      placeholder="Degree / Major"
                    />
                    <button
                      type="button"
                      onClick={() => setEducations(educations.filter((_, i) => i !== idx))}
                      className="text-red-600 font-semibold flex items-center gap-1 text-xs hover:underline"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove Education
                    </button>
                  </div>
                ) : (
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{edu.degree} - {edu.fieldOfStudy}</h4>
                    <p className="font-semibold text-slate-700">{edu.institution}</p>
                    <span className="text-slate-500 text-[11px]">{edu.startDate} - {edu.endDate || "Present"}</span>
                  </div>
                )}
              </div>
            ))}
            {educations.length === 0 && <p className="text-slate-400 italic">No education history added.</p>}
          </div>
        </div>
      )}

      {activeTab === "projects" && (
        <div className="space-y-4 text-xs">
          {isEditing && (
            <button
              type="button"
              onClick={handleAddProject}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-bold border border-blue-200 hover:bg-blue-100 cursor-pointer"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Project</span>
            </button>
          )}

          <div className="space-y-3">
            {projects.map((proj, idx) => (
              <div key={proj.id || idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={proj.title}
                      onChange={(e) => {
                        const copy = [...projects];
                        copy[idx].title = e.target.value;
                        setProjects(copy);
                      }}
                      className="w-full h-9 px-3 rounded-lg border text-xs"
                      placeholder="Project Title"
                    />
                    <textarea
                      rows={2}
                      value={proj.description}
                      onChange={(e) => {
                        const copy = [...projects];
                        copy[idx].description = e.target.value;
                        setProjects(copy);
                      }}
                      className="w-full p-2 rounded-lg border text-xs"
                      placeholder="Project details..."
                    />
                    <button
                      type="button"
                      onClick={() => setProjects(projects.filter((_, i) => i !== idx))}
                      className="text-red-600 font-semibold text-xs"
                    >
                      Remove Project
                    </button>
                  </div>
                ) : (
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{proj.title}</h4>
                    <p className="text-slate-700 mt-0.5">{proj.description}</p>
                  </div>
                )}
              </div>
            ))}
            {projects.length === 0 && <p className="text-slate-400 italic">No portfolio projects added.</p>}
          </div>
        </div>
      )}

      {activeTab === "certifications" && (
        <div className="space-y-4 text-xs">
          {isEditing && (
            <button
              type="button"
              onClick={handleAddCertification}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-bold border border-blue-200 hover:bg-blue-100 cursor-pointer"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Certification</span>
            </button>
          )}

          <div className="space-y-3">
            {certifications.map((cert, idx) => (
              <div key={cert.id || idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-900 text-sm">{cert.name}</h4>
                <p className="text-slate-600 font-medium">{cert.issuer} ({cert.issueDate})</p>
              </div>
            ))}
            {certifications.length === 0 && <p className="text-slate-400 italic">No certifications added.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
