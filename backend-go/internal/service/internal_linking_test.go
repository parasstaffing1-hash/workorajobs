package service

import (
	"testing"
)

func TestInternalLinkingEngineConnections(t *testing.T) {
	svc := NewInternalLinkingService(nil, "https://workorajobs.com")

	// 1. Job Connections (1-5: Job -> Company, Skill, City, Salary, Similar Jobs)
	jobGraph, err := svc.GetJobLinks("job_101")
	if err != nil {
		t.Fatalf("GetJobLinks failed: %v", err)
	}

	if len(jobGraph.Outbound) < 4 {
		t.Errorf("Expected at least 4 outbound links for Job, got %d", len(jobGraph.Outbound))
	}
	if len(jobGraph.Similar) < 2 {
		t.Errorf("Expected at least 2 similar jobs, got %d", len(jobGraph.Similar))
	}

	// 2. Company Connections (6-7: Company -> Jobs, Industry)
	compGraph, err := svc.GetCompanyLinks("google")
	if err != nil {
		t.Fatalf("GetCompanyLinks failed: %v", err)
	}
	if len(compGraph.Outbound) < 2 {
		t.Errorf("Expected Company links, got %d", len(compGraph.Outbound))
	}

	// 3. Skill Connections (8-9: Skill -> Jobs, Salary)
	skillGraph, err := svc.GetSkillLinks("golang")
	if err != nil {
		t.Fatalf("GetSkillLinks failed: %v", err)
	}
	if len(skillGraph.Outbound) < 2 {
		t.Errorf("Expected Skill links, got %d", len(skillGraph.Outbound))
	}

	// 4. City Connections (10-11: City -> Companies, Jobs)
	cityGraph, err := svc.GetCityLinks("bengaluru")
	if err != nil {
		t.Fatalf("GetCityLinks failed: %v", err)
	}
	if len(cityGraph.Outbound) < 2 {
		t.Errorf("Expected City links, got %d", len(cityGraph.Outbound))
	}

	// 5. Industry Connections (12-13: Industry -> Companies, Jobs)
	indGraph, err := svc.GetIndustryLinks("software-engineering")
	if err != nil {
		t.Fatalf("GetIndustryLinks failed: %v", err)
	}
	if len(indGraph.Outbound) < 2 {
		t.Errorf("Expected Industry links, got %d", len(indGraph.Outbound))
	}
}

func TestOrphanPageAuditAndCrawlDepth(t *testing.T) {
	svc := NewInternalLinkingService(nil, "https://workorajobs.com")

	// 1. Orphan Audit
	audit := svc.AuditOrphanPages()
	if audit.TotalAudited == 0 {
		t.Errorf("Orphan audit returned 0 audited pages")
	}
	if audit.OrphanCount > 0 {
		t.Errorf("Expected 0 orphans after auto-linking, got %d", audit.OrphanCount)
	}

	// 2. Crawl Depth Optimization (target <= 3 clicks)
	homeDepth := svc.ComputeCrawlDepth("https://workorajobs.com/")
	if homeDepth != 0 {
		t.Errorf("Expected homepage crawl depth 0, got %d", homeDepth)
	}

	jobDepth := svc.ComputeCrawlDepth("https://workorajobs.com/jobs/senior-golang-developer")
	if jobDepth > 3 {
		t.Errorf("Crawl depth exceeds target 3 clicks: %d", jobDepth)
	}
}
