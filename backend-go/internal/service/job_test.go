package service

import (
	"testing"
	"time"

	"github.com/glebarez/sqlite"
	"github.com/workorajobs/backend-go/internal/domain/models"
	"gorm.io/gorm"
)

func TestCreateJobValidationAndAuthorization(t *testing.T) {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		t.Fatalf("Failed to open sqlite memory DB: %v", err)
	}

	if err := db.AutoMigrate(&models.User{}, &models.Company{}); err != nil {
		t.Fatalf("Failed to auto migrate models: %v", err)
	}

	// Create SQLite Job table matching all columns in models.Job
	err = db.Exec(`CREATE TABLE "Job" (
		id VARCHAR(255) PRIMARY KEY,
		title VARCHAR(255) NOT NULL,
		slug VARCHAR(255),
		description TEXT NOT NULL,
		responsibilities TEXT,
		requirements TEXT,
		department TEXT,
		location VARCHAR(255),
		salary INTEGER,
		salary_min INTEGER,
		salary_max INTEGER,
		currency TEXT,
		type VARCHAR(50),
		work_mode VARCHAR(50),
		experience TEXT,
		education TEXT,
		skills_required TEXT,
		openings_count INTEGER,
		notice_period TEXT,
		benefits TEXT,
		external_apply_url TEXT,
		deadline_at DATETIME,
		scheduled_publish_at DATETIME,
		status VARCHAR(50),
		version INTEGER,
		company_id VARCHAR(255),
		posted_by_id VARCHAR(255),
		posted_at DATETIME,
		deleted_at DATETIME,
		created_at DATETIME,
		updated_at DATETIME
	)`).Error
	if err != nil {
		t.Fatalf("Failed to create SQLite Job table: %v", err)
	}

	jobSvc := NewJobService(db)

	ownerID := "owner_user_1"
	otherID := "other_user_2"
	compID := "company_100"

	db.Create(&models.User{ID: ownerID, Email: "owner@workora.com", Role: models.RoleEmployer})
	db.Create(&models.User{ID: otherID, Email: "other@workora.com", Role: models.RoleEmployer})
	db.Create(&models.Company{ID: compID, Name: "Acme Tech", OwnerID: &ownerID})

	// 1. Empty userID rejected
	_, err = jobSvc.CreateJob("", "EMPLOYER", &models.Job{CompanyID: &compID})
	if err != ErrUserIDRequired {
		t.Errorf("Expected ErrUserIDRequired, got %v", err)
	}

	// 2. Missing companyId rejected
	_, err = jobSvc.CreateJob(ownerID, "EMPLOYER", &models.Job{Title: "Engineer"})
	if err != ErrInvalidJobCompany {
		t.Errorf("Expected ErrInvalidJobCompany, got %v", err)
	}

	// 3. Unknown company rejected
	unknownCompID := "comp_unknown"
	_, err = jobSvc.CreateJob(ownerID, "EMPLOYER", &models.Job{Title: "Engineer", CompanyID: &unknownCompID})
	if err != ErrCompanyNotFound {
		t.Errorf("Expected ErrCompanyNotFound, got %v", err)
	}

	// 4. Unrelated user rejected
	_, err = jobSvc.CreateJob(otherID, "EMPLOYER", &models.Job{Title: "Engineer", CompanyID: &compID})
	if err != ErrForbiddenCompanyAccess {
		t.Errorf("Expected ErrForbiddenCompanyAccess, got %v", err)
	}

	// 5. Company owner allowed
	jobInput := &models.Job{
		Title:       "Lead Go Architect",
		Description: "Build distributed backend",
		CompanyID:   &compID,
		PostedAt:    time.Now(),
	}
	createdJob, err := jobSvc.CreateJob(ownerID, "EMPLOYER", jobInput)
	if err != nil {
		t.Fatalf("Failed for owner: %v", err)
	}
	if createdJob == nil || createdJob.Title != "Lead Go Architect" {
		t.Errorf("Unexpected created job: %+v", createdJob)
	}

	// 6. Admin allowed for any company
	adminJobInput := &models.Job{
		Title:       "Admin Created Job",
		Description: "Platform administrative job",
		CompanyID:   &compID,
		PostedAt:    time.Now(),
	}
	adminCreatedJob, err := jobSvc.CreateJob("admin_1", "ADMIN", adminJobInput)
	if err != nil {
		t.Fatalf("Failed for admin: %v", err)
	}
	if adminCreatedJob == nil || adminCreatedJob.Title != "Admin Created Job" {
		t.Errorf("Unexpected admin created job: %+v", adminCreatedJob)
	}
}
