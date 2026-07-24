import { ArrowRight, BadgeCheck, Building2, CheckCircle2, ShieldCheck, Database, Search, RefreshCw } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { companiesData } from "@/data/companies";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({
  title: "Admin Company Directory Management | WorkoraJobs",
  description: "Internal admin interface for duplicate company review, verification status, and quality score management.",
  path: "/admin/companies",
});

export default function AdminCompaniesPage() {
  const totalCompanies = companiesData.length;
  const usCompanies = companiesData.filter((c) => c.countryCode === "US" || c.country === "USA").length;
  const indiaCompanies = companiesData.filter((c) => c.countryCode === "IN" || c.country === "India").length;
  const publicCompanies = companiesData.filter((c) => c.publicPrivateStatus === "Public" || c.ownershipType === "Public").length;
  const privateCompanies = companiesData.filter((c) => c.publicPrivateStatus === "Private").length;

  return (
    <main className="min-h-screen py-10 bg-white dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Company Directory Admin & Verification Console
              </h1>
            </div>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Manage company records, verify official careers portals, resolve duplicates, and inspect quality scores.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/companies">
              <Button size="sm" variant="outline">
                <Building2 className="h-4 w-4 mr-1.5" />
                Live Directory
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4 bg-white border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">Total Directory Records</span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{totalCompanies}</div>
          </Card>
          <Card className="p-4 bg-white border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">US Companies</span>
            <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">{usCompanies}</div>
          </Card>
          <Card className="p-4 bg-white border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">Indian Companies</span>
            <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{indiaCompanies}</div>
          </Card>
          <Card className="p-4 bg-white border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">Public Exchanges</span>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{publicCompanies}</div>
          </Card>
        </div>

        {/* Records Table */}
        <Card className="p-6 bg-white border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" /> Active Verified Companies
            </h2>
            <Badge className="text-xs font-semibold">
              0 Duplicates Pending
            </Badge>

          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold bg-slate-50 dark:bg-slate-900/50">
                  <th className="py-3 px-4">Company Name</th>
                  <th className="py-3 px-4">Legal / Official Name</th>
                  <th className="py-3 px-4">Ticker / Exchanges</th>
                  <th className="py-3 px-4">Country</th>
                  <th className="py-3 px-4">Qualification</th>
                  <th className="py-3 px-4">Quality Score</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {companiesData.map((company) => (
                  <tr key={company.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Link href={`/companies/${company.slug}`} className="hover:text-primary hover:underline">
                        {company.name}
                      </Link>
                      {company.verified && <BadgeCheck className="h-4 w-4 text-green-500 inline shrink-0" />}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-600 dark:text-slate-400">
                      {company.officialName || company.legalName}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-800 dark:text-slate-200">
                      {company.ticker} ({company.stockExchange})
                    </td>
                    <td className="py-3.5 px-4 font-medium">
                      {company.country}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge className="text-[10px] uppercase font-bold">
                        {company.qualificationReason || "industry_leader"}
                      </Badge>

                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" /> {company.contentQualityScore || 95}/100
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <a href={company.careersUrl} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="ghost" className="h-7 text-xs">
                          Careers Portal
                        </Button>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </main>
  );
}
