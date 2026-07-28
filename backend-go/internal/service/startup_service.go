package service

import (
	"context"

	"github.com/workorajobs/backend-go/internal/domain/models"
	"gorm.io/gorm"
)

type StartupService struct {
	db *gorm.DB
}

func NewStartupService(db *gorm.DB) *StartupService {
	return &StartupService{db: db}
}

func (s *StartupService) ComputeRankScore(profile *models.StartupProfile, activeJobs int) float64 {
	score := 0.0

	// Funding stage weights
	switch profile.FundingStage {
	case models.FundingStageUnicorn:
		score += 40.0
	case models.FundingStageSeriesB:
		score += 35.0
	case models.FundingStageSeriesA:
		score += 30.0
	case models.FundingStageSeed:
		score += 25.0
	case models.FundingStageBootstrapped:
		score += 20.0
	}

	// ESOP Availability (+20 pts)
	if profile.HasESOP {
		score += 20.0
	}

	// Remote Flexibility (+15 pts)
	if profile.RemoteFriendly {
		score += 15.0
	}

	// Active Hiring Boost (+5 pts per job up to 25 pts)
	jobBoost := float64(activeJobs) * 5.0
	if jobBoost > 25.0 {
		jobBoost = 25.0
	}
	score += jobBoost

	return score
}

func (s *StartupService) SearchStartups(ctx context.Context, filter *models.StartupFilterDTO) ([]models.StartupProfile, int64, error) {
	var startups []models.StartupProfile
	var total int64

	query := s.db.Model(&models.StartupProfile{})

	if filter.FundingStage != "" {
		query = query.Where("funding_stage = ?", filter.FundingStage)
	}
	if filter.EmployeeCountRange != "" {
		query = query.Where("employee_count_range = ?", filter.EmployeeCountRange)
	}
	if filter.HasESOP != nil {
		query = query.Where("has_esop = ?", *filter.HasESOP)
	}
	if filter.RemoteFriendly != nil {
		query = query.Where("remote_friendly = ?", *filter.RemoteFriendly)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (filter.Page - 1) * filter.Limit
	if err := query.Offset(offset).Limit(filter.Limit).Find(&startups).Error; err != nil {
		return nil, 0, err
	}

	return startups, total, nil
}

func (s *StartupService) GetProfileBySlug(ctx context.Context, slug string) (*models.StartupProfile, error) {
	var profile models.StartupProfile
	if err := s.db.Where("slug = ?", slug).First(&profile).Error; err != nil {
		return nil, err
	}
	return &profile, nil
}
