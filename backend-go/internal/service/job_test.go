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

	if err := db.AutoMigrate(&models.User{}, &models.Company{}, &models.CompanyUser{}); err != nil {
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

	// 7. CompanyUser roles aligned to Prisma EmployerUserRole
	allowedCompanyRoles := []models.CompanyUserRole{
		models.CompanyUserRoleOwner,
		models.CompanyUserRoleAdmin,
		models.CompanyUserRoleHRManager,
		models.CompanyUserRoleHiringManager,
		models.CompanyUserRoleRecruiter,
	}
	for idx, companyRole := range allowedCompanyRoles {
		memberID := "allowed_company_user_" + string(companyRole)
		db.Create(&models.User{ID: memberID, Email: memberID + "@workora.com", Role: models.RoleEmployer})
		db.Create(&models.CompanyUser{
			ID:        "cu_allowed_" + string(companyRole),
			CompanyID: compID,
			UserID:    memberID,
			Role:      companyRole,
			Status:    "ACTIVE",
		})
		jobInput := &models.Job{
			Title:       "CompanyUser Allowed Job",
			Description: "Posted by authorized company member",
			CompanyID:   &compID,
			PostedAt:    time.Now().Add(time.Duration(idx) * time.Second),
		}
		if _, err := jobSvc.CreateJob(memberID, "EMPLOYER", jobInput); err != nil {
			t.Fatalf("Expected CompanyUser role %s to create job, got %v", companyRole, err)
		}
	}

	blockedCompanyUsers := []struct {
		id     string
		role   models.CompanyUserRole
		status string
	}{
		{id: "blocked_interviewer", role: models.CompanyUserRoleInterviewer, status: "ACTIVE"},
		{id: "blocked_viewer", role: models.CompanyUserRoleViewer, status: "ACTIVE"},
		{id: "blocked_suspended", role: models.CompanyUserRoleRecruiter, status: "SUSPENDED"},
		{id: "blocked_invited", role: models.CompanyUserRoleHiringManager, status: "INVITED"},
	}
	for _, tc := range blockedCompanyUsers {
		db.Create(&models.User{ID: tc.id, Email: tc.id + "@workora.com", Role: models.RoleEmployer})
		db.Create(&models.CompanyUser{
			ID:        "cu_" + tc.id,
			CompanyID: compID,
			UserID:    tc.id,
			Role:      tc.role,
			Status:    tc.status,
		})
		_, err := jobSvc.CreateJob(tc.id, "EMPLOYER", &models.Job{
			Title:       "Blocked CompanyUser Job",
			Description: "Should not be created",
			CompanyID:   &compID,
			PostedAt:    time.Now(),
		})
		if err != ErrForbiddenCompanyAccess {
			t.Errorf("Expected CompanyUser role/status %s/%s to be forbidden, got %v", tc.role, tc.status, err)
		}
	}

	candidateID := "candidate_user"
	db.Create(&models.User{ID: candidateID, Email: "candidate@workora.com", Role: models.RoleUser})
	_, err = jobSvc.CreateJob(candidateID, "CANDIDATE", &models.Job{
		Title:       "Candidate Created Job",
		Description: "Should not be created",
		CompanyID:   &compID,
		PostedAt:    time.Now(),
	})
	if err != ErrForbiddenCompanyAccess {
		t.Errorf("Expected candidate to be forbidden, got %v", err)
	}
}
