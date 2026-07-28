package service

import (
	"context"
	"strings"
	"testing"
)

func TestRemoteSeoPageResolver(t *testing.T) {
	svc := &RemoteService{}

	seoPage, err := svc.ResolveSeoPage(context.Background(), "remote-software-jobs")
	if err != nil {
		t.Fatalf("Unexpected error resolving remote software jobs SEO page: %v", err)
	}

	if !strings.Contains(seoPage.Title, "Software") {
		t.Errorf("Expected Title to contain 'Software', got %s", seoPage.Title)
	}

	usaPage, _ := svc.ResolveSeoPage(context.Background(), "remote-jobs-usa")
	if !strings.Contains(usaPage.Title, "USA") {
		t.Errorf("Expected Title to contain 'USA', got %s", usaPage.Title)
	}
}
