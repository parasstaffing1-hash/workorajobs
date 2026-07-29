package models

type FresherCategory string

const (
	FresherCategoryGraduateJob    FresherCategory = "GRADUATE_JOB"
	FresherCategoryTrainee        FresherCategory = "TRAINEE"
	FresherCategoryApprenticeship FresherCategory = "APPRENTICESHIP"
	FresherCategoryEntryLevel     FresherCategory = "ENTRY_LEVEL"
	FresherCategoryCampusHiring   FresherCategory = "CAMPUS_HIRING"
)

type FresherFilterDTO struct {
	Category  string `form:"category"` // GRADUATE_JOB, TRAINEE, APPRENTICESHIP, ENTRY_LEVEL, CAMPUS_HIRING
	Degree    string `form:"degree"`   // B.Tech, B.Sc, B.Com, MBA
	Stream    string `form:"stream"`   // CS, IT, ECE, Finance
	College   string `form:"college"`
	MinSalary *int   `form:"minSalary"`
	Location  string `form:"location"`
	Company   string `form:"company"`
	Page      int    `form:"page,default=1"`
	Limit     int    `form:"limit,default=20"`
}

type FresherSeoPageDTO struct {
	Slug            string `json:"slug"`
	Title           string `json:"title"`
	H1              string `json:"h1"`
	MetaDescription string `json:"metaDescription"`
	CanonicalURL    string `json:"canonicalUrl"`
	TargetCategory  string `json:"targetCategory,omitempty"`
	JobCount        int64  `json:"jobCount"`
}
