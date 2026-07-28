package storage

import (
	"testing"

	"github.com/glebarez/sqlite"
	"github.com/workorajobs/backend-go/internal/domain/models"
	"gorm.io/gorm"
)

func TestSanitizeFileName(t *testing.T) {
	tests := []struct {
		input    string
		expected string
	}{
		{"resume.pdf", "resume.pdf"},
		{"../../../etc/passwd", "passwd"},
		{"My Resume (2026) Final!.pdf", "My_Resume__2026__Final_.pdf"},
		{"..", "unnamed_file"},
		{"C:\\Users\\Admin\\Desktop\\photo.png", "photo.png"},
	}

	for _, tt := range tests {
		got := SanitizeFileName(tt.input)
		if got != tt.expected {
			t.Errorf("SanitizeFileName(%q) = %q; want %q", tt.input, got, tt.expected)
		}
	}
}

func TestValidateMimeAndSize(t *testing.T) {
	// Valid tests
	if err := ValidateMimeAndSize(PurposeResume, "application/pdf", 5*1024*1024); err != nil {
		t.Errorf("Expected valid resume, got error: %v", err)
	}

	if err := ValidateMimeAndSize(PurposeProfileImage, "image/png", 2*1024*1024); err != nil {
		t.Errorf("Expected valid profile image, got error: %v", err)
	}

	if err := ValidateMimeAndSize(PurposeCompanyLogo, "image/webp", 3*1024*1024); err != nil {
		t.Errorf("Expected valid company logo, got error: %v", err)
	}

	// Invalid MIME type
	if err := ValidateMimeAndSize(PurposeResume, "image/png", 1024); err != ErrInvalidMimeType {
		t.Errorf("Expected ErrInvalidMimeType, got %v", err)
	}

	if err := ValidateMimeAndSize(PurposeProfileImage, "application/json", 1024); err != ErrInvalidMimeType {
		t.Errorf("Expected ErrInvalidMimeType, got %v", err)
	}

	// Exceeded file size
	if err := ValidateMimeAndSize(PurposeResume, "application/pdf", 15*1024*1024); err != ErrFileTooLarge {
		t.Errorf("Expected ErrFileTooLarge, got %v", err)
	}

	if err := ValidateMimeAndSize(PurposeProfileImage, "image/jpeg", 6*1024*1024); err != ErrFileTooLarge {
		t.Errorf("Expected ErrFileTooLarge, got %v", err)
	}

	// Invalid purpose
	if err := ValidateMimeAndSize("invalid_purpose", "application/pdf", 1024); err != ErrInvalidPurpose {
		t.Errorf("Expected ErrInvalidPurpose, got %v", err)
	}
}

func TestGenerateObjectKey(t *testing.T) {
	key, err := GenerateObjectKey(PurposeResume, "user_123", "my_resume.pdf")
	if err != nil {
		t.Fatalf("Unexpected error: %v", err)
	}

	if len(key) == 0 {
		t.Error("Expected non-empty key")
	}

	if !t_hasPrefix(key, "resumes/user_123/") {
		t.Errorf("Expected prefix 'resumes/user_123/', got key %q", key)
	}

	logoKey, err := GenerateObjectKey(PurposeCompanyLogo, "comp_999", "logo.png")
	if err != nil {
		t.Fatalf("Unexpected error: %v", err)
	}
	if !t_hasPrefix(logoKey, "company-logos/comp_999/") {
		t.Errorf("Expected prefix 'company-logos/comp_999/', got key %q", logoKey)
	}
}

func TestValidateOwnership(t *testing.T) {
	svc := &S3Service{}
	userID := "user_123"

	userResumeKey := "resumes/user_123/uuid-resume.pdf"
	otherResumeKey := "resumes/user_456/uuid-resume.pdf"

	// Owner allowed
	if !svc.ValidateOwnership(userResumeKey, userID, "CANDIDATE") {
		t.Error("Expected candidate to own their resume key")
	}

	// Non-owner candidate rejected
	if svc.ValidateOwnership(otherResumeKey, userID, "CANDIDATE") {
		t.Error("Expected candidate to be rejected for another user's key")
	}

	// Admin allowed for any key
	if !svc.ValidateOwnership(otherResumeKey, userID, "ADMIN") {
		t.Error("Expected admin to be allowed for any key")
	}

	// Without DB, non-ADMIN fail-closed for company logo
	logoKey := "company-logos/comp_999/uuid-logo.png"
	if svc.ValidateOwnership(logoKey, userID, "EMPLOYER") {
		t.Error("Expected employer without DB to be rejected (fail closed)")
	}

	// Candidate rejected for other user's profile image
	otherProfileKey := "profile-images/user_456/uuid-pic.jpg"
	if svc.ValidateOwnership(otherProfileKey, userID, "CANDIDATE") {
		t.Error("Expected candidate to be rejected for other user's profile image")
	}
}

func TestDBBackedCompanyLogoAuthorization(t *testing.T) {
	db, err := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
	if err != nil {
		t.Fatalf("Failed to open sqlite memory DB: %v", err)
	}

	if err := db.AutoMigrate(&models.Company{}, &models.CompanyUser{}); err != nil {
		t.Fatalf("Failed to migrate company models: %v", err)
	}

	ownerID := "user_owner_100"
	cuUserID := "user_cu_member"
	comp := models.Company{
		ID:      "comp_100",
		Name:    "Acme Corp",
		OwnerID: &ownerID,
	}
	if err := db.Create(&comp).Error; err != nil {
		t.Fatalf("Failed to create test company: %v", err)
	}

	db.Create(&models.CompanyUser{
		ID:        "cu_1",
		CompanyID: "comp_100",
		UserID:    cuUserID,
		Role:      models.CompanyUserRoleRecruiter,
		Status:    "ACTIVE",
	})

	svcWithDB := &S3Service{db: db}
	svcNilDB := &S3Service{db: nil}

	// 1. ADMIN can manage company logo with or without DB
	if !svcWithDB.ValidateCompanyManagement("comp_100", "user_any", "ADMIN") {
		t.Error("ADMIN should be allowed with DB")
	}
	if !svcNilDB.ValidateCompanyManagement("comp_100", "user_any", "ADMIN") {
		t.Error("ADMIN should be allowed without DB")
	}

	// 2. EMPLOYER who owns Company.OwnerID is allowed
	if !svcWithDB.ValidateCompanyManagement("comp_100", ownerID, "EMPLOYER") {
		t.Error("EMPLOYER owner should be allowed for their company")
	}

	// 3. EMPLOYER with active CompanyUser membership is allowed
	if !svcWithDB.ValidateCompanyManagement("comp_100", cuUserID, "EMPLOYER") {
		t.Error("EMPLOYER CompanyUser member should be allowed for their company")
	}

	// 4. EMPLOYER/RECRUITER not associated is rejected
	if svcWithDB.ValidateCompanyManagement("comp_100", "user_other", "EMPLOYER") {
		t.Error("Unassociated EMPLOYER should be rejected")
	}
	if svcWithDB.ValidateCompanyManagement("comp_100", "user_other", "RECRUITER") {
		t.Error("Unassociated RECRUITER should be rejected")
	}

	// 4. CANDIDATE is rejected
	if svcWithDB.ValidateCompanyManagement("comp_100", ownerID, "CANDIDATE") {
		t.Error("CANDIDATE role should be rejected")
	}

	// 5. Unknown company is rejected
	if svcWithDB.ValidateCompanyManagement("comp_unknown", ownerID, "EMPLOYER") {
		t.Error("Unknown company ID should be rejected")
	}

	// 6. Nil DB fails closed for EMPLOYER/RECRUITER
	if svcNilDB.ValidateCompanyManagement("comp_100", ownerID, "EMPLOYER") {
		t.Error("Nil DB must fail closed for EMPLOYER")
	}
}

func t_hasPrefix(s, prefix string) bool {
	return len(s) >= len(prefix) && s[:len(prefix)] == prefix
}
