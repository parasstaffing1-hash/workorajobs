"use client";

import React, { useState } from "react";

interface CompanyLogoProps {
  company: {
    name: string;
    logo?: string;
    logoUrl?: string;
    website?: string;
  };
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function CompanyLogo({ company, className = "h-12 w-12", size = "md" }: CompanyLogoProps) {
  const [fallbackLevel, setFallbackLevel] = useState(0);

  const getDomain = (url?: string) => {
    if (!url) return "";
    try {
      return url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0];
    } catch {
      return "";
    }
  };

  const domain = getDomain(company.website);

  // Generate fallback sources chain
  const getLogoSrc = () => {
    if (fallbackLevel === 0 && company.logoUrl) {
      return company.logoUrl;
    }
    if (fallbackLevel <= 1 && domain) {
      return `https://icon.horse/icon/${domain}`;
    }
    if (fallbackLevel <= 2 && domain) {
      return `https://unavatar.io/${domain}?fallback=false`;
    }
    return null;
  };

  const logoSrc = getLogoSrc();
  const initials = company.logo || company.name.substring(0, 2).toUpperCase();

  if (!logoSrc || fallbackLevel >= 3) {
    return (
      <div
        className={`grid h-full w-full place-items-center rounded-xl bg-gradient-to-br from-primary via-blue-600 to-indigo-700 font-extrabold text-white shadow-sm select-none ${
          size === "sm" ? "text-[10px]" : size === "lg" ? "text-base" : "text-xs"
        }`}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={logoSrc}
      alt={`${company.name} logo`}
      className="h-full w-full object-contain p-1"
      loading="lazy"
      onError={() => {
        setFallbackLevel((prev) => prev + 1);
      }}
    />
  );
}
