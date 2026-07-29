package service

import (
	"testing"
)

func TestSeoAutomationEngineCycleAndConfig(t *testing.T) {
	svc := NewSeoAutomationService(nil, nil, nil, nil, nil, nil, "https://workorajobs.com")

	// 1. Get Default Config
	cfg := svc.GetConfig()
	if !cfg.EnableAutoMetadata {
		t.Errorf("Expected EnableAutoMetadata true by default")
	}
	if cfg.StalePageAgeDays != 7 {
		t.Errorf("Expected StalePageAgeDays 7, got %d", cfg.StalePageAgeDays)
	}

	// 2. Update Config
	cfg.StalePageAgeDays = 14
	updated := svc.UpdateConfig(cfg)
	if updated.StalePageAgeDays != 14 {
		t.Errorf("Expected updated StalePageAgeDays 14, got %d", updated.StalePageAgeDays)
	}

	// 3. Trigger Automation Cycle
	result := svc.RunAutomationCycle()
	if result.MetadataGenerated <= 0 {
		t.Errorf("Expected MetadataGenerated > 0, got %d", result.MetadataGenerated)
	}
	if result.SalaryRefreshed <= 0 {
		t.Errorf("Expected SalaryRefreshed > 0, got %d", result.SalaryRefreshed)
	}
	if result.CompanyRefreshed <= 0 {
		t.Errorf("Expected CompanyRefreshed > 0, got %d", result.CompanyRefreshed)
	}

	// 4. Check Worker Status
	status := svc.GetWorkerStatus()
	if !status.IsRunning {
		t.Errorf("Expected IsRunning true")
	}
	if status.TotalCyclesRun != 1 {
		t.Errorf("Expected TotalCyclesRun 1, got %d", status.TotalCyclesRun)
	}
}
