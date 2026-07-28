package service

import (
	"context"
	"strings"
	"testing"

	"github.com/workorajobs/backend-go/internal/domain/models"
)

func TestComputeVisaRankScore(t *testing.T) {
	svc := &VisaService{}

	detail := &models.VisaSponsorshipDetail{
		TargetCountry:        models.VisaCountryUSA,
		SponsorshipConfirmed: true,
		RelocationAssistance: true,
		ImmigrationSupport:   true,
	}

	score := svc.ComputeVisaRankScore(detail) // 40 + 25 + 20 + 15 = 100.0
	if score != 100.0 {
		t.Errorf("Expected rank score 100.0, got %f", score)
	}

	uaeDetail := &models.VisaSponsorshipDetail{
		TargetCountry:        models.VisaCountryUAE,
		SponsorshipConfirmed: true,
		RelocationAssistance: false,
		ImmigrationSupport:   false,
	}

	uaeScore := svc.ComputeVisaRankScore(uaeDetail) // 40 + 6 = 46.0
	if uaeScore != 46.0 {
		t.Errorf("Expected rank score 46.0, got %f", uaeScore)
	}
}

func TestVisaSeoPageResolver(t *testing.T) {
	svc := &VisaService{}

	usaPage, err := svc.ResolveSeoPage(context.Background(), "visa-sponsorship-jobs-usa")
	if err != nil {
		t.Fatalf("Unexpected error: %v", err)
	}
	if !strings.Contains(usaPage.Title, "USA") {
		t.Errorf("Expected Title to contain 'USA', got %s", usaPage.Title)
	}

	ukPage, _ := svc.ResolveSeoPage(context.Background(), "visa-sponsorship-jobs-uk")
	if !strings.Contains(ukPage.Title, "UK") {
		t.Errorf("Expected Title to contain 'UK', got %s", ukPage.Title)
	}
}
