package service

import (
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

var (
	ErrInvalidRegistrationRole = errors.New("registration role is not allowed")
	ErrInvalidRefreshToken     = errors.New("invalid or expired refresh token")
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
