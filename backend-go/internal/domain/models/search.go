package models

type SearchFilterDTO struct {
	Query      string   `form:"q"`
	Location   string   `form:"location"`
	Category   string   `form:"category"`
	Company    string   `form:"company"`
	JobType    string   `form:"jobType"`
	WorkMode   string   `form:"workMode"`
	Experience string   `form:"experience"`
	MinSalary  *int     `form:"minSalary"`
	MaxSalary  *int     `form:"maxSalary"`
	Skills     []string `form:"skills"`
	SortBy     string   `form:"sortBy,default=newest"` // newest, salary_high, salary_low, relevance
	Page       int      `form:"page,default=1"`
	Limit      int      `form:"limit,default=20"`
}

type AutocompleteResultDTO struct {
	Query     string   `json:"query"`
	Titles    []string `json:"titles"`
	Companies []string `json:"companies"`
	Locations []string `json:"locations"`
	Skills    []string `json:"skills"`
}

type RecommendationRequestDTO struct {
	UserID    string   `json:"userId"`
	Skills    []string `json:"skills"`
	Location  string   `json:"location"`
	JobTitles []string `json:"jobTitles"`
	Limit     int      `json:"limit"`
}
