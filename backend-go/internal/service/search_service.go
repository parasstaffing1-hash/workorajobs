package service

import (
	"context"
	"time"

	"github.com/workorajobs/backend-go/internal/cache"
	"github.com/workorajobs/backend-go/internal/domain/models"
	"gorm.io/gorm"
)

type SearchService struct {
	db    *gorm.DB
	cache *cache.RedisCache
}

func NewSearchService(db *gorm.DB, cache *cache.RedisCache) *SearchService {
	return &SearchService{db: db, cache: cache}
}

func (s *SearchService) SearchJobs(ctx context.Context, filter *models.SearchFilterDTO) ([]models.Job, int64, error) {
	var jobs []models.Job
	var total int64

	query := s.db.Model(&models.Job{}).Where("status = ?", models.JobStatusPublished)

	if filter.Query != "" {
		q := "%" + filter.Query + "%"
		query = query.Where("title ILIKE ? OR description ILIKE ?", q, q)
	}
	if filter.Location != "" {
		query = query.Where("location ILIKE ?", "%"+filter.Location+"%")
	}
	if filter.JobType != "" {
		query = query.Where("type = ?", filter.JobType)
	}
	if filter.WorkMode != "" {
		query = query.Where("work_mode = ?", filter.WorkMode)
	}
	if filter.Experience != "" {
		query = query.Where("experience = ?", filter.Experience)
	}
	if filter.MinSalary != nil {
		query = query.Where("salary_max >= ?", *filter.MinSalary)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Sorting
	switch filter.SortBy {
	case "salary_high":
		query = query.Order("salary_max DESC")
	case "salary_low":
		query = query.Order("salary_min ASC")
	default:
		query = query.Order("posted_at DESC")
	}

	offset := (filter.Page - 1) * filter.Limit
	if err := query.Preload("Company").Offset(offset).Limit(filter.Limit).Find(&jobs).Error; err != nil {
		return nil, 0, err
	}

	return jobs, total, nil
}

func (s *SearchService) Autocomplete(ctx context.Context, q string) (*models.AutocompleteResultDTO, error) {
	if q == "" {
		return &models.AutocompleteResultDTO{}, nil
	}

	var titles []string
	s.db.Model(&models.Job{}).Where("title ILIKE ? AND status = 'PUBLISHED'", q+"%").Limit(5).Pluck("title", &titles)

	var locations []string
	s.db.Model(&models.Job{}).Where("location ILIKE ?", q+"%").Distinct().Limit(5).Pluck("location", &locations)

	return &models.AutocompleteResultDTO{
		Query:     q,
		Titles:    titles,
		Locations: locations,
	}, nil
}

func (s *SearchService) GetTrendingJobs(ctx context.Context) ([]models.Job, error) {
	var jobs []models.Job
	cacheKey := "trending_jobs"

	if s.cache != nil {
		err := s.cache.GetOrFetch(ctx, cacheKey, 15*time.Minute, &jobs, func() (interface{}, error) {
			var fetched []models.Job
			err := s.db.Preload("Company").Where("status = ?", models.JobStatusPublished).Order("posted_at DESC").Limit(10).Find(&fetched).Error
			return fetched, err
		})
		return jobs, err
	}

	err := s.db.Preload("Company").Where("status = ?", models.JobStatusPublished).Order("posted_at DESC").Limit(10).Find(&jobs).Error
	return jobs, err
}

func (s *SearchService) GetSimilarJobs(ctx context.Context, jobID string) ([]models.Job, error) {
	var currentJob models.Job
	if err := s.db.Where("id = ?", jobID).First(&currentJob).Error; err != nil {
		return nil, err
	}

	var similar []models.Job
	query := s.db.Preload("Company").Where("id != ? AND status = 'PUBLISHED'", jobID)
	if currentJob.Location != nil {
		query = query.Where("location = ? OR type = ?", *currentJob.Location, currentJob.Type)
	}

	if err := query.Limit(6).Find(&similar).Error; err != nil {
		return nil, err
	}

	return similar, nil
}
