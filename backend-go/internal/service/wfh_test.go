package service

import (
	"context"
	"strings"
	"testing"
)

func TestWFHSeoPageResolver(t *testing.T) {
	svc := &WFHService{}

	freelancePage, err := svc.ResolveSeoPage(context.Background(), "work-from-home-freelance-jobs")
	if err != nil {
		t.Fatalf("Unexpected error: %v", err)
	}
	if !strings.Contains(freelancePage.Title, "Freelance") {
		t.Errorf("Expected Title to contain 'Freelance', got %s", freelancePage.Title)
	}

	permanentPage, _ := svc.ResolveSeoPage(context.Background(), "permanent-wfh-jobs")
	if !strings.Contains(permanentPage.Title, "Permanent") {
		t.Errorf("Expected Title to contain 'Permanent', got %s", permanentPage.Title)
	}
}
