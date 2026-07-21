"use client";

import {
  Activity,
  CheckCircle2,
  Loader2,
  Settings,
  Terminal,
  Trash2,
  Webhook,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

import { PlatformShell } from "@/components/platform/platform-shell";
import { WorkflowCard } from "@/components/platform/workflow-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { recruiterNav } from "@/data/platform";
import { N8NConfig, N8NLog } from "@/lib/N8nConnector";


export default function RecruiterAutomationPage() {
  const [config, setConfig] = useState<N8NConfig>({
    enabled: false,
    webhookUrl: "",
    events: {
      job_created: false,
      application_status_changed: false,
      ats_scan_completed: false,
      copywriter_document_assembled: false,
    },
  });
  const [logs, setLogs] = useState<N8NLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [testEvent, setTestEvent] = useState("job_created");
  const [isTesting, setIsTesting] = useState(false);
  const [testSuccess, setTestSuccess] = useState<string | null>(null);
  const [testError, setTestError] = useState<string | null>(null);

  const [inspectingLog, setInspectingLog] = useState<N8NLog | null>(null);

  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/n8n/config");
      const data = await res.json();
      if (data.success) {
        if (data.config) setConfig(data.config);
        if (data.logs) setLogs(data.logs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchConfig();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError("");

    try {
      const res = await fetch("/api/n8n/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError(data.error || "Failed to save configuration.");
      }
    } catch (err) {
      setSaveError("Network error. Please try again.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleEvent = (key: keyof N8NConfig["events"]) => {
    setConfig((prev) => ({
      ...prev,
      events: {
        ...prev.events,
        [key]: !prev.events[key],
      },
    }));
  };

  const handleDispatchTest = async () => {
    setIsTesting(true);
    setTestSuccess(null);
    setTestError(null);

    try {
      const res = await fetch("/api/n8n/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventType: testEvent }),
      });
      const data = await res.json();

      if (data.success) {
        setTestSuccess(`Mock event '${testEvent}' dispatched successfully!`);
        setTimeout(() => setTestSuccess(null), 4000);
      } else {
        setTestError(data.message || data.error || "Mock dispatch failed.");
        setTimeout(() => setTestError(null), 4000);
      }

      // Reload config & logs to display in history
      void fetchConfig();
    } catch (err) {
      setTestError("Failed to trigger mock webhook.");
      setTimeout(() => setTestError(null), 4000);
      console.error(err);
    } finally {
      setIsTesting(false);
    }
  };

  const handleClearLogs = async () => {
    try {
      const res = await fetch("/api/n8n/logs/clear", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setLogs([]);
        setInspectingLog(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <PlatformShell
        badge="Recruiter"
        description="Configure webhooks and event triggers for n8n integration."
        nav={recruiterNav}
        title="Automation"
      >
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PlatformShell>
    );
  }

  return (
    <PlatformShell
      badge="Recruiter"
      description="Prepare n8n-powered workflows for job creation, status updates, ATS scans, and document assembly."
      nav={recruiterNav}
      title="Automation"
    >
      <div className="space-y-6">
        {/* CONFIGURATION & EVENTS PANEL */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* GENERAL SETTINGS */}
          <WorkflowCard
            action={
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Configuration</span>
              </div>
            }
            title="n8n Integration Settings"
          >
            <form onSubmit={handleSave} className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-secondary/20">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Enable Webhooks</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Toggle to enable or disable outbound webhook dispatches to n8n.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setConfig((prev) => ({ ...prev, enabled: !prev.enabled }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                    config.enabled ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                      config.enabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  n8n Webhook URL
                </label>
                <Input
                  type="url"
                  placeholder="https://n8n.your-domain.com/webhook/..."
                  value={config.webhookUrl}
                  onChange={(e) => setConfig((prev) => ({ ...prev, webhookUrl: e.target.value }))}
                  className="text-xs h-9 bg-secondary/10"
                />
              </div>

              {saveSuccess && (
                <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 flex items-center gap-2 text-emerald-500 text-xs font-semibold">
                  <CheckCircle2 className="h-4 w-4" />
                  Configuration saved successfully!
                </div>
              )}

              {saveError && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 flex items-center gap-2 text-red-500 text-xs font-semibold">
                  <XCircle className="h-4 w-4" />
                  {saveError}
                </div>
              )}

              <Button
                disabled={isSaving}
                type="submit"
                variant="accent"
                className="w-full text-xs font-bold flex items-center justify-center gap-2 h-9"
              >
                {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Save Configuration
              </Button>
            </form>
          </WorkflowCard>

          {/* EVENT TRIGGERS */}
          <WorkflowCard
            action={
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Outbound Triggers</span>
              </div>
            }
            title="Event Triggers"
          >
            <div className="space-y-3">
              {[
                {
                  key: "job_created" as const,
                  name: "Job Created",
                  desc: "Fires when a new Job Posting draft or live posting is saved.",
                },
                {
                  key: "application_status_changed" as const,
                  name: "Application Status Changed",
                  desc: "Fires when candidate workflow changes stage (applied, offer, etc).",
                },
                {
                  key: "ats_scan_completed" as const,
                  name: "ATS Scan Completed",
                  desc: "Fires when AI resume scoring reports profile match index.",
                },
                {
                  key: "copywriter_document_assembled" as const,
                  name: "Copywriter Document Assembled",
                  desc: "Fires when AI hiring artifacts compile draft descriptions.",
                },
              ].map((evt) => (
                <div
                  key={evt.key}
                  className="flex items-center justify-between border border-border p-3.5 rounded-lg bg-card"
                >
                  <div>
                    <h4 className="text-xs font-bold text-foreground">{evt.name}</h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{evt.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleEvent(evt.key)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 ${
                      config.events[evt.key] ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-300 ${
                        config.events[evt.key] ? "translate-x-4.5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </WorkflowCard>
        </div>

        {/* QUICK TEST CONSOLE */}
        <WorkflowCard
          action={
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Test Console</span>
            </div>
          }
          title="Interactive Webhook Quick-Test Console"
        >
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1">
              <label className="text-xs font-semibold text-foreground mb-1 block">
                Select Test Event Scenario
              </label>
              <Select
                value={testEvent}
                onChange={(e) => setTestEvent(e.target.value)}
                className="h-9 text-xs"
              >
                <option value="job_created">Job Created (New job published)</option>
                <option value="application_status_changed">
                  Application Status Changed (Applied to Interviewing)
                </option>
                <option value="ats_scan_completed">
                  ATS Scan Completed (Match score compiled)
                </option>
                <option value="copywriter_document_assembled">
                  Copywriter Document Assembled (Artifact saved)
                </option>
              </Select>
            </div>
            <Button
              disabled={isTesting}
              onClick={handleDispatchTest}
              variant="accent"
              className="font-bold text-xs h-9 flex items-center gap-2"
            >
              {isTesting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Dispatching...
                </>
              ) : (
                <>
                  <Webhook className="h-3.5 w-3.5" /> Dispatch Test Webhook
                </>
              )}
            </Button>
          </div>

          {testSuccess && (
            <div className="mt-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3.5 flex items-center gap-2 text-emerald-500 text-xs font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              {testSuccess}
            </div>
          )}

          {testError && (
            <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3.5 flex items-center gap-2 text-red-500 text-xs font-semibold">
              <XCircle className="h-4 w-4" />
              {testError}
            </div>
          )}
        </WorkflowCard>

        {/* LOGS TABLE AND INSPECTOR */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Logs table */}
          <div className="lg:col-span-7">
            <WorkflowCard
              action={
                <Button
                  onClick={handleClearLogs}
                  size="sm"
                  variant="outline"
                  className="text-xs text-red-500 border-red-500/20 hover:bg-red-500/10"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Clear History
                </Button>
              }
              title="Webhook Delivery Logs"
            >
              <div className="overflow-x-auto border border-border/80 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-secondary/40 border-b border-border/80 text-muted-foreground">
                      <th className="p-3 font-semibold">Timestamp</th>
                      <th className="p-3 font-semibold">Event Type</th>
                      <th className="p-3 font-semibold">Status</th>
                      <th className="p-3 font-semibold">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id} className="border-b border-border/60 hover:bg-secondary/20">
                        <td className="p-3 text-muted-foreground whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="p-3 font-bold whitespace-nowrap">{log.eventType}</td>
                        <td className="p-3 whitespace-nowrap">
                          <Badge
                            className={
                              log.status === "success"
                                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                : "bg-red-500/10 text-red-500 border border-red-500/20"
                            }
                          >
                            {log.status === "success" ? `Success (${log.statusCode})` : `Failed (${log.statusCode})`}
                          </Badge>
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <Button onClick={() => setInspectingLog(log)} size="sm" variant="outline">
                            Inspect Payload
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {logs.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-muted-foreground">
                          No webhook logs recorded yet. Send a test scenario or trigger events to view deliveries.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </WorkflowCard>
          </div>

          {/* Logs inspector */}
          <div className="lg:col-span-5">
            <WorkflowCard
              action={
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Terminal className="h-3.5 w-3.5" />
                  Code Inspector
                </div>
              }
              title="Webhook Inspector"
            >
              {inspectingLog ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div>
                      <h4 className="text-xs font-bold text-foreground">
                        {inspectingLog.eventType}
                      </h4>
                      <span className="text-[10px] text-muted-foreground">
                        ID: {inspectingLog.id}
                      </span>
                    </div>
                    <Badge
                      className={
                        inspectingLog.status === "success"
                          ? "bg-emerald-500/15 text-emerald-500"
                          : "bg-red-500/15 text-red-500"
                      }
                    >
                      {inspectingLog.status === "success"
                        ? `SUCCESS: HTTP ${inspectingLog.statusCode}`
                        : `FAILED: HTTP ${inspectingLog.statusCode}`}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Outbound JSON Payload
                    </label>
                    <pre className="rounded-lg bg-black border border-border/80 p-3.5 text-[10px] font-mono text-green-400 overflow-x-auto max-h-48 whitespace-pre-wrap leading-4">
                      {JSON.stringify(inspectingLog.payload, null, 2)}
                    </pre>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Server Webhook Response
                    </label>
                    <pre className="rounded-lg bg-black border border-border/80 p-3.5 text-[10px] font-mono text-foreground overflow-x-auto max-h-48 whitespace-pre-wrap leading-4">
                      {JSON.stringify(inspectingLog.response, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="h-64 border border-dashed border-border rounded-xl flex items-center justify-center text-center p-6 text-xs text-muted-foreground">
                  Select a webhook item from the logs history list to inspect its outbound payload and n8n response bodies.
                </div>
              )}
            </WorkflowCard>
          </div>
        </div>
      </div>
    </PlatformShell>
  );
}
