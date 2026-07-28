package service

import (
	"testing"
	"time"

	"github.com/glebarez/sqlite"
	"github.com/google/uuid"
	"github.com/workorajobs/backend-go/internal/config"
	"github.com/workorajobs/backend-go/internal/domain/models"
	"gorm.io/gorm"
)

type TestJob struct {
	ID          string    `gorm:"primaryKey;type:varchar(255)" json:"id"`
	Title       string    `gorm:"type:varchar(255);not null;index" json:"title"`
	Description string    `gorm:"type:text;not null" json:"description"`
	Status      string    `gorm:"type:varchar(50);default:'PUBLISHED';index" json:"status"`
	CompanyID   *string   `gorm:"index" json:"companyId"`
	PostedByID  *string   `gorm:"index" json:"postedById"`
	PostedAt    time.Time `json:"postedAt"`
}

func (TestJob) TableName() string {
	return "TestJob"
}

func setupTestDB(t *testing.T) *gorm.DB {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		t.Fatalf("Failed to open sqlite memory db: %v", err)
	}

	err = db.AutoMigrate(
		&models.User{},
		&models.Company{},
		&TestJob{},
		&models.UserProfile{},
		&models.RefreshToken{},
	)
	if err != nil {
		t.Fatalf("Failed to auto migrate models: %v", err)
	}

	return db
}

func TestAuthAndUserIntegration(t *testing.T) {
	db := setupTestDB(t)
	cfg := &config.Config{
		JWTAccessSecret:  "test-secret-key-at-least-32-chars-long!",
		JWTRefreshSecret: "test-refresh-secret-at-least-32-chars-long!",
	}

	svc := NewAuthService(db, cfg)

	// 1. Register User
	authResp, err := svc.Register(&RegisterDTO{
		Email:    "test@workora.com",
		Password: "SecurePassword123!",
		Name:     "Test User",
		Role:     models.RoleUser,
	})
	if err != nil {
		t.Fatalf("Registration failed: %v", err)
	}

	if authResp.User == nil || authResp.User.Email != "test@workora.com" {
		t.Errorf("Unexpected user fields: %+v", authResp.User)
	}

	// 2. Duplicate Email Rejected
	_, err = svc.Register(&RegisterDTO{
		Email:    "test@workora.com",
		Password: "Password456!",
		Name:     "Duplicate User",
		Role:     models.RoleUser,
	})
	if err == nil {
		t.Error("Expected duplicate email registration to fail")
	}

	// 3. Login Works
	tokenResp, err := svc.Login(&LoginDTO{
		Email:    "test@workora.com",
		Password: "SecurePassword123!",
	})
	if err != nil {
		t.Fatalf("Login failed: %v", err)
	}

	if tokenResp.AccessToken == "" || tokenResp.RefreshToken == "" {
		t.Error("Expected non-empty access and refresh tokens")
	}
}

func TestCompanyAndJobIntegration(t *testing.T) {
	db := setupTestDB(t)

	ownerID := "user_owner_789"
	user := models.User{
		ID:    ownerID,
		Email: "owner@company.com",
		Role:  models.RoleEmployer,
	}
	db.Create(&user)

	company := models.Company{
		ID:      "comp_789",
		Name:    "Acme Innovations",
		OwnerID: &ownerID,
	}
	if err := db.Create(&company).Error; err != nil {
		t.Fatalf("Failed to create company: %v", err)
	}

	jobID := uuid.New().String()
	testJob := TestJob{
		ID:          jobID,
		Title:       "Senior Staff Engineer",
		Description: "Build distributed Go services",
		Status:      "PUBLISHED",
		CompanyID:   &company.ID,
		PostedByID:  &ownerID,
		PostedAt:    time.Now(),
	}
	if err := db.Create(&testJob).Error; err != nil {
		t.Fatalf("Failed to create job: %v", err)
	}

	var fetchedJob TestJob
	if err := db.Where("id = ?", jobID).First(&fetchedJob).Error; err != nil {
		t.Fatalf("Failed to fetch job: %v", err)
	}

	if fetchedJob.Title != "Senior Staff Engineer" || *fetchedJob.CompanyID != "comp_789" {
		t.Errorf("Unexpected fetched job: %+v", fetchedJob)
	}
}
