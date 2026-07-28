package service

import (
	"encoding/json"
	"strings"
	"testing"

	"github.com/workorajobs/backend-go/internal/domain/models"
)

func TestSeoEngineSchemaGenerators(t *testing.T) {
	seoService := NewSeoServiceWithBaseURL(nil, "https://workorajobs.com")

	// 1. Test JobPosting Schema Generator
	loc := "Remote, USA"
	salaryMin := 120000
	salaryMax := 180000
	currency := "USD"
	companyName := "Acme Corp"
	websiteURL := "https://acme.com"

	job := &models.Job{
		ID:          "job_1001",
		Title:       "Principal Go Architect",
		Description: "Build distributed backend systems at scale",
		Type:        models.JobTypeFullTime,
		Location:    &loc,
		SalaryMin:   &salaryMin,
		SalaryMax:   &salaryMax,
		Currency:    &currency,
		Company: &models.Company{
			Name:       companyName,
			WebsiteURL: &websiteURL,
		},
	}

	jobSchemaJSON, err := seoService.GenerateJobPostingSchema(job)
	if err != nil {
		t.Fatalf("Failed to generate job posting schema: %v", err)
	}

	if !strings.Contains(jobSchemaJSON, "Principal Go Architect") {
		t.Errorf("Expected job posting schema to contain title, got %s", jobSchemaJSON)
	}
	if !strings.Contains(jobSchemaJSON, "Acme Corp") {
		t.Errorf("Expected job posting schema to contain company name, got %s", jobSchemaJSON)
	}
	if !strings.Contains(jobSchemaJSON, "MonetaryAmount") {
		t.Errorf("Expected job posting schema to contain BaseSalary monetary amount, got %s", jobSchemaJSON)
	}

	// 2. Test Organization Schema Generator
	orgSchemaJSON, err := seoService.GenerateOrganizationSchema()
	if err != nil {
		t.Fatalf("Failed to generate organization schema: %v", err)
	}

	var orgMap map[string]interface{}
	if err := json.Unmarshal([]byte(orgSchemaJSON), &orgMap); err != nil {
		t.Fatalf("Invalid organization JSON: %v", err)
	}
	if orgMap["name"] != "WorkoraJobs" {
		t.Errorf("Expected organization name WorkoraJobs, got %v", orgMap["name"])
	}

	// 3. Test FAQ Schema Generator
	faqSchemaJSON, err := seoService.GenerateFAQSchema(nil)
	if err != nil {
		t.Fatalf("Failed to generate FAQ schema: %v", err)
	}
	if !strings.Contains(faqSchemaJSON, "FAQPage") {
		t.Errorf("Expected FAQ schema to contain FAQPage, got %s", faqSchemaJSON)
	}

	// 4. Test Breadcrumb Schema Generator
	breadcrumbSchemaJSON, err := seoService.GenerateBreadcrumbSchema(nil)
	if err != nil {
		t.Fatalf("Failed to generate breadcrumb schema: %v", err)
	}
	if !strings.Contains(breadcrumbSchemaJSON, "BreadcrumbList") {
		t.Errorf("Expected breadcrumb schema to contain BreadcrumbList, got %s", breadcrumbSchemaJSON)
	}

	// 5. Test WebSite Schema Generator
	siteSchemaJSON, err := seoService.GenerateWebSiteSchema()
	if err != nil {
		t.Fatalf("Failed to generate website schema: %v", err)
	}
	if !strings.Contains(siteSchemaJSON, "SearchAction") {
		t.Errorf("Expected website schema to contain SearchAction, got %s", siteSchemaJSON)
	}
}

func TestCanonicalURLAndMetadataBuilder(t *testing.T) {
	seoService := NewSeoServiceWithBaseURL(nil, "https://workorajobs.com")

	// 1. Canonical URL Cleaner strips tracking params & page 1
	dirtyURL := "/jobs?q=developer&utm_source=google&utm_medium=cpc&gclid=12345&page=1&sort=desc"
	cleanURL := seoService.BuildCanonicalURL(dirtyURL)

	if strings.Contains(cleanURL, "utm_source") || strings.Contains(cleanURL, "gclid") || strings.Contains(cleanURL, "page=1") {
		t.Errorf("BuildCanonicalURL failed to strip tracking params: got %s", cleanURL)
	}
	if !strings.Contains(cleanURL, "q=developer") {
		t.Errorf("BuildCanonicalURL should keep search query, got %s", cleanURL)
	}

	// 2. Metadata Generator pagination & OpenGraph check
	meta := seoService.GenerateMetadata("Tech Jobs", "Discover tech careers", "/jobs?page=6", 6)
	if meta.Robots != "noindex, follow" {
		t.Errorf("Expected page > 5 to have noindex, follow, got %s", meta.Robots)
	}
	if meta.OpenGraph["og:title"] != "Tech Jobs | WorkoraJobs" {
		t.Errorf("Expected openGraph title 'Tech Jobs | WorkoraJobs', got %s", meta.OpenGraph["og:title"])
	}
}

func TestDynamicRobotsTxt(t *testing.T) {
	seoService := NewSeoServiceWithBaseURL(nil, "https://workorajobs.com")

	prodRobots := seoService.GenerateRobotsTxt(true)
	if !strings.Contains(prodRobots, "Allow: /") || !strings.Contains(prodRobots, "Disallow: /admin/") {
		t.Errorf("Production robots.txt missing standard allow/disallow rules: %s", prodRobots)
	}

	devRobots := seoService.GenerateRobotsTxt(false)
	if !strings.Contains(devRobots, "Disallow: /") {
		t.Errorf("Development robots.txt should disallow all: %s", devRobots)
	}
}
