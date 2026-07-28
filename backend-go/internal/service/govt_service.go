package service

import (
	"context"
	"time"

	"github.com/workorajobs/backend-go/internal/domain/models"
	"gorm.io/gorm"
)

type GovtService struct {
	db *gorm.DB
}

func NewGovtService(db *gorm.DB) *GovtService {
	return &GovtService{db: db}
}

func (s *GovtService) SearchGovtJobs(ctx context.Context, filter *models.GovtJobFilterDTO) ([]models.Job, int64, error) {
	var jobs []models.Job
	var total int64

	query := s.db.Model(&models.Job{}).Where("status = 'PUBLISHED' AND (department ILIKE '%Govt%' OR department ILIKE '%UPSC%' OR department ILIKE '%SSC%' OR department ILIKE '%Railway%' OR department ILIKE '%Bank%')")

	if filter.Sector != "" {
		query = query.Where("department ILIKE ?", "%"+filter.Sector+"%")
	}
	if filter.Qualification != "" {
		query = query.Where("education ILIKE ? OR requirements ILIKE ?", "%"+filter.Qualification+"%", "%"+filter.Qualification+"%")
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

func (s *GovtService) GetExamCalendar(ctx context.Context) ([]models.GovtExamCalendarDTO, error) {
	now := time.Now()
	nextMonth := now.AddDate(0, 1, 0)

	calendar := []models.GovtExamCalendarDTO{
		{
			ID:                     "exam_upsc_cda_2026",
			ExamName:               "UPSC Civil Services Prelims 2026",
			OrganizingBody:         "Union Public Service Commission (UPSC)",
			Sector:                 models.GovtSectorUPSC,
			VacancyCount:           1056,
			Qualification:          "Graduate Degree in Any Stream",
			NotificationDate:       now.AddDate(0, -1, 0),
			ApplicationDeadline:    now.AddDate(0, 0, 15),
			ExamDate:               &nextMonth,
			OfficialNotificationURL: "https://upsc.gov.in",
			ApplyURL:               "https://upsconline.nic.in",
		},
		{
			ID:                     "exam_ssc_cgl_2026",
			ExamName:               "SSC Combined Graduate Level (CGL) 2026",
			OrganizingBody:         "Staff Selection Commission (SSC)",
			Sector:                 models.GovtSectorSSC,
			VacancyCount:           7500,
			Qualification:          "Bachelor's Degree",
			NotificationDate:       now.AddDate(0, -2, 0),
			ApplicationDeadline:    now.AddDate(0, 0, 7),
			OfficialNotificationURL: "https://ssc.gov.in",
			ApplyURL:               "https://ssc.gov.in/apply",
		},
		{
			ID:                     "exam_rrb_ntpc_2026",
			ExamName:               "RRB NTPC Railway Recruitment 2026",
			OrganizingBody:         "Railway Recruitment Board (RRB)",
			Sector:                 models.GovtSectorRailways,
			VacancyCount:           11558,
			Qualification:          "12th Pass / Graduate",
			NotificationDate:       now.AddDate(0, -1, 15),
			ApplicationDeadline:    now.AddDate(0, 0, 20),
			OfficialNotificationURL: "https://indianrailways.gov.in",
			ApplyURL:               "https://rrbapply.gov.in",
		},
	}

	return calendar, nil
}
