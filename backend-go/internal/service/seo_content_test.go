package service

import (
	"testing"
)

func TestSeoContentEngineAllGuideCategories(t *testing.T) {
	svc := NewSeoContentService(nil, nil, nil, "https://workorajobs.com")

	categories := []string{
		"company-guides",
		"salary-guides",
		"skill-guides",
		"interview-guides",
		"industry-guides",
		"career-guides",
		"city-guides",
		"certification-guides",
		"remote-work-guides",
	}

	for _, cat := range categories {
		t.Run(cat, func(t *testing.T) {
			guide, err := svc.GetGuide(cat, "golang-developer")
			if err != nil {
				t.Fatalf("GetGuide failed for category %s: %v", cat, err)
			}

			if guide.Title == "" {
				t.Errorf("Title is empty for category %s", cat)
			}
			if len(guide.TableOfContents) == 0 {
				t.Errorf("TableOfContents is empty for category %s", cat)
			}
			if len(guide.Sections) == 0 {
				t.Errorf("Sections is empty for category %s", cat)
			}
			if len(guide.Faq) == 0 {
				t.Errorf("FAQ is empty for category %s", cat)
			}
			if len(guide.RelatedJobs) == 0 {
				t.Errorf("RelatedJobs is empty for category %s", cat)
			}
			if len(guide.RelatedCompanies) == 0 {
				t.Errorf("RelatedCompanies is empty for category %s", cat)
			}
			if len(guide.InternalLinks) == 0 {
				t.Errorf("InternalLinks is empty for category %s", cat)
			}
			if guide.JsonLd == "" {
				t.Errorf("JsonLd is empty for category %s", cat)
			}
		})
	}
}

func TestSeoContentAutoUpdateContent(t *testing.T) {
	svc := NewSeoContentService(nil, nil, nil, "https://workorajobs.com")
	err := svc.AutoUpdateContent("guide_123")
	if err != nil {
		t.Errorf("AutoUpdateContent failed: %v", err)
	}
}
