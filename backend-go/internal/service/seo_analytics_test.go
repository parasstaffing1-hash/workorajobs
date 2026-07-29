package service

import (
	"testing"
)

func TestSeoAnalyticsDashboardMetricsAndCharts(t *testing.T) {
	svc := NewSeoAnalyticsService(nil, nil, nil, nil, nil, "https://workorajobs.com")

	// 1. Overview Metrics (13 Tracked Metrics)
	overview := svc.GetOverviewMetrics()

	if overview.IndexedPages <= 0 {
		t.Errorf("Expected IndexedPages > 0, got %d", overview.IndexedPages)
	}
	if overview.CoreWebVitals.Status == "" {
		t.Errorf("CoreWebVitals.Status is empty")
	}
	if overview.InternalLinksCount <= 0 {
		t.Errorf("Expected InternalLinksCount > 0, got %d", overview.InternalLinksCount)
	}
	if overview.SearchPerformance.TotalClicks <= 0 {
		t.Errorf("Expected TotalClicks > 0, got %d", overview.SearchPerformance.TotalClicks)
	}
	if overview.SitemapStatus == "" {
		t.Errorf("SitemapStatus is empty")
	}

	// 2. 30-Day Chart Series Generator
	charts := svc.GetChartData()

	if len(charts.CrawlHealthTrend) != 30 {
		t.Errorf("Expected 30 days in CrawlHealthTrend, got %d", len(charts.CrawlHealthTrend))
	}
	if len(charts.SearchClicksTrend) != 30 {
		t.Errorf("Expected 30 days in SearchClicksTrend, got %d", len(charts.SearchClicksTrend))
	}
	if len(charts.IssueDistribution) == 0 {
		t.Errorf("IssueDistribution is empty")
	}

	// 3. Search Performance Analytics
	perf := svc.GetSearchPerformanceData()
	if perf.AverageCTR <= 0 {
		t.Errorf("Expected AverageCTR > 0, got %f", perf.AverageCTR)
	}
}
