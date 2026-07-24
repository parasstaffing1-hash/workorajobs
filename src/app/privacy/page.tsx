import { Metadata } from "next";
import Link from "next/link";
import { LegalPageLayout, TocItem } from "@/components/legal/LegalPageLayout";
import { ShieldCheck, Lock, Cpu, Globe, Server, CheckCircle2, Mail, ExternalLink, Key } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | WorkoraJobs",
  description:
    "Learn how WorkoraJobs collects, uses, protects and processes your personal information for enterprise tech hiring, resume parsing, and authentication.",
  alternates: {
    canonical: "https://workorajobs.com/privacy",
  },
  openGraph: {
    title: "Privacy Policy | WorkoraJobs",
    description:
      "Learn how WorkoraJobs collects, uses, protects and processes your personal information.",
    url: "https://workorajobs.com/privacy",
    siteName: "WorkoraJobs",
    type: "website",
    images: [
      {
        url: "https://workorajobs.com/og-privacy.png",
        width: 1200,
        height: 630,
        alt: "WorkoraJobs Privacy Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | WorkoraJobs",
    description:
      "Learn how WorkoraJobs collects, uses, protects and processes your personal information.",
    images: ["https://workorajobs.com/og-privacy.png"],
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
  { id: "introduction", title: "Introduction & Scope" },
  { id: "definitions", title: "Definitions" },
  { id: "information-collected", title: "Information We Collect", badge: "Core Data" },
  { id: "oauth-authentication", title: "Google & LinkedIn OAuth", badge: "SSO" },
  { id: "tokens-sessions", title: "Tokens, Passwords & Sessions", badge: "Security" },
  { id: "use-of-information", title: "How We Use Information" },
  { id: "ai-automated-processing", title: "AI Features & Parsing", badge: "AI Engine" },
  { id: "communications", title: "Communications & Alerts" },
  { id: "sharing-information", title: "Sharing & Disclosures" },
  { id: "third-party-services", title: "Third-Party Subprocessors", badge: "AWS / Resend" },
  { id: "data-security", title: "Data Security & Encryption" },
  { id: "retention-deletion", title: "Data Retention & Erasure" },
  { id: "gdpr-rights", title: "GDPR Privacy Rights", badge: "EU Rights" },
  { id: "ccpa-rights", title: "CCPA Privacy Rights", badge: "US Rights" },
  { id: "cookies-policy", title: "Cookies & Tracking Policy" },
  { id: "international-transfers", title: "International Data Transfers" },
  { id: "children-privacy", title: "Children's Privacy (16+)" },
  { id: "policy-changes", title: "Changes to Privacy Policy" },
  { id: "contact", title: "Contact Privacy Team" },
];

export default function PrivacyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Privacy Policy | WorkoraJobs",
    url: "https://workorajobs.com/privacy",
    description: "Learn how WorkoraJobs collects, uses, protects and processes your personal information.",
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
        title="Privacy Policy & Data Protection Notice"
        subtitle="WorkoraJobs is committed to enterprise-grade data privacy, transparent personal information handling, resilient infrastructure security, and strict compliance with global privacy regulations."
        lastUpdated="July 25, 2026"
        documentType="privacy"
        toc={TOC}
      >
        {/* Section 1: Introduction */}
        <section id="introduction" className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-mono text-base">1.</span>
            Introduction & Scope
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            Welcome to <strong>WorkoraJobs</strong> (&quot;WorkoraJobs&quot;, &quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). WorkoraJobs operates the enterprise talent marketplace, candidate ATS match systems, and employer hiring platform accessible via <strong>https://workorajobs.com</strong> and associated API services (the &quot;Platform&quot;).
          </p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            This Privacy Policy details our policies and practices regarding the collection, use, processing, storage, encryption, disclosure, and erasure of personal information provided by job seekers, candidate applicants, employer hiring managers, enterprise recruiters, and website visitors.
          </p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            By accessing or using WorkoraJobs, creating an account, uploading a resume/CV, authenticating via Google or LinkedIn Single Sign-On (SSO), or posting job openings, you acknowledge that you have read and understood this Privacy Policy.
          </p>
        </section>

        {/* Section 2: Definitions */}
        <section id="definitions" className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-mono text-base">2.</span>
            Definitions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white">Personal Data / Personal Information</h4>
              <p className="text-slate-600 dark:text-slate-300">Any information that identifies, relates to, describes, or is reasonably capable of being associated with a specific individual.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white">Job Seeker / Candidate</h4>
              <p className="text-slate-600 dark:text-slate-300">An individual registered on the Platform to search for tech careers, upload resumes, and submit job applications.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white">Employer / Recruiter</h4>
              <p className="text-slate-600 dark:text-slate-300">An organization or hiring manager authorized to publish job listings, review candidate applications, and manage recruitment pipelines.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white">OAuth / Single Sign-On (SSO)</h4>
              <p className="text-slate-600 dark:text-slate-300">Federated authentication protocols allowing login via third-party identity providers such as Google and LinkedIn.</p>
            </div>
          </div>
        </section>

        {/* Section 3: Information We Collect */}
        <section id="information-collected" className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-mono text-base">3.</span>
            Information We Collect
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            We collect personal information directly from you when you register, communicate with us, or utilize our staffing services, as well as automatically when you navigate the Platform.
          </p>

          <div className="space-y-3 text-sm">
            <div className="pl-4 border-l-2 border-blue-600 dark:border-blue-400 space-y-1">
              <h3 className="font-bold text-slate-900 dark:text-white">A. Account Information</h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs">Full name, primary email address, normalized lowercase email identifier, encrypted password hashes (bcrypt), user role (JOB_SEEKER, EMPLOYER, ADMIN), profile picture URL, and phone number.</p>
            </div>

            <div className="pl-4 border-l-2 border-blue-600 dark:border-blue-400 space-y-1">
              <h3 className="font-bold text-slate-900 dark:text-white">B. Employer Information</h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs">Company name, official work email domain, company logo, headquarters address, industry sector, company size, corporate website URL, hiring budget preferences, and recruiter contact names.</p>
            </div>

            <div className="pl-4 border-l-2 border-blue-600 dark:border-blue-400 space-y-1">
              <h3 className="font-bold text-slate-900 dark:text-white">C. Job Seeker Profile & Resume/CV Uploads</h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs">Uploaded resume files (PDF, DOCX format), parsed work experience history, education records, programming languages, skill proficiencies, target job titles, preferred salary range, location/remote preferences, work authorization status, portfolio links (GitHub, personal site), and LinkedIn URL.</p>
            </div>

            <div className="pl-4 border-l-2 border-blue-600 dark:border-blue-400 space-y-1">
              <h3 className="font-bold text-slate-900 dark:text-white">D. Payment & Billing Data</h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs">Payment transaction metadata, billing addresses, and invoice histories. Complete credit card numbers are processed directly by our PCI-DSS compliant payment gateway (Stripe) and are never stored on WorkoraJobs servers.</p>
            </div>

            <div className="pl-4 border-l-2 border-blue-600 dark:border-blue-400 space-y-1">
              <h3 className="font-bold text-slate-900 dark:text-white">E. Technical, Device & Analytics Information</h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs">IP address, geolocation (country/city level), browser type, browser version, operating system, device classification (Desktop/Mobile/Tablet), session timestamps, page views, clickstream data, HTTP headers, and referrer URLs.</p>
            </div>
          </div>
        </section>

        {/* Section 4: Google & LinkedIn OAuth */}
        <section id="oauth-authentication" className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-mono text-base">4.</span>
            Google OAuth & LinkedIn Single Sign-On (SSO)
          </h2>
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-3">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Third-Party Identity Provider Compliance</h3>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              WorkoraJobs supports seamless authentication via Google OAuth 2.0 and LinkedIn Developer Platform APIs. When you choose to authenticate using your Google or LinkedIn account:
            </p>
            <ul className="list-disc pl-5 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
              <li><strong>Requested Scopes:</strong> We request only basic identity scopes: <code className="bg-white dark:bg-slate-900 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-800">openid</code>, <code className="bg-white dark:bg-slate-900 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-800">profile</code>, and <code className="bg-white dark:bg-slate-900 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-800">email</code>.</li>
              <li><strong>Data Received:</strong> We receive your unique provider user ID (<code className="bg-white dark:bg-slate-900 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-800">sub</code>), verified email address, full name, and avatar picture URL.</li>
              <li><strong>Google API Services User Data Policy:</strong> WorkoraJobs&apos; use and transfer to any other app of information received from Google APIs will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline font-semibold">Google API Services User Data Policy</a>, including the Limited Use requirements.</li>
              <li><strong>No Unauthorized Access:</strong> We do NOT access your Google Drive, Gmail inbox, Google Contacts, LinkedIn messages, or private social connections.</li>
              <li><strong>Account Unlinking:</strong> You can disconnect your Google or LinkedIn identity from your WorkoraJobs account at any time in Account Settings.</li>
            </ul>
          </div>
        </section>

        {/* Section 5: Tokens, Passwords & Sessions */}
        <section id="tokens-sessions" className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-mono text-base">5.</span>
            Authentication Tokens, Password Reset & Session Management
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            To ensure zero unauthorized access and resilient account protection, WorkoraJobs implements state-of-the-art enterprise authentication primitives:
          </p>
          <ul className="list-disc pl-5 text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <li><strong>Password Hashing:</strong> Plaintext passwords are never stored. All passwords are hashed using <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">bcrypt</code> with 12 salt rounds before database persistence.</li>
            <li><strong>Session Store:</strong> User sessions are stored in PostgreSQL and cached in high-performance Redis nodes with in-process LRU memory acceleration. Session tokens are 64-character cryptographically secure hex strings.</li>
            <li><strong>HTTPOnly Cookies:</strong> Session tokens are transmitted exclusively via secure <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">httpOnly</code>, <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">sameSite=lax</code> cookies marked <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">secure</code> in production environments.</li>
            <li><strong>JWT Access Tokens:</strong> Signed with SHA-256 HMAC utilizing our enterprise secret (<code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">JWT_SECRET</code>) supporting dual-key secret rotation.</li>
            <li><strong>Password Reset & Email Verification:</strong> Tokens generated for password resets or email verification are hashed with SHA-256 before storage and automatically expire after 1 hour (resets) or 24 hours (verification).</li>
          </ul>
        </section>

        {/* Section 6: How We Use Information */}
        <section id="use-of-information" className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-mono text-base">6.</span>
            How We Use Information
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            WorkoraJobs processes personal data exclusively for legitimate business purposes and staffing operations:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Staffing & Application Matching
              </h4>
              <p className="text-slate-600 dark:text-slate-300">Connecting candidates with relevant job opportunities and facilitating recruiter outreach.</p>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                AI Resume Processing
              </h4>
              <p className="text-slate-600 dark:text-slate-300">Extracting skills, generating ATS match scores, and ranking candidate profiles.</p>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Security & Fraud Prevention
              </h4>
              <p className="text-slate-600 dark:text-slate-300">Detecting credential abuse, rate-limiting brute force attacks, and verifying employers.</p>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Platform Communications
              </h4>
              <p className="text-slate-600 dark:text-slate-300">Sending application updates, job alerts, interview invites, and system notices via Resend email infrastructure.</p>
            </div>
          </div>
        </section>

        {/* Section 7: AI Features */}
        <section id="ai-automated-processing" className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-mono text-base">7.</span>
            AI Features & Automated Processing
          </h2>
          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2 border border-slate-800">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-sm">Automated Resume Parsing & Recommendation Engine</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              WorkoraJobs utilizes machine learning models and NLP algorithms to analyze uploaded resumes, compute ATS compatibility scores, and generate automated job recommendations.
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Human Oversight:</strong> Automated ATS scores serve as assistive recommendations for employer hiring managers. WorkoraJobs does not make sole automated decisions regarding hiring, rejection, or employment contracts without human review.
            </p>
          </div>
        </section>

        {/* Section 8: Communications */}
        <section id="communications" className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-mono text-base">8.</span>
            Communications, Email Notifications & Preferences
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            We deliver transactional emails (account verification, password reset, interview requests) and optional communications (weekly staffing digest, custom job alerts).
          </p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            <strong>Managing Preferences:</strong> You may opt out of promotional communications at any time by clicking the &quot;Unsubscribe&quot; link embedded at the bottom of any marketing email or by updating your notification preferences in Account Settings. Essential transactional and security notifications cannot be disabled while maintaining an active account.
          </p>
        </section>

        {/* Section 9: Sharing */}
        <section id="sharing-information" className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-mono text-base">9.</span>
            Sharing of Information
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            We do NOT sell, rent, or trade candidate or employer personal data to data brokers or third-party advertisers. We share information strictly in the following circumstances:
          </p>
          <ul className="list-disc pl-5 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
            <li><strong>With Verified Employers:</strong> When a Job Seeker applies for a job listing, their profile, resume, contact details, and ATS match data are shared with the posting employer.</li>
            <li><strong>With Infrastructure Subprocessors:</strong> Secure transmission to audited cloud partners necessary to deliver our services (see Section 10).</li>
            <li><strong>Legal & Regulatory Compliance:</strong> When required by subpoena, court order, or applicable law to protect the legal rights, safety, and security of WorkoraJobs and its users.</li>
          </ul>
        </section>

        {/* Section 10: Third-Party Subprocessors */}
        <section id="third-party-services" className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-mono text-base">10.</span>
            Third-Party Subprocessors & Infrastructure Services
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            WorkoraJobs contracts with vetted, enterprise-certified third-party subprocessors to host infrastructure, process authentication, and monitor service reliability:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-white font-mono">
                  <th className="p-2.5">Subprocessor</th>
                  <th className="p-2.5">Purpose & Function</th>
                  <th className="p-2.5">Data Shared</th>
                  <th className="p-2.5">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                <tr>
                  <td className="p-2.5 font-bold text-slate-900 dark:text-white">Amazon Web Services (AWS)</td>
                  <td className="p-2.5">Cloud Hosting, RDS PostgreSQL, S3 File Storage</td>
                  <td className="p-2.5">Encrypted User & Resume Data</td>
                  <td className="p-2.5">United States / Global</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-900 dark:text-white">Google Cloud & OAuth</td>
                  <td className="p-2.5">Single Sign-On (SSO) & Identity Verification</td>
                  <td className="p-2.5">Google User ID, Email, Name, Avatar</td>
                  <td className="p-2.5">Global</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-900 dark:text-white">LinkedIn Developer Platform</td>
                  <td className="p-2.5">OAuth SSO & Candidate Profile Integration</td>
                  <td className="p-2.5">LinkedIn Profile ID, Email, Name</td>
                  <td className="p-2.5">Global</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-900 dark:text-white">Resend Inc.</td>
                  <td className="p-2.5">Transactional Email Delivery & Job Alerts</td>
                  <td className="p-2.5">Recipient Email, Name, Notice Content</td>
                  <td className="p-2.5">United States</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-900 dark:text-white">Cloudflare Inc.</td>
                  <td className="p-2.5">CDN Cache, DNS, WAF Security & DDoS Shield</td>
                  <td className="p-2.5">IP Address, Request Traffic Metadata</td>
                  <td className="p-2.5">Global Edge Network</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-900 dark:text-white">Stripe Inc.</td>
                  <td className="p-2.5">Payment Processing & Subscription Billing</td>
                  <td className="p-2.5">Billing Name, Address, Payment Token</td>
                  <td className="p-2.5">United States / Global</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 11: Data Security */}
        <section id="data-security" className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-mono text-base">11.</span>
            Data Security, Infrastructure & Encryption
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            WorkoraJobs maintains robust administrative, technical, and physical safeguards designed to ensure the confidentiality, integrity, and availability of personal information:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
              <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h4 className="font-bold text-slate-900 dark:text-white">Encryption Standards</h4>
              <p className="text-slate-600 dark:text-slate-300">TLS 1.3 encryption in transit; AES-256 encryption at rest for database and S3 storage.</p>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h4 className="font-bold text-slate-900 dark:text-white">Role-Based Access (RBAC)</h4>
              <p className="text-slate-600 dark:text-slate-300">Strict least-privilege access control protecting database models and administrative tools.</p>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
              <Server className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h4 className="font-bold text-slate-900 dark:text-white">WAF & DDoS Defense</h4>
              <p className="text-slate-600 dark:text-slate-300">Cloudflare Web Application Firewall and rate limiting guarding API endpoints.</p>
            </div>
          </div>
        </section>

        {/* Section 12: Retention & Erasure */}
        <section id="retention-deletion" className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-mono text-base">12.</span>
            Data Retention & Account Erasure
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            We retain personal data for as long as your account remains active or as needed to provide staffing services. If you delete your account (via <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">POST /api/v1/auth/delete-account</code>), your personal profile, uploaded resumes, and active sessions will be permanently purged from production databases within 30 days, except where retention is required by law.
          </p>
        </section>

        {/* Section 13: GDPR */}
        <section id="gdpr-rights" className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-mono text-base">13.</span>
            European Union Privacy Rights (GDPR)
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            If you reside in the European Economic Area (EEA), United Kingdom, or Switzerland, you possess specific data subject rights under the General Data Protection Regulation (GDPR):
          </p>
          <ul className="list-disc pl-5 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
            <li><strong>Right of Access:</strong> Request a copy of your personal data processed by WorkoraJobs.</li>
            <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete profile information.</li>
            <li><strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> Request permanent deletion of your personal records.</li>
            <li><strong>Right to Data Portability:</strong> Obtain your profile and resume data in a structured, machine-readable JSON format.</li>
            <li><strong>Right to Object & Restrict Processing:</strong> Object to automated processing or direct marketing communications.</li>
          </ul>
        </section>

        {/* Section 14: CCPA */}
        <section id="ccpa-rights" className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-mono text-base">14.</span>
            California Consumer Privacy Act (CCPA / CPRA)
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            Under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA), California residents have the right to know what personal information we collect, request deletion of their personal information, opt out of the sale or sharing of personal information, and receive non-discriminatory service for exercising their rights.
          </p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            <strong>No Sale of Personal Data:</strong> WorkoraJobs has not sold any personal information to third parties in the preceding 12 months.
          </p>
        </section>

        {/* Section 15: Cookies */}
        <section id="cookies-policy" className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-mono text-base">15.</span>
            Cookies & Tracking Technologies
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            WorkoraJobs uses essential cookies, authentication cookies (<code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">sessionToken</code>), preference cookies, and security tokens to maintain active sessions and protect forms against Cross-Site Request Forgery (CSRF). You can manage cookie settings in your web browser.
          </p>
        </section>

        {/* Section 16: International Transfers */}
        <section id="international-transfers" className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-mono text-base">16.</span>
            International Data Transfers
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            WorkoraJobs is headquartered in the United States. Personal data collected globally may be transferred to, stored, and processed in AWS data centers located in the United States. For cross-border data transfers from the EEA or UK, we rely on Standard Contractual Clauses (SCCs) approved by the European Commission.
          </p>
        </section>

        {/* Section 17: Children */}
        <section id="children-privacy" className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-mono text-base">17.</span>
            Children&apos;s Privacy (Minimum Age 16+)
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            WorkoraJobs is an enterprise staffing portal designed for professional job seekers and employers. The Platform is strictly prohibited for individuals under 16 years of age. We do not knowingly collect personal data from children under 16.
          </p>
        </section>

        {/* Section 18: Changes */}
        <section id="policy-changes" className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-mono text-base">18.</span>
            Changes to This Privacy Policy
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            We may update this Privacy Policy periodically to reflect changes in our legal obligations or platform features. We will notify users of material changes by posting an update banner on the Platform or sending an email notification prior to the change taking effect.
          </p>
        </section>

        {/* Section 19: Contact */}
        <section id="contact" className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-mono text-base">19.</span>
            Contact Privacy Officer
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            If you have any questions, requests, or privacy concerns regarding this Privacy Policy or wish to exercise your GDPR/CCPA rights, please contact our Data Protection Office:
          </p>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 text-xs font-mono text-slate-800 dark:text-slate-200">
            <div><strong className="text-slate-900 dark:text-white">Company:</strong> WorkoraJobs Inc.</div>
            <div><strong className="text-slate-900 dark:text-white">Official Website:</strong> <a href="https://workorajobs.com" className="text-blue-600 dark:text-blue-400 underline">https://workorajobs.com</a></div>
            <div><strong className="text-slate-900 dark:text-white">Privacy Email:</strong> <a href="mailto:privacy@workorajobs.com" className="text-blue-600 dark:text-blue-400 underline">privacy@workorajobs.com</a></div>
            <div><strong className="text-slate-900 dark:text-white">General Legal:</strong> <a href="mailto:legal@workorajobs.com" className="text-blue-600 dark:text-blue-400 underline">legal@workorajobs.com</a></div>
          </div>
        </section>
      </LegalPageLayout>
    </>
  );
}
