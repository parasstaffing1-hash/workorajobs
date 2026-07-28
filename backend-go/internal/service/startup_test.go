package service

import (
	"testing"

	"github.com/workorajobs/backend-go/internal/domain/models"
)

func TestComputeRankScore(t *testing.T) {
	svc := &StartupService{}

	profile := &models.StartupProfile{
		FundingStage:   models.FundingStageUnicorn,
		HasESOP:        true,
		RemoteFriendly: true,
	}

	score := svc.ComputeRankScore(profile, 3) // 40 + 20 + 15 + (3*5) = 90.0

	if score != 90.0 {
		t.Errorf("Expected rank score 90.0, got %f", score)
	}

	seriesAProfile := &models.StartupProfile{
		FundingStage:   models.FundingStageSeriesA,
		HasESOP:        false,
		RemoteFriendly: true,
	}

	scoreSeriesA := svc.ComputeRankScore(seriesAProfile, 0) // 30 + 0 + 15 + 0 = 45.0
	if scoreSeriesA != 45.0 {
		t.Errorf("Expected rank score 45.0, got %f", scoreSeriesA)
	}
}
