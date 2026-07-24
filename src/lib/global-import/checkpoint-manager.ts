/**
 * Checkpoint State & Resumable Importer Progress Manager
 */

import fs from "fs";
import path from "path";
import { CheckpointProgress, SourceCountryRecord } from "./types";

const CHECKPOINT_FILE_PATH = path.join(process.cwd(), "scratch", "global_import_checkpoint.json");

export interface CheckpointStore {
  discoveredCountries: SourceCountryRecord[];
  countryProgress: Record<string, CheckpointProgress>;
  lastUpdated: string;
}

export function loadCheckpointStore(): CheckpointStore {
  try {
    if (fs.existsSync(CHECKPOINT_FILE_PATH)) {
      const data = fs.readFileSync(CHECKPOINT_FILE_PATH, "utf-8");
      return JSON.parse(data);
    }
  } catch {
    // Return empty store if unreadable
  }

  return {
    discoveredCountries: [],
    countryProgress: {},
    lastUpdated: new Date().toISOString(),
  };
}

export function saveCheckpointStore(store: CheckpointStore): void {
  try {
    const dir = path.dirname(CHECKPOINT_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    store.lastUpdated = new Date().toISOString();
    fs.writeFileSync(CHECKPOINT_FILE_PATH, JSON.stringify(store, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to save checkpoint store:", e);
  }
}

export function updateCountryCheckpoint(
  countrySlug: string,
  progress: Partial<CheckpointProgress>
): CheckpointProgress {
  const store = loadCheckpointStore();
  const existing = store.countryProgress[countrySlug] || {
    countrySlug,
    currentPage: 1,
    discoveredCount: 0,
    verifiedCount: 0,
    appliedCount: 0,
    failedCount: 0,
    reviewCount: 0,
    lastRunAt: new Date().toISOString(),
    status: "pending",
  };

  const updated: CheckpointProgress = {
    ...existing,
    ...progress,
    lastRunAt: new Date().toISOString(),
  };

  store.countryProgress[countrySlug] = updated;
  saveCheckpointStore(store);
  return updated;
}
