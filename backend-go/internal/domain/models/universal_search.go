package models

type UniversalSearchType string

const (
	SearchTypeJob        UniversalSearchType = "JOB"
	SearchTypeCompany    UniversalSearchType = "COMPANY"
	SearchTypeInternship UniversalSearchType = "INTERNSHIP"
	SearchTypeGovtJob    UniversalSearchType = "GOVT_JOB"
	SearchTypeRemoteJob  UniversalSearchType = "REMOTE_JOB"
	SearchTypeStartupJob UniversalSearchType = "STARTUP_JOB"
	SearchTypeWalkinJob  UniversalSearchType = "WALKIN_JOB"
	SearchTypeVisaJob    UniversalSearchType = "VISA_JOB"
	SearchTypeSkill      UniversalSearchType = "SKILL"
	SearchTypeCity       UniversalSearchType = "CITY"
)

type UniversalSearchQueryDTO struct {
	Query    string   `form:"q" binding:"required"`
	Types    []string `form:"types"` // Filter by result type: JOB, COMPANY, etc.
	Location string   `form:"location"`
	Page     int      `form:"page,default=1"`
	Limit    int      `form:"limit,default=20"`
}

type UniversalSearchResultDTO struct {
	ID          string              `json:"id"`
	Type        UniversalSearchType `json:"type"`
	Title       string              `json:"title"`
	Subtitle    string              `json:"subtitle,omitempty"`
	Description string              `json:"description,omitempty"`
	URL         string              `json:"url"`
	Score       float64             `json:"score"`
	Highlights  []string            `json:"highlights,omitempty"`
}

type UniversalSearchResponseDTO struct {
	Query          string                     `json:"query"`
	CorrectedQuery string                     `json:"correctedQuery,omitempty"`
	TotalResults   int64                      `json:"totalResults"`
	Results        []UniversalSearchResultDTO `json:"results"`
	Facets         map[string][]FacetBucket   `json:"facets"`
	Suggestions    []string                   `json:"suggestions,omitempty"`
}

type FacetBucket struct {
	Key   string `json:"key"`
	Count int64  `json:"count"`
}

type AutocompleteResponseDTO struct {
	Query       string                   `json:"query"`
	Suggestions []AutocompleteSuggestion `json:"suggestions"`
}

type AutocompleteSuggestion struct {
	Text     string              `json:"text"`
	Type     UniversalSearchType `json:"type"`
	Subtitle string              `json:"subtitle,omitempty"`
}

type TrendingSearchDTO struct {
	Query       string `json:"query"`
	SearchCount int    `json:"searchCount"`
}
