"use client";
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect } from "react";
import {
  Camera,
  Pencil,
  Plus,
  Trash2,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Award,
  Eye,
  TrendingUp,
  Search,
  FileText,
  Globe,
  MapPin,
  Mail,
  Phone,
  ThumbsUp,
  Upload,
  Sparkles,
  Link as LinkIcon
} from "lucide-react";

import { PlatformShell } from "@/components/platform/platform-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import { candidateNav } from "@/data/platform";

// Type definitions
type ProfileInfo = {
  firstName: string;
  lastName: string;
  headline: string;
  location: string;
  bio: string;
  avatar: string;
  connections: string;
  contactEmail: string;
  contactPhone: string;
  preferredJobType: string;
  salaryExpectation: string;
  availability: string;
  portfolioUrl: string;
  linkedinUrl: string;
};

type ExperienceItem = {
  id: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
};

type EducationItem = {
  id: string;
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
};

type SkillItem = {
  id: string;
  name: string;
  endorsements: number;
};

type CertItem = {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
};

export function ProfileClient() {
  // 1. Profile Info State
  const [profile, setProfile] = useState<ProfileInfo>({
    firstName: "Daniel",
    lastName: "Okoro",
    headline: "Senior Product Manager @ Workora | Building SaaS & Global Marketplace Platforms",
    location: "Toronto, Ontario, Canada",
    bio: "Product leader with 5+ years of experience directing product roadmap for recruitment automation, global payroll platforms, and SaaS products. Passionate about building high-trust user journeys and borderless hiring tools.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    connections: "500+ connections",
    contactEmail: "daniel.okoro@example.com",
    contactPhone: "+1 (416) 555-0192",
    preferredJobType: "Full time",
    salaryExpectation: "$145,000",
    availability: "Available in 2 weeks",
    portfolioUrl: "https://danielokoro.example",
    linkedinUrl: "https://linkedin.com/in/daniel-okoro"
  });

  // 2. Experience State
  const [experience, setExperience] = useState<ExperienceItem[]>([
    {
      id: "exp-1",
      role: "Lead Product Manager",
      company: "Workora",
      startDate: "Jul 2024",
      endDate: "Present",
      location: "Toronto, Canada (Hybrid)",
      description: "Directing product roadmap for high-trust recruitment automation platforms and AI-driven candidate matching systems. Collaborating with cross-functional engineering teams to increase hiring speed by 35%."
    },
    {
      id: "exp-2",
      role: "Senior Product Manager",
      company: "Stripe",
      startDate: "Jan 2022",
      endDate: "Jun 2024",
      location: "Remote, US",
      description: "Led the international checkout experience product stream. Scaled payment integration tools and compliance verification structures for 40+ countries."
    }
  ]);

  // 3. Education State
  const [education, setEducation] = useState<EducationItem[]>([
    {
      id: "edu-1",
      school: "University of Toronto",
      degree: "B.Sc. in Computer Science & Business Management",
      startDate: "2017",
      endDate: "2021",
      description: "Graduated with High Distinction. Minored in Economics."
    }
  ]);

  // 4. Skills State
  const [skills, setSkills] = useState<SkillItem[]>([
    { id: "skill-1", name: "Product Strategy", endorsements: 42 },
    { id: "skill-2", name: "SaaS Management", endorsements: 31 },
    { id: "skill-3", name: "User Experience (UX)", endorsements: 27 },
    { id: "skill-4", name: "Agile Methodologies", endorsements: 19 },
    { id: "skill-5", name: "Data Analytics & SQL", endorsements: 15 }
  ]);

  // 5. Certifications State
  const [certs, setCerts] = useState<CertItem[]>([
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      issueDate: "Dec 2025"
    },
    {
      id: "cert-2",
      name: "Certified Scrum Product Owner (CSPO)",
      issuer: "Scrum Alliance",
      issueDate: "May 2024"
    }
  ]);

  // 6. Resume Upload State
  const [uploadedResume, setUploadedResume] = useState<string | null>("Daniel_Okoro_Resume_2026.pdf");
  const [isUploading, setIsUploading] = useState(false);

  // 6a. Privacy & Visibility Settings State
  const [privacySettings, setPrivacySettings] = useState({
    isPublic: true,
    showContact: true,
    showSalary: true,
  });

  // 6b. AI Optimization Loading State
  const [isAiLoading, setIsAiLoading] = useState(false);

  // 6c. Hydration / Mount Tracker for SSR Safety
  const [hasMounted, setHasMounted] = useState(false);

  // Load persistent state from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem("workora_candidate_profile");
    const savedExperience = localStorage.getItem("workora_candidate_experience");
    const savedEducation = localStorage.getItem("workora_candidate_education");
    const savedSkills = localStorage.getItem("workora_candidate_skills");
    const savedCerts = localStorage.getItem("workora_candidate_certs");
    const savedResume = localStorage.getItem("workora_candidate_resume");
    const savedPrivacy = localStorage.getItem("workora_candidate_privacy");

    if (savedProfile) {
      try { setProfile(JSON.parse(savedProfile)); } catch (e) { console.error(e); }
    }
    if (savedExperience) {
      try { setExperience(JSON.parse(savedExperience)); } catch (e) { console.error(e); }
    }
    if (savedEducation) {
      try { setEducation(JSON.parse(savedEducation)); } catch (e) { console.error(e); }
    }
    if (savedSkills) {
      try { setSkills(JSON.parse(savedSkills)); } catch (e) { console.error(e); }
    }
    if (savedCerts) {
      try { setCerts(JSON.parse(savedCerts)); } catch (e) { console.error(e); }
    }
    if (savedResume) {
      setUploadedResume(savedResume);
    }
    if (savedPrivacy) {
      try { setPrivacySettings(JSON.parse(savedPrivacy)); } catch (e) { console.error(e); }
    }
    setHasMounted(true);
  }, []);

  // Sync state changes to localStorage when they occur (excluding initial server render)
  useEffect(() => {
    if (!hasMounted) return;
    localStorage.setItem("workora_candidate_profile", JSON.stringify(profile));
  }, [profile, hasMounted]);

  useEffect(() => {
    if (!hasMounted) return;
    localStorage.setItem("workora_candidate_experience", JSON.stringify(experience));
  }, [experience, hasMounted]);

  useEffect(() => {
    if (!hasMounted) return;
    localStorage.setItem("workora_candidate_education", JSON.stringify(education));
  }, [education, hasMounted]);

  useEffect(() => {
    if (!hasMounted) return;
    localStorage.setItem("workora_candidate_skills", JSON.stringify(skills));
  }, [skills, hasMounted]);

  useEffect(() => {
    if (!hasMounted) return;
    localStorage.setItem("workora_candidate_certs", JSON.stringify(certs));
  }, [certs, hasMounted]);

  useEffect(() => {
    if (!hasMounted) return;
    if (uploadedResume) {
      localStorage.setItem("workora_candidate_resume", uploadedResume);
    } else {
      localStorage.removeItem("workora_candidate_resume");
    }
  }, [uploadedResume, hasMounted]);

  useEffect(() => {
    if (!hasMounted) return;
    localStorage.setItem("workora_candidate_privacy", JSON.stringify(privacySettings));
  }, [privacySettings, hasMounted]);

  // AI Headline Optimizer Handler
  const handleOptimizeHeadline = async () => {
    setIsAiLoading(true);
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Optimize this professional candidate headline for an enterprise jobs platform like LinkedIn. Keep it short, high-impact, and professional (under 120 characters). Return only the raw optimized string without any quotes or wrapper: "${tempProfile.headline || "Product Manager"}"`,
          systemPrompt: "You are a professional HR and resume optimizer assistant. Give a direct concise response."
        })
      });
      const data = await response.json();
      if (data.text) {
        setTempProfile(prev => ({ ...prev, headline: data.text.trim().replace(/^["']|["']$/g, "") }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  // AI Bio Optimizer Handler
  const handleOptimizeBio = async () => {
    setIsAiLoading(true);
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Optimize this professional bio to be extremely result-oriented, highlighting 5+ years of experience, specific skills, and measurable business impact. Keep it under 3-4 sentences (approx 80-100 words). Return only the raw bio text: "${tempProfile.bio || ""}"`,
          systemPrompt: "You are a professional resume executive bio writer."
        })
      });
      const data = await response.json();
      if (data.text) {
        setTempProfile(prev => ({ ...prev, bio: data.text.trim().replace(/^["']|["']$/g, "") }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  // AI Experience Bullet/Description Optimizer Handler
  const handleOptimizeExperience = async () => {
    setIsAiLoading(true);
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Improve the following job experience description to use the result-oriented Google XYZ formula (Accomplished [X] as measured by [Y], by doing [Z]). Keep it professional and under 120 words. Return only the optimized text: "${tempExp.description || ""}"`,
          systemPrompt: "You are a professional ATS resume optimizer."
        })
      });
      const data = await response.json();
      if (data.text) {
        setTempExp(prev => ({ ...prev, description: data.text.trim().replace(/^["']|["']$/g, "") }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Generate Resume with Builder & Redirect Handler
  const handleGenerateResume = () => {
    const builderFormState = {
      name: `${profile.firstName} ${profile.lastName}`,
      targetRole: profile.headline,
      email: profile.contactEmail,
      phone: profile.contactPhone,
      location: profile.location,
      linkedin: profile.linkedinUrl,
      portfolio: profile.portfolioUrl,
      seniority: "Senior",
      years: "5",
      summary: profile.bio,
      targetJob: "",
      experiences: experience.map((exp, idx) => ({
        id: exp.id || `exp-${idx}`,
        title: exp.role,
        company: exp.company,
        location: exp.location,
        startDate: exp.startDate,
        endDate: exp.endDate,
        current: exp.endDate === "Present",
        bullets: exp.description ? exp.description.split(". ").filter(Boolean).map(b => b.trim()) : [],
      })),
      education: education.map((edu, idx) => ({
        id: edu.id || `edu-${idx}`,
        degree: edu.degree,
        institution: edu.school,
        location: "Toronto, Canada",
        year: edu.endDate,
        details: edu.description,
      })),
      projects: [],
      skills: skills.map(s => s.name),
      certifications: certs.map(c => `${c.name} (${c.issuer})`),
      template: "modern",
    };
    localStorage.setItem("workora_cv_builder_state", JSON.stringify(builderFormState));
    window.location.href = "/resume-builder#builder";
  };

  // 7. Modals Open State
  const [activeModal, setActiveModal] = useState<string | null>(null); // "intro" | "about" | "exp" | "edu" | "skill" | "cert"
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // 8. Temp Edit State Buffer
  const [tempProfile, setTempProfile] = useState<ProfileInfo>({ ...profile });
  const [tempExp, setTempExp] = useState<Partial<ExperienceItem>>({});
  const [tempEdu, setTempEdu] = useState<Partial<EducationItem>>({});
  const [tempSkill, setTempSkill] = useState("");
  const [tempCert, setTempCert] = useState<Partial<CertItem>>({});

  // Skill Endorse Handler
  const handleEndorse = (id: string) => {
    setSkills(prev =>
      prev.map(skill =>
        skill.id === id ? { ...skill, endorsements: skill.endorsements + 1 } : skill
      )
    );
  };

  // Resume Upload Handler
  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setIsUploading(true);
    const file = e.target.files[0];
    setTimeout(() => {
      setUploadedResume(file.name);
      setIsUploading(false);
    }, 1500);
  };

  // Open Intro Modal
  const openIntroEdit = () => {
    setTempProfile({ ...profile });
    setActiveModal("intro");
  };

  // Save Intro Info
  const saveIntro = () => {
    setProfile({ ...tempProfile });
    setActiveModal(null);
  };

  // Open About Modal
  const openAboutEdit = () => {
    setTempProfile({ ...profile });
    setActiveModal("about");
  };

  // Save About Info
  const saveAbout = () => {
    setProfile({ ...tempProfile });
    setActiveModal(null);
  };

  // Open Exp Modal (add or edit)
  const openExpEdit = (item?: ExperienceItem) => {
    if (item) {
      setTempExp({ ...item });
      setSelectedItemId(item.id);
    } else {
      setTempExp({
        role: "",
        company: "",
        startDate: "",
        endDate: "",
        location: "",
        description: ""
      });
      setSelectedItemId(null);
    }
    setActiveModal("exp");
  };

  // Save Experience Item
  const saveExperience = () => {
    if (selectedItemId) {
      setExperience(prev =>
        prev.map(item => (item.id === selectedItemId ? (tempExp as ExperienceItem) : item))
      );
    } else {
      const newItem: ExperienceItem = {
        id: `exp-${Date.now()}`,
        role: tempExp.role || "Untitled Role",
        company: tempExp.company || "Unknown Company",
        startDate: tempExp.startDate || "N/A",
        endDate: tempExp.endDate || "Present",
        location: tempExp.location || "Remote",
        description: tempExp.description || ""
      };
      setExperience(prev => [newItem, ...prev]);
    }
    setActiveModal(null);
  };

  // Delete Experience Item
  const deleteExperience = (id: string) => {
    setExperience(prev => prev.filter(item => item.id !== id));
    setActiveModal(null);
  };

  // Open Edu Modal (add or edit)
  const openEduEdit = (item?: EducationItem) => {
    if (item) {
      setTempEdu({ ...item });
      setSelectedItemId(item.id);
    } else {
      setTempEdu({
        school: "",
        degree: "",
        startDate: "",
        endDate: "",
        description: ""
      });
      setSelectedItemId(null);
    }
    setActiveModal("edu");
  };

  // Save Education Item
  const saveEducation = () => {
    if (selectedItemId) {
      setEducation(prev =>
        prev.map(item => (item.id === selectedItemId ? (tempEdu as EducationItem) : item))
      );
    } else {
      const newItem: EducationItem = {
        id: `edu-${Date.now()}`,
        school: tempEdu.school || "Unknown School",
        degree: tempEdu.degree || "Degree",
        startDate: tempEdu.startDate || "N/A",
        endDate: tempEdu.endDate || "N/A",
        description: tempEdu.description || ""
      };
      setEducation(prev => [newItem, ...prev]);
    }
    setActiveModal(null);
  };

  // Delete Education Item
  const deleteEducation = (id: string) => {
    setEducation(prev => prev.filter(item => item.id !== id));
    setActiveModal(null);
  };

  // Open Skill Modal
  const openSkillAdd = () => {
    setTempSkill("");
    setActiveModal("skill");
  };

  // Save Skill
  const saveSkill = () => {
    if (!tempSkill.trim()) return;
    const newItem: SkillItem = {
      id: `skill-${Date.now()}`,
      name: tempSkill.trim(),
      endorsements: 0
    };
    setSkills(prev => [...prev, newItem]);
    setActiveModal(null);
  };

  // Delete Skill
  const deleteSkill = (id: string) => {
    setSkills(prev => prev.filter(item => item.id !== id));
  };

  // Open Cert Modal
  const openCertEdit = (item?: CertItem) => {
    if (item) {
      setTempCert({ ...item });
      setSelectedItemId(item.id);
    } else {
      setTempCert({
        name: "",
        issuer: "",
        issueDate: ""
      });
      setSelectedItemId(null);
    }
    setActiveModal("cert");
  };

  // Save Certification
  const saveCert = () => {
    if (selectedItemId) {
      setCertificates(prev =>
        prev.map(item => (item.id === selectedItemId ? (tempCert as CertItem) : item))
      );
    } else {
      const newItem: CertItem = {
        id: `cert-${Date.now()}`,
        name: tempCert.name || "AWS Certified",
        issuer: tempCert.issuer || "AWS",
        issueDate: tempCert.issueDate || "2026"
      };
      setCertificates(prev => [...prev, newItem]);
    }
    setActiveModal(null);
  };

  // Helper setter for certs
  const setCertificates = (val: CertItem[] | ((prev: CertItem[]) => CertItem[])) => {
    if (typeof val === "function") {
      setCerts(val);
    } else {
      setCerts(val);
    }
  };

  // Delete Certification
  const deleteCert = (id: string) => {
    setCerts(prev => prev.filter(item => item.id !== id));
    setActiveModal(null);
  };

  return (
    <PlatformShell
      badge="Candidate profile"
      description="Interactive high-fidelity profile showcasing details, experience, skills, and credentials matching recruiter standards."
      nav={candidateNav}
      title="Daniel Okoro"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT/MAIN COLUMN (70%) */}
        <div className="lg:col-span-2 space-y-6">

          {/* 1. LINKEDIN COVER & AVATAR CARD */}
          <div className="glass-panel overflow-hidden rounded-lg border border-border/70 shadow-premium relative">
            
            {/* Cover Banner */}
            <div className="h-44 bg-gradient-to-r from-blue-700 via-indigo-600 to-[hsl(var(--violet))] relative">
              <button 
                onClick={openIntroEdit}
                className="absolute right-4 top-4 bg-background/30 hover:bg-background/50 text-white rounded-full p-2 backdrop-blur-md transition-colors"
                title="Edit cover photo"
              >
                <Camera className="h-5 w-5" />
              </button>
            </div>

            {/* Avatar Headshot - overlapping banner */}
            <div className="px-6 pb-6 relative">
              <div className="absolute -top-16 left-6">
                <div className="relative h-32 w-32 rounded-full border-4 border-card bg-secondary overflow-hidden shadow-premium">
                  <img 
                    src={profile.avatar} 
                    alt={`${profile.firstName} ${profile.lastName}`} 
                    className="h-full w-full object-cover"
                  />
                  <button 
                    onClick={openIntroEdit}
                    className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <Camera className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Edit Intro Button */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={openIntroEdit}
                  className="rounded-full border border-border p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  aria-label="Edit intro"
                >
                  <Pencil className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Profile Bio Details */}
              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    {profile.firstName} {profile.lastName}
                  </h2>
                  <span className="text-xs text-muted-foreground font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    1st
                  </span>
                </div>
                <p className="text-base text-foreground mt-1 font-medium leading-normal">
                  {profile.headline}
                </p>
                
                {/* Location and Connections */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.location}</span>
                  </div>
                  <div className="flex items-center gap-1 text-primary font-medium hover:underline cursor-pointer">
                    <span>{profile.connections}</span>
                  </div>
                </div>

                {/* Open To and Actions bar */}
                <div className="flex flex-wrap gap-2.5 mt-5">
                  <Button variant="primary" size="sm" className="rounded-full px-5">
                    Open to work
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full px-5 text-primary border-primary/40 hover:bg-primary/5">
                    Add profile section
                  </Button>
                  <Button variant="secondary" size="sm" className="rounded-full px-5">
                    More
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* 2. ANALYTICS / DASHBOARD CARD */}
          <div className="glass-panel rounded-lg border border-border/70 p-6 shadow-premium">
            <h3 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Analytics
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Private to you</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 pt-2 border-t border-border/50">
              
              <div className="flex items-start gap-3 hover:bg-secondary/40 p-2.5 rounded-lg transition-colors cursor-pointer">
                <Eye className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-lg font-bold">1,420</p>
                  <p className="text-xs font-semibold text-foreground">Profile views</p>
                  <p className="text-[11px] text-green-600 font-medium">▲ 24% past 7 days</p>
                </div>
              </div>

              <div className="flex items-start gap-3 hover:bg-secondary/40 p-2.5 rounded-lg transition-colors cursor-pointer">
                <TrendingUp className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-lg font-bold">3,842</p>
                  <p className="text-xs font-semibold text-foreground">Post impressions</p>
                  <p className="text-[11px] text-green-600 font-medium">▲ 12% past 7 days</p>
                </div>
              </div>

              <div className="flex items-start gap-3 hover:bg-secondary/40 p-2.5 rounded-lg transition-colors cursor-pointer">
                <Search className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-lg font-bold">156</p>
                  <p className="text-xs font-semibold text-foreground">Search appearances</p>
                  <p className="text-[11px] text-green-600 font-medium">▲ 8% past 7 days</p>
                </div>
              </div>

            </div>
          </div>

          {/* 3. ABOUT SECTION */}
          <div className="glass-panel rounded-lg border border-border/70 p-6 shadow-premium relative">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold tracking-tight text-foreground">About</h3>
              <button
                onClick={openAboutEdit}
                className="rounded-full p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                aria-label="Edit about"
              >
                <Pencil className="h-4.5 w-4.5" />
              </button>
            </div>
            <p className="text-sm leading-6 text-muted-foreground mt-3 whitespace-pre-line">
              {profile.bio}
            </p>
          </div>

          {/* 4. EXPERIENCE SECTION */}
          <div className="glass-panel rounded-lg border border-border/70 p-6 shadow-premium">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold tracking-tight text-foreground">Experience</h3>
              <button
                onClick={() => openExpEdit()}
                className="rounded-full p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                aria-label="Add experience"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-6">
              {experience.map((item, idx) => (
                <div key={item.id} className="relative">
                  {idx > 0 && <div className="absolute -top-3 left-6 right-0 border-t border-border/50" />}
                  <div className="flex gap-4 pt-3 items-start">
                    <div className="h-12 w-12 rounded-md bg-secondary flex items-center justify-center shrink-0 border border-border/70 shadow-sm">
                      <Briefcase className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-base font-semibold text-foreground truncate">{item.role}</h4>
                        <button
                          onClick={() => openExpEdit(item)}
                          className="rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0"
                          aria-label="Edit item"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-sm font-medium text-foreground mt-0.5">{item.company}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.startDate} – {item.endDate} · {item.location}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed whitespace-pre-line">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. EDUCATION SECTION */}
          <div className="glass-panel rounded-lg border border-border/70 p-6 shadow-premium">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold tracking-tight text-foreground">Education</h3>
              <button
                onClick={() => openEduEdit()}
                className="rounded-full p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                aria-label="Add education"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-6">
              {education.map((item, idx) => (
                <div key={item.id} className="relative">
                  {idx > 0 && <div className="absolute -top-3 left-6 right-0 border-t border-border/50" />}
                  <div className="flex gap-4 pt-3 items-start">
                    <div className="h-12 w-12 rounded-md bg-secondary flex items-center justify-center shrink-0 border border-border/70 shadow-sm">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-base font-semibold text-foreground truncate">{item.school}</h4>
                        <button
                          onClick={() => openEduEdit(item)}
                          className="rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0"
                          aria-label="Edit education"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-sm font-medium text-foreground mt-0.5">{item.degree}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.startDate} – {item.endDate}
                      </p>
                      {item.description && (
                        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6. SKILLS SECTION */}
          <div className="glass-panel rounded-lg border border-border/70 p-6 shadow-premium">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold tracking-tight text-foreground">Skills</h3>
              <button
                onClick={openSkillAdd}
                className="rounded-full p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                aria-label="Add skill"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
              {skills.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3.5 rounded-lg border border-border/50 bg-secondary/20 hover:bg-secondary/40 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.endorsements} endorsements
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEndorse(item.id)}
                      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white transition-colors"
                    >
                      <ThumbsUp className="h-3 w-3" />
                      Endorse
                    </button>
                    <button
                      onClick={() => deleteSkill(item.id)}
                      className="rounded-full p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      title="Remove skill"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 7. CERTIFICATIONS SECTION */}
          <div className="glass-panel rounded-lg border border-border/70 p-6 shadow-premium">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold tracking-tight text-foreground">Certifications</h3>
              <button
                onClick={() => openCertEdit()}
                className="rounded-full p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                aria-label="Add certification"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {certs.map((item, idx) => (
                <div key={item.id} className="relative">
                  {idx > 0 && <div className="absolute -top-2 left-6 right-0 border-t border-border/50" />}
                  <div className="flex gap-4 pt-2.5 items-start">
                    <div className="h-10 w-10 rounded-md bg-secondary flex items-center justify-center shrink-0 border border-border/70">
                      <Award className="h-5.5 w-5.5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-foreground truncate">{item.name}</h4>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openCertEdit(item)}
                            className="rounded-full p-1 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => deleteCert(item.id)}
                            className="rounded-full p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs font-medium text-foreground mt-0.5">{item.issuer}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Issued {item.issueDate}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (30%) - LinkedIn-style Sidebar widgets */}
        <div className="space-y-6">

          {/* SIDEBAR WIDGET 1: PROFILE STRENGTH */}
          <div className="glass-panel rounded-lg border border-border/70 p-5 shadow-premium">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-foreground">Profile Strength</h4>
              <span className="text-xs font-semibold text-primary flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" />
                Strong
              </span>
            </div>
            
            <div className="mt-3.5">
              <div className="flex justify-between text-xs font-medium mb-1">
                <span>All Star level</span>
                <span>86% completed</span>
              </div>
              <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-[hsl(var(--violet))] rounded-full"
                  style={{ width: "86%" }}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3.5 leading-relaxed">
              Recruiters are <strong>18x more likely</strong> to contact candidates with fully completed experience details.
            </p>
          </div>

          {/* SIDEBAR WIDGET 2: RESUME UPLOADER */}
          <div className="glass-panel rounded-lg border border-border/70 p-5 shadow-premium">
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
              <FileText className="h-4.5 w-4.5 text-primary" />
              Document / Resume
            </h4>
            
            {uploadedResume ? (
              <div className="mt-4 p-3 rounded-lg border border-border bg-secondary/20 relative">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-red-500">PDF</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-foreground truncate">{uploadedResume}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Uploaded Jul 17, 2026</p>
                  </div>
                  <button
                    onClick={() => setUploadedResume(null)}
                    className="rounded-full p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                    title="Delete resume"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 border-2 border-dashed border-border/80 rounded-lg p-5 text-center hover:border-primary/50 transition-colors relative cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={isUploading}
                />
                <Upload className="h-7 w-7 text-muted-foreground mx-auto" />
                <p className="text-xs font-bold text-foreground mt-2">
                  {isUploading ? "Uploading..." : "Upload New Resume"}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">PDF, DOC, DOCX up to 10MB</p>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-muted-foreground">Preferred job type</p>
                <p className="font-semibold text-foreground mt-0.5">{profile.preferredJobType}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Expectation</p>
                <p className="font-semibold text-foreground mt-0.5">{profile.salaryExpectation}</p>
              </div>
              <div className="col-span-2 pt-1">
                <p className="text-muted-foreground">Availability</p>
                <p className="font-semibold text-foreground mt-0.5">{profile.availability}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border/50">
              <button
                onClick={handleGenerateResume}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary hover:bg-primary/90 text-white font-bold text-xs py-2 px-3 transition-colors shadow-sm cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Build & Tailor AI Resume
              </button>
            </div>
          </div>

          {/* SIDEBAR WIDGET 3: PUBLIC LINKS */}
          <div className="glass-panel rounded-lg border border-border/70 p-5 shadow-premium">
            <h4 className="text-sm font-bold text-foreground">Contact & Social</h4>
            <div className="mt-3.5 space-y-3">
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-2 rounded-lg border border-border/40 hover:bg-secondary/40 transition-colors text-xs text-muted-foreground hover:text-primary"
              >
                <LinkIcon className="h-4 w-4 text-primary shrink-0" />
                <span className="truncate">{profile.linkedinUrl}</span>
                <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
              </a>

              <a
                href={profile.portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-2 rounded-lg border border-border/40 hover:bg-secondary/40 transition-colors text-xs text-muted-foreground hover:text-primary"
              >
                <Globe className="h-4 w-4 text-primary shrink-0" />
                <span className="truncate">{profile.portfolioUrl}</span>
                <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
              </a>

              <div className="flex items-center gap-3 p-2 text-xs text-muted-foreground">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="truncate">{profile.contactEmail}</span>
              </div>

              <div className="flex items-center gap-3 p-2 text-xs text-muted-foreground">
                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="truncate">{profile.contactPhone}</span>
              </div>
            </div>
          </div>

          {/* SIDEBAR WIDGET: PRIVACY & VISIBILITY CONTROLS */}
          <div className="glass-panel rounded-lg border border-border/70 p-5 shadow-premium">
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Eye className="h-4.5 w-4.5 text-primary" />
              Privacy & Visibility
            </h4>
            <p className="text-[11px] text-muted-foreground mt-1 leading-normal">
              Manage who can see your professional identity and personal contact details across the Workora platform.
            </p>
            
            <div className="mt-4 space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-foreground">Public Profile Search</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Let recruiters discover you in candidates search</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPrivacySettings(prev => ({ ...prev, isPublic: !prev.isPublic }))}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer ${privacySettings.isPublic ? "bg-primary" : "bg-secondary"}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ease-in-out ${privacySettings.isPublic ? "translate-x-4" : "translate-x-0"}`} />
                </button>
              </div>

              <div className="flex items-center justify-between border-t border-border/40 pt-3">
                <div>
                  <p className="text-xs font-bold text-foreground">Contact Visibility</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Display phone & email details on public profile</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPrivacySettings(prev => ({ ...prev, showContact: !prev.showContact }))}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer ${privacySettings.showContact ? "bg-primary" : "bg-secondary"}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ease-in-out ${privacySettings.showContact ? "translate-x-4" : "translate-x-0"}`} />
                </button>
              </div>

              <div className="flex items-center justify-between border-t border-border/40 pt-3">
                <div>
                  <p className="text-xs font-bold text-foreground">Salary Expectation</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Show target salary details to hiring teams</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPrivacySettings(prev => ({ ...prev, showSalary: !prev.showSalary }))}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer ${privacySettings.showSalary ? "bg-primary" : "bg-secondary"}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ease-in-out ${privacySettings.showSalary ? "translate-x-4" : "translate-x-0"}`} />
                </button>
              </div>
            </div>
          </div>

          {/* SIDEBAR WIDGET 4: PEOPLE ALSO VIEWED */}
          <div className="glass-panel rounded-lg border border-border/70 p-5 shadow-premium">
            <h4 className="text-sm font-bold text-foreground">People also viewed</h4>
            <div className="mt-4 space-y-4">
              
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-secondary overflow-hidden shrink-0 border border-border">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Priya" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-foreground hover:text-primary cursor-pointer truncate">Priya Raman</p>
                  <p className="text-[10px] text-muted-foreground truncate">Staff Backend Engineer · 2nd</p>
                </div>
                <button className="rounded-full px-3 py-1 border border-primary text-[10px] font-bold text-primary hover:bg-primary hover:text-white transition-colors shrink-0">
                  Connect
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-secondary overflow-hidden shrink-0 border border-border">
                  <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80" alt="Elena" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-foreground hover:text-primary cursor-pointer truncate">Elena Garcia</p>
                  <p className="text-[10px] text-muted-foreground truncate">Payroll Operations Lead · 3rd</p>
                </div>
                <button className="rounded-full px-3 py-1 border border-primary text-[10px] font-bold text-primary hover:bg-primary hover:text-white transition-colors shrink-0">
                  Connect
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-secondary overflow-hidden shrink-0 border border-border">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80" alt="Marcus" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-foreground hover:text-primary cursor-pointer truncate">Marcus Lee</p>
                  <p className="text-[10px] text-muted-foreground truncate">Global Payroll Lead · 2nd</p>
                </div>
                <button className="rounded-full px-3 py-1 border border-primary text-[10px] font-bold text-primary hover:bg-primary hover:text-white transition-colors shrink-0">
                  Connect
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* ==================================================== */}
      {/* MODALS SECTION */}
      {/* ==================================================== */}

      {/* 1. INTRO / HEADER DETAILS MODAL */}
      <Modal
        open={activeModal === "intro"}
        title="Edit intro"
        onClose={() => setActiveModal(null)}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">First Name</label>
              <Input
                value={tempProfile.firstName}
                onChange={e => setTempProfile({ ...tempProfile, firstName: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Last Name</label>
              <Input
                value={tempProfile.lastName}
                onChange={e => setTempProfile({ ...tempProfile, lastName: e.target.value })}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-foreground block">Headline</label>
              <button
                type="button"
                onClick={handleOptimizeHeadline}
                disabled={isAiLoading}
                className="flex items-center gap-1 text-[10px] text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 px-2 py-0.5 rounded font-bold transition-colors disabled:opacity-50"
              >
                <Sparkles className="h-3 w-3" />
                {isAiLoading ? "Optimizing..." : "Optimize with AI"}
              </button>
            </div>
            <Input
              value={tempProfile.headline}
              onChange={e => setTempProfile({ ...tempProfile, headline: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">Location</label>
            <Input
              value={tempProfile.location}
              onChange={e => setTempProfile({ ...tempProfile, location: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Preferred Job Type</label>
              <Select
                value={tempProfile.preferredJobType}
                onChange={e => setTempProfile({ ...tempProfile, preferredJobType: e.target.value })}
              >
                <option value="Full time">Full time</option>
                <option value="Contract">Contract</option>
                <option value="Part time">Part time</option>
                <option value="Internship">Internship</option>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Salary Expectation</label>
              <Input
                value={tempProfile.salaryExpectation}
                onChange={e => setTempProfile({ ...tempProfile, salaryExpectation: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Availability</label>
              <Input
                value={tempProfile.availability}
                onChange={e => setTempProfile({ ...tempProfile, availability: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">LinkedIn URL</label>
              <Input
                value={tempProfile.linkedinUrl}
                onChange={e => setTempProfile({ ...tempProfile, linkedinUrl: e.target.value })}
              />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-2.5">
            <Button variant="secondary" type="button" onClick={() => setActiveModal(null)}>Cancel</Button>
            <Button variant="primary" type="button" onClick={saveIntro}>Save</Button>
          </div>
        </div>
      </Modal>

      {/* 2. ABOUT BIO MODAL */}
      <Modal
        open={activeModal === "about"}
        title="Edit about bio"
        onClose={() => setActiveModal(null)}
      >
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-foreground block">Summary</label>
              <button
                type="button"
                onClick={handleOptimizeBio}
                disabled={isAiLoading}
                className="flex items-center gap-1 text-[10px] text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 px-2 py-0.5 rounded font-bold transition-colors disabled:opacity-50"
              >
                <Sparkles className="h-3 w-3" />
                {isAiLoading ? "Optimizing..." : "Optimize with AI"}
              </button>
            </div>
            <Textarea
              className="h-36"
              value={tempProfile.bio}
              onChange={e => setTempProfile({ ...tempProfile, bio: e.target.value })}
            />
          </div>
          <div className="pt-2 flex justify-end gap-2.5">
            <Button variant="secondary" type="button" onClick={() => setActiveModal(null)}>Cancel</Button>
            <Button variant="primary" type="button" onClick={saveAbout}>Save</Button>
          </div>
        </div>
      </Modal>

      {/* 3. EXPERIENCE MODAL */}
      <Modal
        open={activeModal === "exp"}
        title={selectedItemId ? "Edit experience" : "Add experience"}
        onClose={() => setActiveModal(null)}
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">Role / Title</label>
            <Input
              value={tempExp.role || ""}
              onChange={e => setTempExp({ ...tempExp, role: e.target.value })}
              placeholder="e.g. Lead Product Manager"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">Company</label>
            <Input
              value={tempExp.company || ""}
              onChange={e => setTempExp({ ...tempExp, company: e.target.value })}
              placeholder="e.g. Workora"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Start Date</label>
              <Input
                value={tempExp.startDate || ""}
                onChange={e => setTempExp({ ...tempExp, startDate: e.target.value })}
                placeholder="e.g. Jul 2024"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">End Date</label>
              <Input
                value={tempExp.endDate || ""}
                onChange={e => setTempExp({ ...tempExp, endDate: e.target.value })}
                placeholder="e.g. Present"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">Location</label>
            <Input
              value={tempExp.location || ""}
              onChange={e => setTempExp({ ...tempExp, location: e.target.value })}
              placeholder="e.g. Toronto, Canada (Hybrid)"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-foreground block">Description</label>
              <button
                type="button"
                onClick={handleOptimizeExperience}
                disabled={isAiLoading}
                className="flex items-center gap-1 text-[10px] text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 px-2 py-0.5 rounded font-bold transition-colors disabled:opacity-50"
              >
                <Sparkles className="h-3 w-3" />
                {isAiLoading ? "Optimizing..." : "Optimize with AI"}
              </button>
            </div>
            <Textarea
              className="h-28"
              value={tempExp.description || ""}
              onChange={e => setTempExp({ ...tempExp, description: e.target.value })}
              placeholder="Describe your responsibilities and achievements..."
            />
          </div>
          <div className="pt-4 flex justify-between items-center">
            <div>
              {selectedItemId && (
                <button
                  type="button"
                  onClick={() => deleteExperience(selectedItemId)}
                  className="text-xs font-bold text-destructive hover:underline"
                >
                  Delete experience
                </button>
              )}
            </div>
            <div className="flex gap-2.5">
              <Button variant="secondary" type="button" onClick={() => setActiveModal(null)}>Cancel</Button>
              <Button variant="primary" type="button" onClick={saveExperience}>Save</Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* 4. EDUCATION MODAL */}
      <Modal
        open={activeModal === "edu"}
        title={selectedItemId ? "Edit education" : "Add education"}
        onClose={() => setActiveModal(null)}
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">School</label>
            <Input
              value={tempEdu.school || ""}
              onChange={e => setTempEdu({ ...tempEdu, school: e.target.value })}
              placeholder="e.g. University of Toronto"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">Degree / Certification</label>
            <Input
              value={tempEdu.degree || ""}
              onChange={e => setTempEdu({ ...tempEdu, degree: e.target.value })}
              placeholder="e.g. B.Sc. in Computer Science"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Start Date / Year</label>
              <Input
                value={tempEdu.startDate || ""}
                onChange={e => setTempEdu({ ...tempEdu, startDate: e.target.value })}
                placeholder="e.g. 2017"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">End Date / Year (Expected)</label>
              <Input
                value={tempEdu.endDate || ""}
                onChange={e => setTempEdu({ ...tempEdu, endDate: e.target.value })}
                placeholder="e.g. 2021"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">Activities & Description</label>
            <Textarea
              className="h-24"
              value={tempEdu.description || ""}
              onChange={e => setTempEdu({ ...tempEdu, description: e.target.value })}
              placeholder="List clubs, courses or special awards..."
            />
          </div>
          <div className="pt-4 flex justify-between items-center">
            <div>
              {selectedItemId && (
                <button
                  type="button"
                  onClick={() => deleteEducation(selectedItemId)}
                  className="text-xs font-bold text-destructive hover:underline"
                >
                  Delete education
                </button>
              )}
            </div>
            <div className="flex gap-2.5">
              <Button variant="secondary" type="button" onClick={() => setActiveModal(null)}>Cancel</Button>
              <Button variant="primary" type="button" onClick={saveEducation}>Save</Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* 5. ADD SKILL MODAL */}
      <Modal
        open={activeModal === "skill"}
        title="Add skill"
        onClose={() => setActiveModal(null)}
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">Skill Name</label>
            <Input
              value={tempSkill}
              onChange={e => setTempSkill(e.target.value)}
              placeholder="e.g. Growth Marketing, Kubernetes, Next.js"
            />
          </div>
          <div className="pt-2 flex justify-end gap-2.5">
            <Button variant="secondary" type="button" onClick={() => setActiveModal(null)}>Cancel</Button>
            <Button variant="primary" type="button" onClick={saveSkill}>Add</Button>
          </div>
        </div>
      </Modal>

      {/* 6. CERTIFICATION MODAL */}
      <Modal
        open={activeModal === "cert"}
        title={selectedItemId ? "Edit certification" : "Add certification"}
        onClose={() => setActiveModal(null)}
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">Certification Name</label>
            <Input
              value={tempCert.name || ""}
              onChange={e => setTempCert({ ...tempCert, name: e.target.value })}
              placeholder="e.g. AWS Certified Solutions Architect"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">Issuing Organization</label>
            <Input
              value={tempCert.issuer || ""}
              onChange={e => setTempCert({ ...tempCert, issuer: e.target.value })}
              placeholder="e.g. Amazon Web Services"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">Issue Date</label>
            <Input
              value={tempCert.issueDate || ""}
              onChange={e => setTempCert({ ...tempCert, issueDate: e.target.value })}
              placeholder="e.g. Dec 2025"
            />
          </div>
          <div className="pt-4 flex justify-between items-center">
            <div>
              {selectedItemId && (
                <button
                  type="button"
                  onClick={() => deleteCert(selectedItemId)}
                  className="text-xs font-bold text-destructive hover:underline"
                >
                  Delete certification
                </button>
              )}
            </div>
            <div className="flex gap-2.5">
              <Button variant="secondary" type="button" onClick={() => setActiveModal(null)}>Cancel</Button>
              <Button variant="primary" type="button" onClick={saveCert}>Save</Button>
            </div>
          </div>
        </div>
      </Modal>

    </PlatformShell>
  );
}
