package models

import (
	"time"

	"gorm.io/gorm"
)

type ApplicationStatus string

const (
	ApplicationStatusSubmitted   ApplicationStatus = "SUBMITTED"
	ApplicationStatusUnderReview ApplicationStatus = "UNDER_REVIEW"
	ApplicationStatusShortlisted ApplicationStatus = "SHORTLISTED"
	ApplicationStatusInterviewing ApplicationStatus = "INTERVIEWING"
	ApplicationStatusOffered     ApplicationStatus = "OFFERED"
	ApplicationStatusRejected    ApplicationStatus = "REJECTED"
	ApplicationStatusWithdrawn   ApplicationStatus = "WITHDRAWN"
)

type Application struct {
	ID                 string            `gorm:"primaryKey;type:varchar(255)" json:"id"`
	JobID              string            `gorm:"type:varchar(255);not null;index" json:"jobId"`
	Job                Job               `gorm:"foreignKey:JobID;constraint:OnDelete:CASCADE" json:"job"`
	UserID             string            `gorm:"type:varchar(255);not null;index" json:"userId"`
	User               User              `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE" json:"user"`
	ResumeURL          *string           `json:"resumeUrl"`
	CoverLetter        *string           `gorm:"type:text" json:"coverLetter"`
	Status             ApplicationStatus `gorm:"type:varchar(50);default:'SUBMITTED';index" json:"status"`
	AtsMatchScore      *int              `json:"atsMatchScore"`
	Feedback           *string           `gorm:"type:text" json:"feedback"`
	ScreeningAnswers   *string           `gorm:"type:jsonb" json:"screeningAnswers"`
	AppliedAt          time.Time         `gorm:"default:now();index" json:"appliedAt"`
	DeletedAt          gorm.DeletedAt    `gorm:"index" json:"-"`
	CreatedAt          time.Time         `json:"createdAt"`
	UpdatedAt          time.Time         `json:"updatedAt"`
}

func (Application) TableName() string {
	return "Application"
}
