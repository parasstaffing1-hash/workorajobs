// GA4 & Search Measurement Helper for WorkoraJobs

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export type CandidateEvent =
  | "view_job"
  | "search_jobs"
  | "filter_jobs"
  | "start_application"
  | "submit_application"
  | "create_candidate_account"
  | "upload_resume"
  | "use_resume_builder"
  | "complete_ats_check"
  | "save_job";

export type EmployerEvent =
  | "view_employer_service"
  | "start_demo_form"
  | "submit_demo_form"
  | "post_job"
  | "create_employer_account"
  | "view_pricing"
  | "contact_sales";

export function trackEvent(
  eventName: CandidateEvent | EmployerEvent,
  params?: Record<string, any>
) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, {
      ...params,
      timestamp: new Date().toISOString(),
    });
  }
}

export function trackCandidateAction(
  action: CandidateEvent,
  jobId?: string,
  extraParams?: Record<string, any>
) {
  trackEvent(action, {
    category: "candidate_experience",
    job_id: jobId,
    ...extraParams,
  });
}

export function trackEmployerAction(
  action: EmployerEvent,
  extraParams?: Record<string, any>
) {
  trackEvent(action, {
    category: "employer_lead",
    ...extraParams,
  });
}
