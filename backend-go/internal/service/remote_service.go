package service

import (
	"context"
	"fmt"
	"strings"

	"github.com/workorajobs/backend-go/internal/domain/models"
	"gorm.io/gorm"
)

type RemoteService struct {
	db *gorm.DB
}

func NewRemoteService(db *gorm.DB) *RemoteService {
	return &RemoteService{db: db}
}

func (s *RemoteService) SearchRemoteJobs(ctx context.Context, filter *models.RemoteSearchFilterDTO) ([]models.Job, int64, error) {
	var jobs []models.Job
	var total int64

	query := s.db.Model(&models.Job{}).Where("status = 'PUBLISHED' AND work_mode IN ('Remote', 'Hybrid')")

	if filter.Country != "" {
		query = query.Where("location ILIKE ?", "%"+filter.Country+"%")
	}
	if filter.Category != "" {
		query = query.Where("department ILIKE ? OR title ILIKE ?", "%"+filter.Category+"%", "%"+filter.Category+"%")
	}
	if filter.MinSalary != nil {
		query = query.Where("salary_max >= ?", *filter.MinSalary)
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

func (s *RemoteService) ResolveSeoPage(ctx context.Context, slug string) (*models.RemoteSeoPageDTO, error) {
	cleanSlug := strings.ToLower(strings.TrimSpace(slug))

	title := "Remote Jobs Worldwide | WorkoraJobs"
	h1 := "Find Remote Jobs Worldwide"
	metaDesc := "Browse verified remote jobs worldwide with top tech companies and global startups."

	if strings.Contains(cleanSlug, "software") {
		title = "Remote Software Engineering Jobs | WorkoraJobs"
		h1 = "Remote Software & Engineering Jobs"
		metaDesc = "Explore top remote software developer, backend, frontend, and DevOps jobs."
	} else if strings.Contains(cleanSlug, "marketing") {
		title = "Remote Marketing Jobs | WorkoraJobs"
		h1 = "Remote Marketing & Growth Jobs"
		metaDesc = "Find remote marketing, SEO, content, and growth management roles."
	} else if strings.Contains(cleanSlug, "usa") {
		title = "Remote Jobs in USA | WorkoraJobs"
		h1 = "Remote Jobs for US Residents & Companies"
		metaDesc = "Find top remote jobs based in the United States."
	} else if strings.Contains(cleanSlug, "india") {
		title = "Remote Jobs in India | WorkoraJobs"
		h1 = "Remote Jobs for Candidates in India"
		metaDesc = "Browse high-paying remote roles hiring candidates in India."
	}

	var count int64
	if s.db != nil {
		s.db.Model(&models.Job{}).Where("status = 'PUBLISHED' AND work_mode IN ('Remote', 'Hybrid')").Count(&count)
	}

	return &models.RemoteSeoPageDTO{
		Slug:            cleanSlug,
		Title:           title,
		H1:              h1,
		MetaDescription: metaDesc,
		CanonicalURL:    fmt.Sprintf("https://workorajobs.com/%s", cleanSlug),
		JobCount:        count,
	}, nil
}
