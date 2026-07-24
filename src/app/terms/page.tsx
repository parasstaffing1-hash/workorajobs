import { Metadata } from "next";
import Link from "next/link";
import { LegalPageLayout, TocItem } from "@/components/legal/LegalPageLayout";
import { FileText, ShieldAlert, Scale, Building2, UserCheck, AlertTriangle, CreditCard, Ban } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | WorkoraJobs",
  description:
    "Read the WorkoraJobs Terms of Service governing use of our recruitment platform, candidate ATS matching, employer job postings, and enterprise subscriptions.",
  alternates: {
    canonical: "https://workorajobs.com/terms",
  },
  openGraph: {
    title: "Terms of Service | WorkoraJobs",
    description:
      "Read the WorkoraJobs Terms of Service governing use of our recruitment platform.",
    url: "https://workorajobs.com/terms",
    siteName: "WorkoraJobs",
    type: "website",
    images: [
      {
        url: "https://workorajobs.com/og-terms.png",
        width: 1200,
        height: 630,
        alt: "WorkoraJobs Terms of Service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | WorkoraJobs",
    description:
      "Read the WorkoraJobs Terms of Service governing use of our recruitment platform.",
    images: ["https://workorajobs.com/og-terms.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const TOC: TocItem[] = [
  { id: "acceptance", title: "Acceptance of Terms" },
  { id: "eligibility", title: "Eligibility Requirements" },
  { id: "user-accounts", title: "User Accounts & Security" },
  { id: "authentication", title: "Google & LinkedIn SSO", badge: "OAuth" },
  { id: "employer-responsibilities", title: "Employer Responsibilities", badge: "Employers" },
  { id: "jobseeker-responsibilities", title: "Job Seeker Responsibilities", badge: "Candidates" },
  { id: "company-profiles", title: "Company Profiles" },
  { id: "job-listings", title: "Job Listings & Applications" },
  { id: "resume-uploads", title: "Resume Uploads & Parsing" },
  { id: "ai-content", title: "AI Content & Match Scores", badge: "AI Engine" },
  { id: "acceptable-use", title: "Acceptable Use & Conduct" },
  { id: "prohibited-activities", title: "Prohibited Activities", badge: "Security" },
  { id: "fraud-prevention", title: "Fraud Prevention" },
  { id: "intellectual-property", title: "Intellectual Property Rights" },
  { id: "user-content", title: "User Generated Content" },
  { id: "subscription-terms", title: "Subscriptions & Payments", badge: "Billing" },
  { id: "refund-policy", title: "Refund & Cancellation Policy" },
  { id: "account-suspension", title: "Suspension & Termination" },
  { id: "limitation-liability", title: "Limitation of Liability" },
  { id: "disclaimer", title: "Warranty Disclaimers" },
  { id: "indemnification", title: "Indemnification" },
  { id: "governing-law", title: "Governing Law & Jurisdiction" },
  { id: "dispute-resolution", title: "Dispute Resolution & Arbitration" },
  { id: "force-majeure", title: "Force Majeure & Severability" },
  { id: "changes-terms", title: "Modifications to Terms" },
  { id: "contact", title: "Legal Contact" },
];

export default function TermsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Terms of Service | WorkoraJobs",
    url: "https://workorajobs.com/terms",
    description: "Read the WorkoraJobs Terms of Service governing use of our recruitment platform.",
    publisher: {
      "@type": "Organization",
      name: "WorkoraJobs Inc.",
      url: "https://workorajobs.com",
      logo: "https://workorajobs.com/logo.png",
    },
    inLanguage: "en-US",
    datePublished: "2024-01-01",
    dateModified: "2026-07-25",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <LegalPageLayout
        title="Terms of Service & Platform Usage Conditions"
        subtitle="These Terms of Service govern your access to and use of the WorkoraJobs staffing platform, candidate application workflows, employer recruitment portals, and API services."
        lastUpdated="July 25, 2026"
        documentType="terms"
        toc={TOC}
      >
        {/* Section 1: Acceptance */}
        <section id="acceptance" className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-mono text-base">1.</span>
            Acceptance of Terms
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            These Terms of Service (&quot;Terms&quot;, &quot;Agreement&quot;) constitute a legally binding contract between you (&quot;User&quot;, &quot;you&quot;, or &quot;your&quot;) and <strong>WorkoraJobs Inc.</strong> (&quot;WorkoraJobs&quot;, &quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
          </p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            By accessing or using our website at <strong>https://workorajobs.com</strong>, creating a candidate or employer account, authenticating via Google or LinkedIn Single Sign-On, uploading resumes, or purchasing hiring subscriptions, you explicitly agree to be bound by these Terms and our <Link href="/privacy" className="text-blue-600 dark:text-blue-400 underline font-semibold">Privacy Policy</Link>.
          </p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            If you do not agree to all terms and conditions set forth herein, you must immediately cease accessing and using the WorkoraJobs Platform.
          </p>
        </section>

        {/* Section 2: Eligibility */}
        <section id="eligibility" className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-mono text-base">2.</span>
            Eligibility Requirements
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            You must be at least 18 years of age (or the legal age of majority in your jurisdiction) to form a binding contract with WorkoraJobs. If you are registering an employer account on behalf of a company, organization, or corporate entity:
          </p>
          <ul className="list-disc pl-5 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
            <li>You represent and warrant that you possess full legal authority to bind that entity to these Terms.</li>
            <li>All references to &quot;you&quot; or &quot;Employer&quot; shall refer to that legal corporate entity.</li>
            <li>You confirm that your organization operates a legitimate corporate business with verifiable hiring authority.</li>
          </ul>
        </section>

        {/* Section 3: User Accounts */}
        <section id="user-accounts" className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-mono text-base">3.</span>
            User Accounts, Passwords & Credentials
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            To access certain features of the Platform (such as applying to jobs, managing candidate ATS pipelines, or posting listings), you must register for an account.
          </p>
          <ul className="list-disc pl-5 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
            <li><strong>Accurate Information:</strong> You agree to provide true, accurate, current, and complete registration information.</li>
            <li><strong>Credential Confidentiality:</strong> You are solely responsible for maintaining the confidentiality of your password and session credentials.</li>
            <li><strong>Account Responsibility:</strong> You are strictly liable for all activities, job applications, or listing postings occurring under your account credentials.</li>
            <li><strong>Unauthorized Access:</strong> You agree to notify us immediately at <a href="mailto:security@workorajobs.com" className="text-blue-600 dark:text-blue-400 underline">security@workorajobs.com</a> if you suspect any unauthorized access or compromise of your account.</li>
          </ul>
        </section>

        {/* Section 4: Single Sign-On (OAuth) */}
        <section id="authentication" className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-mono text-base">4.</span>
            Google Login & LinkedIn Single Sign-On (SSO)
          </h2>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="font-bold text-slate-900 dark:text-white text-xs">Federated Identity Authentication</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              WorkoraJobs permits logging in via Google OAuth and LinkedIn SSO. When authenticating through these providers, you authorize WorkoraJobs to access and store your verified email address, full name, and avatar picture as permitted by the respective provider&apos;s API terms. You remain responsible for maintaining access to your primary Google or LinkedIn identity provider.
            </p>
          </div>
        </section>

        {/* Section 5: Employer Responsibilities */}
        <section id="employer-responsibilities" className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-mono text-base">5.</span>
            Employer Responsibilities & Posting Rules
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            Employers publishing job listings or recruiting candidate applicants through WorkoraJobs warrant and agree that:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white">Bona Fide Job Openings</h4>
              <p className="text-slate-600 dark:text-slate-300">All job listings must represent active, legitimate employment opportunities with clear responsibilities and salary disclosures.</p>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white">Equal Employment Opportunity</h4>
              <p className="text-slate-600 dark:text-slate-300">Listings must comply with EEO laws and must not discriminate based on race, gender, age, religion, disability, or national origin.</p>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white">No Application Fees</h4>
              <p className="text-slate-600 dark:text-slate-300">Employers shall not charge job seekers any fee, training cost, or financial deposit to apply or interview for a job listing.</p>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white">Candidate Privacy Protection</h4>
              <p className="text-slate-600 dark:text-slate-300">Employer recruiters must use candidate resume data strictly for evaluation and hiring for the specific job listing.</p>
            </div>
          </div>
        </section>

        {/* Section 6: Job Seeker Responsibilities */}
        <section id="jobseeker-responsibilities" className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-mono text-base">6.</span>
            Job Seeker Responsibilities
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            Job seekers utilizing WorkoraJobs warrant that all submitted profile data, employment histories, degrees, certifications, work authorization claims, and uploaded resume documents represent true, accurate, and unmanipulated facts. Misrepresentation of identity or credentials may result in immediate account termination.
          </p>
        </section>

        {/* Section 7: Company Profiles */}
        <section id="company-profiles" className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-mono text-base">7.</span>
            Company Profiles & Employer Branding
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            Employers are granted a limited license to create company profile pages. Employers retain ownership of their corporate trademarks, logos, and branding assets uploaded to WorkoraJobs. By uploading corporate assets, Employers grant WorkoraJobs a worldwide, non-exclusive license to display such logos solely in connection with job listings and recruiter branding on the Platform.
          </p>
        </section>

        {/* Section 8: Job Listings & Applications */}
        <section id="job-listings" className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-mono text-base">8.</span>
            Job Listings & Application Processing
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            WorkoraJobs provides matching technology connecting candidate applicants with posted listings. WorkoraJobs is not an employment agency and does not act as an agent for either Job Seekers or Employers. WorkoraJobs does not guarantee that Job Seekers will receive interviews or job offers, nor that Employers will fill posted vacancies.
          </p>
        </section>

        {/* Section 9: Resume Uploads */}
        <section id="resume-uploads" className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-mono text-base">9.</span>
            Resume Uploads & Document Processing
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            When you upload a resume or CV (PDF/DOCX), you grant WorkoraJobs a non-exclusive license to process, parse, store, extract skills, and present your resume data to employers for job applications submitted by you or matching candidate searches.
          </p>
        </section>

        {/* Section 10: AI Content */}
        <section id="ai-content" className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-mono text-base">10.</span>
            AI-Generated Content & Match Score Disclaimers
          </h2>
          <div className="p-4 rounded-xl bg-blue-950/80 text-white space-y-2 border border-blue-800">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-sm">Automated Scoring Disclaimer</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              WorkoraJobs incorporates AI algorithms for ATS resume parsing, skill matching, and candidate ranking scores. These AI metrics represent assistive analytical tools designed to help recruiters organize applications.
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              Match scores do not constitute formal employment evaluations or guarantees of hiring suitability. WorkoraJobs disclaims liability for employment decisions made by employers based on automated match recommendations.
            </p>
          </div>
        </section>

        {/* Section 11: Acceptable Use */}
        <section id="acceptable-use" className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-mono text-base">11.</span>
            Acceptable Use Policy
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            You agree to use the Platform in compliance with all applicable local, state, national, and international laws, regulations, and privacy requirements.
          </p>
        </section>

        {/* Section 12: Prohibited Activities */}
        <section id="prohibited-activities" className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-mono text-base">12.</span>
            Prohibited Activities
          </h2>
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 space-y-2">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <Ban className="w-4 h-4" />
              <h3 className="font-bold text-xs uppercase tracking-wider">Strictly Forbidden Conduct</h3>
            </div>
            <ul className="list-disc pl-5 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
              <li>Scraping, harvesting, or extracting candidate resumes or job listings using automated bots, crawlers, or scrapers without express written consent.</li>
              <li>Publishing fraudulent job postings, multi-level marketing (MLM) schemes, pyramid schemes, or phishing invitations.</li>
              <li>Reverse engineering, decompiling, or attempting to derive source code for WorkoraJobs proprietary algorithms or API endpoints.</li>
              <li>Transmitting malware, ransomware, viruses, or malicious payloads through resume uploads or messaging features.</li>
              <li>Circumventing rate limiters, security controls, or authentication checks.</li>
            </ul>
          </div>
        </section>

        {/* Section 13: Fraud Prevention */}
        <section id="fraud-prevention" className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-mono text-base">13.</span>
            Fraud Prevention & Security Monitoring
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            WorkoraJobs actively monitors API traffic, login patterns, and job posting activity to prevent fraud. We reserve the right to audit company domain ownership, request corporate registration documents, and suspend suspicious employer accounts without prior notice.
          </p>
        </section>

        {/* Section 14: Intellectual Property */}
        <section id="intellectual-property" className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-mono text-base">14.</span>
            Intellectual Property Rights
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            The WorkoraJobs Platform, including its underlying software code, Next.js architecture, design tokens, UI components, database structures, logos, trademarks, and AI scoring algorithms, are the exclusive property of WorkoraJobs Inc. and its licensors, protected by United States and international copyright, trademark, and trade secret laws.
          </p>
        </section>

        {/* Section 15: User Generated Content */}
        <section id="user-content" className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-mono text-base">15.</span>
            User Generated Content
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            You retain ownership of all profile content, job listings, and resume materials you submit to WorkoraJobs. By submitting content, you grant WorkoraJobs a worldwide, royalty-free license to host, display, reformat, and process such content solely to operate the Platform services.
          </p>
        </section>

        {/* Section 16: Subscriptions */}
        <section id="subscription-terms" className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-mono text-base">16.</span>
            Subscription Terms & Payments
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            Employers purchasing job posting credits or enterprise recruitment subscriptions agree to pay all applicable fees specified at checkout. Subscriptions automatically renew at the specified interval (monthly/annually) using your stored payment method until cancelled.
          </p>
        </section>

        {/* Section 17: Refund Policy */}
        <section id="refund-policy" className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-mono text-base">17.</span>
            Refund & Cancellation Policy
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            Subscription cancellations take effect at the end of the current billing cycle. Job posting credits and enterprise subscription fees are non-refundable once listing publication or candidate resume access has been utilized, except where required by law.
          </p>
        </section>

        {/* Section 18: Account Suspension */}
        <section id="account-suspension" className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-mono text-base">18.</span>
            Account Suspension & Termination
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            WorkoraJobs reserves the right to suspend or permanently terminate your account, delete posted job listings, or revoke API access at any time, with or without cause, if you violate these Terms or engage in conduct detrimental to the Platform.
          </p>
        </section>

        {/* Section 19: Limitation of Liability */}
        <section id="limitation-liability" className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-mono text-base">19.</span>
            Limitation of Liability
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL WORKORAJOBS INC., ITS DIRECTORS, OFFICERS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA LOSS, OR BUSINESS INTERRUPTION, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE PLATFORM.
          </p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            OUR TOTAL AGGREGATE LIABILITY FOR ALL CLAIMS ARISING UNDER THESE TERMS SHALL NOT EXCEED THE GREATER OF ONE HUNDRED US DOLLARS ($100.00) OR THE TOTAL AMOUNT PAID BY YOU TO WORKORAJOBS IN THE PRECEDING SIX (6) MONTHS.
          </p>
        </section>

        {/* Section 20: Disclaimer */}
        <section id="disclaimer" className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-mono text-base">20.</span>
            Warranty Disclaimers
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm font-semibold">
            THE WORKORAJOBS PLATFORM IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
          </p>
        </section>

        {/* Section 21: Indemnification */}
        <section id="indemnification" className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-mono text-base">21.</span>
            Indemnification
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            You agree to defend, indemnify, and hold harmless WorkoraJobs Inc. and its affiliates from and against any third-party claims, damages, liabilities, costs, and attorney fees arising from your violation of these Terms or misuse of the Platform.
          </p>
        </section>

        {/* Section 22: Governing Law */}
        <section id="governing-law" className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-mono text-base">22.</span>
            Governing Law & Jurisdiction
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law principles.
          </p>
        </section>

        {/* Section 23: Dispute Resolution */}
        <section id="dispute-resolution" className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-mono text-base">23.</span>
            Dispute Resolution & Binding Arbitration
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            Any dispute or claim arising out of these Terms shall be settled by binding arbitration administered by the American Arbitration Association (AAA) in accordance with its Commercial Arbitration Rules. You agree to resolve all disputes on an individual basis and waive any right to participate in class actions or class-wide arbitration.
          </p>
        </section>

        {/* Section 24: Force Majeure */}
        <section id="force-majeure" className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-mono text-base">24.</span>
            Force Majeure & Severability
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            WorkoraJobs shall not be liable for any failure or delay in performance resulting from events beyond our reasonable control, including internet outages, server host failures, cyberattacks, acts of God, or government regulations. If any provision of these Terms is found invalid, the remaining provisions shall remain in full force and effect.
          </p>
        </section>

        {/* Section 25: Modifications */}
        <section id="changes-terms" className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-mono text-base">25.</span>
            Modifications to Terms
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            We reserve the right to modify these Terms at any time. We will post updated Terms on the Platform with a revised &quot;Last Updated&quot; timestamp. Continued use of the Platform after changes are posted constitutes your acceptance of the revised Terms.
          </p>
        </section>

        {/* Section 26: Contact */}
        <section id="contact" className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-mono text-base">26.</span>
            Contact Legal Department
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            If you have questions or official legal notices regarding these Terms of Service, please contact our legal counsel:
          </p>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 text-xs font-mono text-slate-800 dark:text-slate-200">
            <div><strong className="text-slate-900 dark:text-white">Company:</strong> WorkoraJobs Inc.</div>
            <div><strong className="text-slate-900 dark:text-white">Official Website:</strong> <a href="https://workorajobs.com" className="text-blue-600 dark:text-blue-400 underline">https://workorajobs.com</a></div>
            <div><strong className="text-slate-900 dark:text-white">Legal Email:</strong> <a href="mailto:legal@workorajobs.com" className="text-blue-600 dark:text-blue-400 underline">legal@workorajobs.com</a></div>
            <div><strong className="text-slate-900 dark:text-white">Privacy Office:</strong> <a href="mailto:privacy@workorajobs.com" className="text-blue-600 dark:text-blue-400 underline">privacy@workorajobs.com</a></div>
          </div>
        </section>
      </LegalPageLayout>
    </>
  );
}
