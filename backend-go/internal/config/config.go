package config

import (
	"fmt"
	"time"

	"github.com/spf13/viper"
)

type Config struct {
	Environment string `mapstructure:"NODE_ENV"`
	Port        int    `mapstructure:"PORT"`

	// Database
	DatabaseURL          string `mapstructure:"DATABASE_URL"`
	PostgresHost         string `mapstructure:"POSTGRES_HOST"`
	PostgresPort         int    `mapstructure:"POSTGRES_PORT"`
	PostgresUser         string `mapstructure:"POSTGRES_USER"`
	PostgresPassword     string `mapstructure:"POSTGRES_PASSWORD"`
	PostgresDB           string `mapstructure:"POSTGRES_DB"`
	PostgresSchema       string `mapstructure:"POSTGRES_SCHEMA"`
	PostgresMaxConns     int    `mapstructure:"POSTGRES_CONNECTION_LIMIT"`
	PostgresIdleConns    int    `mapstructure:"POSTGRES_IDLE_LIMIT"`
	PostgresConnMaxLifetime time.Duration `mapstructure:"POSTGRES_CONN_MAX_LIFETIME"`

	// Redis
	RedisURL string `mapstructure:"REDIS_URL"`

	// JWT
	JWTSecret         string `mapstructure:"JWT_SECRET"`
	JWTAccessSecret   string `mapstructure:"JWT_ACCESS_SECRET"`
	JWTRefreshSecret  string `mapstructure:"JWT_REFRESH_SECRET"`
	JWTAccessExpiresIn string `mapstructure:"JWT_ACCESS_EXPIRES_IN"`
	JWTRefreshExpiresIn string `mapstructure:"JWT_REFRESH_EXPIRES_IN"`

	// CORS & App
	AppURL      string   `mapstructure:"NEXT_PUBLIC_APP_URL"`
	CORSOrigins []string `mapstructure:"CORS_ORIGINS"`

	// External Services
	ResendAPIKey string `mapstructure:"RESEND_API_KEY"`
	EmailFrom    string `mapstructure:"EMAIL_FROM"`
	S3Bucket     string `mapstructure:"AWS_S3_BUCKET"`
	AWSRegion    string `mapstructure:"AWS_REGION"`
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
	viper.SetDefault("POSTGRES_PASSWORD", "workora_password")
	viper.SetDefault("POSTGRES_SCHEMA", "public")
	viper.SetDefault("POSTGRES_CONNECTION_LIMIT", 25)
	viper.SetDefault("POSTGRES_IDLE_LIMIT", 5)
	viper.SetDefault("JWT_ACCESS_EXPIRES_IN", "15m")
	viper.SetDefault("JWT_REFRESH_EXPIRES_IN", "30d")

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
		cfg.DatabaseURL = fmt.Sprintf("postgres://%s:%s@%s:%d/%s?sslmode=disable&search_path=%s",
			cfg.PostgresUser,
			cfg.PostgresPassword,
			cfg.PostgresHost,
			cfg.PostgresPort,
			cfg.PostgresDB,
			cfg.PostgresSchema,
		)
	}

	return &cfg, nil
}
