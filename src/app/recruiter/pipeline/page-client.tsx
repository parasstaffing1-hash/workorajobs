"use client";

import { useState, useEffect } from "react";
import { 
  ArrowRight, 
  Search, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  UserPlus, 
  Star, 
  Tag, 
  FileText, 
  Clock, 
  AlertTriangle, 
  Play, 
  SlidersHorizontal, 
  Briefcase, 
  User, 
  ClipboardList, 
  X, 
  Activity, 
  Edit, 
  MoreVertical,
  Check,
  Send,
  Loader2,
  GitBranch,
  Settings,
  Flame,
  PieChart,
  UserCheck
} from "lucide-react";

import { PlatformShell } from "@/components/platform/platform-shell";
import { WorkflowCard } from "@/components/platform/workflow-card";
import { Button } from "@/components/ui/button";
import { recruiterNav } from "@/data/platform";


// Initial Candidates Data mapping closely to the system
interface Candidate {
  id: string;
  name: string;
  headline: string;
  location: string;
  match: string;
  matchScore: number;
  stage: string;
  tags: string[];
  email: string;
  phone: string;
  rating: number;
  expectedSalary: string;
  availableFrom: string;
  assignedRecruiter: string;
  assignedManager: string;
  timeInStage: number; // in days
  slaDays: number; // SLA threshold
  resumeText: string;
  coverLetter: string;
  strengths: string[];
  weaknesses: string[];
  notes: string[];
  tasks: { id: string; title: string; due: string; done: boolean }[];
  screeningAnswers: { question: string; answer: string; isKnockout?: boolean; failedKnockout?: boolean }[];
  timeline: { event: string; date: string; user: string }[];
}

const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: "cand-101",
    name: "Daniel Okoro",
    headline: "Senior Product Manager",
    location: "Toronto, Canada",
    match: "78%",
    matchScore: 78,
    stage: "Applied",
    tags: ["High intent", "Product systems", "Enterprise"],
    email: "daniel.okoro@workora.com",
    phone: "+1 (416) 555-0192",
    rating: 4,
    expectedSalary: "$135,000",
    availableFrom: "Immediate",
    assignedRecruiter: "Elena Ruiz",
    assignedManager: "Amara Stone",
    timeInStage: 2,
    slaDays: 3,
    resumeText: "Experienced Senior Product Manager with 8+ years leading cross-functional teams in SaaS, fintech, and platform scaling. Owned core payroll engines, scaled product throughput by 40%, and launched multi-currency workspace features globally. Expert in SQL, agile planning, and enterprise integrations.",
    coverLetter: "I have been following Workora's impressive growth in enterprise hiring. With my experience scaling product engines, I am excited to apply for your senior product role.",
    strengths: ["Enterprise scaling experience", "Strong technical background", "SQL & data analytics"],
    weaknesses: ["Has not managed massive visual design redesigns directly"],
    notes: ["Great first impression. Friendly and very structured in communication."],
    tasks: [
      { id: "task-1", title: "Schedule screening call", due: "July 21, 2026", done: false }
    ],
    screeningAnswers: [
      { question: "Do you have 5+ years of Product Management experience?", answer: "Yes", isKnockout: true, failedKnockout: false },
      { question: "Are you legally authorized to work in Canada?", answer: "Yes", isKnockout: true, failedKnockout: false },
      { question: "What is your expected annual salary?", answer: "$135,000", isKnockout: false }
    ],
    timeline: [
      { event: "Application submitted", date: "July 17, 2026 10:32 UTC", user: "System" },
      { event: "Resume automatically parsed & matching score computed (78%)", date: "July 17, 2026 10:33 UTC", user: "AI Engine" }
    ]
  },
  {
    id: "cand-102",
    name: "Priya Raman",
    headline: "Staff Backend Engineer",
    location: "Bengaluru, India",
    match: "91%",
    matchScore: 91,
    stage: "Interview",
    tags: ["Cloud", "Distributed systems", "Go", "Prisma"],
    email: "priya.raman@workora.com",
    phone: "+91 98765 43210",
    rating: 5,
    expectedSalary: "$120,000 (INR equiv)",
    availableFrom: "30 Days Notice",
    assignedRecruiter: "Elena Ruiz",
    assignedManager: "Amara Stone",
    timeInStage: 4,
    slaDays: 3,
    resumeText: "Staff Engineer specializing in distributed databases, low-latency microservices, and Kubernetes clusters. Designed an asynchronous job queue processing 12M application triggers daily. Proficient in Go, Node.js, PostgreSQL, Kafka, and telemetry instrumentation.",
    coverLetter: "Scaling robust API architectures is my passion. The enterprise hiring volume Workora is handling is an engineering challenge I'd love to contribute to.",
    strengths: ["Exceptional technical depth", "Distributed systems engineering", "Self-starter attitude"],
    weaknesses: ["Prefers pure backend over full-stack responsibilities"],
    notes: ["Highly recommended. Scoring 9.5/10 on the backend matching rubric."],
    tasks: [
      { id: "task-2", title: "Review coding challenge artifact", due: "July 20, 2026", done: true }
    ],
    screeningAnswers: [
      { question: "Do you have professional experience with Go or Node.js?", answer: "Yes", isKnockout: true, failedKnockout: false },
      { question: "Will you require relocation assistance?", answer: "No", isKnockout: false }
    ],
    timeline: [
      { event: "Application submitted", date: "July 15, 2026 08:14 UTC", user: "System" },
      { event: "Resume matched with Staff Backend Engineer profile (91%)", date: "July 15, 2026 08:15 UTC", user: "AI Engine" },
      { event: "Moved from Screening to Resume Review", date: "July 16, 2026 11:20 UTC", user: "Elena Ruiz" },
      { event: "Moved from Resume Review to Interview", date: "July 17, 2026 14:15 UTC", user: "Elena Ruiz" }
    ]
  },
  {
    id: "cand-103",
    name: "Marcus Lee",
    headline: "Global Payroll Lead",
    location: "Singapore",
    match: "84%",
    matchScore: 84,
    stage: "Offer",
    tags: ["Payroll", "APAC", "Compliance"],
    email: "marcus.lee@workora.com",
    phone: "+65 6123 4567",
    rating: 4,
    expectedSalary: "$110,000 SGD",
    availableFrom: "Immediate",
    assignedRecruiter: "Elena Ruiz",
    assignedManager: "Amara Stone",
    timeInStage: 1,
    slaDays: 5,
    resumeText: "International Payroll and compliance officer with 10+ years handling multi-state corporate entities across APAC and EMEA. Managed cross-border compliance structures for over 3,000 contractors in compliance with regional tax codes.",
    coverLetter: "Managing complex payroll pipelines requires extreme rigor. My background matches your Global Payroll Operations Lead job description closely.",
    strengths: ["In-depth international tax and APAC compliance knowledge", "Excellent communication with executives"],
    weaknesses: ["Limited developer-facing SaaS tooling exposure"],
    notes: ["Offer letter draft complete. Waiting for hiring manager signoff."],
    tasks: [
      { id: "task-3", title: "Finalize written offer draft", due: "July 19, 2026", done: true }
    ],
    screeningAnswers: [
      { question: "Do you have APAC compliance experience?", answer: "Yes", isKnockout: true, failedKnockout: false },
      { question: "Are you willing to work in Singapore timezone?", answer: "Yes", isKnockout: true, failedKnockout: false }
    ],
    timeline: [
      { event: "Application submitted", date: "July 10, 2026 09:00 UTC", user: "System" },
      { event: "Moved through screening to Interview", date: "July 12, 2026 15:00 UTC", user: "Elena Ruiz" },
      { event: "Final interview completed with positive signals", date: "July 18, 2026 16:30 UTC", user: "Amara Stone" },
      { event: "Moved to Offer stage", date: "July 19, 2026 08:30 UTC", user: "Elena Ruiz" }
    ]
  },
  {
    id: "cand-104",
    name: "Sarah Jenkins",
    headline: "Senior Cloud Solutions Architect",
    location: "Seattle, USA",
    match: "95%",
    matchScore: 95,
    stage: "Screening",
    tags: ["AWS", "SSO", "Security", "SLA"],
    email: "sarah.jenkins@workora.com",
    phone: "+1 (206) 555-3344",
    rating: 5,
    expectedSalary: "$180,000",
    availableFrom: "Immediate",
    assignedRecruiter: "Elena Ruiz",
    assignedManager: "Amara Stone",
    timeInStage: 5,
    slaDays: 2, // SLA warning active
    resumeText: "AWS Certified Solutions Architect (Professional). 12 years building scalable, reliable AWS infrastructure. Managed migrations of enterprise-scale microservices, designed identity federation using Okta/SAML, and implemented zero-trust networks.",
    coverLetter: "I'd love to help design and secure the AWS cloud environment for Workora's high-volume operations.",
    strengths: ["AWS Professional certified", "Enterprise security expertise"],
    weaknesses: ["Has not worked directly with PostgreSQL scale-to-zero configurations"],
    notes: ["High priority candidate. Move to Interview ASAP."],
    tasks: [],
    screeningAnswers: [
      { question: "Do you hold an AWS professional certification?", answer: "Yes", isKnockout: true, failedKnockout: false },
      { question: "Expected salary matching local US standards?", answer: "Yes", isKnockout: false }
    ],
    timeline: [
      { event: "Application submitted", date: "July 14, 2026 12:44 UTC", user: "System" },
      { event: "AI analysis completed (95% match)", date: "July 14, 2026 12:45 UTC", user: "AI Engine" }
    ]
  },
  {
    id: "cand-105",
    name: "Alex Rivera",
    headline: "Junior QA Engineer",
    location: "San Jose, Costa Rica",
    match: "45%",
    matchScore: 45,
    stage: "Screening",
    tags: ["Testing", "Manual QA"],
    email: "alex.rivera@workora.com",
    phone: "+506 8888 7777",
    rating: 2,
    expectedSalary: "$45,000",
    availableFrom: "Immediate",
    assignedRecruiter: "Elena Ruiz",
    assignedManager: "Amara Stone",
    timeInStage: 3,
    slaDays: 4,
    resumeText: "1 year experience in manual QA testing of mobile applications. Experience creating bug reports in Jira and following basic test cases.",
    coverLetter: "Interested in starting my career in enterprise software testing with Workora.",
    strengths: ["Highly enthusiastic", "Good attention to detail"],
    weaknesses: ["Lacks automation experience", "Insufficient years of senior backend scaling engineering requested"],
    notes: ["May be a better fit for a junior localized role, rather than the staff backend team."],
    tasks: [],
    screeningAnswers: [
      { question: "Do you have 3+ years of automated testing experience?", answer: "No", isKnockout: true, failedKnockout: true },
      { question: "Are you comfortable with asynchronous queue monitoring?", answer: "No", isKnockout: false }
    ],
    timeline: [
      { event: "Application submitted", date: "July 16, 2026 14:00 UTC", user: "System" },
      { event: "Auto-rejection rule triggered: Answered NO to automated testing knockout question", date: "July 16, 2026 14:01 UTC", user: "Knockout Engine" }
    ]
  }
];

const INITIAL_STAGES = [
  "Applied",
  "Screening",
  "Resume Review",
  "Shortlisted",
  "Interview",
  "Offer",
  "Hired",
  "Rejected"
];

export default function RecruiterPipelinePage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [stages, setStages] = useState<string[]>(INITIAL_STAGES);
  const [selectedJob, setSelectedJob] = useState("wj-001");
  const [searchQuery, setSearchQuery] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  
  // Custom stage editor state
  const [newStageName, setNewStageName] = useState("");
  const [isAddingStage, setIsAddingStage] = useState(false);
  const [editingStage, setEditingStage] = useState<string | null>(null);
  const [editedStageName, setEditedStageName] = useState("");

  // Bulk actions state
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [bulkStageTarget, setBulkStageTarget] = useState("");

  // New Note state
  const [newNote, setNewNote] = useState("");
  // New Tag state
  const [newTagVal, setNewTagVal] = useState("");
  // New Strength state
  const [newStrengthVal, setNewStrengthVal] = useState("");
  // New Weakness state
  const [newWeaknessVal, setNewWeaknessVal] = useState("");
  // New Task state
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDue, setNewTaskDue] = useState("");

  // Simulated resume version selection
  const [resumeVersion, setResumeVersion] = useState<"v1" | "v2">("v1");

  // Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const cachedCandidates = localStorage.getItem("workora_ats_candidates");
    const cachedStages = localStorage.getItem("workora_ats_stages");
    if (cachedCandidates) {
      setCandidates(JSON.parse(cachedCandidates));
    } else {
      setCandidates(INITIAL_CANDIDATES);
      localStorage.setItem("workora_ats_candidates", JSON.stringify(INITIAL_CANDIDATES));
    }

    if (cachedStages) {
      setStages(JSON.parse(cachedStages));
    } else {
      setStages(INITIAL_STAGES);
      localStorage.setItem("workora_ats_stages", JSON.stringify(INITIAL_STAGES));
    }
  }, []);

  // Save updates to local storage
  const syncCandidates = (updated: Candidate[]) => {
    setCandidates(updated);
    localStorage.setItem("workora_ats_candidates", JSON.stringify(updated));
    if (selectedCandidate) {
      const reSelected = updated.find(c => c.id === selectedCandidate.id);
      if (reSelected) setSelectedCandidate(reSelected);
    }
  };

  const syncStages = (updatedStages: string[]) => {
    setStages(updatedStages);
    localStorage.setItem("workora_ats_stages", JSON.stringify(updatedStages));
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Stage customization handlers
  const handleAddStage = () => {
    if (!newStageName.trim()) return;
    if (stages.includes(newStageName.trim())) {
      triggerToast("Stage name already exists");
      return;
    }
    const updated = [...stages, newStageName.trim()];
    syncStages(updated);
    setNewStageName("");
    setIsAddingStage(false);
    triggerToast(`Custom stage "${newStageName}" added successfully.`);
  };

  const handleRenameStage = (oldName: string) => {
    if (!editedStageName.trim() || oldName === editedStageName.trim()) {
      setEditingStage(null);
      return;
    }
    const updatedStages = stages.map(st => st === oldName ? editedStageName.trim() : st);
    const updatedCandidates = candidates.map(cand => cand.stage === oldName ? { ...cand, stage: editedStageName.trim() } : cand);
    
    syncStages(updatedStages);
    syncCandidates(updatedCandidates);
    setEditingStage(null);
    setEditedStageName("");
    triggerToast(`Stage "${oldName}" renamed to "${editedStageName}".`);
  };

  const handleDeleteStage = (stageName: string) => {
    const candidatesInStage = candidates.filter(c => c.stage === stageName);
    if (candidatesInStage.length > 0) {
      triggerToast(`Cannot delete stage. Move the ${candidatesInStage.length} candidate(s) out of "${stageName}" first.`);
      return;
    }
    const updated = stages.filter(st => st !== stageName);
    syncStages(updated);
    triggerToast(`Stage "${stageName}" removed.`);
  };

  // Move candidate to stage
  const moveCandidate = (candidateId: string, targetStage: string) => {
    const updated = candidates.map(cand => {
      if (cand.id === candidateId) {
        const timestamp = new Date().toISOString().replace("T", " ").substring(0, 16) + " UTC";
        return {
          ...cand,
          stage: targetStage,
          timeInStage: 0, // Reset timer on move
          timeline: [
            { event: `Stage updated from "${cand.stage}" to "${targetStage}"`, date: timestamp, user: "Elena Ruiz (Recruiter)" },
            ...cand.timeline
          ]
        };
      }
      return cand;
    });
    syncCandidates(updated);
    triggerToast(`Moved candidate to "${targetStage}".`);
  };

  // Bulk operation handlers
  const toggleCandidateSelection = (id: string) => {
    setSelectedCandidates(prev => 
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  const selectAllCandidatesInStage = (stageName: string) => {
    const stageCandidateIds = filteredCandidates.filter(c => c.stage === stageName).map(c => c.id);
    const allSelected = stageCandidateIds.every(id => selectedCandidates.includes(id));
    if (allSelected) {
      // Unselect all of them
      setSelectedCandidates(prev => prev.filter(id => !stageCandidateIds.includes(id)));
    } else {
      // Select all
      setSelectedCandidates(prev => [...new Set([...prev, ...stageCandidateIds])]);
    }
  };

  const handleBulkStageChange = () => {
    if (selectedCandidates.length === 0 || !bulkStageTarget) return;
    const timestamp = new Date().toISOString().replace("T", " ").substring(0, 16) + " UTC";
    const updated = candidates.map(cand => {
      if (selectedCandidates.includes(cand.id)) {
        return {
          ...cand,
          stage: bulkStageTarget,
          timeInStage: 0,
          timeline: [
            { event: `Bulk action: stage updated from "${cand.stage}" to "${bulkStageTarget}"`, date: timestamp, user: "Elena Ruiz" },
            ...cand.timeline
          ]
        };
      }
      return cand;
    });
    syncCandidates(updated);
    triggerToast(`Successfully moved ${selectedCandidates.length} candidate(s) to "${bulkStageTarget}".`);
    setSelectedCandidates([]);
    setBulkStageTarget("");
  };

  const handleBulkReject = () => {
    if (selectedCandidates.length === 0) return;
    const timestamp = new Date().toISOString().replace("T", " ").substring(0, 16) + " UTC";
    const updated = candidates.map(cand => {
      if (selectedCandidates.includes(cand.id)) {
        return {
          ...cand,
          stage: "Rejected",
          timeInStage: 0,
          timeline: [
            { event: `Bulk action: candidate rejected`, date: timestamp, user: "Elena Ruiz" },
            ...cand.timeline
          ]
        };
      }
      return cand;
    });
    syncCandidates(updated);
    triggerToast(`Rejected ${selectedCandidates.length} candidates in bulk.`);
    setSelectedCandidates([]);
  };

  // Detail panel modification handlers
  const handleUpdateRating = (ratingVal: number) => {
    if (!selectedCandidate) return;
    const updated = candidates.map(c => {
      if (c.id === selectedCandidate.id) {
        return { ...c, rating: ratingVal };
      }
      return c;
    });
    syncCandidates(updated);
  };

  const handleAddTag = () => {
    if (!selectedCandidate || !newTagVal.trim()) return;
    const updated = candidates.map(c => {
      if (c.id === selectedCandidate.id) {
        if (c.tags.includes(newTagVal.trim())) return c;
        return { ...c, tags: [...c.tags, newTagVal.trim()] };
      }
      return c;
    });
    syncCandidates(updated);
    setNewTagVal("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!selectedCandidate) return;
    const updated = candidates.map(c => {
      if (c.id === selectedCandidate.id) {
        return { ...c, tags: c.tags.filter(t => t !== tagToRemove) };
      }
      return c;
    });
    syncCandidates(updated);
  };

  const handleAddStrength = () => {
    if (!selectedCandidate || !newStrengthVal.trim()) return;
    const updated = candidates.map(c => {
      if (c.id === selectedCandidate.id) {
        return { ...c, strengths: [...c.strengths, newStrengthVal.trim()] };
      }
      return c;
    });
    syncCandidates(updated);
    setNewStrengthVal("");
  };

  const handleRemoveStrength = (idx: number) => {
    if (!selectedCandidate) return;
    const updated = candidates.map(c => {
      if (c.id === selectedCandidate.id) {
        return { ...c, strengths: c.strengths.filter((_, i) => i !== idx) };
      }
      return c;
    });
    syncCandidates(updated);
  };

  const handleAddWeakness = () => {
    if (!selectedCandidate || !newWeaknessVal.trim()) return;
    const updated = candidates.map(c => {
      if (c.id === selectedCandidate.id) {
        return { ...c, weaknesses: [...c.weaknesses, newWeaknessVal.trim()] };
      }
      return c;
    });
    syncCandidates(updated);
    setNewWeaknessVal("");
  };

  const handleRemoveWeakness = (idx: number) => {
    if (!selectedCandidate) return;
    const updated = candidates.map(c => {
      if (c.id === selectedCandidate.id) {
        return { ...c, weaknesses: c.weaknesses.filter((_, i) => i !== idx) };
      }
      return c;
    });
    syncCandidates(updated);
  };

  const handleAddNote = () => {
    if (!selectedCandidate || !newNote.trim()) return;
    const timestamp = new Date().toISOString().replace("T", " ").substring(0, 16) + " UTC";
    const updated = candidates.map(c => {
      if (c.id === selectedCandidate.id) {
        return {
          ...c,
          notes: [...c.notes, newNote.trim()],
          timeline: [
            { event: `Recruiter note added: "${newNote.trim().substring(0, 30)}..."`, date: timestamp, user: "Elena Ruiz" },
            ...c.timeline
          ]
        };
      }
      return c;
    });
    syncCandidates(updated);
    setNewNote("");
    triggerToast("Recruiter evaluation note added successfully.");
  };

  const handleAddTask = () => {
    if (!selectedCandidate || !newTaskTitle.trim()) return;
    const id = "task-" + Date.now();
    const updated = candidates.map(c => {
      if (c.id === selectedCandidate.id) {
        return {
          ...c,
          tasks: [...c.tasks, { id, title: newTaskTitle.trim(), due: newTaskDue || "No due date", done: false }]
        };
      }
      return c;
    });
    syncCandidates(updated);
    setNewTaskTitle("");
    setNewTaskDue("");
    triggerToast("Follow-up recruiter task queued.");
  };

  const handleToggleTask = (taskId: string) => {
    if (!selectedCandidate) return;
    const updated = candidates.map(c => {
      if (c.id === selectedCandidate.id) {
        return {
          ...c,
          tasks: c.tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t)
        };
      }
      return c;
    });
    syncCandidates(updated);
  };

  const handleAssignRole = (type: "recruiter" | "manager", name: string) => {
    if (!selectedCandidate) return;
    const timestamp = new Date().toISOString().replace("T", " ").substring(0, 16) + " UTC";
    const updated = candidates.map(c => {
      if (c.id === selectedCandidate.id) {
        return {
          ...c,
          assignedRecruiter: type === "recruiter" ? name : c.assignedRecruiter,
          assignedManager: type === "manager" ? name : c.assignedManager,
          timeline: [
            { event: `Assigned ${type}: ${name}`, date: timestamp, user: "Elena Ruiz" },
            ...c.timeline
          ]
        };
      }
      return c;
    });
    syncCandidates(updated);
    triggerToast(`Assigned ${type} ${name} successfully.`);
  };

  // Run knockout evaluations manually for candidate
  const runKnockoutEvaluation = () => {
    if (!selectedCandidate) return;
    const timestamp = new Date().toISOString().replace("T", " ").substring(0, 16) + " UTC";
    
    // Evaluate answers
    let knockoutFailed = false;
    const evaluatedAnswers = selectedCandidate.screeningAnswers.map(ans => {
      if (ans.isKnockout) {
        const isFailed = ans.answer.toLowerCase() === "no";
        if (isFailed) knockoutFailed = true;
        return { ...ans, failedKnockout: isFailed };
      }
      return ans;
    });

    const updated = candidates.map(c => {
      if (c.id === selectedCandidate.id) {
        return {
          ...c,
          screeningAnswers: evaluatedAnswers,
          stage: knockoutFailed ? "Rejected" : c.stage,
          timeline: [
            { 
              event: knockoutFailed 
                ? "Knockout evaluation: FAILED rules. Candidate auto-moved to Rejected." 
                : "Knockout evaluation: PASSED all core eligibility screening checks.", 
              date: timestamp, 
              user: "ATS Knockout Engine" 
            },
            ...c.timeline
          ]
        };
      }
      return c;
    });

    syncCandidates(updated);
    if (knockoutFailed) {
      triggerToast("Knockout evaluation complete: Candidate rejected due to knockout answers.");
    } else {
      triggerToast("Knockout evaluation complete: Candidate passed all eligibility screening checks.");
    }
  };

  // n8n Integrations
  const handleTriggerN8N = async (flowName: string) => {
    if (!selectedCandidate) return;
    setIsProcessing(true);
    try {
      // Simulate API call to n8n Webhook Endpoint
      const res = await fetch("/api/n8n/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: flowName,
          payload: {
            candidateId: selectedCandidate.id,
            name: selectedCandidate.name,
            email: selectedCandidate.email,
            stage: selectedCandidate.stage,
            matchScore: selectedCandidate.matchScore,
            triggeredAt: new Date().toISOString()
          }
        })
      });
      
      const text = new Date().toISOString().replace("T", " ").substring(0, 16) + " UTC";
      const updated = candidates.map(c => {
        if (c.id === selectedCandidate.id) {
          return {
            ...c,
            timeline: [
              { event: `n8n Webhook flow dispatched: "${flowName}"`, date: text, user: "Elena Ruiz" },
              ...c.timeline
            ]
          };
        }
        return c;
      });
      
      syncCandidates(updated);
      triggerToast(`Successfully triggered n8n workflow "${flowName}"! Check system log.`);
    } catch (e) {
      console.error(e);
      triggerToast("n8n Dispatch simulation successful (webhook logs populated).");
    } finally {
      setIsProcessing(false);
    }
  };

  // Filter logic
  const filteredCandidates = candidates.filter(cand => {
    const matchesSearch = cand.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          cand.headline.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          cand.resumeText.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSkill = !skillFilter || cand.resumeText.toLowerCase().includes(skillFilter.toLowerCase()) || cand.tags.some(t => t.toLowerCase().includes(skillFilter.toLowerCase()));
    const matchesLocation = !locationFilter || cand.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesRating = ratingFilter === "all" || cand.rating === parseInt(ratingFilter);
    const matchesTag = !tagFilter || cand.tags.some(t => t.toLowerCase().includes(tagFilter.toLowerCase()));
    return matchesSearch && matchesSkill && matchesLocation && matchesRating && matchesTag;
  });

  // Calculate funnel metrics
  const totalApplied = candidates.length;
  const inInterview = candidates.filter(c => c.stage.toLowerCase().includes("interview")).length;
  const offered = candidates.filter(c => c.stage.toLowerCase() === "offer").length;
  const hired = candidates.filter(c => c.stage.toLowerCase() === "hired").length;
  const conversionRate = totalApplied > 0 ? ((hired / totalApplied) * 100).toFixed(1) : "0.0";

  return (
    <PlatformShell
      badge="Recruiter"
      description="Enterprise-grade Applicant Tracking System (ATS) workspace. Organize custom stages, evaluate screening knockout rules, edit candidate reviews, rate profiles, and dispatch n8n pipeline webhooks seamlessly."
      nav={recruiterNav}
      title="Hiring Pipeline"
    >
      {/* Toast Alert */}
      {toastMessage && (
        <div id="ats-toast" className="fixed bottom-6 right-6 z-50 rounded-xl bg-slate-900 text-white border border-slate-700/80 p-4 shadow-2xl flex items-center gap-3 animate-bounce max-w-md">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <div className="text-xs font-semibold">
            {toastMessage}
          </div>
        </div>
      )}

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6" id="ats-metrics">
        <div className="p-4 rounded-xl border border-border bg-card/60 backdrop-blur-md">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Active Candidates</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold tracking-tight">{filteredCandidates.length}</span>
            <span className="text-[10px] text-muted-foreground">filtered</span>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card/60 backdrop-blur-md">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Interview Pipeline</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold tracking-tight text-primary">{inInterview}</span>
            <span className="text-[10px] text-muted-foreground">active interviews</span>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card/60 backdrop-blur-md">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Hires / Offers</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold tracking-tight text-emerald-500">{hired} <span className="text-sm font-normal text-muted-foreground">/ {offered}</span></span>
            <span className="text-[10px] text-muted-foreground">closed</span>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card/60 backdrop-blur-md">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Overall Funnel SLA Conversion</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold tracking-tight text-amber-500">{conversionRate}%</span>
            <span className="text-[10px] text-muted-foreground">apply-to-hire</span>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="glass-panel rounded-xl border border-border/80 p-5 mb-6" id="ats-filters">
        <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Advanced Candidate Search & Filters</h3>
          </div>
          <div className="flex gap-2">
            <select 
              value={selectedJob} 
              onChange={(e) => setSelectedJob(e.target.value)}
              className="text-xs rounded-md border border-border bg-background px-2.5 py-1 text-foreground font-medium outline-none focus:border-primary"
            >
              <option value="wj-001">Senior Product Designer (#wj-001)</option>
              <option value="wj-002">Staff Backend Engineer (#wj-002)</option>
              <option value="wj-003">Global Payroll Operations Lead (#wj-003)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Keywords, Name, Headline..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 border border-border rounded-md bg-background outline-none focus:border-primary text-foreground"
            />
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Skills (e.g. SQL, AWS, Go)"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-border rounded-md bg-background outline-none focus:border-primary text-foreground"
            />
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Location (e.g. Canada, Singapore)"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-border rounded-md bg-background outline-none focus:border-primary text-foreground"
            />
          </div>

          <div>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-border rounded-md bg-background outline-none focus:border-primary text-foreground"
            >
              <option value="all">Any Rating (1 - 5 ★)</option>
              <option value="5">Excellent (5 ★)</option>
              <option value="4">Good (4+ ★)</option>
              <option value="3">Average (3+ ★)</option>
              <option value="2">Poor (2+ ★)</option>
              <option value="1">Critical (1 ★)</option>
            </select>
          </div>

          <div>
            <input
              type="text"
              placeholder="Tag Filter (e.g. High intent)"
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-border rounded-md bg-background outline-none focus:border-primary text-foreground"
            />
          </div>
        </div>

        {/* Bulk Action Controls */}
        {selectedCandidates.length > 0 && (
          <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20 flex flex-wrap items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded">
                {selectedCandidates.length} Candidates Selected
              </span>
              <button 
                onClick={() => setSelectedCandidates([])}
                className="text-[10px] text-muted-foreground hover:underline"
              >
                Clear Selection
              </button>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={bulkStageTarget}
                onChange={(e) => setBulkStageTarget(e.target.value)}
                className="text-xs border border-border rounded-md bg-background px-2 py-1.5 outline-none focus:border-primary text-foreground"
              >
                <option value="">Move selected to...</option>
                {stages.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
              <Button 
                onClick={handleBulkStageChange}
                disabled={!bulkStageTarget}
                size="sm"
                className="text-xs h-8"
              >
                Apply Stage Change
              </Button>
              <Button 
                onClick={handleBulkReject}
                variant="outline"
                size="sm"
                className="text-xs h-8 text-destructive border-destructive/20 hover:bg-destructive/5 hover:border-destructive/30"
              >
                Bulk Reject Candidates
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Main Board Workspace */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-primary" />
          Visual Hiring Funnel Pipeline
        </h3>
        <div className="flex items-center gap-2">
          {isAddingStage ? (
            <div className="flex items-center gap-1.5 animate-fade-in">
              <input
                type="text"
                placeholder="Custom Stage Name"
                value={newStageName}
                onChange={(e) => setNewStageName(e.target.value)}
                className="text-xs border border-border rounded px-2.5 py-1 bg-background outline-none focus:border-primary"
              />
              <Button onClick={handleAddStage} size="sm" className="h-7 text-[10px] font-bold">
                Save
              </Button>
              <Button onClick={() => setIsAddingStage(false)} size="sm" variant="ghost" className="h-7 text-[10px] px-1.5 text-muted-foreground">
                Cancel
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsAddingStage(true)} size="sm" variant="outline" className="text-xs h-8 flex items-center gap-1">
              <Plus className="h-3.5 w-3.5" />
              Add Custom Stage
            </Button>
          )}
        </div>
      </div>

      {/* Kanban Stages Board Container */}
      <div className="grid gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-muted" style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(280px, 1fr))` }} id="ats-kanban-board">
        {stages.map((stageName) => {
          const stageCandidates = filteredCandidates.filter(c => c.stage === stageName);
          const isSlaWarningStage = stageName !== "Rejected" && stageName !== "Hired";
          const totalInStage = stageCandidates.length;

          return (
            <div 
              key={stageName} 
              className="bg-secondary/25 border border-border/60 rounded-xl p-3 flex flex-col min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-3">
                <div className="flex items-center gap-2 max-w-[70%]">
                  {editingStage === stageName ? (
                    <input
                      type="text"
                      value={editedStageName}
                      onChange={(e) => setEditedStageName(e.target.value)}
                      onBlur={() => handleRenameStage(stageName)}
                      onKeyDown={(e) => e.key === "Enter" && handleRenameStage(stageName)}
                      className="text-xs font-bold border border-primary rounded bg-background px-1 w-full"
                      autoFocus
                    />
                  ) : (
                    <span 
                      className="text-xs font-bold text-foreground cursor-pointer hover:underline truncate"
                      onClick={() => {
                        setEditingStage(stageName);
                        setEditedStageName(stageName);
                      }}
                    >
                      {stageName}
                    </span>
                  )}
                  <span className="text-[10px] font-bold text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-full shrink-0">
                    {totalInStage}
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => selectAllCandidatesInStage(stageName)}
                    className="text-[10px] text-muted-foreground hover:text-primary font-medium"
                    title="Select all in column"
                  >
                    Select
                  </button>
                  {stages.length > 3 && (
                    <button 
                      onClick={() => handleDeleteStage(stageName)}
                      className="text-muted-foreground hover:text-destructive shrink-0 p-1"
                      title="Delete Stage"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Conversion and SLA indicator for Column */}
              <div className="flex justify-between items-center px-1 mb-2">
                <span className="text-[9px] text-muted-foreground">SLA limit: 3 days</span>
                <span className="text-[9px] text-muted-foreground bg-primary/5 px-1.5 rounded font-mono">
                  {totalApplied > 0 ? ((totalInStage / totalApplied) * 100).toFixed(0) : 0}% flow
                </span>
              </div>

              {/* Candidates in column */}
              <div className="flex-1 flex flex-col gap-2.5">
                {stageCandidates.length > 0 ? (
                  stageCandidates.map((cand) => {
                    const hasSlaViolation = isSlaWarningStage && cand.timeInStage >= cand.slaDays;
                    const isAnySelected = selectedCandidates.includes(cand.id);

                    // Check if knockout checks are failed
                    const isKnockoutFailed = cand.screeningAnswers.some(ans => ans.failedKnockout);

                    return (
                      <div 
                        key={cand.id}
                        className={`group rounded-lg border p-3.5 transition-all cursor-pointer bg-background relative ${
                          isAnySelected 
                            ? "border-primary ring-1 ring-primary" 
                            : hasSlaViolation 
                              ? "border-amber-500/50 hover:border-amber-500 hover:shadow-md" 
                              : isKnockoutFailed
                                ? "border-red-500/50 bg-red-500/[0.02]"
                                : "border-border/75 hover:border-primary/60 hover:shadow-sm"
                        }`}
                        onClick={() => setSelectedCandidate(cand)}
                      >
                        {/* Checkbox selector inside card */}
                        <div 
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCandidateSelection(cand.id);
                          }}
                        >
                          <input 
                            type="checkbox" 
                            checked={isAnySelected}
                            readOnly
                            className="h-3 w-3 accent-primary rounded" 
                          />
                        </div>

                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                            {cand.name}
                          </h4>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-sm shrink-0 ${
                            cand.matchScore >= 90 
                              ? "text-emerald-600 bg-emerald-50" 
                              : cand.matchScore >= 75 
                                ? "text-primary bg-primary/5" 
                                : "text-muted-foreground bg-secondary"
                          }`}>
                            {cand.match}
                          </span>
                        </div>

                        <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                          {cand.headline}
                        </p>

                        <div className="flex flex-wrap gap-1 mt-2">
                          {cand.tags.slice(0, 2).map(tg => (
                            <span key={tg} className="text-[9px] text-muted-foreground bg-secondary/80 px-1.5 py-0.5 rounded">
                              {tg}
                            </span>
                          ))}
                        </div>

                        {/* Rating Stars */}
                        <div className="flex items-center gap-1 mt-2.5 justify-between">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-2.5 w-2.5 ${
                                  i < cand.rating ? "text-amber-500 fill-amber-500" : "text-border"
                                }`} 
                              />
                            ))}
                          </div>

                          {/* Time in Stage / SLA warning */}
                          {isSlaWarningStage && (
                            <div className={`flex items-center gap-1 text-[9px] font-mono px-1.5 rounded ${
                              hasSlaViolation 
                                ? "text-amber-600 bg-amber-50 font-bold animate-pulse" 
                                : "text-muted-foreground"
                            }`}>
                              <Clock className="h-2.5 w-2.5" />
                              <span>{cand.timeInStage}d</span>
                              {hasSlaViolation && <AlertTriangle className="h-2.5 w-2.5 text-amber-600" />}
                            </div>
                          )}

                          {isKnockoutFailed && (
                            <div className="text-[9px] text-red-500 font-bold bg-red-50 px-1.5 rounded flex items-center gap-1">
                              <Flame className="h-2.5 w-2.5" />
                              KO Failed
                            </div>
                          )}
                        </div>

                        {/* Inline Move Controls for quick action */}
                        <div className="mt-3 pt-2.5 border-t border-border/40 flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          {stages.indexOf(stageName) > 0 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                moveCandidate(cand.id, stages[stages.indexOf(stageName) - 1]);
                              }}
                              className="text-[9px] text-muted-foreground hover:text-primary border border-border rounded px-1.5 py-0.5"
                            >
                              Back
                            </button>
                          )}
                          {stages.indexOf(stageName) < stages.length - 1 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                moveCandidate(cand.id, stages[stages.indexOf(stageName) + 1]);
                              }}
                              className="text-[9px] text-primary hover:bg-primary/5 font-semibold border border-primary/20 rounded px-1.5 py-0.5 flex items-center gap-0.5"
                            >
                              Advance
                              <ArrowRight className="h-2.5 w-2.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border/40 rounded-lg p-6 text-center">
                    <p className="text-[10px] text-muted-foreground">No candidates in this stage matching current search filters.</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Candidate Detailed Profile Drawer Overlay */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex justify-end animate-fade-in" id="ats-detail-drawer">
          <div className="w-full max-w-4xl bg-background border-l border-border h-full flex flex-col shadow-2xl relative animate-slide-in overflow-hidden">
            
            {/* Drawer Header */}
            <div className="p-4 border-b border-border flex justify-between items-center bg-secondary/15">
              <div>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Candidate ID: {selectedCandidate.id}
                </span>
                <h3 className="text-sm font-bold text-foreground mt-1 flex items-center gap-1.5">
                  {selectedCandidate.name}
                  <span className="text-xs font-semibold text-muted-foreground">· {selectedCandidate.headline}</span>
                </h3>
              </div>
              <button 
                onClick={() => setSelectedCandidate(null)}
                className="text-muted-foreground hover:text-foreground p-1 border rounded hover:bg-secondary/40 transition-colors"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Main Drawer Body Scrollable */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {/* Profile Overview Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-border rounded-xl p-4 bg-secondary/10">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Contact Information</p>
                  <p className="text-xs text-foreground font-medium">{selectedCandidate.email}</p>
                  <p className="text-xs text-muted-foreground">{selectedCandidate.phone}</p>
                  <p className="text-xs text-muted-foreground">{selectedCandidate.location}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Expectations & Ready</p>
                  <p className="text-xs text-foreground font-semibold">Salary: {selectedCandidate.expectedSalary}</p>
                  <p className="text-xs text-muted-foreground">Starts: {selectedCandidate.availableFrom}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Assigned Stakeholders</p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground">Recruiter:</span>
                    <select 
                      value={selectedCandidate.assignedRecruiter} 
                      onChange={(e) => handleAssignRole("recruiter", e.target.value)}
                      className="text-[10px] border border-border rounded bg-background px-1 py-0.5"
                    >
                      <option value="Elena Ruiz">Elena Ruiz</option>
                      <option value="Maya Chen">Maya Chen</option>
                      <option value="Unassigned">Unassigned</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground">Hiring Mgr:</span>
                    <select 
                      value={selectedCandidate.assignedManager} 
                      onChange={(e) => handleAssignRole("manager", e.target.value)}
                      className="text-[10px] border border-border rounded bg-background px-1 py-0.5"
                    >
                      <option value="Amara Stone">Amara Stone</option>
                      <option value="Daniel Okoro">Daniel Okoro</option>
                      <option value="Unassigned">Unassigned</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Multi-Tab Panel (Resume, Screening, Evaluation, Tasks, Timeline) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left Column: Resume & Screening Questions */}
                <div className="space-y-5">
                  
                  {/* Resume Review Module */}
                  <div className="border border-border rounded-xl p-4 bg-background">
                    <div className="flex items-center justify-between border-b border-border/60 pb-2.5 mb-3">
                      <div className="flex items-center gap-1.5">
                        <FileText className="h-4 w-4 text-primary" />
                        <h4 className="text-xs font-bold text-foreground">Prism Resume Extraction</h4>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <select
                          value={resumeVersion}
                          onChange={(e) => setResumeVersion(e.target.value as "v1" | "v2")}
                          className="text-[10px] border rounded bg-background px-1 py-0.5 text-foreground"
                        >
                          <option value="v1">Resume v1.0 (PDF)</option>
                          <option value="v2">Resume v1.1 (Word)</option>
                        </select>
                        <span className="text-[10px] text-primary font-bold bg-primary/10 px-1.5 rounded">
                          Score: {selectedCandidate.matchScore}/100
                        </span>
                      </div>
                    </div>

                    <div className="bg-secondary/15 rounded-md p-3 max-h-48 overflow-y-auto mb-3">
                      <p className="text-xs font-mono text-foreground leading- relaxed whitespace-pre-line">
                        {selectedCandidate.resumeText}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <strong className="text-[10px] text-muted-foreground uppercase tracking-wider block">AI Heuristic Summary Factor</strong>
                      <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                        <p className="text-xs text-foreground">
                          <strong>Fit Signal:</strong> Strong functional overlap with enterprise scaling requirements. Heavy Go/Node competence aligned to core services.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Screening Questions & Knockout Engine */}
                  <div className="border border-border rounded-xl p-4 bg-background">
                    <div className="flex items-center justify-between border-b border-border/60 pb-2.5 mb-3">
                      <div className="flex items-center gap-1.5">
                        <ClipboardList className="h-4 w-4 text-primary" />
                        <h4 className="text-xs font-bold text-foreground">Screening Answers & Knockouts</h4>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={runKnockoutEvaluation}
                        className="text-[10px] h-6 px-2 py-0"
                      >
                        Run Knockout Check
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {selectedCandidate.screeningAnswers.map((ans, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg border border-border/60 bg-secondary/10">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-foreground max-w-[80%]">
                              {ans.question}
                            </span>
                            {ans.isKnockout && (
                              <span className="text-[9px] font-bold bg-red-100 text-red-600 px-1.5 rounded">
                                Knockout Rule
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-medium text-primary mt-1">{ans.answer}</p>
                          {ans.failedKnockout && (
                            <p className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Rule Failed: Candidate does not fulfill mandatory criteria.
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right Column: Candidate Evaluations & Tasks */}
                <div className="space-y-5">
                  
                  {/* Candidate Evaluation Form */}
                  <div className="border border-border rounded-xl p-4 bg-background">
                    <div className="border-b border-border/60 pb-2.5 mb-3">
                      <h4 className="text-xs font-bold text-foreground">Hiring Committee Evaluation Form</h4>
                    </div>

                    <div className="space-y-4">
                      {/* Rating input */}
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Recruiter Rating (1-5 Stars)</label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((starVal) => (
                            <button
                              key={starVal}
                              onClick={() => handleUpdateRating(starVal)}
                              className="p-1 hover:scale-110 transition-transform"
                            >
                              <Star 
                                className={`h-5 w-5 ${
                                  starVal <= selectedCandidate.rating ? "text-amber-500 fill-amber-500" : "text-border"
                                }`} 
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Custom Tags editor */}
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Profile Tags</label>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {selectedCandidate.tags.map(t => (
                            <span key={t} className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                              {t}
                              <button onClick={() => handleRemoveTag(t)} className="hover:text-destructive text-[9px] font-bold">×</button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            placeholder="Add Tag (press enter)"
                            value={newTagVal}
                            onChange={(e) => setNewTagVal(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                            className="text-xs border border-border rounded px-2 py-1 bg-background outline-none focus:border-primary flex-1"
                          />
                          <Button onClick={handleAddTag} size="sm" className="h-7 text-[10px]">Add</Button>
                        </div>
                      </div>

                      {/* Strengths list */}
                      <div>
                        <label className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">Identified Strengths</label>
                        <ul className="space-y-1 mb-2">
                          {selectedCandidate.strengths.map((st, i) => (
                            <li key={i} className="text-xs text-foreground bg-emerald-500/[0.04] p-1.5 rounded flex justify-between items-center">
                              <span>✓ {st}</span>
                              <button onClick={() => handleRemoveStrength(i)} className="text-[10px] text-muted-foreground hover:text-destructive">×</button>
                            </li>
                          ))}
                        </ul>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            placeholder="Record key strength..."
                            value={newStrengthVal}
                            onChange={(e) => setNewStrengthVal(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddStrength()}
                            className="text-xs border border-border rounded px-2 py-1 bg-background outline-none focus:border-primary flex-1"
                          />
                          <Button onClick={handleAddStrength} size="sm" className="h-7 text-[10px]">Add</Button>
                        </div>
                      </div>

                      {/* Weaknesses list */}
                      <div>
                        <label className="text-[10px] font-bold text-red-500 uppercase tracking-wider block mb-1">Evaluated Risks / Weaknesses</label>
                        <ul className="space-y-1 mb-2">
                          {selectedCandidate.weaknesses.map((wk, i) => (
                            <li key={i} className="text-xs text-foreground bg-red-500/[0.04] p-1.5 rounded flex justify-between items-center">
                              <span>⚠ {wk}</span>
                              <button onClick={() => handleRemoveWeakness(i)} className="text-[10px] text-muted-foreground hover:text-destructive">×</button>
                            </li>
                          ))}
                        </ul>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            placeholder="Record risk factor..."
                            value={newWeaknessVal}
                            onChange={(e) => setNewWeaknessVal(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddWeakness()}
                            className="text-xs border border-border rounded px-2 py-1 bg-background outline-none focus:border-primary flex-1"
                          />
                          <Button onClick={handleAddWeakness} size="sm" className="h-7 text-[10px]">Add</Button>
                        </div>
                      </div>

                      {/* Add Evaluation Note */}
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Recruiter Interview Notes</label>
                        <div className="space-y-2">
                          {selectedCandidate.notes.map((note, idx) => (
                            <div key={idx} className="text-xs border border-border/40 p-2.5 rounded bg-secondary/5 font-normal italic">
                              "{note}"
                            </div>
                          ))}
                          <textarea
                            placeholder="Add evaluation remarks or feedback..."
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            className="w-full text-xs border border-border rounded p-2.5 bg-background outline-none focus:border-primary h-16 text-foreground"
                          />
                          <Button onClick={handleAddNote} disabled={!newNote.trim()} className="text-xs w-full">
                            Save Evaluation Comment
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tasks queue for Recruiter */}
                  <div className="border border-border rounded-xl p-4 bg-background">
                    <div className="border-b border-border/60 pb-2.5 mb-3">
                      <h4 className="text-xs font-bold text-foreground">Follow-Up Recruiter Tasks</h4>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-2">
                        {selectedCandidate.tasks.map((t) => (
                          <div key={t.id} className="flex items-center justify-between p-2 rounded-lg border border-border/50 bg-secondary/10">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={t.done}
                                onChange={() => handleToggleTask(t.id)}
                                className="h-3.5 w-3.5 accent-primary rounded cursor-pointer"
                              />
                              <span className={`text-xs ${t.done ? "line-through text-muted-foreground" : "text-foreground font-medium"}`}>
                                {t.title}
                              </span>
                            </div>
                            <span className="text-[9px] text-muted-foreground bg-secondary px-1.5 rounded">{t.due}</span>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        <input
                          type="text"
                          placeholder="Task Title (e.g. Call back Priya)"
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          className="text-xs border border-border rounded px-2 py-1 bg-background outline-none focus:border-primary"
                        />
                        <input
                          type="text"
                          placeholder="Due Date (e.g. Tomorrow)"
                          value={newTaskDue}
                          onChange={(e) => setNewTaskDue(e.target.value)}
                          className="text-xs border border-border rounded px-2 py-1 bg-background outline-none focus:border-primary"
                        />
                      </div>
                      <Button onClick={handleAddTask} disabled={!newTaskTitle.trim()} className="text-xs w-full mt-1.5">
                        <Plus className="h-3.5 w-3.5" /> Queued New Task
                      </Button>
                    </div>
                  </div>

                </div>

              </div>

              {/* Immutable Candidate Timeline / Audit Log */}
              <div className="border border-border rounded-xl p-4 bg-background">
                <div className="border-b border-border/60 pb-2.5 mb-3">
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Activity className="h-4 w-4 text-primary" />
                    Immutable Candidate Application Audit Log
                  </h4>
                </div>

                <div className="relative border-l border-border pl-4 space-y-4 ml-1.5">
                  {selectedCandidate.timeline.map((item, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full border border-primary bg-background flex items-center justify-center">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      </div>
                      <p className="text-xs font-semibold text-foreground leading-relaxed">{item.event}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Timestamp: {item.date} · Authorized Actor: <span className="font-mono text-[9px] bg-secondary px-1.5 rounded">{item.user}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* n8n Workflows Automation Triggering Hub */}
              <div className="border border-border rounded-xl p-4 bg-slate-950/90 text-slate-100">
                <div className="border-b border-slate-800 pb-2.5 mb-3 flex justify-between items-center">
                  <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <SlidersHorizontal className="h-4 w-4 text-emerald-400" />
                    n8n Automated Workflow Trigger Hub
                  </h4>
                  <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                    Integration Active
                  </span>
                </div>

                <p className="text-xs text-slate-400 mb-4">
                  Trigger automated outbound recruiter workflows connected to external Slack hubs, email systems, calendar synchronization, or analytics updating. The core system logs all webhook dispatch attempts.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => handleTriggerN8N("candidate_screening")}
                    disabled={isProcessing}
                    className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-left hover:border-emerald-500/50 hover:bg-slate-900/50 transition-all"
                  >
                    <div className="flex items-center gap-1.5">
                      <Send className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-xs font-bold text-slate-200">Screening Dispatch</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                      Email custom technical screening questionnaire.
                    </p>
                  </button>

                  <button
                    onClick={() => handleTriggerN8N("interview_invitation_flow")}
                    disabled={isProcessing}
                    className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-left hover:border-emerald-500/50 hover:bg-slate-900/50 transition-all"
                  >
                    <div className="flex items-center gap-1.5">
                      <Send className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-xs font-bold text-slate-200">Interview Invites</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                      Dispatch live calendly links & coordinate slots.
                    </p>
                  </button>

                  <button
                    onClick={() => handleTriggerN8N("crm_hub_sync")}
                    disabled={isProcessing}
                    className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-left hover:border-emerald-500/50 hover:bg-slate-900/50 transition-all"
                  >
                    <div className="flex items-center gap-1.5">
                      <Send className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-xs font-bold text-slate-200">Enterprise CRM Sync</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                      Export candidate record to active CRM databases.
                    </p>
                  </button>
                </div>
              </div>

            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-border bg-secondary/15 flex justify-end gap-3 shrink-0">
              {selectedCandidate.stage !== "Rejected" && (
                <Button 
                  onClick={() => {
                    moveCandidate(selectedCandidate.id, "Rejected");
                  }}
                  variant="outline" 
                  size="sm"
                  className="text-xs text-destructive border-destructive/20 hover:bg-destructive/5 hover:border-destructive/30"
                >
                  Reject Candidate
                </Button>
              )}
              {selectedCandidate.stage !== "Shortlisted" && (
                <Button 
                  onClick={() => {
                    moveCandidate(selectedCandidate.id, "Shortlisted");
                  }}
                  variant="outline" 
                  size="sm"
                  className="text-xs text-primary border-primary/20 hover:bg-primary/5"
                >
                  Shortlist Candidate
                </Button>
              )}
              <select
                value={selectedCandidate.stage}
                onChange={(e) => moveCandidate(selectedCandidate.id, e.target.value)}
                className="text-xs border border-border rounded-md bg-background px-3 py-1.5 outline-none focus:border-primary font-medium text-foreground"
              >
                {stages.map(st => (
                  <option key={st} value={st}>Move to: {st}</option>
                ))}
              </select>
            </div>

          </div>
        </div>
      )}
    </PlatformShell>
  );
}
