package models

import (
	"time"

	"gorm.io/gorm"
)

type Role string

const (
	RoleUser       Role = "USER"
	RoleJobSeeker  Role = "JOB_SEEKER"
	RoleEmployer   Role = "EMPLOYER"
	RoleRecruiter  Role = "RECRUITER"
	RoleEditor     Role = "EDITOR"
	RoleSeoManager Role = "SEO_MANAGER"
	RoleAdmin      Role = "ADMIN"
)

type User struct {
	ID              string         `gorm:"primaryKey;type:varchar(255)" json:"id"`
	Email           string         `gorm:"uniqueIndex;type:varchar(255);not null" json:"email"`
	PasswordHash    *string        `gorm:"type:varchar(255)" json:"-"`
	Name            *string        `gorm:"type:varchar(255)" json:"name"`
	Role            Role           `gorm:"type:varchar(50);default:'USER'" json:"role"`
	IsEmailVerified bool           `gorm:"default:false" json:"isEmailVerified"`
	EmailVerifiedAt *time.Time     `json:"emailVerifiedAt"`
	DeletedAt       gorm.DeletedAt `gorm:"index" json:"-"`
	CreatedAt       time.Time      `json:"createdAt"`
	UpdatedAt       time.Time      `json:"updatedAt"`

	// Relationships
	Profile         *UserProfile     `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE" json:"profile,omitempty"`
	EmployerProfile *EmployerProfile `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE" json:"employerProfile,omitempty"`
	RefreshTokens   []RefreshToken   `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE" json:"-"`
	UserSessions    []UserSession    `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE" json:"-"`
	OAuthAccounts   []OAuthAccount   `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE" json:"oauthAccounts,omitempty"`
}

func (User) TableName() string {
	return "User"
}

type UserProfile struct {
	ID                 string     `gorm:"primaryKey;type:varchar(255)" json:"id"`
	UserID             string     `gorm:"uniqueIndex;type:varchar(255);not null" json:"userId"`
	Phone              *string    `json:"phone"`
	PhotoURL           *string    `json:"photoUrl"`
	DateOfBirth        *time.Time `json:"dateOfBirth"`
	Gender             *string    `json:"gender"`
	Location           *string    `json:"location"`
	Headline           *string    `json:"headline"`
	Summary            *string    `json:"summary"`
	Skills             []string   `gorm:"type:text[]" json:"skills"`
	ResumeURL          *string    `json:"resumeUrl"`
	PreferredJobTitles []string   `gorm:"type:text[]" json:"preferredJobTitles"`
	SalaryExpectation  *int       `json:"salaryExpectation"`
	RemotePreference   string     `gorm:"default:'Remote'" json:"remotePreference"`
	WorkMode           string     `gorm:"default:'Remote'" json:"workMode"`
	JobType            string     `gorm:"default:'Full-time'" json:"jobType"`
	NoticePeriod       string     `gorm:"default:'Immediate'" json:"noticePeriod"`
	WillRelocate       bool       `gorm:"default:false" json:"willRelocate"`
	PreferredLocations []string   `gorm:"type:text[]" json:"preferredLocations"`
	ProfileVisibility  string     `gorm:"default:'PUBLIC'" json:"profileVisibility"`
	ResumeVisibility   string     `gorm:"default:'PUBLIC'" json:"resumeVisibility"`
	ContactVisibility  string     `gorm:"default:'RECRUITERS_ONLY'" json:"contactVisibility"`
	CreatedAt          time.Time  `json:"createdAt"`
	UpdatedAt          time.Time  `json:"updatedAt"`
}

func (UserProfile) TableName() string {
	return "UserProfile"
}

type EmployerProfile struct {
	ID              string    `gorm:"primaryKey;type:varchar(255)" json:"id"`
	UserID          string    `gorm:"uniqueIndex;type:varchar(255);not null" json:"userId"`
	CompanyName     string    `gorm:"type:varchar(255);not null;index" json:"companyName"`
	BusinessEmail   *string   `json:"businessEmail"`
	Phone           *string   `json:"phone"`
	IsPhoneVerified bool      `gorm:"default:false" json:"isPhoneVerified"`
	Designation     *string   `gorm:"default:'Hiring Manager'" json:"designation"`
	Website         *string   `json:"website"`
	LogoURL         *string   `json:"logoUrl"`
	Industry        *string   `json:"industry"`
	CompanySize     *string   `gorm:"default:'11-50 employees'" json:"companySize"`
	Description     *string   `json:"description"`
	CompanyID       *string   `gorm:"index" json:"companyId"`
	CreatedAt       time.Time `json:"createdAt"`
	UpdatedAt       time.Time `json:"updatedAt"`
}

func (EmployerProfile) TableName() string {
	return "EmployerProfile"
}

type RefreshToken struct {
	ID        string    `gorm:"primaryKey;type:varchar(255)" json:"id"`
	UserID    string    `gorm:"type:varchar(255);not null;index" json:"userId"`
	TokenHash string    `gorm:"uniqueIndex;type:varchar(255);not null" json:"tokenHash"`
	IsRevoked bool      `gorm:"default:false" json:"isRevoked"`
	ExpiresAt time.Time `gorm:"not null" json:"expiresAt"`
	CreatedAt time.Time `json:"createdAt"`
}

func (RefreshToken) TableName() string {
	return "RefreshToken"
}

type PasswordReset struct {
	ID        string    `gorm:"primaryKey;type:varchar(255)" json:"id"`
	Email     string    `gorm:"type:varchar(255);not null;index" json:"email"`
	TokenHash string    `gorm:"uniqueIndex;type:varchar(255);not null" json:"-"`
	IsUsed    bool      `gorm:"default:false" json:"isUsed"`
	ExpiresAt time.Time `gorm:"not null" json:"expiresAt"`
	CreatedAt time.Time `json:"createdAt"`
}

func (PasswordReset) TableName() string {
	return "PasswordReset"
}

type EmailVerification struct {
	ID         string    `gorm:"primaryKey;type:varchar(255)" json:"id"`
	Email      string    `gorm:"type:varchar(255);not null;index" json:"email"`
	TokenHash  string    `gorm:"uniqueIndex;type:varchar(255);not null" json:"-"`
	IsVerified bool      `gorm:"default:false" json:"isVerified"`
	ExpiresAt  time.Time `gorm:"not null" json:"expiresAt"`
	CreatedAt  time.Time `json:"createdAt"`
}

func (EmailVerification) TableName() string {
	return "EmailVerification"
}

type UserSession struct {
	ID           string    `gorm:"primaryKey;type:varchar(255)" json:"id"`
	UserID       string    `gorm:"type:varchar(255);not null;index" json:"userId"`
	SessionToken string    `gorm:"uniqueIndex;type:varchar(255);not null" json:"sessionToken"`
	IPAddress    *string   `json:"ipAddress"`
	UserAgent    *string   `json:"userAgent"`
	DeviceType   *string   `gorm:"default:'Desktop'" json:"deviceType"`
	Browser      *string   `json:"browser"`
	OS           *string   `json:"os"`
	Location     *string   `json:"location"`
	IsRevoked    bool      `gorm:"default:false" json:"isRevoked"`
	ExpiresAt    time.Time `json:"expiresAt"`
	LastActiveAt time.Time `gorm:"default:now()" json:"lastActiveAt"`
	CreatedAt    time.Time `json:"createdAt"`
}

func (UserSession) TableName() string {
	return "UserSession"
}

type OAuthAccount struct {
	ID                string     `gorm:"primaryKey;type:varchar(255)" json:"id"`
	UserID            string     `gorm:"type:varchar(255);not null;index" json:"userId"`
	Provider          string     `gorm:"type:varchar(50);not null;uniqueIndex:idx_oauth_provider_account" json:"provider"`
	ProviderAccountID string     `gorm:"type:varchar(255);not null;uniqueIndex:idx_oauth_provider_account" json:"providerAccountId"`
	AccessToken       *string    `gorm:"type:text" json:"-"`
	RefreshToken      *string    `gorm:"type:text" json:"-"`
	ExpiresAt         *time.Time `json:"expiresAt"`
	Scope             *string    `json:"scope"`
	CreatedAt         time.Time  `json:"createdAt"`
	UpdatedAt         time.Time  `json:"updatedAt"`
}

func (OAuthAccount) TableName() string {
	return "OAuthAccount"
}
