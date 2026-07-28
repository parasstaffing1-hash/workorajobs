package service

import (
	"context"
	"testing"
)

func TestGetExamCalendar(t *testing.T) {
	svc := &GovtService{}

	calendar, err := svc.GetExamCalendar(context.Background())
	if err != nil {
		t.Fatalf("Unexpected error fetching exam calendar: %v", err)
	}

	if len(calendar) == 0 {
		t.Fatalf("Expected non-empty exam calendar list")
	}

	if calendar[0].ExamName == "" || calendar[0].VacancyCount <= 0 {
		t.Errorf("Invalid exam calendar item: %+v", calendar[0])
	}
}
