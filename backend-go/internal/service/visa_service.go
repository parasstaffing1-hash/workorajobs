package service

import (
	"context"
	"fmt"
	"strings"

	"github.com/workorajobs/backend-go/internal/domain/models"
	"gorm.io/gorm"
)

type VisaService struct {
	db *gorm.DB
}

func NewVisaService(db *gorm.DB) *VisaService {
	return &VisaService{db: db}
}

func (s *VisaService) ComputeVisaRankScore(detail *models.VisaSponsorshipDetail) float64 {
	score := 0.0

	// Sponsorship confirmed (+40 pts)
	if detail.SponsorshipConfirmed {
		score += 40.0
	}

	// Relocation assistance (+25 pts)
	if detail.RelocationAssistance {
		score += 25.0
	}

	// Immigration support (+20 pts)
	if detail.ImmigrationSupport {
		score += 20.0
	}

	// Country premium weights
	switch detail.TargetCountry {
	case models.VisaCountryUSA:
		score += 15.0
	case models.VisaCountryCanada:
		score += 12.0
	case models.VisaCountryUK:
		score += 12.0
	case models.VisaCountryGermany:
		score += 10.0
	case models.VisaCountryAustralia:
		score += 10.0
	case models.VisaCountrySingapore:
		score += 8.0
	case models.VisaCountryNetherlands:
		score += 8.0
	case models.VisaCountryUAE:
		score += 6.0
	}

	return score
}

func (s *VisaService) SearchVisaJobs(ctx context.Context, filter *models.VisaFilterDTO) ([]models.Job, int64, error) {
	var jobs []models.Job
	var total int64

	query := s.db.Model(&models.Job{}).
		Joins("JOIN \"VisaSponsorshipDetail\" vsd ON vsd.job_id = \"Job\".id").
		Where("\"Job\".status = 'PUBLISHED'")

	if filter.TargetCountry != "" {
		query = query.Where("vsd.target_country = ?", filter.TargetCountry)
	}
	if filter.VisaType != "" {
		query = query.Where("vsd.visa_type = ?", filter.VisaType)
	}
	if filter.RelocationAssistance != nil {
		query = query.Where("vsd.relocation_assistance = ?", *filter.RelocationAssistance)
	}
	if filter.ImmigrationSupport != nil {
		query = query.Where("vsd.immigration_support = ?", *filter.ImmigrationSupport)
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

func (s *VisaService) ResolveSeoPage(ctx context.Context, slug string) (*models.VisaSeoPageDTO, error) {
	cleanSlug := strings.ToLower(strings.TrimSpace(slug))

	title := "Visa Sponsorship Jobs Worldwide | WorkoraJobs"
	h1 := "Jobs With Visa Sponsorship"
	metaDesc := "Find jobs offering visa sponsorship, relocation assistance, and immigration support worldwide."
	country := ""

	if strings.Contains(cleanSlug, "usa") || strings.Contains(cleanSlug, "us") {
		title = "H1B Visa Sponsorship Jobs in USA | WorkoraJobs"
		h1 = "USA Visa Sponsorship & H1B Jobs"
		metaDesc = "Explore H1B, L1, and O1 visa sponsorship roles in the United States."
		country = "USA"
	} else if strings.Contains(cleanSlug, "canada") {
		title = "Visa Sponsorship Jobs in Canada | WorkoraJobs"
		h1 = "Canada Work Permit & LMIA Jobs"
		metaDesc = "Find jobs with Canadian work permit sponsorship and LMIA support."
		country = "CANADA"
	} else if strings.Contains(cleanSlug, "uk") {
		title = "Tier 2 Visa Sponsorship Jobs in UK | WorkoraJobs"
		h1 = "UK Skilled Worker Visa Jobs"
		metaDesc = "Browse Tier 2 and Skilled Worker visa sponsored roles in the United Kingdom."
		country = "UK"
	} else if strings.Contains(cleanSlug, "germany") {
		title = "EU Blue Card Jobs in Germany | WorkoraJobs"
		h1 = "Germany EU Blue Card & Work Visa Jobs"
		metaDesc = "Find EU Blue Card and work visa sponsored positions in Germany."
		country = "GERMANY"
	} else if strings.Contains(cleanSlug, "australia") {
		title = "Visa Sponsorship Jobs in Australia | WorkoraJobs"
		h1 = "Australia 482/494 Visa Sponsorship Jobs"
		metaDesc = "Explore Subclass 482 and 494 employer-sponsored roles in Australia."
		country = "AUSTRALIA"
	}

	var count int64
	if s.db != nil {
		s.db.Model(&models.VisaSponsorshipDetail{}).Count(&count)
	}

	return &models.VisaSeoPageDTO{
		Slug:            cleanSlug,
		Title:           title,
		H1:              h1,
		MetaDescription: metaDesc,
		CanonicalURL:    fmt.Sprintf("https://workorajobs.com/%s", cleanSlug),
		TargetCountry:   country,
		JobCount:        count,
	}, nil
}
