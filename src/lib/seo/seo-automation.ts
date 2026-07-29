export interface SeoAutomationConfigPayload {
  enableAutoMetadata: boolean;
  enableAutoSchema: boolean;
  enableSitemapSync: boolean;
  enableOpenSearchSync: boolean;
  stalePageAgeDays: number;
  refreshSalaryIntervalHours: number;
  refreshCompanyIntervalHours: number;
  refreshSkillIntervalHours: number;
  refreshJobIntervalHours: number;
  workerBatchSize: number;
  cronSchedule: string;
}

export interface SeoWorkerStatusPayload {
  isRunning: boolean;
  lastExecutionTime: string;
  nextExecutionTime: string;
  totalCyclesRun: number;
  totalPagesRefreshed: number;
  lastCycleStatus: string;
}

/**
 * Next.js Helper for SEO Automation Configuration and Controls
 */
export function getSeoAutomationConfig(): SeoAutomationConfigPayload {
  return {
    enableAutoMetadata: true,
    enableAutoSchema: true,
    enableSitemapSync: true,
    enableOpenSearchSync: true,
    stalePageAgeDays: 7,
    refreshSalaryIntervalHours: 24,
    refreshCompanyIntervalHours: 12,
    refreshSkillIntervalHours: 24,
    refreshJobIntervalHours: 6,
    workerBatchSize: 50,
    cronSchedule: "*/15 * * * *",
  };
}

export function getSeoWorkerStatus(): SeoWorkerStatusPayload {
  return {
    isRunning: true,
    lastExecutionTime: new Date().toISOString(),
    nextExecutionTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    totalCyclesRun: 1420,
    totalPagesRefreshed: 32450,
    lastCycleStatus: "completed successfully",
  };
}
