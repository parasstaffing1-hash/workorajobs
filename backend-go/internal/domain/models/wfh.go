package models

type WFHCategory string

const (
	WFHCategoryPermanent WFHCategory = "PERMANENT_WFH"
	WFHCategoryTemporary WFHCategory = "TEMPORARY_WFH"
	WFHCategoryHybrid    WFHCategory = "HYBRID"
	WFHCategoryContract  WFHCategory = "CONTRACT"
	WFHCategoryFreelance WFHCategory = "FREELANCE"
	WFHCategoryPartTime  WFHCategory = "PART_TIME"
)

type WFHFilterDTO struct {
	Category   string   `form:"category"` // PERMANENT_WFH, TEMPORARY_WFH, HYBRID, CONTRACT, FREELANCE, PART_TIME
	MinSalary  *int     `form:"minSalary"`
	Experience string   `form:"experience"`
	Skills     []string `form:"skills"`
	Company    string   `form:"company"`
	Industry   string   `form:"industry"`
	TimeZone   string   `form:"timeZone"`
	Page       int      `form:"page,default=1"`
	Limit      int      `form:"limit,default=20"`
}

type WFHSeoPageDTO struct {
	Slug            string `json:"slug"`
	Title           string `json:"title"`
	H1              string `json:"h1"`
	MetaDescription string `json:"metaDescription"`
	CanonicalURL    string `json:"canonicalUrl"`
	TargetCategory  string `json:"targetCategory,omitempty"`
	JobCount        int64  `json:"jobCount"`
}
