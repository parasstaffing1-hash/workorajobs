package service

import (
	"context"
	"strings"
	"testing"
)

func TestGenerateICalendar(t *testing.T) {
	svc := &WalkinService{}

	ics, err := svc.GenerateICalendar(context.Background(), "walkin_123")
	if err != nil {
		t.Fatalf("Unexpected error generating iCal: %v", err)
	}

	if !strings.Contains(ics, "BEGIN:VCALENDAR") || !strings.Contains(ics, "END:VCALENDAR") {
		t.Errorf("Invalid iCal output structure: %s", ics)
	}

	if !strings.Contains(ics, "walkin_123@workorajobs.com") {
		t.Errorf("Expected UID walkin_123@workorajobs.com in iCal")
	}
}

func TestWalkinSeoPageResolver(t *testing.T) {
	svc := &WalkinService{}

	seoPage, err := svc.ResolveSeoPage(context.Background(), "walkin-jobs-bangalore")
	if err != nil {
		t.Fatalf("Unexpected error resolving walkin SEO page: %v", err)
	}

	if !strings.Contains(seoPage.Title, "Bangalore") {
		t.Errorf("Expected Title to contain 'Bangalore', got %s", seoPage.Title)
	}
}
