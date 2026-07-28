package service

import (
	"strings"
	"testing"
)

func TestProgrammaticSeoEngineAllDimensions(t *testing.T) {
	seoService := NewSeoServiceWithBaseURL(nil, "https://workorajobs.com")
	pseoService := NewPseoService(nil, seoService, "https://workorajobs.com")

	dimensions := []string{
		"jobs",
		"companies",
		"cities",
		"states",
		"countries",
		"skills",
		"industries",
		"salaries",
		"interview-questions",
		"career-paths",
		"certifications",
		"remote-jobs",
		"govt-jobs",
		"startup-jobs",
		"walkin-jobs",
		"visa-sponsorship-jobs",
	}

	slug := "golang-developer"

	for _, dim := range dimensions {
		t.Run(dim, func(t *testing.T) {
			res, err := pseoService.ResolvePseoPage(dim, slug)
			if err != nil {
				t.Fatalf("Failed to resolve pSEO page for dimension '%s': %v", dim, err)
			}

			if res.Title == "" {
				t.Errorf("Title is empty for dimension %s", dim)
			}
			if res.Description == "" {
				t.Errorf("Description is empty for dimension %s", dim)
			}
			if !strings.HasPrefix(res.CanonicalURL, "https://workorajobs.com/") {
				t.Errorf("Invalid canonical URL for dimension %s: %s", dim, res.CanonicalURL)
			}
			if res.JsonLd == "" {
				t.Errorf("JSON-LD is empty for dimension %s", dim)
			}
			if len(res.Breadcrumbs) < 2 {
				t.Errorf("Breadcrumbs incomplete for dimension %s", dim)
			}
			if len(res.RelatedPages) == 0 {
				t.Errorf("RelatedPages empty for dimension %s", dim)
			}
			if len(res.InternalLinks) == 0 {
				t.Errorf("InternalLinks empty for dimension %s", dim)
			}
		})
	}
}

func TestProgrammaticSeoCrossLinkGraph(t *testing.T) {
	seoService := NewSeoServiceWithBaseURL(nil, "https://workorajobs.com")
	pseoService := NewPseoService(nil, seoService, "https://workorajobs.com")

	related, internal := pseoService.GenerateRelatedInternalLinks(DimensionSkills, "react")
	if len(related) == 0 || len(internal) == 0 {
		t.Errorf("Cross-linking graph returned empty links")
	}

	foundSalaryLink := false
	for _, r := range related {
		if r.Type == "salary" && strings.Contains(r.URL, "/salary/react") {
			foundSalaryLink = true
			break
		}
	}
	if !foundSalaryLink {
		t.Errorf("Cross-linking graph missing salary link for react")
	}
}
