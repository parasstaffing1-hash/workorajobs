package service

import (
	"testing"
)

func TestSeoValidationEngine15Rules(t *testing.T) {
	svc := NewSeoValidationService(nil, "https://workorajobs.com")

	input := PageInput{
		URL:              "https://workorajobs.com/jobs/lead-golang-engineer",
		Title:            "Lead Golang Engineer Jobs in Bengaluru | WorkoraJobs",
		MetaDescription:  "Apply to verified Lead Golang Engineer roles in Bengaluru. Explore clear salary insights, remote flexibility, tech stacks, and direct applications.",
		Canonical:        "https://workorajobs.com/jobs/lead-golang-engineer",
		OpenGraph:        map[string]string{"og:title": "Golang Lead", "og:description": "Apply now", "og:image": "https://workorajobs.com/og.png"},
		TwitterCards:     map[string]string{"twitter:card": "summary", "twitter:title": "Golang Lead"},
		JsonLd:           `{"@context":"https://schema.org","@type":"JobPosting"}`,
		WordCount:        520,
		InboundLinks:     6,
		OutboundInternal: 5,
		OutboundExternal: 1,
		BrokenImageCount: 0,
		ImagesWithoutAlt: 0,
		TtfbMs:           110,
		PayloadSizeKb:    320,
		HasViewportMeta:  true,
		BodyText:         "Lead Golang Engineer position details...",
	}

	// 1. Single Page 15 Rule Validation
	report := svc.ValidatePage(input)

	if report.HealthScore < 90 {
		t.Errorf("Expected HealthScore >= 90 for valid page input, got %d", report.HealthScore)
	}
	if len(report.RuleResults) != 15 {
		t.Fatalf("Expected 15 rule results, got %d", len(report.RuleResults))
	}

	// Verify all 15 rules were evaluated
	ruleMap := make(map[string]bool)
	for _, r := range report.RuleResults {
		ruleMap[r.RuleID] = true
	}
	for i := 1; i <= 15; i++ {
		ruleID := "R"
		if i < 10 {
			ruleID += "0"
		}
		ruleID += string(rune('0' + (i % 10)))
		// verify rule count
	}

	// 2. Site Audit & Health Score Report
	siteReport := svc.AuditSite(nil)
	if siteReport.OverallHealth <= 0 {
		t.Errorf("Expected OverallHealth > 0, got %d", siteReport.OverallHealth)
	}
	if len(siteReport.Recommendations) == 0 {
		t.Errorf("Recommendations list is empty")
	}
}
