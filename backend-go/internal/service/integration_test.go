package service

import (
	"context"
	"testing"
	"time"

	"github.com/glebarez/sqlite"
	"github.com/google/uuid"
	"github.com/workorajobs/backend-go/internal/config"
	"github.com/workorajobs/backend-go/internal/domain/models"
	"gorm.io/gorm"
)

type fakeEmailSender struct {
	verificationTo    string
	verificationToken string
	resetTo           string
	resetToken        string
}

func (f *fakeEmailSender) SendEmailVerification(_ context.Context, to, token string) error {
	f.verificationTo = to
	f.verificationToken = token
	return nil
}

func (f *fakeEmailSender) SendPasswordReset(_ context.Context, to, token string) error {
	f.resetTo = to
	f.resetToken = token
	return nil
}

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
		&models.EmailVerification{},
		&models.PasswordReset{},
		&models.OAuthAccount{},
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

	sender := &fakeEmailSender{}
	svc := NewAuthServiceWithEmailSender(db, cfg, sender)

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

	var refreshCount int64
	if err := db.Model(&models.RefreshToken{}).Where("user_id = ? AND is_revoked = ?", tokenResp.User.ID, false).Count(&refreshCount).Error; err != nil {
		t.Fatalf("Failed to count refresh tokens: %v", err)
	}
	if refreshCount < 2 {
		t.Errorf("Expected register and login to persist refresh tokens, got %d", refreshCount)
	}

	// 4. Refresh rotates tokens
	refreshed, err := svc.Refresh(&RefreshTokenDTO{RefreshToken: tokenResp.RefreshToken})
	if err != nil {
		t.Fatalf("Refresh failed: %v", err)
	}
	if refreshed.AccessToken == "" || refreshed.RefreshToken == "" || refreshed.RefreshToken == tokenResp.RefreshToken {
		t.Error("Expected refresh to return new access and refresh tokens")
	}

	// 5. Logout revokes refresh token
	if err := svc.Logout(&LogoutDTO{RefreshToken: refreshed.RefreshToken}); err != nil {
		t.Fatalf("Logout failed: %v", err)
	}
	if _, err := svc.Refresh(&RefreshTokenDTO{RefreshToken: refreshed.RefreshToken}); err != ErrInvalidRefreshToken {
		t.Errorf("Expected revoked refresh token to fail, got %v", err)
	}
}

func TestRegistrationRejectsPrivilegedRoles(t *testing.T) {
	db := setupTestDB(t)
	cfg := &config.Config{
		JWTAccessSecret:  "test-secret-key-at-least-32-chars-long!",
		JWTRefreshSecret: "test-refresh-secret-at-least-32-chars-long!",
	}

	svc := NewAuthService(db, cfg)
	for _, role := range []models.Role{models.RoleAdmin, models.RoleRecruiter, models.RoleEditor, models.RoleSeoManager} {
		_, err := svc.Register(&RegisterDTO{
			Email:    "blocked-" + string(role) + "@workora.com",
			Password: "SecurePassword123!",
			Name:     "Blocked User",
			Role:     role,
		})
		if err != ErrInvalidRegistrationRole {
			t.Errorf("Expected role %s to be blocked, got %v", role, err)
		}
	}
}

func TestEmailVerificationLifecycle(t *testing.T) {
	db := setupTestDB(t)
	cfg := &config.Config{
		JWTAccessSecret:  "test-secret-key-at-least-32-chars-long!",
		JWTRefreshSecret: "test-refresh-secret-at-least-32-chars-long!",
	}
	sender := &fakeEmailSender{}
	svc := NewAuthServiceWithEmailSender(db, cfg, sender)

	authResp, err := svc.Register(&RegisterDTO{
		Email:    "verify@workora.com",
		Password: "SecurePassword123!",
		Name:     "Verify User",
		Role:     models.RoleUser,
	})
	if err != nil {
		t.Fatalf("Registration failed: %v", err)
	}

	token, err := svc.RequestEmailVerification(&RequestEmailVerificationDTO{Email: authResp.User.Email})
	if err != nil {
		t.Fatalf("RequestEmailVerification failed: %v", err)
	}
	if token == "" {
		t.Fatal("Expected verification token for unverified user")
	}
	if sender.verificationTo != authResp.User.Email || sender.verificationToken != token {
		t.Fatalf("Expected verification token to be sent by email sender")
	}

	if err := svc.VerifyEmail(&VerifyEmailDTO{Email: authResp.User.Email, Token: token}); err != nil {
		t.Fatalf("VerifyEmail failed: %v", err)
	}

	var user models.User
	if err := db.Where("email = ?", authResp.User.Email).First(&user).Error; err != nil {
		t.Fatalf("Failed to load verified user: %v", err)
	}
	if !user.IsEmailVerified || user.EmailVerifiedAt == nil {
		t.Fatal("Expected user to be email verified")
	}
	if err := svc.VerifyEmail(&VerifyEmailDTO{Email: authResp.User.Email, Token: token}); err != ErrInvalidVerifyToken {
		t.Errorf("Expected reused verification token to fail, got %v", err)
	}
}

func TestPasswordResetLifecycle(t *testing.T) {
	db := setupTestDB(t)
	cfg := &config.Config{
		JWTAccessSecret:  "test-secret-key-at-least-32-chars-long!",
		JWTRefreshSecret: "test-refresh-secret-at-least-32-chars-long!",
	}
	sender := &fakeEmailSender{}
	svc := NewAuthServiceWithEmailSender(db, cfg, sender)

	_, err := svc.Register(&RegisterDTO{
		Email:    "reset@workora.com",
		Password: "OldPassword123!",
		Name:     "Reset User",
		Role:     models.RoleUser,
	})
	if err != nil {
		t.Fatalf("Registration failed: %v", err)
	}
	loginResp, err := svc.Login(&LoginDTO{Email: "reset@workora.com", Password: "OldPassword123!"})
	if err != nil {
		t.Fatalf("Login before reset failed: %v", err)
	}

	token, err := svc.RequestPasswordReset(&RequestPasswordResetDTO{Email: "reset@workora.com"})
	if err != nil {
		t.Fatalf("RequestPasswordReset failed: %v", err)
	}
	if token == "" {
		t.Fatal("Expected password reset token")
	}
	if sender.resetTo != "reset@workora.com" || sender.resetToken != token {
		t.Fatalf("Expected password reset token to be sent by email sender")
	}

	if err := svc.ResetPassword(&ResetPasswordDTO{Email: "reset@workora.com", Token: token, NewPassword: "NewPassword123!"}); err != nil {
		t.Fatalf("ResetPassword failed: %v", err)
	}
	if _, err := svc.Login(&LoginDTO{Email: "reset@workora.com", Password: "OldPassword123!"}); err == nil {
		t.Fatal("Expected old password to fail after reset")
	}
	if _, err := svc.Login(&LoginDTO{Email: "reset@workora.com", Password: "NewPassword123!"}); err != nil {
		t.Fatalf("Expected new password to work: %v", err)
	}
	if _, err := svc.Refresh(&RefreshTokenDTO{RefreshToken: loginResp.RefreshToken}); err != ErrInvalidRefreshToken {
		t.Errorf("Expected pre-reset refresh token to be revoked, got %v", err)
	}
	if err := svc.ResetPassword(&ResetPasswordDTO{Email: "reset@workora.com", Token: token, NewPassword: "AnotherPassword123!"}); err != ErrInvalidResetToken {
		t.Errorf("Expected reused reset token to fail, got %v", err)
	}
}

func TestOAuthCreatesVerifiedUserAndLinksAccount(t *testing.T) {
	db := setupTestDB(t)
	cfg := &config.Config{
		JWTAccessSecret:  "test-secret-key-at-least-32-chars-long!",
		JWTRefreshSecret: "test-refresh-secret-at-least-32-chars-long!",
	}
	svc := NewAuthService(db, cfg)

	authResp, err := svc.AuthenticateOAuth(&OAuthProfile{
		Provider:          "google",
		ProviderAccountID: "google-sub-123",
		Email:             "oauth.user@workora.com",
		Name:              "OAuth User",
		Picture:           "https://example.com/avatar.png",
	})
	if err != nil {
		t.Fatalf("AuthenticateOAuth failed: %v", err)
	}
	if authResp.User.Email != "oauth.user@workora.com" || authResp.User.Role != models.RoleJobSeeker {
		t.Fatalf("Unexpected OAuth user: %+v", authResp.User)
	}
	if !authResp.User.IsEmailVerified {
		t.Fatal("Expected OAuth user email to be verified")
	}
	if authResp.AccessToken == "" || authResp.RefreshToken == "" {
		t.Fatal("Expected OAuth auth response tokens")
	}

	var account models.OAuthAccount
	if err := db.Where("provider = ? AND provider_account_id = ?", "google", "google-sub-123").First(&account).Error; err != nil {
		t.Fatalf("Expected OAuth account link: %v", err)
	}
	if account.UserID != authResp.User.ID {
		t.Fatalf("Expected OAuth account to link created user")
	}
	if account.AccessToken != nil || account.RefreshToken != nil {
		t.Fatal("Provider access tokens must not be persisted")
	}
}

func TestOAuthLinksExistingUserByEmail(t *testing.T) {
	db := setupTestDB(t)
	cfg := &config.Config{
		JWTAccessSecret:  "test-secret-key-at-least-32-chars-long!",
		JWTRefreshSecret: "test-refresh-secret-at-least-32-chars-long!",
	}
	svc := NewAuthService(db, cfg)

	registered, err := svc.Register(&RegisterDTO{
		Email:    "existing.oauth@workora.com",
		Password: "SecurePassword123!",
		Name:     "Existing User",
		Role:     models.RoleUser,
	})
	if err != nil {
		t.Fatalf("Registration failed: %v", err)
	}

	oauthResp, err := svc.AuthenticateOAuth(&OAuthProfile{
		Provider:          "linkedin",
		ProviderAccountID: "linkedin-sub-456",
		Email:             "existing.oauth@workora.com",
		Name:              "Existing OAuth User",
	})
	if err != nil {
		t.Fatalf("AuthenticateOAuth failed: %v", err)
	}
	if oauthResp.User.ID != registered.User.ID {
		t.Fatal("Expected OAuth to link the existing email user")
	}
	if !oauthResp.User.IsEmailVerified {
		t.Fatal("Expected linked OAuth user to become email verified")
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
