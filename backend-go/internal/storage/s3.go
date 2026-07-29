package storage

import (
	"context"
	"errors"
	"fmt"
	"path/filepath"
	"regexp"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	awsconfig "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/s3/types"
	"github.com/google/uuid"
	"github.com/workorajobs/backend-go/internal/config"
	"github.com/workorajobs/backend-go/internal/domain/models"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

var (
	ErrInvalidPurpose     = errors.New("invalid upload purpose; must be resume, company_logo, or profile_image")
	ErrInvalidMimeType    = errors.New("unsupported content type for given purpose")
	ErrFileTooLarge       = errors.New("file size exceeds maximum allowed threshold")
	ErrUnauthorizedAccess = errors.New("unauthorized: user does not own or manage this storage object")
	ErrTargetIDRequired   = errors.New("targetId is required for company_logo upload")
)

const (
	PurposeResume       = "resume"
	PurposeCompanyLogo  = "company_logo"
	PurposeProfileImage = "profile_image"

	MaxResumeSizeBytes       int64 = 10 * 1024 * 1024 // 10MB
	MaxProfileImageSizeBytes int64 = 5 * 1024 * 1024  // 5MB
	MaxCompanyLogoSizeBytes  int64 = 5 * 1024 * 1024  // 5MB
)

type S3Service struct {
	client        *s3.Client
	presignClient *s3.PresignClient
	bucket        string
	region        string
	kmsKeyID      string
	ttlSeconds    int
	logger        *zap.Logger
	db            *gorm.DB
}

type PresignUploadRequest struct {
	Purpose     string `json:"purpose" binding:"required"`
	FileName    string `json:"fileName" binding:"required"`
	ContentType string `json:"contentType" binding:"required"`
	SizeBytes   int64  `json:"sizeBytes" binding:"required"`
	TargetID    string `json:"targetId"`
}

type PresignUploadResponse struct {
	UploadURL string            `json:"uploadUrl"`
	Method    string            `json:"method"`
	Key       string            `json:"key"`
	Headers   map[string]string `json:"headers"`
	ExpiresAt time.Time         `json:"expiresAt"`
}

type DeleteObjectRequest struct {
	Key string `json:"key" binding:"required"`
}

func NewS3Service(cfg *config.Config, logger *zap.Logger, db *gorm.DB) (*S3Service, error) {
	if logger == nil {
		logger = zap.NewNop()
	}

	if err := cfg.ValidateS3Config(); err != nil {
		return nil, fmt.Errorf("invalid s3 configuration: %w", err)
	}

	ttl := cfg.AWSS3PresignTTLSeconds
	if ttl <= 0 {
		ttl = 900
	}

	opts := []func(*awsconfig.LoadOptions) error{
		awsconfig.WithRegion(cfg.AWSRegion),
	}

	if cfg.AWSAccessKeyID != "" && cfg.AWSSecretAccessKey != "" {
		opts = append(opts, awsconfig.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(
			cfg.AWSAccessKeyID, cfg.AWSSecretAccessKey, "",
		)))
	}

	awsCfg, err := awsconfig.LoadDefaultConfig(context.Background(), opts...)
	if err != nil {
		return nil, fmt.Errorf("failed to load AWS config: %w", err)
	}

	client := s3.NewFromConfig(awsCfg, func(o *s3.Options) {
		if cfg.AWSS3Endpoint != "" {
			o.BaseEndpoint = aws.String(cfg.AWSS3Endpoint)
		}
		if cfg.AWSS3ForcePathStyle {
			o.UsePathStyle = true
		}
	})

	presignClient := s3.NewPresignClient(client)

	return &S3Service{
		client:        client,
		presignClient: presignClient,
		bucket:        cfg.S3Bucket,
		region:        cfg.AWSRegion,
		kmsKeyID:      cfg.AWSS3KMSKeyID,
		ttlSeconds:    ttl,
		logger:        logger,
		db:            db,
	}, nil
}

// SanitizeFileName cleans filenames to prevent path traversal and invalid characters
func SanitizeFileName(filename string) string {
	base := filepath.Base(filename)
	base = strings.ReplaceAll(base, "\\", "/")
	if idx := strings.LastIndex(base, "/"); idx != -1 {
		base = base[idx+1:]
	}

	reg := regexp.MustCompile(`[^a-zA-Z0-9._-]`)
	safe := reg.ReplaceAllString(base, "_")
	if safe == "" || safe == "." || safe == ".." {
		safe = "unnamed_file"
	}
	return safe
}

// ValidateMimeAndSize checks MIME types and size limits per purpose
func ValidateMimeAndSize(purpose, contentType string, sizeBytes int64) error {
	contentType = strings.ToLower(strings.TrimSpace(contentType))

	switch purpose {
	case PurposeResume:
		if sizeBytes > MaxResumeSizeBytes {
			return ErrFileTooLarge
		}
		allowed := map[string]bool{
			"application/pdf":    true,
			"application/msword": true,
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document": true,
		}
		if !allowed[contentType] {
			return ErrInvalidMimeType
		}

	case PurposeProfileImage:
		if sizeBytes > MaxProfileImageSizeBytes {
			return ErrFileTooLarge
		}
		allowed := map[string]bool{
			"image/png":  true,
			"image/jpeg": true,
			"image/webp": true,
		}
		if !allowed[contentType] {
			return ErrInvalidMimeType
		}

	case PurposeCompanyLogo:
		if sizeBytes > MaxCompanyLogoSizeBytes {
			return ErrFileTooLarge
		}
		allowed := map[string]bool{
			"image/png":  true,
			"image/jpeg": true,
			"image/webp": true,
		}
		if !allowed[contentType] {
			return ErrInvalidMimeType
		}

	default:
		return ErrInvalidPurpose
	}

	return nil
}

// GenerateObjectKey formats safe scoped object keys
func GenerateObjectKey(purpose, entityID, fileName string) (string, error) {
	safeName := SanitizeFileName(fileName)
	fileUUID := uuid.New().String()

	switch purpose {
	case PurposeResume:
		return fmt.Sprintf("resumes/%s/%s-%s", entityID, fileUUID, safeName), nil
	case PurposeProfileImage:
		return fmt.Sprintf("profile-images/%s/%s-%s", entityID, fileUUID, safeName), nil
	case PurposeCompanyLogo:
		return fmt.Sprintf("company-logos/%s/%s-%s", entityID, fileUUID, safeName), nil
	default:
		return "", ErrInvalidPurpose
	}
}

// ValidateCompanyManagement checks if a user is allowed to manage a company's logo
func (s *S3Service) ValidateCompanyManagement(companyID, userID, role string) bool {
	if role == "ADMIN" {
		return true
	}

	if role != "EMPLOYER" && role != "RECRUITER" {
		return false
	}

	// Fail closed if database is unavailable
	if s.db == nil {
		return false
	}

	var count int64
	err := s.db.Model(&models.Company{}).
		Where("id = ? AND owner_id = ?", companyID, userID).
		Count(&count).Error
	if err == nil && count > 0 {
		return true
	}

	var cuCount int64
	err = s.db.Model(&models.CompanyUser{}).
		Where("company_id = ? AND user_id = ? AND status = 'ACTIVE' AND role IN ('EMPLOYER', 'RECRUITER', 'ADMIN')", companyID, userID).
		Count(&cuCount).Error
	return err == nil && cuCount > 0
}

// ValidateOwnership verifies the key prefix belongs to the active user/entity
func (s *S3Service) ValidateOwnership(key, userID, role string) bool {
	if role == "ADMIN" {
		return true
	}

	cleanKey := strings.TrimPrefix(key, "/")

	if strings.HasPrefix(cleanKey, "resumes/") {
		parts := strings.Split(cleanKey, "/")
		if len(parts) >= 2 && parts[1] == userID {
			return true
		}
	}

	if strings.HasPrefix(cleanKey, "profile-images/") {
		parts := strings.Split(cleanKey, "/")
		if len(parts) >= 2 && parts[1] == userID {
			return true
		}
	}

	if strings.HasPrefix(cleanKey, "company-logos/") {
		parts := strings.Split(cleanKey, "/")
		if len(parts) >= 2 {
			companyID := parts[1]
			return s.ValidateCompanyManagement(companyID, userID, role)
		}
	}

	return false
}

func extractKeyPrefix(key string) string {
	parts := strings.Split(key, "/")
	if len(parts) >= 2 {
		return parts[0] + "/" + parts[1] + "/*"
	}
	return "s3-object/*"
}

// GeneratePresignedUpload creates a presigned PUT URL with strict authorization
func (s *S3Service) GeneratePresignedUpload(ctx context.Context, req *PresignUploadRequest, userID, role string) (*PresignUploadResponse, error) {
	if err := ValidateMimeAndSize(req.Purpose, req.ContentType, req.SizeBytes); err != nil {
		return nil, err
	}

	entityID := userID
	if req.Purpose == PurposeCompanyLogo {
		if strings.TrimSpace(req.TargetID) == "" {
			return nil, ErrTargetIDRequired
		}
		if !s.ValidateCompanyManagement(req.TargetID, userID, role) {
			s.logger.Warn("unauthorized company logo upload attempt",
				zap.String("companyId", req.TargetID),
				zap.String("userId", userID),
				zap.String("role", role),
			)
			return nil, ErrUnauthorizedAccess
		}
		entityID = req.TargetID
	}

	key, err := GenerateObjectKey(req.Purpose, entityID, req.FileName)
	if err != nil {
		return nil, err
	}

	putInput := &s3.PutObjectInput{
		Bucket:      aws.String(s.bucket),
		Key:         aws.String(key),
		ContentType: aws.String(req.ContentType),
	}

	headers := map[string]string{
		"Content-Type": req.ContentType,
	}

	if s.kmsKeyID != "" {
		putInput.ServerSideEncryption = types.ServerSideEncryptionAwsKms
		putInput.SSEKMSKeyId = aws.String(s.kmsKeyID)
		headers["x-amz-server-side-encryption"] = "aws:kms"
	} else {
		putInput.ServerSideEncryption = types.ServerSideEncryptionAes256
		headers["x-amz-server-side-encryption"] = "AES256"
	}

	duration := time.Duration(s.ttlSeconds) * time.Second
	presignedReq, err := s.presignClient.PresignPutObject(ctx, putInput, s3.WithPresignExpires(duration))
	if err != nil {
		s.logger.Error("failed to presign put object", zap.Error(err), zap.String("keyPrefix", extractKeyPrefix(key)))
		return nil, fmt.Errorf("failed to generate presigned upload url: %w", err)
	}

	expiresAt := time.Now().Add(duration)

	s.logger.Info("generated presigned upload url",
		zap.String("purpose", req.Purpose),
		zap.String("keyPrefix", extractKeyPrefix(key)),
		zap.String("userId", userID),
	)

	return &PresignUploadResponse{
		UploadURL: presignedReq.URL,
		Method:    "PUT",
		Key:       key,
		Headers:   headers,
		ExpiresAt: expiresAt,
	}, nil
}

// GeneratePresignedDownload creates a presigned GET URL after validating ownership
func (s *S3Service) GeneratePresignedDownload(ctx context.Context, key, userID, role string) (string, error) {
	if !s.ValidateOwnership(key, userID, role) {
		s.logger.Warn("unauthorized download attempt", zap.String("keyPrefix", extractKeyPrefix(key)), zap.String("userId", userID))
		return "", ErrUnauthorizedAccess
	}

	getInput := &s3.GetObjectInput{
		Bucket: aws.String(s.bucket),
		Key:    aws.String(key),
	}

	duration := time.Duration(s.ttlSeconds) * time.Second
	presignedReq, err := s.presignClient.PresignGetObject(ctx, getInput, s3.WithPresignExpires(duration))
	if err != nil {
		s.logger.Error("failed to presign get object", zap.Error(err), zap.String("keyPrefix", extractKeyPrefix(key)))
		return "", fmt.Errorf("failed to generate presigned download url: %w", err)
	}

	s.logger.Info("generated presigned download url",
		zap.String("keyPrefix", extractKeyPrefix(key)),
		zap.String("userId", userID),
	)

	return presignedReq.URL, nil
}

// DeleteObject removes an object from S3 after validating ownership
func (s *S3Service) DeleteObject(ctx context.Context, key, userID, role string) error {
	if !s.ValidateOwnership(key, userID, role) {
		s.logger.Warn("unauthorized delete attempt", zap.String("keyPrefix", extractKeyPrefix(key)), zap.String("userId", userID))
		return ErrUnauthorizedAccess
	}

	deleteInput := &s3.DeleteObjectInput{
		Bucket: aws.String(s.bucket),
		Key:    aws.String(key),
	}

	_, err := s.client.DeleteObject(ctx, deleteInput)
	if err != nil {
		s.logger.Error("failed to delete s3 object", zap.Error(err), zap.String("keyPrefix", extractKeyPrefix(key)))
		return fmt.Errorf("failed to delete object: %w", err)
	}

	s.logger.Info("deleted s3 object",
		zap.String("keyPrefix", extractKeyPrefix(key)),
		zap.String("userId", userID),
	)

	return nil
}
