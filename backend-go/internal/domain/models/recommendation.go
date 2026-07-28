package models

type RecommendationType string

const (
	RecommendationTypeJob     RecommendationType = "JOB"
	RecommendationTypeCompany RecommendationType = "COMPANY"
	RecommendationTypeCareer  RecommendationType = "CAREER"
	RecommendationTypeSkill   RecommendationType = "SKILL"
)

type UserProfileVector struct {
	UserID         string   `json:"userId"`
	Skills         []string `json:"skills"`
	JobTitles      []string `json:"jobTitles"`
	Experience     int      `json:"experience"`
	Location       string   `json:"location"`
	ViewedJobIDs   []string `json:"viewedJobIds"`
	SavedJobIDs    []string `json:"savedJobIds"`
	AppliedJobIDs  []string `json:"appliedJobIds"`
}

type RecommendationResultDTO struct {
	Type      RecommendationType `json:"type"`
	ItemID    string             `json:"itemId"`
	Title     string             `json:"title"`
	Score     float64            `json:"score"`
	Reason    string             `json:"reason"` // e.g. "Based on your skills", "Similar to saved jobs"
}

type SalaryPredictionInputDTO struct {
	JobTitle   string   `json:"jobTitle" binding:"required"`
	Skills     []string `json:"skills"`
	Experience int      `json:"experience"`
	Location   string   `json:"location"`
}

type SalaryPredictionOutputDTO struct {
	PredictedMin  float64 `json:"predictedMin"`
	PredictedMax  float64 `json:"predictedMax"`
	PredictedMid  float64 `json:"predictedMid"`
	Confidence    float64 `json:"confidence"` // 0.0 - 1.0
}

type ResumeMatchInputDTO struct {
	ResumeSkills     []string `json:"resumeSkills" binding:"required"`
	ResumeExperience int      `json:"resumeExperience"`
	JobID            string   `json:"jobId" binding:"required"`
}

type ResumeMatchOutputDTO struct {
	JobID          string  `json:"jobId"`
	MatchScore     float64 `json:"matchScore"` // 0.0 - 100.0
	MatchedSkills  []string `json:"matchedSkills"`
	MissingSkills  []string `json:"missingSkills"`
}
