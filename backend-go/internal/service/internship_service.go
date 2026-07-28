package service

import (
	"context"

	"github.com/workorajobs/backend-go/internal/domain/models"
	"gorm.io/gorm"
)

type InternshipService struct {
	db *gorm.DB
}

func NewInternshipService(db *gorm.DB) *InternshipService {
	return &InternshipService{db: db}
}

func (s *InternshipService) SearchInternships(ctx context.Context, filter *models.InternshipSearchFilterDTO) ([]models.Job, int64, error) {
	var jobs []models.Job
	var total int64

	query := s.db.Model(&models.Job{}).Where("status = 'PUBLISHED' AND type = 'INTERNSHIP'")

	if filter.Location != "" {
		query = query.Where("location ILIKE ?", "%"+filter.Location+"%")
	}
	if filter.MinStipend != nil {
		query = query.Where("salary_max >= ?", *filter.MinStipend)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (filter.Page - 1) * filter.Limit
	if err := query.Preload("Company").Order("posted_at DESC").Offset(offset).Limit(filter.Limit).Find(&jobs).Error; err != nil {
		return nil, 0, err
	}

	return jobs, total, nil
}

func (s *InternshipService) GetRecommendations(ctx context.Context, req *models.InternshipRecommendationDTO) ([]models.Job, error) {
	var jobs []models.Job
	limit := req.Limit
	if limit <= 0 {
		limit = 10
	}

	query := s.db.Preload("Company").Where("status = 'PUBLISHED' AND type = 'INTERNSHIP'")
	if len(req.Skills) > 0 {
		query = query.Where("skills_required && ?", req.Skills)
	}

	if err := query.Order("posted_at DESC").Limit(limit).Find(&jobs).Error; err != nil {
		return nil, err
	}

	return jobs, nil
}
