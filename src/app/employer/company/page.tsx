"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  Save,
  ArrowLeft,
  Moon,
  Sun,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { CompanyHeaderCard } from "@/components/company/CompanyHeaderCard";
import { CompanyDetailsSection } from "@/components/company/CompanyDetailsSection";
import { HiringContactsSection } from "@/components/company/HiringContactsSection";
import { CompanyVerificationSection } from "@/components/company/CompanyVerificationSection";
import { SocialLinksSection } from "@/components/company/SocialLinksSection";
import { AuthAlert } from "@/components/auth/AuthAlert";

export default function EmployerCompanyPage() {
  const [company, setCompany] = useState<any>(null);
  const [report, setReport] = useState<any>({ score: 0, level: "Basic Profile", missingItems: [] });
  const [formData, setFormData] = useState<any>({});

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);

  const fetchCompanyData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/employer/company");
      const json = await res.json();
      if (json.success && json.company) {
        setCompany(json.company);
        setReport(json.completion);
        setFormData({
          name: json.company.name || "",
          tagline: json.company.tagline || "",
          description: json.company.description || "",
          logoUrl: json.company.logoUrl || "",
          coverImageUrl: json.company.coverImageUrl || "",
          websiteUrl: json.company.websiteUrl || "",
          careersUrl: json.company.careersUrl || "",
          industry: json.company.industry || "",
          companySize: json.company.employeeRange || json.company.companySize || "11-50 employees",
          foundedYear: json.company.foundedYear || "",
          headquartersCity: json.company.headquartersCity || "",
          headquartersState: json.company.headquartersState || "",
          headquartersCountry: json.company.headquartersCountry || "United States",
          gstNumber: json.company.gstNumber || "",
          cinNumber: json.company.cinNumber || "",
          hiringEmail: json.company.hiringEmail || "",
          hrContactName: json.company.hrContact?.name || "",
          hrContactEmail: json.company.hrContact?.email || "",
          recruiterContactName: json.company.recruiterContact?.name || "",
          linkedinUrl: json.company.linkedinUrl || "",
          twitterUrl: json.company.twitterUrl || "",
          facebookUrl: json.company.facebookUrl || "",
          githubUrl: json.company.githubUrl || "",
        });
      } else {
        throw new Error(json.error || "Failed to load company profile.");
      }
    } catch (err: any) {
      setAlert({ type: "error", message: err.message || "Error loading company profile." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setAlert(null);

    const payload = {
      ...formData,
      hrContact: {
        name: formData.hrContactName,
        email: formData.hrContactEmail,
      },
      recruiterContact: {
        name: formData.recruiterContactName,
      },
    };

    try {
      const res = await fetch("/api/v1/employer/company", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update company profile.");
      }

      setCompany(data.company);
      setReport(data.completion);
      setAlert({ type: "success", message: "Company profile updated successfully!" });
      setTimeout(() => setAlert(null), 3000);
    } catch (err: any) {
      setAlert({ type: "error", message: err.message || "Error saving changes." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 py-8 px-4 sm:px-6 lg:px-8 ${
        isDark ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/employer/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Employer Dashboard</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isDark
                  ? "bg-slate-800 border-slate-700 text-amber-400"
                  : "bg-white border-slate-200 text-slate-700"
              }`}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? "Saving..." : "Save Company Changes"}</span>
            </button>
          </div>
        </div>

        {alert && <AuthAlert type={alert.type} message={alert.message} />}

        {isLoading || !company ? (
          <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500">
            Loading company profile...
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-8">
            {/* Header Banner & Completion Score Card */}
            <CompanyHeaderCard company={company} report={report} isDark={isDark} />

            {/* Overview & Basics */}
            <CompanyDetailsSection formData={formData} onChange={handleChange} isDark={isDark} />

            {/* Hiring & HR Contacts */}
            <HiringContactsSection formData={formData} onChange={handleChange} isDark={isDark} />

            {/* GST & CIN Verification */}
            <CompanyVerificationSection formData={formData} onChange={handleChange} isDark={isDark} />

            {/* Social Links */}
            <SocialLinksSection formData={formData} onChange={handleChange} isDark={isDark} />

            {/* Bottom Save Trigger */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                <span>{isSaving ? "Saving Changes..." : "Save Company Profile"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
