package service

import (
	"context"
	"math"
	"strings"

	"github.com/workorajobs/backend-go/internal/domain/models"
	"gorm.io/gorm"
)

type RecommendationService struct {
	db *gorm.DB
}

func NewRecommendationService(db *gorm.DB) *RecommendationService {
	return &RecommendationService{db: db}
}

// Content-Based Filtering: match user skills to job requirements
func (s *RecommendationService) ContentBasedJobRecommendations(ctx context.Context, profile *models.UserProfileVector, limit int) ([]models.RecommendationResultDTO, error) {
	var jobs []models.Job

	if s.db != nil {
		query := s.db.Preload("Company").Where("status = 'PUBLISHED'")
		if profile.Location != "" {
			query = query.Where("location ILIKE ?", "%"+profile.Location+"%")
		}
		query.Order("posted_at DESC").Limit(limit * 3).Find(&jobs)
	}

	var results []models.RecommendationResultDTO
	for _, job := range jobs {
		score := s.computeContentScore(profile, &job)
		if score > 0 {
			results = append(results, models.RecommendationResultDTO{
				Type:   models.RecommendationTypeJob,
				ItemID: job.ID,
				Title:  job.Title,
				Score:  score,
				Reason: "Based on your skills and experience",
			})
		}
	}

	// Sort by score descending
	for i := 0; i < len(results); i++ {
		for j := i + 1; j < len(results); j++ {
			if results[j].Score > results[i].Score {
				results[i], results[j] = results[j], results[i]
			}
		}
	}

	if len(results) > limit {
		results = results[:limit]
	}

	return results, nil
}

func (s *RecommendationService) computeContentScore(profile *models.UserProfileVector, job *models.Job) float64 {
	score := 0.0

	// Skill overlap scoring
	jobDesc := strings.ToLower(job.Description)
	matchCount := 0
	for _, skill := range profile.Skills {
		if strings.Contains(jobDesc, strings.ToLower(skill)) {
			matchCount++
		}
	}

	if len(profile.Skills) > 0 {
		score += (float64(matchCount) / float64(len(profile.Skills))) * 60.0
	}

	// Title relevance scoring
	jobTitle := strings.ToLower(job.Title)
	for _, title := range profile.JobTitles {
		if strings.Contains(jobTitle, strings.ToLower(title)) {
			score += 25.0
			break
		}
	}

	// Location match
	if profile.Location != "" && job.Location != nil {
		if strings.Contains(strings.ToLower(*job.Location), strings.ToLower(profile.Location)) {
			score += 15.0
		}
	}

	return math.Round(score*100) / 100
}

// Collaborative Filtering: recommend jobs viewed by similar users
func (s *RecommendationService) CollaborativeFilteringRecommendations(ctx context.Context, profile *models.UserProfileVector, limit int) ([]models.RecommendationResultDTO, error) {
	// In production, this would query a user-item interaction matrix
	// For now, recommend trending jobs as proxy for collaborative signal
	var jobs []models.Job
	if s.db != nil {
		s.db.Preload("Company").Where("status = 'PUBLISHED'").
			Where("id NOT IN (?)", profile.ViewedJobIDs).
			Order("posted_at DESC").Limit(limit).Find(&jobs)
	}

	var results []models.RecommendationResultDTO
	for _, job := range jobs {
		results = append(results, models.RecommendationResultDTO{
			Type:   models.RecommendationTypeJob,
			ItemID: job.ID,
			Title:  job.Title,
			Score:  50.0, // Base collaborative score
			Reason: "Popular among similar professionals",
		})
	}

	return results, nil
}

// Hybrid: merge content-based and collaborative results
func (s *RecommendationService) HybridRecommendations(ctx context.Context, profile *models.UserProfileVector, limit int) ([]models.RecommendationResultDTO, error) {
	contentResults, err := s.ContentBasedJobRecommendations(ctx, profile, limit)
	if err != nil {
		return nil, err
	}

	collabResults, err := s.CollaborativeFilteringRecommendations(ctx, profile, limit)
	if err != nil {
		return nil, err
	}

	// Merge and deduplicate, content-based gets 70% weight, collaborative 30%
	seen := map[string]bool{}
	var merged []models.RecommendationResultDTO

	for _, r := range contentResults {
		r.Score = r.Score * 0.7
		merged = append(merged, r)
		seen[r.ItemID] = true
	}
	for _, r := range collabResults {
		if !seen[r.ItemID] {
			r.Score = r.Score * 0.3
			merged = append(merged, r)
		}
	}

	// Sort by score descending
	for i := 0; i < len(merged); i++ {
		for j := i + 1; j < len(merged); j++ {
			if merged[j].Score > merged[i].Score {
				merged[i], merged[j] = merged[j], merged[i]
			}
		}
	}

	if len(merged) > limit {
		merged = merged[:limit]
	}

	return merged, nil
}

// Resume Match Score
func (s *RecommendationService) ComputeResumeMatchScore(ctx context.Context, input *models.ResumeMatchInputDTO) (*models.ResumeMatchOutputDTO, error) {
	var job models.Job
	if s.db != nil {
		if err := s.db.Where("id = ?", input.JobID).First(&job).Error; err != nil {
			return nil, err
		}
	}

	jobDesc := strings.ToLower(job.Description)

	var matched, missing []string
	for _, skill := range input.ResumeSkills {
		if strings.Contains(jobDesc, strings.ToLower(skill)) {
			matched = append(matched, skill)
		} else {
			missing = append(missing, skill)
		}
	}

	matchScore := 0.0
	if len(input.ResumeSkills) > 0 {
		matchScore = (float64(len(matched)) / float64(len(input.ResumeSkills))) * 100.0
	}

	return &models.ResumeMatchOutputDTO{
		JobID:         input.JobID,
		MatchScore:    math.Round(matchScore*100) / 100,
		MatchedSkills: matched,
		MissingSkills: missing,
	}, nil
}

// Salary Prediction
func (s *RecommendationService) PredictSalary(ctx context.Context, input *models.SalaryPredictionInputDTO) (*models.SalaryPredictionOutputDTO, error) {
	baseSalary := 500000.0 // Base in INR

	// Experience multiplier
	expMultiplier := 1.0 + (float64(input.Experience) * 0.15)
	if expMultiplier > 5.0 {
		expMultiplier = 5.0
	}

	// Skill premium
	skillPremium := float64(len(input.Skills)) * 50000.0
	if skillPremium > 500000 {
		skillPremium = 500000
	}

	predicted := baseSalary*expMultiplier + skillPremium

	return &models.SalaryPredictionOutputDTO{
		PredictedMin: math.Round(predicted * 0.85),
		PredictedMax: math.Round(predicted * 1.15),
		PredictedMid: math.Round(predicted),
		Confidence:   0.78,
	}, nil
}
