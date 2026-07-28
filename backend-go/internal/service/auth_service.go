package service

import (
	"crypto/rand"
	"encoding/base64"
	"errors"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/workorajobs/backend-go/internal/auth"
	"github.com/workorajobs/backend-go/internal/config"
	"github.com/workorajobs/backend-go/internal/domain/models"
	"gorm.io/gorm"
)

type AuthService struct {
	db  *gorm.DB
	cfg *config.Config
}

func NewAuthService(db *gorm.DB, cfg *config.Config) *AuthService {
	return &AuthService{db: db, cfg: cfg}
}

type RegisterDTO struct {
	Email    string      `json:"email" binding:"required,email"`
	Password string      `json:"password" binding:"required,min=8"`
	Name     string      `json:"name" binding:"required"`
	Role     models.Role `json:"role"`
}

type LoginDTO struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type AuthResponse struct {
	User         *models.User `json:"user"`
	AccessToken  string       `json:"accessToken"`
	RefreshToken string       `json:"refreshToken"`
}

type RefreshTokenDTO struct {
	RefreshToken string `json:"refreshToken" binding:"required"`
}

type LogoutDTO struct {
	RefreshToken string `json:"refreshToken" binding:"required"`
}

type RequestEmailVerificationDTO struct {
	Email string `json:"email" binding:"required,email"`
}

type VerifyEmailDTO struct {
	Email string `json:"email" binding:"required,email"`
	Token string `json:"token" binding:"required"`
}

type RequestPasswordResetDTO struct {
	Email string `json:"email" binding:"required,email"`
}

type ResetPasswordDTO struct {
	Email       string `json:"email" binding:"required,email"`
	Token       string `json:"token" binding:"required"`
	NewPassword string `json:"newPassword" binding:"required,min=8"`
}

var (
	ErrInvalidRegistrationRole = errors.New("registration role is not allowed")
	ErrInvalidRefreshToken     = errors.New("invalid or expired refresh token")
	ErrInvalidResetToken       = errors.New("invalid or expired password reset token")
	ErrInvalidVerifyToken      = errors.New("invalid or expired email verification token")
)

func (s *AuthService) Register(dto *RegisterDTO) (*AuthResponse, error) {
	var existingUser models.User
	if err := s.db.Where("email = ?", dto.Email).First(&existingUser).Error; err == nil {
		return nil, errors.New("email already registered")
	}

	hashedPassword, err := auth.HashPassword(dto.Password)
	if err != nil {
		return nil, err
	}

	role, err := normalizeRegistrationRole(dto.Role)
	if err != nil {
		return nil, err
	}

	user := models.User{
		ID:           uuid.New().String(),
		Email:        dto.Email,
		PasswordHash: &hashedPassword,
		Name:         &dto.Name,
		Role:         role,
	}

	if err := s.db.Create(&user).Error; err != nil {
		return nil, err
	}

	// Create UserProfile
	profile := models.UserProfile{
		ID:     uuid.New().String(),
		UserID: user.ID,
	}
	s.db.Create(&profile)

	// Issue Tokens
	accessToken, err := auth.GenerateAccessToken(user.ID, user.Email, string(user.Role), s.cfg.JWTAccessSecret, 15*time.Minute)
	if err != nil {
		return nil, err
	}

	refreshToken, err := auth.GenerateAccessToken(user.ID, user.Email, string(user.Role), s.cfg.JWTRefreshSecret, 30*24*time.Hour)
	if err != nil {
		return nil, err
	}

	// Save Refresh Token
	if err := s.persistRefreshToken(user.ID, refreshToken); err != nil {
		return nil, err
	}

	return &AuthResponse{
		User:         &user,
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil
}

func (s *AuthService) Login(dto *LoginDTO) (*AuthResponse, error) {
	var user models.User
	if err := s.db.Preload("Profile").Where("email = ?", dto.Email).First(&user).Error; err != nil {
		return nil, errors.New("invalid email or password")
	}

	if user.PasswordHash == nil {
		return nil, errors.New("please log in using your OAuth provider")
	}

	match, err := auth.VerifyPassword(dto.Password, *user.PasswordHash)
	if err != nil || !match {
		return nil, errors.New("invalid email or password")
	}

	accessToken, err := auth.GenerateAccessToken(user.ID, user.Email, string(user.Role), s.cfg.JWTAccessSecret, 15*time.Minute)
	if err != nil {
		return nil, err
	}

	refreshToken, err := auth.GenerateAccessToken(user.ID, user.Email, string(user.Role), s.cfg.JWTRefreshSecret, 30*24*time.Hour)
	if err != nil {
		return nil, err
	}

	if err := s.persistRefreshToken(user.ID, refreshToken); err != nil {
		return nil, err
	}

	return &AuthResponse{
		User:         &user,
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil
}

func (s *AuthService) Refresh(dto *RefreshTokenDTO) (*AuthResponse, error) {
	claims, err := auth.ValidateToken(dto.RefreshToken, s.cfg.JWTRefreshSecret)
	if err != nil {
		return nil, ErrInvalidRefreshToken
	}

	var storedTokens []models.RefreshToken
	if err := s.db.Where("user_id = ? AND is_revoked = ? AND expires_at > ?", claims.UserID, false, time.Now()).Find(&storedTokens).Error; err != nil {
		return nil, err
	}

	matched := false
	for _, stored := range storedTokens {
		ok, err := auth.VerifyPassword(dto.RefreshToken, stored.TokenHash)
		if err == nil && ok {
			matched = true
			break
		}
	}
	if !matched {
		return nil, ErrInvalidRefreshToken
	}

	var user models.User
	if err := s.db.Where("id = ?", claims.UserID).First(&user).Error; err != nil {
		return nil, ErrInvalidRefreshToken
	}

	accessToken, err := auth.GenerateAccessToken(user.ID, user.Email, string(user.Role), s.cfg.JWTAccessSecret, 15*time.Minute)
	if err != nil {
		return nil, err
	}

	refreshToken, err := auth.GenerateAccessToken(user.ID, user.Email, string(user.Role), s.cfg.JWTRefreshSecret, 30*24*time.Hour)
	if err != nil {
		return nil, err
	}
	if err := s.persistRefreshToken(user.ID, refreshToken); err != nil {
		return nil, err
	}

	return &AuthResponse{User: &user, AccessToken: accessToken, RefreshToken: refreshToken}, nil
}

func (s *AuthService) Logout(dto *LogoutDTO) error {
	claims, err := auth.ValidateToken(dto.RefreshToken, s.cfg.JWTRefreshSecret)
	if err != nil {
		return ErrInvalidRefreshToken
	}

	var storedTokens []models.RefreshToken
	if err := s.db.Where("user_id = ? AND is_revoked = ? AND expires_at > ?", claims.UserID, false, time.Now()).Find(&storedTokens).Error; err != nil {
		return err
	}

	for _, stored := range storedTokens {
		ok, err := auth.VerifyPassword(dto.RefreshToken, stored.TokenHash)
		if err == nil && ok {
			return s.db.Model(&models.RefreshToken{}).Where("id = ?", stored.ID).Update("is_revoked", true).Error
		}
	}

	return ErrInvalidRefreshToken
}

func (s *AuthService) RequestEmailVerification(dto *RequestEmailVerificationDTO) (string, error) {
	var user models.User
	if err := s.db.Where("email = ?", strings.ToLower(strings.TrimSpace(dto.Email))).First(&user).Error; err != nil {
		return "", nil
	}
	if user.IsEmailVerified {
		return "", nil
	}

	token, tokenHash, err := newOpaqueToken()
	if err != nil {
		return "", err
	}
	if err := s.db.Create(&models.EmailVerification{
		ID:        uuid.New().String(),
		Email:     user.Email,
		TokenHash: tokenHash,
		ExpiresAt: time.Now().Add(24 * time.Hour),
	}).Error; err != nil {
		return "", err
	}
	return token, nil
}

func (s *AuthService) VerifyEmail(dto *VerifyEmailDTO) error {
	email := strings.ToLower(strings.TrimSpace(dto.Email))
	var tokens []models.EmailVerification
	if err := s.db.Where("email = ? AND is_verified = ? AND expires_at > ?", email, false, time.Now()).Find(&tokens).Error; err != nil {
		return err
	}

	var matched *models.EmailVerification
	for idx := range tokens {
		ok, err := auth.VerifyPassword(dto.Token, tokens[idx].TokenHash)
		if err == nil && ok {
			matched = &tokens[idx]
			break
		}
	}
	if matched == nil {
		return ErrInvalidVerifyToken
	}

	now := time.Now()
	return s.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Model(&models.User{}).Where("email = ?", email).Updates(map[string]interface{}{
			"is_email_verified": true,
			"email_verified_at": now,
		}).Error; err != nil {
			return err
		}
		return tx.Model(&models.EmailVerification{}).Where("id = ?", matched.ID).Update("is_verified", true).Error
	})
}

func (s *AuthService) RequestPasswordReset(dto *RequestPasswordResetDTO) (string, error) {
	email := strings.ToLower(strings.TrimSpace(dto.Email))
	var user models.User
	if err := s.db.Where("email = ?", email).First(&user).Error; err != nil {
		return "", nil
	}

	token, tokenHash, err := newOpaqueToken()
	if err != nil {
		return "", err
	}
	if err := s.db.Create(&models.PasswordReset{
		ID:        uuid.New().String(),
		Email:     email,
		TokenHash: tokenHash,
		ExpiresAt: time.Now().Add(1 * time.Hour),
	}).Error; err != nil {
		return "", err
	}
	return token, nil
}

func (s *AuthService) ResetPassword(dto *ResetPasswordDTO) error {
	email := strings.ToLower(strings.TrimSpace(dto.Email))
	var tokens []models.PasswordReset
	if err := s.db.Where("email = ? AND is_used = ? AND expires_at > ?", email, false, time.Now()).Find(&tokens).Error; err != nil {
		return err
	}

	var matched *models.PasswordReset
	for idx := range tokens {
		ok, err := auth.VerifyPassword(dto.Token, tokens[idx].TokenHash)
		if err == nil && ok {
			matched = &tokens[idx]
			break
		}
	}
	if matched == nil {
		return ErrInvalidResetToken
	}

	hashedPassword, err := auth.HashPassword(dto.NewPassword)
	if err != nil {
		return err
	}
	var user models.User
	if err := s.db.Where("email = ?", email).First(&user).Error; err != nil {
		return ErrInvalidResetToken
	}

	return s.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Model(&models.User{}).Where("email = ?", email).Update("password_hash", hashedPassword).Error; err != nil {
			return err
		}
		if err := tx.Model(&models.PasswordReset{}).Where("id = ?", matched.ID).Update("is_used", true).Error; err != nil {
			return err
		}
		return tx.Model(&models.RefreshToken{}).Where("user_id = ?", user.ID).Update("is_revoked", true).Error
	})
}

func (s *AuthService) persistRefreshToken(userID, refreshToken string) error {
	tokenHash, err := auth.HashPassword(refreshToken)
	if err != nil {
		return err
	}
	return s.db.Create(&models.RefreshToken{
		ID:        uuid.New().String(),
		UserID:    userID,
		TokenHash: tokenHash,
		ExpiresAt: time.Now().Add(30 * 24 * time.Hour),
	}).Error
}

func normalizeRegistrationRole(role models.Role) (models.Role, error) {
	if role == "" {
		return models.RoleUser, nil
	}
	switch models.Role(strings.ToUpper(string(role))) {
	case models.RoleUser, models.RoleJobSeeker, models.RoleEmployer:
		return models.Role(strings.ToUpper(string(role))), nil
	default:
		return "", ErrInvalidRegistrationRole
	}
}

func newOpaqueToken() (plain string, hash string, err error) {
	raw := make([]byte, 32)
	if _, err := rand.Read(raw); err != nil {
		return "", "", err
	}
	plain = base64.RawURLEncoding.EncodeToString(raw)
	hash, err = auth.HashPassword(plain)
	return plain, hash, err
}
