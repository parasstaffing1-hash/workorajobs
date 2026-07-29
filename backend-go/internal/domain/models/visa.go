package models

type VisaCountry string

const (
	VisaCountryUSA         VisaCountry = "USA"
	VisaCountryCanada      VisaCountry = "CANADA"
	VisaCountryUK          VisaCountry = "UK"
	VisaCountryGermany     VisaCountry = "GERMANY"
	VisaCountryAustralia   VisaCountry = "AUSTRALIA"
	VisaCountrySingapore   VisaCountry = "SINGAPORE"
	VisaCountryNetherlands VisaCountry = "NETHERLANDS"
	VisaCountryUAE         VisaCountry = "UAE"
)

type VisaSponsorshipDetail struct {
	ID                   string      `gorm:"primaryKey;type:varchar(255)" json:"id"`
	JobID                string      `gorm:"type:varchar(255);not null" json:"jobId"`
	TargetCountry        VisaCountry `gorm:"type:varchar(50);not null" json:"targetCountry"`
	VisaType             string      `gorm:"type:varchar(100)" json:"visaType"` // H1B, L1, Tier2, BlueCard, etc.
	SponsorshipConfirmed bool        `gorm:"default:false" json:"sponsorshipConfirmed"`
	RelocationAssistance bool        `gorm:"default:false" json:"relocationAssistance"`
	ImmigrationSupport   bool        `gorm:"default:false" json:"immigrationSupport"`
}

func (VisaSponsorshipDetail) TableName() string {
	return "VisaSponsorshipDetail"
}

type VisaFilterDTO struct {
	TargetCountry        string `form:"targetCountry"`
	VisaType             string `form:"visaType"`
	RelocationAssistance *bool  `form:"relocationAssistance"`
	ImmigrationSupport   *bool  `form:"immigrationSupport"`
	MinSalary            *int   `form:"minSalary"`
	Experience           string `form:"experience"`
	Page                 int    `form:"page,default=1"`
	Limit                int    `form:"limit,default=20"`
}

type VisaSeoPageDTO struct {
	Slug            string `json:"slug"`
	Title           string `json:"title"`
	H1              string `json:"h1"`
	MetaDescription string `json:"metaDescription"`
	CanonicalURL    string `json:"canonicalUrl"`
	TargetCountry   string `json:"targetCountry,omitempty"`
	JobCount        int64  `json:"jobCount"`
}

type VisaRankedResultDTO struct {
	JobID     string  `json:"jobId"`
	Country   string  `json:"country"`
	VisaType  string  `json:"visaType"`
	RankScore float64 `json:"rankScore"`
}
