package models

import (
	"time"
)

type WalkInDetail struct {
	ID                 string    `gorm:"primaryKey;type:varchar(255)" json:"id"`
	JobID              string    `gorm:"type:varchar(255);not null" json:"jobId"`
	StartDate          time.Time `gorm:"not null" json:"startDate"`
	EndDate            time.Time `gorm:"not null" json:"endDate"`
	TimeSlot           string    `gorm:"type:varchar(100);not null" json:"timeSlot"` // e.g. 10:00 AM - 04:00 PM
	VenueAddress       string    `gorm:"type:text;not null" json:"venueAddress"`
	City               string    `gorm:"type:varchar(100);not null" json:"city"`
	State              string    `gorm:"type:varchar(100);not null" json:"state"`
	GoogleMapURL       string    `gorm:"type:text" json:"googleMapUrl"`
	HRContactName      string    `gorm:"type:varchar(100)" json:"hrContactName"`
	HRContactPhone     string    `gorm:"type:varchar(50)" json:"hrContactPhone"`
	HRContactEmail     string    `gorm:"type:varchar(100)" json:"hrContactEmail"`
	RequiredDocuments  string    `gorm:"type:text" json:"requiredDocuments"` // Comma-separated: Resume, Gov ID, Degree Certs
	CreatedAt          time.Time `json:"createdAt"`
}

func (WalkInDetail) TableName() string {
	return "WalkInDetail"
}

type WalkinFilterDTO struct {
	City         string `form:"city"`
	State        string `form:"state"`
	Date         string `form:"date"`         // today, tomorrow, this_week
	Company      string `form:"company"`
	Role         string `form:"role"`
	Page         int    `form:"page,default=1"`
	Limit        int    `form:"limit,default=20"`
}

type WalkinReminderDTO struct {
	WalkInID string `json:"walkInId" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
}

type WalkinSeoPageDTO struct {
	Slug            string `json:"slug"`
	Title           string `json:"title"`
	H1              string `json:"h1"`
	MetaDescription string `json:"metaDescription"`
	CanonicalURL    string `json:"canonicalUrl"`
	JobCount        int64  `json:"jobCount"`
}
