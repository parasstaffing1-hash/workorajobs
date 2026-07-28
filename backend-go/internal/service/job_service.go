package service

import (
	"errors"

	"github.com/google/uuid"
	"github.com/workorajobs/backend-go/internal/domain/models"
	"gorm.io/gorm"
)

type JobService struct {
	db *gorm.DB
}

func NewJobService(db *gorm.DB) *JobService {
	return &JobService{db: db}
}

type JobFilter struct {
	Query      string `form:"q"`
	Location   string `form:"location"`
	JobType    string `form:"type"`
	WorkMode   string `form:"workMode"`
	Experience string `form:"experience"`
	Page       int    `form:"page,default=1"`
	Limit      int    `form:"limit,default=20"`
}

func (s *JobService) ListJobs(filter *JobFilter) ([]models.Job, int64, error) {
	var jobs []models.Job
	var total int64

	db := s.db.Model(&models.Job{}).Where("status = ?", models.JobStatusPublished)

	if filter.Query != "" {
		q := "%" + filter.Query + "%"
		db = db.Where("title ILIKE ? OR description ILIKE ?", q, q)
	}
	if filter.Location != "" {
		db = db.Where("location ILIKE ?", "%"+filter.Location+"%")
	}
	if filter.JobType != "" {
		db = db.Where("type = ?", filter.JobType)
	}
	if filter.WorkMode != "" {
		db = db.Where("work_mode = ?", filter.WorkMode)
	}
	if filter.Experience != "" {
		db = db.Where("experience = ?", filter.Experience)
	}

	if err := db.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (filter.Page - 1) * filter.Limit
	if err := db.Preload("Company").Order("posted_at DESC").Offset(offset).Limit(filter.Limit).Find(&jobs).Error; err != nil {
		return nil, 0, err
	}

	return jobs, total, nil
}

func (s *JobService) GetJobByID(id string) (*models.Job, error) {
	var job models.Job
	if err := s.db.Preload("Company").Where("id = ?", id).First(&job).Error; err != nil {
		return nil, errors.New("job not found")
	}
	return &job, nil
}

func (s *JobService) CreateJob(userID string, job *models.Job) (*models.Job, error) {
	job.ID = uuid.New().String()
	job.PostedByID = &userID
	job.Status = models.JobStatusPublished

	if err := s.db.Create(job).Error; err != nil {
		return nil, err
	}

	return job, nil
}
