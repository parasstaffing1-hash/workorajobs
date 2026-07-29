package service

import (
	"testing"
)

func TestCrawlOptimizationEngineAllDetectors(t *testing.T) {
	svc := NewCrawlOptimizationService(nil, "https://workorajobs.com")

	samples := []CrawlPageSample{
		{URL: "https://workorajobs.com/jobs/dev?utm_source=test", StatusCode: 200, BodyText: "Dev Role", WordCount: 300, Canonical: "https://workorajobs.com/jobs/dev", InboundLinks: 3},
		{URL: "https://workorajobs.com/jobs/dup1", StatusCode: 200, BodyText: "Identical body text content sample", WordCount: 100, Canonical: "", InboundLinks: 1},
		{URL: "https://workorajobs.com/jobs/dup2", StatusCode: 200, BodyText: "Identical body text content sample", WordCount: 100, Canonical: "https://workorajobs.com/jobs/dup1", InboundLinks: 0},
		{URL: "https://workorajobs.com/expired-page", StatusCode: 200, BodyText: "404 Not Found - Page Expired", WordCount: 50, Canonical: "", InboundLinks: 0},
		{URL: "https://workorajobs.com/loop/loop/loop/page", StatusCode: 200, BodyText: "Loop Path Page", WordCount: 400, Canonical: "https://workorajobs.com/loop/page", InboundLinks: 2},
		{URL: "https://workorajobs.com/broken-target", StatusCode: 404, BodyText: "Not Found", WordCount: 10, Canonical: "", InboundLinks: 1},
	}

	// 1. Crawl Budget Detector
	cbIssues := svc.DetectCrawlBudgetIssues(samples)
	if len(cbIssues) == 0 {
		t.Errorf("Expected Crawl Budget issues for utm_ parameter")
	}

	// 2. Exact Duplicate Detector
	dupIssues := svc.DetectExactDuplicates(samples)
	if len(dupIssues) == 0 {
		t.Errorf("Expected Exact Duplicate issue for identical body text")
	}

	// 3. Canonical Validator
	canIssues := svc.ValidateCanonicals(samples)
	if len(canIssues) == 0 {
		t.Errorf("Expected Missing Canonical issue")
	}

	// 4. Broken Link Detector
	brkIssues := svc.DetectBrokenLinks(samples)
	if len(brkIssues) == 0 {
		t.Errorf("Expected Broken Link issue for 404 status")
	}

	// 5. Orphan Page Detector
	orpIssues := svc.DetectOrphanPages(samples)
	if len(orpIssues) == 0 {
		t.Errorf("Expected Orphan Page issue for 0 inbound links")
	}

	// 6. Thin Content Detector
	thnIssues := svc.DetectThinContent(samples)
	if len(thnIssues) == 0 {
		t.Errorf("Expected Thin Content issue for < 250 words")
	}

	// 7. Soft 404 Detector
	sftIssues := svc.DetectSoft404s(samples)
	if len(sftIssues) == 0 {
		t.Errorf("Expected Soft 404 issue for 200 OK + 404 text")
	}

	// 8. Infinite URL Loop Detector
	infIssues := svc.DetectInfiniteUrlLoops(samples)
	if len(infIssues) == 0 {
		t.Errorf("Expected Infinite URL Loop issue for repeated path segments")
	}

	// 9. Full Diagnostic Audit & Health Score
	report := svc.RunFullAudit()
	if report.CrawlHealth < 0 || report.CrawlHealth > 100 {
		t.Errorf("Invalid crawl health score: %d", report.CrawlHealth)
	}
	if len(report.Recommendations) == 0 {
		t.Errorf("Recommendations list is empty")
	}
}
