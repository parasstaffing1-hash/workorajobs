"use client";

import React from "react";
import { Share2 } from "lucide-react";
import { FormInput } from "@/components/auth/FormInput";

interface SocialLinksSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  isDark?: boolean;
}

export function SocialLinksSection({ formData, onChange, isDark = false }: SocialLinksSectionProps) {
  return (
    <div
      className={`rounded-2xl border p-6 shadow-sm space-y-6 ${
        isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
      }`}
    >
      <div className="flex items-center gap-2">
        <Share2 className="h-5 w-5 text-purple-600" />
        <h2 className="text-base font-bold">Official Company Social Pages &amp; Branding</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="LinkedIn Company Page URL"
          placeholder="https://linkedin.com/company/acme"
          value={formData.linkedinUrl || ""}
          onChange={(e) => onChange("linkedinUrl", e.target.value)}
        />

        <FormInput
          label="Twitter / X Profile URL"
          placeholder="https://x.com/acme"
          value={formData.twitterUrl || ""}
          onChange={(e) => onChange("twitterUrl", e.target.value)}
        />

        <FormInput
          label="Facebook Page URL"
          placeholder="https://facebook.com/acme"
          value={formData.facebookUrl || ""}
          onChange={(e) => onChange("facebookUrl", e.target.value)}
        />

        <FormInput
          label="GitHub Tech Org URL"
          placeholder="https://github.com/acme"
          value={formData.githubUrl || ""}
          onChange={(e) => onChange("githubUrl", e.target.value)}
        />
      </div>
    </div>
  );
}
