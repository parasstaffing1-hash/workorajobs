package service

import (
	"context"
	"fmt"
	"strings"

	"github.com/workorajobs/backend-go/internal/domain/models"
	"gorm.io/gorm"
)

type WFHService struct {
	db *gorm.DB
}

func NewWFHService(db *gorm.DB) *WFHService {
	return &WFHService{db: db}
}

func (s *WFHService) SearchWFHJobs(ctx context.Context, filter *models.WFHFilterDTO) ([]models.Job, int64, error) {
	var jobs []models.Job
	var total int64

	query := s.db.Model(&models.Job{}).Where("status = 'PUBLISHED' AND work_mode IN ('Remote', 'Hybrid', 'Work From Home')")

	if filter.Category != "" {
		switch filter.Category {
		case "PERMANENT_WFH":
			query = query.Where("work_mode = 'Remote'")
		case "HYBRID":
			query = query.Where("work_mode = 'Hybrid'")
		case "CONTRACT":
			query = query.Where("type = 'CONTRACT'")
		case "FREELANCE":
			query = query.Where("type = 'FREELANCE'")
		case "PART_TIME":
			query = query.Where("type = 'PART_TIME'")
		}
	}
	if filter.MinSalary != nil {
		query = query.Where("salary_max >= ?", *filter.MinSalary)
	}
	if filter.Company != "" {
		query = query.Where("company_id IN (SELECT id FROM \"Company\" WHERE name ILIKE ?)", "%"+filter.Company+"%")
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

func (s *WFHService) ResolveSeoPage(ctx context.Context, slug string) (*models.WFHSeoPageDTO, error) {
	cleanSlug := strings.ToLower(strings.TrimSpace(slug))

	title := "Work From Home Jobs | WorkoraJobs"
	h1 := "Find Work From Home & Remote Jobs"
	metaDesc := "Browse verified work from home, freelance, part-time, and permanent remote jobs."

	if strings.Contains(cleanSlug, "freelance") {
		title = "Freelance Work From Home Jobs | WorkoraJobs"
		h1 = "Freelance & Contract WFH Opportunities"
		metaDesc = "Discover freelance gigs and contract work from home positions."
	} else if strings.Contains(cleanSlug, "part-time") {
		title = "Part Time Work From Home Jobs | WorkoraJobs"
		h1 = "Part Time Remote & WFH Roles"
		metaDesc = "Find flexible part-time work from home jobs with top companies."
	} else if strings.Contains(cleanSlug, "permanent") {
		title = "Permanent Work From Home Jobs | WorkoraJobs"
		h1 = "Permanent Remote Jobs — No Office Required"
		metaDesc = "Browse permanent work from home positions with full benefits."
	}

	var count int64
	if s.db != nil {
		s.db.Model(&models.Job{}).Where("status = 'PUBLISHED' AND work_mode IN ('Remote', 'Hybrid', 'Work From Home')").Count(&count)
	}

	return &models.WFHSeoPageDTO{
		Slug:            cleanSlug,
		Title:           title,
		H1:              h1,
		MetaDescription: metaDesc,
		CanonicalURL:    fmt.Sprintf("https://workorajobs.com/%s", cleanSlug),
		JobCount:        count,
	}, nil
}
