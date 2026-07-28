package models

import (
	"time"

	"gorm.io/gorm"
)

type JobType string

const (
	JobTypeFullTime   JobType = "FULL_TIME"
	JobTypePartTime   JobType = "PART_TIME"
	JobTypeContract   JobType = "CONTRACT"
	JobTypeInternship JobType = "INTERNSHIP"
	JobTypeTemporary  JobType = "TEMPORARY"
	JobTypeFreelance  JobType = "FREELANCE"
)

type JobStatus string

const (
	JobStatusDraft     JobStatus = "DRAFT"
	JobStatusPublished JobStatus = "PUBLISHED"
	JobStatusScheduled JobStatus = "SCHEDULED"
	JobStatusPaused    JobStatus = "PAUSED"
	JobStatusClosed    JobStatus = "CLOSED"
	JobStatusArchived  JobStatus = "ARCHIVED"
)

type Job struct {
	ID                 string         `gorm:"primaryKey;type:varchar(255)" json:"id"`
	Title              string         `gorm:"type:varchar(255);not null;index" json:"title"`
	Slug               *string        `gorm:"uniqueIndex;type:varchar(255)" json:"slug"`
	Description        string         `gorm:"type:text;not null" json:"description"`
	Responsibilities   *string        `gorm:"type:text" json:"responsibilities"`
	Requirements       *string        `gorm:"type:text" json:"requirements"`
	Department         *string        `json:"department"`
	Location           *string        `json:"location"`
	Salary             *int           `json:"salary"`
	SalaryMin          *int           `json:"salaryMin"`
	SalaryMax          *int           `json:"salaryMax"`
	Currency           *string        `gorm:"default:'USD'" json:"currency"`
	Type               JobType        `gorm:"type:varchar(50);default:'FULL_TIME'" json:"type"`
	WorkMode           *string        `gorm:"default:'Remote'" json:"workMode"`
	Experience         *string        `gorm:"default:'Mid Level'" json:"experience"`
	Education          *string        `json:"education"`
	SkillsRequired     []string       `gorm:"type:text[]" json:"skillsRequired"`
	OpeningsCount      int            `gorm:"default:1" json:"openingsCount"`
	NoticePeriod       *string        `gorm:"default:'Immediate'" json:"noticePeriod"`
	Benefits           []string       `gorm:"type:text[]" json:"benefits"`
	ExternalApplyURL   *string        `json:"externalApplyUrl"`
	DeadlineAt         *time.Time     `json:"deadlineAt"`
	ScheduledPublishAt *time.Time     `json:"scheduledPublishAt"`
	Status             JobStatus      `gorm:"type:varchar(50);default:'PUBLISHED';index" json:"status"`
	Version            int            `gorm:"default:1" json:"version"`
	PostedAt           time.Time      `gorm:"default:now();index" json:"postedAt"`
	DeletedAt          gorm.DeletedAt `gorm:"index" json:"-"`
	CreatedAt          time.Time      `json:"createdAt"`
	UpdatedAt          time.Time      `json:"updatedAt"`

	// Foreign Keys
	CompanyID *string `gorm:"index" json:"companyId"`
	Company   *Company `gorm:"foreignKey:CompanyID;constraint:OnDelete:SET NULL" json:"company,omitempty"`
	PostedByID *string `gorm:"index" json:"postedById"`
	PostedBy   *User    `gorm:"foreignKey:PostedByID;constraint:OnDelete:SET NULL" json:"postedBy,omitempty"`
}

func (Job) TableName() string {
	return "Job"
}

type SavedJob struct {
	ID        string    `gorm:"primaryKey;type:varchar(255)" json:"id"`
	UserID    string    `gorm:"type:varchar(255);not null;index" json:"userId"`
	JobID     string    `gorm:"type:varchar(255);not null;index" json:"jobId"`
	User      User      `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE" json:"-"`
	Job       Job       `gorm:"foreignKey:JobID;constraint:OnDelete:CASCADE" json:"job"`
	CreatedAt time.Time `json:"createdAt"`
}

func (SavedJob) TableName() string {
	return "SavedJob"
}

type JobCategory struct {
	ID               string        `gorm:"primaryKey;type:varchar(255)" json:"id"`
	Name             string        `gorm:"type:varchar(255);not null" json:"name"`
	Slug             string        `gorm:"uniqueIndex;type:varchar(255);not null" json:"slug"`
	ParentCategoryID *string       `gorm:"index" json:"parentCategoryId"`
	CreatedAt        time.Time     `json:"createdAt"`
}

func (JobCategory) TableName() string {
	return "JobCategory"
}
