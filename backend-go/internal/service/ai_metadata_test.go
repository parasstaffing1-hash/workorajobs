package service

import (
	"testing"
)

func TestAiMetadataEngineGenerationAndLimits(t *testing.T) {
	svc := NewAiMetadataService(nil, "https://workorajobs.com")

	// 1. Generate Full Package (9 Assets)
	pkg := svc.GenerateMetadataPackage("entity_999", "senior-golang-developer", "bengaluru")

	if pkg.EntityID != "entity_999" {
		t.Errorf("Expected entityID entity_999, got %s", pkg.EntityID)
	}

	// 2. SEO Title <= 60 chars
	if len(pkg.SeoTitle) > 60 {
		t.Errorf("SeoTitle exceeds 60 chars: length %d ('%s')", len(pkg.SeoTitle), pkg.SeoTitle)
	}

	// 3. Meta Description <= 160 chars
	if len(pkg.MetaDescription) > 160 {
		t.Errorf("MetaDescription exceeds 160 chars: length %d ('%s')", len(pkg.MetaDescription), pkg.MetaDescription)
	}

	// 4. OpenGraph Title <= 60 chars
	if len(pkg.OpenGraphTitle) > 60 {
		t.Errorf("OpenGraphTitle exceeds 60 chars: length %d ('%s')", len(pkg.OpenGraphTitle), pkg.OpenGraphTitle)
	}

	// 5. Twitter Title <= 60 chars
	if len(pkg.TwitterTitle) > 60 {
		t.Errorf("TwitterTitle exceeds 60 chars: length %d ('%s')", len(pkg.TwitterTitle), pkg.TwitterTitle)
	}

	// 6. Rich Snippets
	if pkg.RichSnippets == "" {
		t.Errorf("RichSnippets is empty")
	}

	// 7. FAQ (2-4 QA pairs)
	if len(pkg.Faq) == 0 {
		t.Errorf("FAQ is empty")
	}

	// 8. Page Introduction
	if pkg.PageIntroduction == "" {
		t.Errorf("PageIntroduction is empty")
	}

	// 9. Page Summary
	if len(pkg.PageSummary) == 0 {
		t.Errorf("PageSummary is empty")
	}

	// SHA256 Hash
	if pkg.ContentHash == "" {
		t.Errorf("ContentHash is empty")
	}
}

func TestAiMetadataVersioningAndRollback(t *testing.T) {
	svc := NewAiMetadataService(nil, "https://workorajobs.com")

	entityID := "entity_888"

	// Version 1
	pkg1 := svc.GenerateMetadataPackage(entityID, "golang-developer", "bengaluru")
	if pkg1.Version != 1 {
		t.Errorf("Expected version 1, got %d", pkg1.Version)
	}

	// Version 2
	pkg2 := svc.GenerateMetadataPackage(entityID, "lead-golang-architect", "remote")
	if pkg2.Version != 2 {
		t.Errorf("Expected version 2, got %d", pkg2.Version)
	}

	// Fetch history
	history := svc.GetVersions(entityID)
	if len(history) != 2 {
		t.Fatalf("Expected 2 version records, got %d", len(history))
	}

	// Rollback to Version 1
	rolledBack, err := svc.RollbackVersion(entityID, 1)
	if err != nil {
		t.Fatalf("Rollback failed: %v", err)
	}
	if rolledBack.Version != 1 {
		t.Errorf("Expected rolled back package version 1, got %d", rolledBack.Version)
	}
}

func TestBulkRegenerationQueue(t *testing.T) {
	svc := NewAiMetadataService(nil, "https://workorajobs.com")

	entityIDs := []string{"id_1", "id_2", "id_3"}
	count := svc.BulkRegenerate(entityIDs)

	if count != 3 {
		t.Errorf("Expected bulk count 3, got %d", count)
	}
}
