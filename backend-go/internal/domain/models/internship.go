package models

type InternshipType string

const (
	InternshipTypePaid         InternshipType = "PAID"
	InternshipTypeUnpaid       InternshipType = "UNPAID"
	InternshipTypePPO          InternshipType = "PPO_OFFERED"
	InternshipTypeWorkFromHome InternshipType = "WORK_FROM_HOME"
	InternshipTypeHybrid       InternshipType = "HYBRID"
)

type InternshipSearchFilterDTO struct {
	Type           string   `form:"type"`   // PAID, UNPAID, PPO_OFFERED, WORK_FROM_HOME, HYBRID
	HasPPO         *bool    `form:"hasPPO"` // Pre-placement offer
	MinStipend     *int     `form:"minStipend"`
	DurationMonths *int     `form:"durationMonths"` // 1, 2, 3, 6
	CollegeYear    string   `form:"collegeYear"`    // FIRST_YEAR, SECOND_YEAR, THIRD_YEAR, FINAL_YEAR
	Skills         []string `form:"skills"`
	Location       string   `form:"location"`
	Page           int      `form:"page,default=1"`
	Limit          int      `form:"limit,default=20"`
}

type InternshipRecommendationDTO struct {
	CollegeYear string   `json:"collegeYear"`
	Skills      []string `json:"skills"`
	Limit       int      `json:"limit,default=10"`
}
