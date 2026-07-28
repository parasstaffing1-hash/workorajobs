package service

import (
	"context"
	"testing"

	"github.com/workorajobs/backend-go/internal/domain/models"
)

func TestPredictSalary(t *testing.T) {
	svc := &RecommendationService{}

	output, err := svc.PredictSalary(context.Background(), &models.SalaryPredictionInputDTO{
		JobTitle:   "Senior Go Engineer",
		Skills:     []string{"Go", "PostgreSQL", "Kubernetes"},
		Experience: 5,
		Location:   "Bangalore",
	})

	if err != nil {
		t.Fatalf("Unexpected error: %v", err)
	}

	if output.PredictedMid <= 0 {
		t.Errorf("Expected positive predicted salary, got %f", output.PredictedMid)
	}

	if output.PredictedMin >= output.PredictedMax {
		t.Errorf("Expected min < max, got min=%f max=%f", output.PredictedMin, output.PredictedMax)
	}

	if output.Confidence <= 0 || output.Confidence > 1.0 {
		t.Errorf("Expected confidence between 0-1, got %f", output.Confidence)
	}
}

func TestComputeResumeMatchScore(t *testing.T) {
	svc := &RecommendationService{}

	result, err := svc.ComputeResumeMatchScore(context.Background(), &models.ResumeMatchInputDTO{
		ResumeSkills:     []string{"Go", "React", "Docker"},
		ResumeExperience: 3,
		JobID:            "job_123",
	})

	if err != nil {
		t.Fatalf("Unexpected error: %v", err)
	}

	// With nil db, job description is empty, so no skills match
	if result.MatchScore != 0.0 {
		t.Errorf("Expected 0 match score with empty job, got %f", result.MatchScore)
	}

	if len(result.MissingSkills) != 3 {
		t.Errorf("Expected 3 missing skills, got %d", len(result.MissingSkills))
	}
}
