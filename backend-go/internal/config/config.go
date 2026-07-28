package config

import (
	"fmt"
	"strings"
	"time"

	"github.com/spf13/viper"
)

type Config struct {
	Environment string `mapstructure:"NODE_ENV"`
	Port        int    `mapstructure:"PORT"`

	// Database
	DatabaseURL             string        `mapstructure:"DATABASE_URL"`
	PostgresHost            string        `mapstructure:"POSTGRES_HOST"`
	PostgresPort            int           `mapstructure:"POSTGRES_PORT"`
	PostgresUser            string        `mapstructure:"POSTGRES_USER"`
	PostgresPassword        string        `mapstructure:"POSTGRES_PASSWORD"`
	PostgresDB              string        `mapstructure:"POSTGRES_DB"`
	PostgresSchema          string        `mapstructure:"POSTGRES_SCHEMA"`
	PostgresMaxConns        int           `mapstructure:"POSTGRES_CONNECTION_LIMIT"`
	PostgresIdleConns       int           `mapstructure:"POSTGRES_IDLE_LIMIT"`
	PostgresConnMaxLifetime time.Duration `mapstructure:"POSTGRES_CONN_MAX_LIFETIME"`

	// Redis
	RedisURL string `mapstructure:"REDIS_URL"`

	// JWT
	JWTSecret           string `mapstructure:"JWT_SECRET"`
	JWTAccessSecret     string `mapstructure:"JWT_ACCESS_SECRET"`
	JWTRefreshSecret    string `mapstructure:"JWT_REFRESH_SECRET"`
	JWTAccessExpiresIn  string `mapstructure:"JWT_ACCESS_EXPIRES_IN"`
	JWTRefreshExpiresIn string `mapstructure:"JWT_REFRESH_EXPIRES_IN"`

	// CORS & App
	AppURL      string   `mapstructure:"NEXT_PUBLIC_APP_URL"`
	CORSOrigins []string `mapstructure:"CORS_ORIGINS"`

	// External Services
	ResendAPIKey           string `mapstructure:"RESEND_API_KEY"`
	EmailFrom              string `mapstructure:"EMAIL_FROM"`
	S3Bucket               string `mapstructure:"AWS_S3_BUCKET"`
	AWSRegion              string `mapstructure:"AWS_REGION"`
	AWSAccessKeyID         string `mapstructure:"AWS_ACCESS_KEY_ID"`
	AWSSecretAccessKey     string `mapstructure:"AWS_SECRET_ACCESS_KEY"`
	AWSS3Endpoint          string `mapstructure:"AWS_S3_ENDPOINT"`
	AWSS3ForcePathStyle    bool   `mapstructure:"AWS_S3_FORCE_PATH_STYLE"`
	AWSS3KMSKeyID          string `mapstructure:"AWS_S3_KMS_KEY_ID"`
	AWSS3PresignTTLSeconds int    `mapstructure:"AWS_S3_PRESIGN_TTL_SECONDS"`
	EnableS3Uploads        bool   `mapstructure:"ENABLE_S3_UPLOADS"`

	// Operations
	MetricsBearerToken string `mapstructure:"METRICS_BEARER_TOKEN"`
	EnableAutoMigrate  bool   `mapstructure:"ENABLE_AUTO_MIGRATE"`
	RateLimitBackend   string `mapstructure:"RATE_LIMIT_BACKEND"`
}

func (c *Config) ValidateS3Config() error {
	if c.Environment == "production" {
		if c.AWSRegion == "" {
			return fmt.Errorf("AWS_REGION is required in production environment")
		}
		if c.S3Bucket == "" {
			return fmt.Errorf("AWS_S3_BUCKET is required in production environment")
		}
	}
	return nil
}

func LoadConfig(path string) (*Config, error) {
	viper.AddConfigPath(path)
	viper.SetConfigName(".env")
	viper.SetConfigType("env")

	viper.SetDefault("NODE_ENV", "development")
	viper.SetDefault("PORT", 8080)
	viper.SetDefault("POSTGRES_HOST", "localhost")
	viper.SetDefault("POSTGRES_PORT", 5432)
	viper.SetDefault("POSTGRES_DB", "workora_jobs")
	viper.SetDefault("POSTGRES_USER", "workora")
	viper.SetDefault("POSTGRES_SCHEMA", "public")
	viper.SetDefault("POSTGRES_CONNECTION_LIMIT", 25)
	viper.SetDefault("POSTGRES_IDLE_LIMIT", 5)
	viper.SetDefault("JWT_ACCESS_EXPIRES_IN", "15m")
	viper.SetDefault("JWT_REFRESH_EXPIRES_IN", "30d")
	viper.SetDefault("ENABLE_AUTO_MIGRATE", false)
	viper.SetDefault("AWS_S3_PRESIGN_TTL_SECONDS", 900)
	viper.SetDefault("ENABLE_S3_UPLOADS", false)
	viper.SetDefault("RATE_LIMIT_BACKEND", "memory")

	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); !ok {
			return nil, fmt.Errorf("error reading config file: %w", err)
		}
	}

	var cfg Config
	if err := viper.Unmarshal(&cfg); err != nil {
		return nil, fmt.Errorf("unable to decode config into struct: %w", err)
	}

	// Format DSN if DATABASE_URL is not set directly
	if cfg.DatabaseURL == "" {
		if cfg.Environment == "production" {
			return nil, fmt.Errorf("DATABASE_URL is required in production")
		}
		cfg.DatabaseURL = fmt.Sprintf("postgres://%s:%s@%s:%d/%s?sslmode=disable&search_path=%s",
			cfg.PostgresUser,
			cfg.PostgresPassword,
			cfg.PostgresHost,
			cfg.PostgresPort,
			cfg.PostgresDB,
			cfg.PostgresSchema,
		)
	}

	if cfg.Environment == "production" {
		if strings.TrimSpace(cfg.JWTAccessSecret) == "" || strings.TrimSpace(cfg.JWTRefreshSecret) == "" {
			return nil, fmt.Errorf("JWT_ACCESS_SECRET and JWT_REFRESH_SECRET are required in production")
		}
		if len(cfg.JWTAccessSecret) < 32 || len(cfg.JWTRefreshSecret) < 32 {
			return nil, fmt.Errorf("JWT secrets must be at least 32 characters in production")
		}
		if strings.Contains(cfg.DatabaseURL, "sslmode=disable") {
			return nil, fmt.Errorf("production DATABASE_URL must not use sslmode=disable")
		}
	}

	return &cfg, nil
}
