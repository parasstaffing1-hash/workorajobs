"use client";

import { useState, useEffect } from "react";
import {
  CalendarPlus,
  ChevronDown,
  ChevronUp,
  User,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Briefcase,
  TrendingUp,
  DollarSign,
  FileText,
  Mail,
  Sliders,
  Play,
  RotateCw,
  Award,
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";

import { PlatformShell } from "@/components/platform/platform-shell";
import { WorkflowCard } from "@/components/platform/workflow-card";
import { Button } from "@/components/ui/button";
import { recruiterNav } from "@/data/platform";

interface PanelMember {
  userId: string;
  name: string;
  role: string;
}

interface Interview {
  id: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  startsAt: string;
  endsAt: string;
  timezone: string;
  location: string;
  meetingUrl: string;
  roundName: string;
  bufferMinutes: number;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "RESCHEDULED";
  panel: PanelMember[];
  feedback?: {
    technicalRating: number;
    communicationRating: number;
    problemSolvingRating: number;
    leadershipRating: number;
    culturalFitRating: number;
    strengths: string[];
    weaknesses: string[];
    recommendation: "STRONG_HIRE" | "HIRE" | "NO_HIRE" | "STRONG_NO_HIRE";
    additionalNotes: string;
    createdAt: string;
  };
}

interface Offer {
  id: string;
  candidateName: string;
  jobTitle: string;
  templateName: string;
  baseSalary: number;
  signOnBonus: number;
  benefits: string;
  joiningDate: string;
  expirationDate: string;
  status: "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "SENT" | "ACCEPTED" | "DECLINED" | "WITHDRAWN" | "JOINED";
  version: number;
  approvals: Array<{
    name: string;
    role: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    comment?: string;
  }>;
}

export default function RecruiterCalendarPage() {
  const [activeTab, setActiveTab] = useState<"interviews" | "offers" | "automation">("interviews");
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [automationLogs, setAutomationLogs] = useState<Array<{ id: string; text: string; type: "info" | "success" | "warn" }>>([]);

  // Form states for creating interview
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [newIntCandidate, setNewIntCandidate] = useState("Alexander Wright");
  const [newIntEmail, setNewIntEmail] = useState("alexander.w@gmail.com");
  const [newIntJob, setNewIntJob] = useState("Principal DevOps Architect");
  const [newIntRound, setNewIntRound] = useState("Technical Assessment");
  const [newIntStart, setNewIntStart] = useState("2026-07-20T10:00");
  const [newIntEnd, setNewIntEnd] = useState("2026-07-20T11:00");
  const [newIntTimezone, setNewIntTimezone] = useState("EST");
  const [newIntLocation, setNewIntLocation] = useState("Virtual Meeting");
  const [newIntUrl, setNewIntUrl] = useState("https://teams.microsoft.com/j/934812");
  const [newIntBuffer, setNewIntBuffer] = useState(15);
  const [newIntPanel, setNewIntPanel] = useState<PanelMember[]>([
    { userId: "int-1", name: "David Chen", role: "Panel Lead" },
    { userId: "int-2", name: "Samantha Ross", role: "System Architect" },
  ]);

  // Scorecard entry states
  const [scoringInterviewId, setScoringInterviewId] = useState<string | null>(null);
  const [techRating, setTechRating] = useState(4);
  const [commRating, setCommRating] = useState(4);
  const [probRating, setProbRating] = useState(5);
  const [leadRating, setLeadRating] = useState(3);
  const [cultRating, setCultRating] = useState(4);
  const [strengthsInput, setStrengthsInput] = useState("Excellent systems design intuition, clear communicator");
  const [weaknessesInput, setWeaknessesInput] = useState("Could elaborate more on automated recovery pipelines");
  const [recommendation, setRecommendation] = useState<"STRONG_HIRE" | "HIRE" | "NO_HIRE" | "STRONG_NO_HIRE">("HIRE");
  const [addNotes, setAddNotes] = useState("Strong match for our immediate core migration requirements.");

  // Offer Creation states
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [newOfferCandidate, setNewOfferCandidate] = useState("Alexander Wright");
  const [newOfferJob, setNewOfferJob] = useState("Principal DevOps Architect");
  const [newOfferTemplate, setNewOfferTemplate] = useState("Standard Full-Time Executive");
  const [newOfferSalary, setNewOfferSalary] = useState(185000);
  const [newOfferBonus, setNewOfferBonus] = useState(25000);
  const [newOfferBenefits, setNewOfferBenefits] = useState("Premium Health & Dental, 401(k) 6% Match, Unlimited PTO, $5k annual learning budget");
  const [newOfferJoin, setNewOfferJoin] = useState("2026-08-15");
  const [newOfferExpire, setNewOfferExpire] = useState("2026-07-27");

  // Load Seed Data from LocalStorage or default fallback
  useEffect(() => {
    const savedInterviews = localStorage.getItem("recruiter_interviews");
    const savedOffers = localStorage.getItem("recruiter_offers");

    if (savedInterviews) {
      setInterviews(JSON.parse(savedInterviews));
    } else {
      const initialInterviews: Interview[] = [
        {
          id: "int-1",
          candidateName: "Sophia Martinez",
          candidateEmail: "sophia.m@gmail.com",
          jobTitle: "Senior Frontend Engineer",
          startsAt: "2026-07-19T14:00",
          endsAt: "2026-07-19T15:00",
          timezone: "EST",
          location: "Virtual Meeting",
          meetingUrl: "https://meet.google.com/abc-defg-hij",
          roundName: "Technical Panel",
          bufferMinutes: 15,
          status: "COMPLETED",
          panel: [
            { userId: "u-1", name: "David Chen", role: "Panel Lead" },
            { userId: "u-2", name: "Sarah Connor", role: "Frontend Lead" },
          ],
          feedback: {
            technicalRating: 5,
            communicationRating: 4,
            problemSolvingRating: 5,
            leadershipRating: 3,
            culturalFitRating: 5,
            strengths: ["In-depth understanding of React internals", "Elegant CSS/Tailwind architectural ideas"],
            weaknesses: ["No direct experience with NestJS backends"],
            recommendation: "STRONG_HIRE",
            additionalNotes: "Exceptional visual craft. Would make an excellent addition to our platform core team.",
            createdAt: "2026-07-19T15:15",
          },
        },
        {
          id: "int-2",
          candidateName: "Alexander Wright",
          candidateEmail: "alexander.w@gmail.com",
          jobTitle: "Principal DevOps Architect",
          startsAt: "2026-07-20T10:00",
          endsAt: "2026-07-20T11:00",
          timezone: "EST",
          location: "Virtual Meeting",
          meetingUrl: "https://teams.microsoft.com/j/934812",
          roundName: "Architecture Screening",
          bufferMinutes: 15,
          status: "SCHEDULED",
          panel: [
            { userId: "u-1", name: "David Chen", role: "Panel Lead" },
            { userId: "u-3", name: "Samantha Ross", role: "System Architect" },
          ],
        },
        {
          id: "int-3",
          candidateName: "Liam Johnson",
          candidateEmail: "liam.j@yahoo.com",
          jobTitle: "Senior Product Manager",
          startsAt: "2026-07-21T13:00",
          endsAt: "2026-07-21T14:00",
          timezone: "PST",
          location: "Conference Room B",
          meetingUrl: "https://zoom.us/j/48293021",
          roundName: "Hiring Manager Interview",
          bufferMinutes: 10,
          status: "SCHEDULED",
          panel: [{ userId: "u-4", name: "Marcus Brody", role: "VP Product" }],
        },
      ];
      setInterviews(initialInterviews);
      localStorage.setItem("recruiter_interviews", JSON.stringify(initialInterviews));
    }

    if (savedOffers) {
      setOffers(JSON.parse(savedOffers));
    } else {
      const initialOffers: Offer[] = [
        {
          id: "off-1",
          candidateName: "Sophia Martinez",
          jobTitle: "Senior Frontend Engineer",
          templateName: "Standard Full-Time",
          baseSalary: 145000,
          signOnBonus: 10000,
          benefits: "Premium Health, Dental & Vision, 401(k) Match 5%, 25 Days PTO, Remote Workspace stipend.",
          joiningDate: "2026-08-01",
          expirationDate: "2026-07-25",
          status: "PENDING_APPROVAL",
          version: 1,
          approvals: [
            { name: "Marcus Brody", role: "Hiring Manager", status: "APPROVED", comment: "Approved base salary match." },
            { name: "Elena Rostova", role: "HR Representative", status: "APPROVED", comment: "Aligned with band standards." },
            { name: "John Sterling", role: "Finance Director", status: "PENDING" },
          ],
        },
      ];
      setOffers(initialOffers);
      localStorage.setItem("recruiter_offers", JSON.stringify(initialOffers));
    }

    addLog("System initialized. Active worker thread listening to redis list: 'queue:calendar-sync'", "info");
    addLog("Active worker thread listening to redis list: 'queue:interview-reminders'", "info");
  }, []);

  const addLog = (text: string, type: "info" | "success" | "warn" = "info") => {
    setAutomationLogs((prev) => [
      { id: `${Date.now()}_${Math.random()}`, text, type },
      ...prev.slice(0, 49),
    ]);
  };

  const saveInterviewsList = (list: Interview[]) => {
    setInterviews(list);
    localStorage.setItem("recruiter_interviews", JSON.stringify(list));
  };

  const saveOffersList = (list: Offer[]) => {
    setOffers(list);
    localStorage.setItem("recruiter_offers", JSON.stringify(list));
  };

  // ACTIONS
  const handleScheduleInterview = (e: React.FormEvent) => {
    e.preventDefault();
    const newInt: Interview = {
      id: `int-${Date.now()}`,
      candidateName: newIntCandidate,
      candidateEmail: newIntEmail,
      jobTitle: newIntJob,
      startsAt: newIntStart,
      endsAt: newIntEnd,
      timezone: newIntTimezone,
      location: newIntLocation,
      meetingUrl: newIntUrl,
      roundName: newIntRound,
      bufferMinutes: newIntBuffer,
      status: "SCHEDULED",
      panel: newIntPanel,
    };

    const updated = [newInt, ...interviews];
    saveInterviewsList(updated);
    setShowScheduleModal(false);

    addLog(`Scheduled "${newIntRound}" for ${newIntCandidate}. Dispatching job ID calendar_sync_${newInt.id} to BullMQ queue`, "success");
    addLog(`Sent transactional email invite to ${newIntCandidate} (${newIntEmail})`, "success");
  };

  const handleCancelInterview = (id: string) => {
    const updated = interviews.map((i) => (i.id === id ? { ...i, status: "CANCELLED" as const } : i));
    saveInterviewsList(updated);
    const item = interviews.find((i) => i.id === id);
    addLog(`Cancelled interview ${id} for ${item?.candidateName}. Sent cancellation email.`, "warn");
  };

  const handleRescheduleSubmit = (id: string) => {
    const updated = interviews.map((i) =>
      i.id === id ? { ...i, startsAt: "2026-07-22T15:00", status: "RESCHEDULED" as const } : i,
    );
    saveInterviewsList(updated);
    const item = interviews.find((i) => i.id === id);
    addLog(`Rescheduled interview ${id} for ${item?.candidateName} to July 22, 15:00. Sent reschedule update.`, "info");
  };

  const submitScorecard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scoringInterviewId) return;

    const updated = interviews.map((i) => {
      if (i.id === scoringInterviewId) {
        return {
          ...i,
          status: "COMPLETED" as const,
          feedback: {
            technicalRating: techRating,
            communicationRating: commRating,
            problemSolvingRating: probRating,
            leadershipRating: leadRating,
            culturalFitRating: cultRating,
            strengths: strengthsInput.split(",").map((s) => s.trim()).filter(Boolean),
            weaknesses: weaknessesInput.split(",").map((w) => w.trim()).filter(Boolean),
            recommendation,
            additionalNotes: addNotes,
            createdAt: new Date().toISOString(),
          },
        };
      }
      return i;
    });

    saveInterviewsList(updated);
    setScoringInterviewId(null);
    const item = interviews.find((i) => i.id === scoringInterviewId);
    addLog(`Submitted structured feedback scorecard for ${item?.candidateName}. Evaluated Recommendation: ${recommendation}`, "success");
    addLog(`Triggered background worker 'feedback-processing' to analyze scorecard metrics.`, "info");
  };

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const newOffer: Offer = {
      id: `off-${Date.now()}`,
      candidateName: newOfferCandidate,
      jobTitle: newOfferJob,
      templateName: newOfferTemplate,
      baseSalary: newOfferSalary,
      signOnBonus: newOfferBonus,
      benefits: newOfferBenefits,
      joiningDate: newOfferJoin,
      expirationDate: newOfferExpire,
      status: "PENDING_APPROVAL",
      version: 1,
      approvals: [
        { name: "Marcus Brody", role: "Hiring Manager", status: "PENDING" },
        { name: "Elena Rostova", role: "HR Representative", status: "PENDING" },
        { name: "John Sterling", role: "Finance Director", status: "PENDING" },
      ],
    };

    const updated = [newOffer, ...offers];
    saveOffersList(updated);
    setShowOfferModal(false);

    addLog(`Drafted new offer for ${newOfferCandidate} (Base: $${newOfferSalary.toLocaleString()}). Enqueued approval chain.`, "success");
    addLog(`Dispatched background task 'offer-generation' to assemble standardized PDF contracts.`, "info");
  };

  const handleSignOffer = (offerId: string, approverName: string, approved: boolean) => {
    const updated = offers.map((o) => {
      if (o.id === offerId) {
        const nextApprovals = o.approvals.map((app) =>
          app.name === approverName ? { ...app, status: (approved ? "APPROVED" as const : "REJECTED" as const), comment: "Verified & Approved" } : app,
        );
        // If all approved, transition offer status
        const allApproved = nextApprovals.every((app) => app.status === "APPROVED");
        const anyRejected = nextApprovals.some((app) => app.status === "REJECTED");

        let status = o.status;
        if (anyRejected) status = "DECLINED";
        else if (allApproved) status = "APPROVED";

        return { ...o, approvals: nextApprovals, status };
      }
      return o;
    });

    saveOffersList(updated);
    addLog(`${approverName} signed offer ${offerId} with decision: ${approved ? "APPROVED" : "REJECTED"}.`, approved ? "success" : "warn");
  };

  const handleSendOfferToCandidate = (offerId: string) => {
    const updated = offers.map((o) => (o.id === offerId ? { ...o, status: "SENT" as const } : o));
    saveOffersList(updated);
    const item = offers.find((o) => o.id === offerId);
    addLog(`Sent official offer contract to candidate ${item?.candidateName}. Dispatched status notification.`, "success");
  };

  const handleSimulateCandidateResponse = (offerId: string, accept: boolean) => {
    const updated = offers.map((o) => (o.id === offerId ? { ...o, status: (accept ? "ACCEPTED" as const : "DECLINED" as const) } : o));
    saveOffersList(updated);
    const item = offers.find((o) => o.id === offerId);
    addLog(`Candidate ${item?.candidateName} responded to offer ${offerId}: ${accept ? "ACCEPTED" : "DECLINED"}.`, accept ? "success" : "warn");
    addLog(`Automatically enqueued analytics updates for hiring funnel logs.`, "info");
  };

  const triggerMockCron = () => {
    addLog("Triggering manual cron execution for workflow audit check...", "info");
    addLog("Checking upcoming candidate interview dates...", "info");
    const upcoming = interviews.filter((i) => i.status === "SCHEDULED").length;
    addLog(`Cron finished: found ${upcoming} active interviews. Dispatched 0 urgent reminders.`, "success");
  };

  const triggerN8nSync = () => {
    addLog("Invoking n8n report trigger webhook...", "info");
    addLog("n8n response: Workflow 'Generate Hiring Funnel Report' processed. 3 attachments compiled.", "success");
  };

  return (
    <PlatformShell
      badge="Recruiter Workspace"
      description="Coordinate interviews, configure panel panels, collect feedback, design compensation packages, and control approval chains."
      nav={recruiterNav}
      title="Hiring & Interview Management"
    >
      <div id="enterprise-recruitment-dashboard" className="space-y-6">
        
        {/* TOP STATUS CARDS / ANALYTICS BANNER */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs font-mono text-muted-foreground uppercase">Scheduled Rounds</p>
              <h3 className="text-2xl font-bold font-sans mt-1">
                {interviews.filter((i) => i.status === "SCHEDULED" || i.status === "RESCHEDULED").length}
              </h3>
            </div>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 rounded-lg">
              <Calendar className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs font-mono text-muted-foreground uppercase">Pending Scorecards</p>
              <h3 className="text-2xl font-bold font-sans mt-1">
                {interviews.filter((i) => i.status === "SCHEDULED" && !i.feedback).length}
              </h3>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-600 rounded-lg">
              <Clock className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs font-mono text-muted-foreground uppercase">Offers Pending Approval</p>
              <h3 className="text-2xl font-bold font-sans mt-1">
                {offers.filter((o) => o.status === "PENDING_APPROVAL").length}
              </h3>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-lg">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs font-mono text-muted-foreground uppercase">Hired Candidates</p>
              <h3 className="text-2xl font-bold font-sans mt-1">
                {offers.filter((o) => o.status === "ACCEPTED" || o.status === "JOINED").length}
              </h3>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 rounded-lg">
              <Award className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="flex border-b border-border space-x-4">
          <button
            onClick={() => setActiveTab("interviews")}
            className={`pb-2 text-sm font-medium transition-colors ${
              activeTab === "interviews"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Interviews & Scorecards
          </button>
          <button
            onClick={() => setActiveTab("offers")}
            className={`pb-2 text-sm font-medium transition-colors ${
              activeTab === "offers"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Offer Management
          </button>
          <button
            onClick={() => setActiveTab("automation")}
            className={`pb-2 text-sm font-medium transition-colors ${
              activeTab === "automation"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            n8n & BullMQ Workers
          </button>
        </div>

        {/* TAB 1: INTERVIEWS & SCORECARDS */}
        {activeTab === "interviews" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold font-sans">Interview Scheduling & Panel Panels</h2>
                <p className="text-xs text-muted-foreground">Schedule complex interview sessions, assign panelists, and fill structured scorecards.</p>
              </div>
              <Button size="sm" onClick={() => setShowScheduleModal(true)}>
                <CalendarPlus className="mr-2 h-4 w-4" />
                Schedule Interview
              </Button>
            </div>

            <div className="grid gap-4">
              {interviews.map((interview) => (
                <div key={interview.id} className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-base text-foreground">{interview.candidateName}</h3>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          interview.status === "COMPLETED" ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700" :
                          interview.status === "CANCELLED" ? "bg-rose-100 dark:bg-rose-950/50 text-rose-700" :
                          "bg-amber-100 dark:bg-amber-950/50 text-amber-700"
                        }`}>
                          {interview.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center">
                        <Briefcase className="h-3 w-3 mr-1" /> {interview.jobTitle} &bull; <Layers className="h-3 w-3 mx-1" /> {interview.roundName}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 text-xs font-mono text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(interview.startsAt).toLocaleString()} ({interview.timezone})</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border/60 text-sm">
                    <div>
                      <h4 className="font-semibold text-xs text-foreground uppercase tracking-wider mb-1 flex items-center">
                        <Users className="h-3 w-3 mr-1 text-primary" /> Interview Panel Panel
                      </h4>
                      <div className="space-y-1 mt-1">
                        {interview.panel.map((p, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs bg-muted/50 p-1.5 rounded">
                            <span className="font-medium text-foreground">{p.name}</span>
                            <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">{p.role}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        <strong>Meeting Link:</strong> <a href={interview.meetingUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">{interview.meetingUrl}</a>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-xs text-foreground uppercase tracking-wider mb-1 flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1 text-emerald-600" /> Scorecard Evaluation
                      </h4>
                      {interview.feedback ? (
                        <div className="bg-emerald-50/40 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 rounded-lg p-3 space-y-2 text-xs">
                          <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                            <div>Technical: <span className="font-bold text-emerald-600">{interview.feedback.technicalRating}/5</span></div>
                            <div>Communication: <span className="font-bold text-emerald-600">{interview.feedback.communicationRating}/5</span></div>
                            <div>Problem Solving: <span className="font-bold text-emerald-600">{interview.feedback.problemSolvingRating}/5</span></div>
                            <div>Leadership: <span className="font-bold text-emerald-600">{interview.feedback.leadershipRating}/5</span></div>
                          </div>
                          <div className="text-foreground">
                            <strong>Recommendation:</strong> <span className="font-bold text-primary">{interview.feedback.recommendation}</span>
                          </div>
                          <div>
                            <strong>Notes:</strong> {interview.feedback.additionalNotes}
                          </div>
                        </div>
                      ) : interview.status !== "CANCELLED" ? (
                        <div className="h-full flex flex-col justify-between">
                          <p className="text-xs text-amber-600 italic">No feedback scorecard submitted yet.</p>
                          <div className="flex space-x-2 mt-2">
                            <Button size="sm" variant="outline" onClick={() => setScoringInterviewId(interview.id)}>
                              Write Scorecard
                            </Button>
                            <Button size="sm" variant="outline" className="text-rose-600 hover:text-rose-700" onClick={() => handleCancelInterview(interview.id)}>
                              Cancel Round
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleRescheduleSubmit(interview.id)}>
                              Reschedule
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-rose-500 font-mono">Session Cancelled.</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: OFFERS */}
        {activeTab === "offers" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold font-sans">Corporate Offer Lifecycle Manager</h2>
                <p className="text-xs text-muted-foreground">Create rich templates, configure base, equity and bonus parameters, manage compliance and approval workflows.</p>
              </div>
              <Button size="sm" onClick={() => setShowOfferModal(true)}>
                <DollarSign className="mr-2 h-4 w-4" />
                Draft Employment Offer
              </Button>
            </div>

            <div className="grid gap-6">
              {offers.map((offer) => (
                <div key={offer.id} className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-base text-foreground">{offer.candidateName}</h3>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          offer.status === "ACCEPTED" || offer.status === "JOINED" ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700" :
                          offer.status === "DECLINED" ? "bg-rose-100 dark:bg-rose-950/50 text-rose-700" :
                          offer.status === "PENDING_APPROVAL" ? "bg-amber-100 dark:bg-amber-950/50 text-amber-700" :
                          "bg-blue-100 dark:bg-blue-950/50 text-blue-700"
                        }`}>
                          {offer.status}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">v{offer.version}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center">
                        <Briefcase className="h-3 w-3 mr-1" /> {offer.jobTitle} &bull; <FileText className="h-3 w-3 mx-1" /> {offer.templateName}
                      </p>
                    </div>

                    <div className="bg-muted px-3 py-1 rounded text-xs font-mono text-foreground">
                      <strong>Base Salary:</strong> ${offer.baseSalary.toLocaleString()}/yr
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border/60 text-sm">
                    <div>
                      <h4 className="font-semibold text-xs text-foreground uppercase tracking-wider mb-2 flex items-center">
                        <Users className="h-3 w-3 mr-1 text-primary" /> Approval Chain status
                      </h4>
                      <div className="space-y-2">
                        {offer.approvals.map((app, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs bg-muted/50 p-2 rounded">
                            <div>
                              <span className="font-medium text-foreground d-block">{app.name}</span>
                              <p className="text-[10px] text-muted-foreground">{app.role}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {app.status === "APPROVED" && <CheckCircle className="h-4 w-4 text-emerald-600" />}
                              {app.status === "REJECTED" && <XCircle className="h-4 w-4 text-rose-600" />}
                              {app.status === "PENDING" && <Clock className="h-4 w-4 text-amber-500" />}
                              {app.status === "PENDING" && (
                                <div className="flex space-x-1">
                                  <Button size="sm" variant="outline" className="h-5 px-1 py-0 text-[9px] text-emerald-600" onClick={() => handleSignOffer(offer.id, app.name, true)}>Sign</Button>
                                  <Button size="sm" variant="outline" className="h-5 px-1 py-0 text-[9px] text-rose-600" onClick={() => handleSignOffer(offer.id, app.name, false)}>Reject</Button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col justify-between space-y-2">
                      <div>
                        <h4 className="font-semibold text-xs text-foreground uppercase tracking-wider mb-1 flex items-center">
                          <Sliders className="h-3 w-3 mr-1 text-indigo-500" /> Benefit parameters
                        </h4>
                        <p className="text-xs text-foreground">{offer.benefits}</p>
                        <div className="grid grid-cols-2 gap-2 mt-2 text-xs font-mono">
                          <div><strong>Start Date:</strong> {offer.joiningDate}</div>
                          <div><strong>Expiration Date:</strong> {offer.expirationDate}</div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-border/50 flex space-x-2">
                        {offer.status === "APPROVED" && (
                          <Button size="sm" onClick={() => handleSendOfferToCandidate(offer.id)}>
                            <Mail className="h-3.5 w-3.5 mr-1" /> Send Offer
                          </Button>
                        )}
                        {offer.status === "SENT" && (
                          <>
                            <Button size="sm" variant="outline" className="text-emerald-600 hover:text-emerald-700" onClick={() => handleSimulateCandidateResponse(offer.id, true)}>
                              Candidate Accepts
                            </Button>
                            <Button size="sm" variant="outline" className="text-rose-600 hover:text-rose-700" onClick={() => handleSimulateCandidateResponse(offer.id, false)}>
                              Candidate Declines
                            </Button>
                          </>
                        )}
                        {(offer.status === "ACCEPTED" || offer.status === "JOINED") && (
                          <div className="text-xs text-emerald-600 flex items-center font-bold">
                            <CheckCircle className="h-4 w-4 mr-1 text-emerald-600" /> Offer Fully Accepted & Concluded.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: n8n AUTOMATION WEBHOOKS */}
        {activeTab === "automation" && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold text-foreground">n8n Automation Webhooks & BullMQ Thread Visualizer</h3>
                  <p className="text-xs text-muted-foreground">Interact with mock n8n automation, dispatch email triggers, retry failed worker states, and audit background transactions.</p>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={triggerMockCron}>
                    <RotateCw className="mr-1.5 h-3.5 w-3.5" /> Execute Audit Cron
                  </Button>
                  <Button size="sm" onClick={triggerN8nSync}>
                    <Play className="mr-1.5 h-3.5 w-3.5" /> Trigger n8n webhook
                  </Button>
                </div>
              </div>

              <div className="bg-muted rounded-lg p-4 font-mono text-xs overflow-y-auto max-h-80 space-y-1.5 text-foreground">
                <p className="text-muted-foreground border-b border-border/80 pb-1 mb-2">// Active BullMQ Workers logs & n8n hooks (idempotent, horizontal scaling)</p>
                {automationLogs.map((log) => (
                  <div key={log.id} className="flex space-x-2">
                    <span className="text-muted-foreground">[{new Date().toLocaleTimeString()}]</span>
                    <span className={
                      log.type === "success" ? "text-emerald-600" :
                      log.type === "warn" ? "text-rose-500" :
                      "text-primary"
                    }>
                      {log.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SCHEDULE MODAL */}
        {showScheduleModal && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-xl max-w-lg w-full p-6 shadow-lg space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-foreground">Schedule Interview Panel</h3>
                <button onClick={() => setShowScheduleModal(false)} className="text-muted-foreground hover:text-foreground">✕</button>
              </div>

              <form onSubmit={handleScheduleInterview} className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Candidate Name</label>
                    <input type="text" className="w-full bg-muted/60 border border-border p-2 rounded" value={newIntCandidate} onChange={(e) => setNewIntCandidate(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Candidate Email</label>
                    <input type="email" className="w-full bg-muted/60 border border-border p-2 rounded" value={newIntEmail} onChange={(e) => setNewIntEmail(e.target.value)} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Target Job</label>
                    <input type="text" className="w-full bg-muted/60 border border-border p-2 rounded" value={newIntJob} onChange={(e) => setNewIntJob(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Round Name</label>
                    <input type="text" className="w-full bg-muted/60 border border-border p-2 rounded" value={newIntRound} onChange={(e) => setNewIntRound(e.target.value)} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Starts At</label>
                    <input type="datetime-local" className="w-full bg-muted/60 border border-border p-2 rounded" value={newIntStart} onChange={(e) => setNewIntStart(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Ends At</label>
                    <input type="datetime-local" className="w-full bg-muted/60 border border-border p-2 rounded" value={newIntEnd} onChange={(e) => setNewIntEnd(e.target.value)} required />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Timezone</label>
                    <input type="text" className="w-full bg-muted/60 border border-border p-2 rounded" value={newIntTimezone} onChange={(e) => setNewIntTimezone(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Buffer (Min)</label>
                    <input type="number" className="w-full bg-muted/60 border border-border p-2 rounded" value={newIntBuffer} onChange={(e) => setNewIntBuffer(Number(e.target.value))} required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Location</label>
                    <input type="text" className="w-full bg-muted/60 border border-border p-2 rounded" value={newIntLocation} onChange={(e) => setNewIntLocation(e.target.value)} required />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Meeting URL</label>
                  <input type="text" className="w-full bg-muted/60 border border-border p-2 rounded" value={newIntUrl} onChange={(e) => setNewIntUrl(e.target.value)} required />
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setShowScheduleModal(false)}>Cancel</Button>
                  <Button type="submit">Schedule Round</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* FEEDBACK SCORECARD MODAL */}
        {scoringInterviewId && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-xl max-w-lg w-full p-6 shadow-lg space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-foreground">Submit Structured Feedback Scorecard</h3>
                <button onClick={() => setScoringInterviewId(null)} className="text-muted-foreground hover:text-foreground">✕</button>
              </div>

              <form onSubmit={submitScorecard} className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Technical skills (1-5)</label>
                    <input type="number" min="1" max="5" className="w-full bg-muted/60 border border-border p-2 rounded" value={techRating} onChange={(e) => setTechRating(Number(e.target.value))} required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Communication (1-5)</label>
                    <input type="number" min="1" max="5" className="w-full bg-muted/60 border border-border p-2 rounded" value={commRating} onChange={(e) => setCommRating(Number(e.target.value))} required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Problem Solving (1-5)</label>
                    <input type="number" min="1" max="5" className="w-full bg-muted/60 border border-border p-2 rounded" value={probRating} onChange={(e) => setProbRating(Number(e.target.value))} required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Leadership fit (1-5)</label>
                    <input type="number" min="1" max="5" className="w-full bg-muted/60 border border-border p-2 rounded" value={leadRating} onChange={(e) => setLeadRating(Number(e.target.value))} required />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Cultural Match (1-5)</label>
                  <input type="number" min="1" max="5" className="w-full bg-muted/60 border border-border p-2 rounded" value={cultRating} onChange={(e) => setCultRating(Number(e.target.value))} required />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Key Strengths (comma separated)</label>
                  <input type="text" className="w-full bg-muted/60 border border-border p-2 rounded" value={strengthsInput} onChange={(e) => setStrengthsInput(e.target.value)} required />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Areas for improvement (comma separated)</label>
                  <input type="text" className="w-full bg-muted/60 border border-border p-2 rounded" value={weaknessesInput} onChange={(e) => setWeaknessesInput(e.target.value)} required />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Hiring Recommendation</label>
                  <select className="w-full bg-muted border border-border p-2 rounded text-foreground" value={recommendation} onChange={(e) => setRecommendation(e.target.value as any)}>
                    <option value="STRONG_HIRE">STRONG HIRE</option>
                    <option value="HIRE">HIRE</option>
                    <option value="NO_HIRE">NO HIRE</option>
                    <option value="STRONG_NO_HIRE">STRONG NO HIRE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Evaluation Summary Notes</label>
                  <textarea className="w-full bg-muted/60 border border-border p-2 rounded h-20" value={addNotes} onChange={(e) => setAddNotes(e.target.value)} required />
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setScoringInterviewId(null)}>Cancel</Button>
                  <Button type="submit">Submit Scorecard</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DRAFT OFFER MODAL */}
        {showOfferModal && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-xl max-w-lg w-full p-6 shadow-lg space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-foreground">Draft Employment Offer</h3>
                <button onClick={() => setShowOfferModal(false)} className="text-muted-foreground hover:text-foreground">✕</button>
              </div>

              <form onSubmit={handleCreateOffer} className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Candidate Name</label>
                    <input type="text" className="w-full bg-muted/60 border border-border p-2 rounded" value={newOfferCandidate} onChange={(e) => setNewOfferCandidate(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Target Role</label>
                    <input type="text" className="w-full bg-muted/60 border border-border p-2 rounded" value={newOfferJob} onChange={(e) => setNewOfferJob(e.target.value)} required />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Contract template</label>
                  <input type="text" className="w-full bg-muted/60 border border-border p-2 rounded" value={newOfferTemplate} onChange={(e) => setNewOfferTemplate(e.target.value)} required />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Base Salary (USD / yr)</label>
                    <input type="number" className="w-full bg-muted/60 border border-border p-2 rounded" value={newOfferSalary} onChange={(e) => setNewOfferSalary(Number(e.target.value))} required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Sign-on Bonus (USD)</label>
                    <input type="number" className="w-full bg-muted/60 border border-border p-2 rounded" value={newOfferBonus} onChange={(e) => setNewOfferBonus(Number(e.target.value))} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Target Start Date</label>
                    <input type="date" className="w-full bg-muted/60 border border-border p-2 rounded" value={newOfferJoin} onChange={(e) => setNewOfferJoin(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Offer Expiration Date</label>
                    <input type="date" className="w-full bg-muted/60 border border-border p-2 rounded" value={newOfferExpire} onChange={(e) => setNewOfferExpire(e.target.value)} required />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Package Benefits & Stipends</label>
                  <textarea className="w-full bg-muted/60 border border-border p-2 rounded h-20" value={newOfferBenefits} onChange={(e) => setNewOfferBenefits(e.target.value)} required />
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setShowOfferModal(false)}>Cancel</Button>
                  <Button type="submit">Initiate Approval Chain</Button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </PlatformShell>
  );
}
