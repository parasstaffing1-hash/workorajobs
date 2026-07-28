package service

import (
	"context"
	"testing"
)

func TestGetChartData(t *testing.T) {
	svc := &SalaryService{}

	chart, err := svc.GetChartData(context.Background(), "Software Engineer")
	if err != nil {
		t.Fatalf("Unexpected error: %v", err)
	}

	if len(chart.Labels) != 4 || len(chart.Values) != 4 {
		t.Errorf("Expected 4 salary bands, got labels=%d values=%d", len(chart.Labels), len(chart.Values))
	}

	if chart.Labels[0] != "0-3 yrs" {
		t.Errorf("Expected first band '0-3 yrs', got '%s'", chart.Labels[0])
	}

	if chart.Values[0] != 550000 {
		t.Errorf("Expected avg salary 550000 for 0-3 yrs, got %f", chart.Values[0])
	}
}
