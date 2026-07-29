package service

import (
	"testing"
)

func TestSearchIndexingSystemPipeline(t *testing.T) {
	svc := NewSearchIndexingService(nil, nil, "https://workorajobs.com")

	// 1. Queue Jobs
	job1 := svc.QueueJob("/jobs/senior-golang-developer", "job", ActionIndexNew, 1)
	if job1.Status != "pending" {
		t.Errorf("Expected job status pending, got %s", job1.Status)
	}

	job2 := svc.QueueJob("/companies/acme-corp", "company", ActionIndexModify, 2)
	if job2.Priority != 2 {
		t.Errorf("Expected priority 2, got %d", job2.Priority)
	}

	queue := svc.GetQueue()
	if len(queue) != 2 {
		t.Fatalf("Expected 2 items in queue, got %d", len(queue))
	}

	// 2. Batch Processing
	success, failed := svc.ProcessBatchQueue(2)
	if success != 2 {
		t.Errorf("Expected 2 successful syncs, got %d", success)
	}
	if failed != 0 {
		t.Errorf("Expected 0 failures, got %d", failed)
	}

	// 3. Change Detection
	detected := svc.DetectChanges()
	if detected != 2 {
		t.Errorf("Expected 2 detected changes, got %d", detected)
	}

	// 4. Retry Backoff Exec
	retried := svc.ExecuteRetryBackoff()
	if retried != 2 {
		t.Errorf("Expected 2 retried jobs, got %d", retried)
	}

	// 5. Dashboard Metrics
	metrics := svc.GetDashboardMetrics()
	if metrics.TotalIndexed < 2 {
		t.Errorf("Expected total indexed >= 2, got %d", metrics.TotalIndexed)
	}
	if metrics.OpenSearchStatus == "" {
		t.Errorf("OpenSearchStatus is empty")
	}
	if metrics.SitemapSyncStatus == "" {
		t.Errorf("SitemapSyncStatus is empty")
	}
}
