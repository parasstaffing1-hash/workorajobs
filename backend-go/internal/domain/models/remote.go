package models

type RemoteSearchFilterDTO struct {
	RemoteType  string   `form:"remoteType"`  // WORLDWIDE, COUNTRY_SPECIFIC, REGIONAL, HYBRID, ONSITE
	Country     string   `form:"country"`     // USA, India, Germany, UK
	TimeZone    string   `form:"timeZone"`    // UTC, EST, PST, IST, CET
	Category    string   `form:"category"`    // Software, Marketing, Sales
	MinSalary   *int     `form:"minSalary"`
	Experience  string   `form:"experience"`
	Skills      []string `form:"skills"`
	Company     string   `form:"company"`
	Industry    string   `form:"industry"`
	PostedWithin string  `form:"postedWithin"` // 24h, 7d, 30d
	Page        int      `form:"page,default=1"`
	Limit       int      `form:"limit,default=20"`
}

type RemoteSeoPageDTO struct {
	Slug            string `json:"slug"`
	Title           string `json:"title"`
	H1              string `json:"h1"`
	MetaDescription string `json:"metaDescription"`
	CanonicalURL    string `json:"canonicalUrl"`
	TargetCountry   string `json:"targetCountry,omitempty"`
	TargetCategory  string `json:"targetCategory,omitempty"`
	JobCount        int64  `json:"jobCount"`
}
