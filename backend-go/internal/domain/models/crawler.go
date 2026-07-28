package models

import (
	"time"
)

type CrawlSourceType string

const (
	CrawlTypeRSS        CrawlSourceType = "RSS"
	CrawlTypeXML        CrawlSourceType = "XML"
	CrawlTypeJSON       CrawlSourceType = "JSON_API"
	CrawlTypeHTML       CrawlSourceType = "HTML_PAGE"
	CrawlTypeUserImport CrawlSourceType = "USER_IMPORT"
)

type CrawlSource struct {
	ID             string          `gorm:"primaryKey;type:varchar(255)" json:"id"`
	Name           string          `gorm:"type:varchar(255);not null" json:"name"`
	TargetURL      string          `gorm:"type:text;not null" json:"targetUrl"`
	SourceType     CrawlSourceType `gorm:"type:varchar(50);not null" json:"sourceType"`
	IsActive       bool            `gorm:"default:true" json:"isActive"`
	PollInterval   time.Duration   `gorm:"default:3600000000000" json:"pollInterval"` // 1 hour
	LastCrawledAt  *time.Time      `json:"lastCrawledAt"`
	ETag           *string         `json:"eTag"`
	LastModified   *string         `json:"lastModified"`
	CreatedAt      time.Time       `json:"createdAt"`
	UpdatedAt      time.Time       `json:"updatedAt"`
}

func (CrawlSource) TableName() string {
	return "CrawlSource"
}

type CrawledJobItem struct {
	SourceID         string    `json:"sourceId"`
	ExternalID       string    `json:"externalId"`
	Title            string    `json:"title"`
	Company          string    `json:"company"`
	Location         string    `json:"location"`
	Description      string    `json:"description"`
	ApplyURL         string    `json:"applyUrl"`
	SalaryMin        *int      `json:"salaryMin"`
	SalaryMax        *int      `json:"salaryMax"`
	JobType          string    `json:"jobType"`
	WorkMode         string    `json:"workMode"`
	ContentHash      string    `json:"contentHash"`
	PublishedAt      time.Time `json:"publishedAt"`
}
