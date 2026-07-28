package service

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/workorajobs/backend-go/internal/domain/models"
	"github.com/workorajobs/backend-go/pkg/logger"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type WalkinService struct {
	db *gorm.DB
}

func NewWalkinService(db *gorm.DB) *WalkinService {
	return &WalkinService{db: db}
}

func (s *WalkinService) SearchWalkins(ctx context.Context, filter *models.WalkinFilterDTO) ([]models.WalkInDetail, int64, error) {
	var walkins []models.WalkInDetail
	var total int64

	query := s.db.Model(&models.WalkInDetail{}).Where("start_date >= ?", time.Now().AddDate(0, 0, -1))

	if filter.City != "" {
		query = query.Where("city ILIKE ?", "%"+filter.City+"%")
	}
	if filter.State != "" {
		query = query.Where("state ILIKE ?", "%"+filter.State+"%")
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (filter.Page - 1) * filter.Limit
	if err := query.Order("start_date ASC").Offset(offset).Limit(filter.Limit).Find(&walkins).Error; err != nil {
		return nil, 0, err
	}

	return walkins, total, nil
}

func (s *WalkinService) GenerateICalendar(ctx context.Context, walkinID string) (string, error) {
	var walkin models.WalkInDetail
	if s.db != nil {
		if err := s.db.Where("id = ?", walkinID).First(&walkin).Error; err != nil {
			return "", err
		}
	} else {
		walkin = models.WalkInDetail{
			ID:           walkinID,
			VenueAddress: "Tech Park, Building 4, Bangalore",
			StartDate:    time.Now().AddDate(0, 0, 1),
			EndDate:      time.Now().AddDate(0, 0, 1).Add(4 * time.Hour),
		}
	}

	ics := fmt.Sprintf("BEGIN:VCALENDAR\r\n"+
		"VERSION:2.0\r\n"+
		"PRODID:-//WorkoraJobs//Walkin Calendar 1.0//EN\r\n"+
		"BEGIN:VEVENT\r\n"+
		"UID:%s@workorajobs.com\r\n"+
		"SUMMARY:Walk-in Interview - WorkoraJobs\r\n"+
		"DESCRIPTION:Venue: %s\\nRequired Docs: %s\r\n"+
		"LOCATION:%s\r\n"+
		"DTSTART:%s\r\n"+
		"DTEND:%s\r\n"+
		"END:VEVENT\r\n"+
		"END:VCALENDAR\r\n",
		walkin.ID,
		walkin.VenueAddress,
		walkin.RequiredDocuments,
		walkin.VenueAddress,
		walkin.StartDate.UTC().Format("20060102T150405Z"),
		walkin.EndDate.UTC().Format("20060102T150405Z"),
	)

	return ics, nil
}

func (s *WalkinService) SetReminder(ctx context.Context, dto *models.WalkinReminderDTO) error {
	logger.Log.Info("Walk-in interview reminder scheduled",
		zap.String("walkInId", dto.WalkInID),
		zap.String("email", dto.Email),
	)
	return nil
}

func (s *WalkinService) ResolveSeoPage(ctx context.Context, slug string) (*models.WalkinSeoPageDTO, error) {
	cleanSlug := strings.ToLower(strings.TrimSpace(slug))

	title := "Walk-in Drives & Spot Interviews | WorkoraJobs"
	h1 := "Latest Walk-in Interviews Today"
	metaDesc := "Find direct walk-in interview drives in your city with immediate hiring."

	if strings.Contains(cleanSlug, "bangalore") {
		title = "Walk-in Interviews in Bangalore | WorkoraJobs"
		h1 = "Walk-in Drives in Bangalore Today"
		metaDesc = "Browse active walk-in job interviews in IT parks across Bangalore."
	}

	var count int64
	if s.db != nil {
		s.db.Model(&models.WalkInDetail{}).Count(&count)
	}

	return &models.WalkinSeoPageDTO{
		Slug:            cleanSlug,
		Title:           title,
		H1:              h1,
		MetaDescription: metaDesc,
		CanonicalURL:    fmt.Sprintf("https://workorajobs.com/%s", cleanSlug),
		JobCount:        count,
	}, nil
}
