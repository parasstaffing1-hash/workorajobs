package service

import (
	"context"
	"strings"
	"testing"
)

func TestFreshersSeoPageResolver(t *testing.T) {
	svc := &FreshersService{}

	seoPage, err := svc.ResolveSeoPage(context.Background(), "graduate-trainee-jobs")
	if err != nil {
		t.Fatalf("Unexpected error resolving fresher SEO page: %v", err)
	}

	if !strings.Contains(seoPage.Title, "Trainee") {
		t.Errorf("Expected Title to contain 'Trainee', got %s", seoPage.Title)
	}

	blrPage, _ := svc.ResolveSeoPage(context.Background(), "fresher-jobs-bangalore")
	if !strings.Contains(blrPage.Title, "Bangalore") {
		t.Errorf("Expected Title to contain 'Bangalore', got %s", blrPage.Title)
	}
}
