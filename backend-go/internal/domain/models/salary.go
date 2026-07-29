package models

type SalaryCompareInputDTO struct {
	JobTitle   string `form:"jobTitle" json:"jobTitle" binding:"required"`
	Skills     string `form:"skills" json:"skills"`
	Experience string `form:"experience" json:"experience"`
	Company    string `form:"company" json:"company"`
	Location   string `form:"location" json:"location"`
}

type SalaryCompareOutputDTO struct {
	JobTitle           string                `json:"jobTitle"`
	Location           string                `json:"location"`
	AverageSalary      float64               `json:"averageSalary"`
	MedianSalary       float64               `json:"medianSalary"`
	MinSalary          float64               `json:"minSalary"`
	MaxSalary          float64               `json:"maxSalary"`
	SampleSize         int                   `json:"sampleSize"`
	DemandIndex        float64               `json:"demandIndex"`      // 0.0 - 100.0
	YoYGrowthPercent   float64               `json:"yoyGrowthPercent"` // Year-over-year salary growth
	TopPayingCompanies []TopPayingCompanyDTO `json:"topPayingCompanies"`
	SalaryBands        []SalaryBandDTO       `json:"salaryBands"`
}

type TopPayingCompanyDTO struct {
	CompanyName   string  `json:"companyName"`
	AverageSalary float64 `json:"averageSalary"`
	OpenPositions int     `json:"openPositions"`
}

type SalaryBandDTO struct {
	Label     string  `json:"label"` // e.g. "0-3 yrs", "3-5 yrs", "5-10 yrs", "10+ yrs"
	MinSalary float64 `json:"minSalary"`
	MaxSalary float64 `json:"maxSalary"`
	AvgSalary float64 `json:"avgSalary"`
}

type SalaryChartDataDTO struct {
	Labels []string  `json:"labels"`
	Values []float64 `json:"values"`
}
