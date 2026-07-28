package service

import (
	"context"
	"math"
	"sort"

	"github.com/workorajobs/backend-go/internal/domain/models"
	"gorm.io/gorm"
)

type SalaryService struct {
	db *gorm.DB
}

func NewSalaryService(db *gorm.DB) *SalaryService {
	return &SalaryService{db: db}
}

func (s *SalaryService) CompareSalaries(ctx context.Context, input *models.SalaryCompareInputDTO) (*models.SalaryCompareOutputDTO, error) {
	var salaries []struct {
		SalaryMin float64
		SalaryMax float64
		Company   string
	}

	query := s.db.Model(&models.Job{}).
		Select("salary_min, salary_max, company_id AS company").
		Where("status = 'PUBLISHED' AND title ILIKE ?", "%"+input.JobTitle+"%")

	if input.Location != "" {
		query = query.Where("location ILIKE ?", "%"+input.Location+"%")
	}

	if err := query.Find(&salaries).Error; err != nil {
		return nil, err
	}

	if len(salaries) == 0 {
		return &models.SalaryCompareOutputDTO{
			JobTitle:   input.JobTitle,
			Location:   input.Location,
			SampleSize: 0,
		}, nil
	}

	var allAvgs []float64
	for _, sal := range salaries {
		avg := (sal.SalaryMin + sal.SalaryMax) / 2.0
		allAvgs = append(allAvgs, avg)
	}
	sort.Float64s(allAvgs)

	total := 0.0
	minSal := allAvgs[0]
	maxSal := allAvgs[len(allAvgs)-1]
	for _, v := range allAvgs {
		total += v
	}
	avgSal := total / float64(len(allAvgs))

	medianSal := allAvgs[len(allAvgs)/2]

	demandIndex := math.Min(float64(len(salaries))/10.0*100.0, 100.0)

	bands := s.computeSalaryBands(input.JobTitle)

	return &models.SalaryCompareOutputDTO{
		JobTitle:          input.JobTitle,
		Location:          input.Location,
		AverageSalary:     math.Round(avgSal*100) / 100,
		MedianSalary:      math.Round(medianSal*100) / 100,
		MinSalary:         minSal,
		MaxSalary:         maxSal,
		SampleSize:        len(salaries),
		DemandIndex:       math.Round(demandIndex*100) / 100,
		YoYGrowthPercent:  8.5, // Placeholder — compute from historical data
		SalaryBands:       bands,
	}, nil
}

func (s *SalaryService) computeSalaryBands(jobTitle string) []models.SalaryBandDTO {
	return []models.SalaryBandDTO{
		{Label: "0-3 yrs", MinSalary: 300000, MaxSalary: 800000, AvgSalary: 550000},
		{Label: "3-5 yrs", MinSalary: 600000, MaxSalary: 1500000, AvgSalary: 1050000},
		{Label: "5-10 yrs", MinSalary: 1200000, MaxSalary: 3000000, AvgSalary: 2100000},
		{Label: "10+ yrs", MinSalary: 2500000, MaxSalary: 6000000, AvgSalary: 4250000},
	}
}

func (s *SalaryService) GetChartData(ctx context.Context, jobTitle string) (*models.SalaryChartDataDTO, error) {
	bands := s.computeSalaryBands(jobTitle)
	labels := make([]string, len(bands))
	values := make([]float64, len(bands))
	for i, b := range bands {
		labels[i] = b.Label
		values[i] = b.AvgSalary
	}
	return &models.SalaryChartDataDTO{Labels: labels, Values: values}, nil
}
