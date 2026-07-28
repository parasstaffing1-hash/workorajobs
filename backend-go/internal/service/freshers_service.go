package service

import (
	"context"
	"fmt"
	"strings"

	"github.com/workorajobs/backend-go/internal/domain/models"
	"gorm.io/gorm"
)

type FreshersService struct {
	db *gorm.DB
}

func NewFreshersService(db *gorm.DB) *FreshersService {
	return &FreshersService{db: db}
}

func (s *FreshersService) SearchFresherJobs(ctx context.Context, filter *models.FresherFilterDTO) ([]models.Job, int64, error) {
	var jobs []models.Job
	var total int64

	query := s.db.Model(&models.Job{}).Where("status = 'PUBLISHED' AND (experience ILIKE '%0%' OR experience ILIKE '%Fresher%' OR experience ILIKE '%Entry%')")

	if filter.Category != "" {
		query = query.Where("type = ? OR title ILIKE ?", filter.Category, "%"+filter.Category+"%")
	}
	if filter.Location != "" {
		query = query.Where("location ILIKE ?", "%"+filter.Location+"%")
	}
	if filter.Degree != "" {
		query = query.Where("education ILIKE ? OR requirements ILIKE ?", "%"+filter.Degree+"%", "%"+filter.Degree+"%")
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

func (s *FreshersService) ResolveSeoPage(ctx context.Context, slug string) (*models.FresherSeoPageDTO, error) {
	cleanSlug := strings.ToLower(strings.TrimSpace(slug))

	title := "Fresher Jobs & Entry Level Roles | WorkoraJobs"
	h1 := "Find Jobs for Freshers (0 Years Experience)"
	metaDesc := "Browse latest fresher jobs, graduate trainee programs, apprenticeships, and entry-level positions."

	if strings.Contains(cleanSlug, "trainee") {
		title = "Graduate Trainee Jobs for Freshers | WorkoraJobs"
		h1 = "Graduate Trainee & Apprentice Jobs"
		metaDesc = "Explore corporate graduate trainee programs across top IT and finance companies."
	} else if strings.Contains(cleanSlug, "bangalore") {
		title = "Fresher Jobs in Bangalore | WorkoraJobs"
		h1 = "Fresher & Entry Level Jobs in Bangalore"
		metaDesc = "Find top fresher software engineer, analyst, and support roles in Bangalore."
	}

	var count int64
	if s.db != nil {
		s.db.Model(&models.Job{}).Where("status = 'PUBLISHED' AND (experience ILIKE '%0%' OR experience ILIKE '%Fresher%')").Count(&count)
	}

	return &models.FresherSeoPageDTO{
		Slug:            cleanSlug,
		Title:           title,
		H1:              h1,
		MetaDescription: metaDesc,
		CanonicalURL:    fmt.Sprintf("https://workorajobs.com/%s", cleanSlug),
		JobCount:        count,
	}, nil
}
