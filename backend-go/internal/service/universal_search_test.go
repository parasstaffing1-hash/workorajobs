package service

import (
	"context"
	"testing"
)

func TestLevenshteinDistance(t *testing.T) {
	cases := []struct {
		a, b string
		want int
	}{
		{"kitten", "sitting", 3},
		{"developer", "developer", 0},
		{"engneer", "engineer", 1},
		{"softwar", "software", 1},
		{"bangalor", "bangalore", 1},
	}

	for _, tc := range cases {
		got := levenshtein(tc.a, tc.b)
		if got != tc.want {
			t.Errorf("levenshtein(%q, %q) = %d, want %d", tc.a, tc.b, got, tc.want)
		}
	}
}

func TestCorrectSpelling(t *testing.T) {
	svc := NewUniversalSearchService(nil)

	corrected := svc.CorrectSpelling("softwar engneer")
	if corrected != "software engineer" {
		t.Errorf("Expected 'software engineer', got '%s'", corrected)
	}

	noCorrection := svc.CorrectSpelling("software engineer")
	if noCorrection != "" {
		t.Errorf("Expected empty string for correct query, got '%s'", noCorrection)
	}
}

func TestExpandSynonyms(t *testing.T) {
	svc := NewUniversalSearchService(nil)

	expanded := svc.ExpandSynonyms("developer")
	if len(expanded) < 2 {
		t.Errorf("Expected at least 2 synonym expansions for 'developer', got %d", len(expanded))
	}

	found := false
	for _, e := range expanded {
		if e == "engineer" {
			found = true
		}
	}
	if !found {
		t.Errorf("Expected 'engineer' as a synonym expansion for 'developer'")
	}
}

func TestGetTrendingSearches(t *testing.T) {
	svc := NewUniversalSearchService(nil)

	trending, err := svc.GetTrendingSearches(context.Background())
	if err != nil {
		t.Fatalf("Unexpected error: %v", err)
	}

	if len(trending) != 10 {
		t.Errorf("Expected 10 trending searches, got %d", len(trending))
	}

	if trending[0].SearchCount <= 0 {
		t.Errorf("Expected positive search count, got %d", trending[0].SearchCount)
	}
}

func TestComputeBoost(t *testing.T) {
	svc := NewUniversalSearchService(nil)

	exactScore := svc.computeBoost("Software Engineer", "Software Engineer", "JOB")
	partialScore := svc.computeBoost("Software", "Software Engineer", "JOB")
	containsScore := svc.computeBoost("Engineer", "Senior Software Engineer", "JOB")

	if exactScore <= partialScore {
		t.Errorf("Exact match should score higher than prefix match: exact=%f partial=%f", exactScore, partialScore)
	}

	if partialScore <= containsScore {
		t.Errorf("Prefix match should score higher than contains match: partial=%f contains=%f", partialScore, containsScore)
	}
}
