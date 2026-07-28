package models

type FundingStage string

const (
	FundingStageSeed         FundingStage = "SEED"
	FundingStageSeriesA      FundingStage = "SERIES_A"
	FundingStageSeriesB      FundingStage = "SERIES_B"
	FundingStageSeriesCPlus  FundingStage = "SERIES_C_PLUS"
	FundingStageBootstrapped FundingStage = "BOOTSTRAPPED"
	FundingStageUnicorn      FundingStage = "UNICORN"
)

type StartupProfile struct {
	ID                 string       `gorm:"primaryKey;type:varchar(255)" json:"id"`
	CompanyID          string       `gorm:"type:varchar(255);not null;unique" json:"companyId"`
	CompanyName        string       `gorm:"type:varchar(255);not null" json:"companyName"`
	Slug               string       `gorm:"type:varchar(255);not null;unique" json:"slug"`
	FundingStage       FundingStage `gorm:"type:varchar(50);not null" json:"fundingStage"`
	TotalFundingUSD    float64      `gorm:"default:0" json:"totalFundingUSD"`
	EmployeeCountRange string       `gorm:"type:varchar(50);not null" json:"employeeCountRange"` // 1-10, 11-50, 51-200, 200+
	HasESOP            bool         `gorm:"default:false" json:"hasESOP"`
	RemoteFriendly     bool         `gorm:"default:true" json:"remoteFriendly"`
	TechStack          string       `gorm:"type:text" json:"techStack"` // Comma separated
	Investors          string       `gorm:"type:text" json:"investors"` // Comma separated
	FoundedYear        int          `gorm:"not null" json:"foundedYear"`
}

func (StartupProfile) TableName() string {
	return "StartupProfile"
}

type StartupFilterDTO struct {
	FundingStage       string `form:"fundingStage"`       // SEED, SERIES_A, SERIES_B, BOOTSTRAPPED, UNICORN
	EmployeeCountRange string `form:"employeeCountRange"` // 1-10, 11-50, 51-200, 200+
	HasESOP            *bool  `form:"hasESOP"`
	RemoteFriendly     *bool  `form:"remoteFriendly"`
	MinFundingUSD      *float64 `form:"minFundingUSD"`
	Page               int    `form:"page,default=1"`
	Limit              int    `form:"limit,default=20"`
}

type StartupRankedResultDTO struct {
	Startup        StartupProfile `json:"startup"`
	RankScore      float64        `json:"rankScore"`
	ActiveJobCount int            `json:"activeJobCount"`
}
