package models

import (
	"time"

	"gorm.io/gorm"
)

type Company struct {
	ID                  string         `gorm:"primaryKey;type:varchar(255)" json:"id"`
	Slug                *string        `gorm:"uniqueIndex;type:varchar(255)" json:"slug"`
	Name                string         `gorm:"type:varchar(255);not null;index" json:"name"`
	OfficialName        *string        `json:"officialName"`
	DisplayName         *string        `json:"displayName"`
	Description         *string        `gorm:"type:text" json:"description"`
	ShortDescription    *string        `json:"shortDescription"`
	OfficialDomain      *string        `gorm:"uniqueIndex;type:varchar(255)" json:"officialDomain"`
	WebsiteURL          *string        `json:"websiteUrl"`
	CareersURL          *string        `json:"careersUrl"`
	LogoURL             *string        `json:"logoUrl"`
	Rating              *float64       `gorm:"default:4.5" json:"rating"`
	CountryCode         *string        `gorm:"default:'US';index" json:"countryCode"`
	HeadquartersCity    *string        `json:"headquartersCity"`
	HeadquartersCountry *string        `gorm:"default:'United States'" json:"headquartersCountry"`
	Industry            *string        `gorm:"index" json:"industry"`
	CompanyType         *string        `gorm:"default:'Enterprise'" json:"companyType"`
	PublicPrivateStatus *string        `gorm:"default:'Public';index" json:"publicPrivateStatus"`
	FoundedYear         *int           `json:"foundedYear"`
	EmployeeRange       *string        `json:"employeeRange"`
	LinkedinURL         *string        `json:"linkedinUrl"`
	ActiveJobCount      int            `gorm:"default:0" json:"activeJobCount"`
	VerificationStatus  *string        `gorm:"default:'VERIFIED'" json:"verificationStatus"`
	SeoTitle            *string        `json:"seoTitle"`
	MetaDescription     *string        `json:"metaDescription"`
	IndexingStatus      *string        `gorm:"default:'published_indexable';index" json:"indexingStatus"`
	DeletedAt           gorm.DeletedAt `gorm:"index" json:"-"`
	OwnerID             *string        `gorm:"uniqueIndex" json:"ownerId"`
	CreatedAt           time.Time      `json:"createdAt"`
	UpdatedAt           time.Time      `json:"updatedAt"`

	// Relationships
	Jobs []Job `gorm:"foreignKey:CompanyID" json:"jobs,omitempty"`
}

func (Company) TableName() string {
	return "Company"
}

type CompanyUserRole string

const (
	CompanyUserRoleOwner         CompanyUserRole = "OWNER"
	CompanyUserRoleAdmin         CompanyUserRole = "ADMIN"
	CompanyUserRoleHRManager     CompanyUserRole = "HR_MANAGER"
	CompanyUserRoleRecruiter     CompanyUserRole = "RECRUITER"
	CompanyUserRoleHiringManager CompanyUserRole = "HIRING_MANAGER"
	CompanyUserRoleInterviewer   CompanyUserRole = "INTERVIEWER"
	CompanyUserRoleViewer        CompanyUserRole = "VIEWER"
)

type CompanyUser struct {
	ID        string          `gorm:"primaryKey;type:varchar(255)" json:"id"`
	CompanyID string          `gorm:"type:varchar(255);not null;index" json:"companyId"`
	UserID    string          `gorm:"type:varchar(255);not null;index" json:"userId"`
	Role      CompanyUserRole `gorm:"type:varchar(50);default:'RECRUITER'" json:"role"`
	Status    string          `gorm:"type:varchar(50);default:'ACTIVE'" json:"status"`
	CreatedAt time.Time       `json:"createdAt"`
	UpdatedAt time.Time       `json:"updatedAt"`

	Company *Company `gorm:"foreignKey:CompanyID" json:"company,omitempty"`
	User    *User    `gorm:"foreignKey:UserID" json:"user,omitempty"`
}

func (CompanyUser) TableName() string {
	return "CompanyUser"
}
