package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/workorajobs/backend-go/internal/api/routes"
	"github.com/workorajobs/backend-go/internal/config"
	"github.com/workorajobs/backend-go/internal/domain/models"
	"github.com/workorajobs/backend-go/pkg/logger"
	"go.uber.org/zap"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	gormlogger "gorm.io/gorm/logger"
)

func main() {
	cfg, err := config.LoadConfig(".")
	if err != nil {
		fmt.Printf("Failed to load configuration: %v\n", err)
		os.Exit(1)
	}

	logger.InitLogger(cfg.Environment)
	defer logger.Sync()

	logger.Log.Info("Starting WorkoraJobs Enterprise Backend in Go",
		zap.String("environment", cfg.Environment),
		zap.Int("port", cfg.Port),
	)

	// Connect PostgreSQL
	gormLogMode := gormlogger.Warn
	if cfg.Environment == "development" {
		gormLogMode = gormlogger.Info
	}

	db, err := gorm.Open(postgres.Open(cfg.DatabaseURL), &gorm.Config{
		Logger: gormlogger.Default.LogMode(gormLogMode),
	})
	if err != nil {
		logger.Log.Fatal("Failed to connect to PostgreSQL database", zap.Error(err))
	}

	sqlDB, err := db.DB()
	if err != nil {
		logger.Log.Fatal("Failed to get DB instance", zap.Error(err))
	}

	sqlDB.SetMaxOpenConns(cfg.PostgresMaxConns)
	sqlDB.SetMaxIdleConns(cfg.PostgresIdleConns)
	sqlDB.SetConnMaxLifetime(15 * time.Minute)

	logger.Log.Info("Database connection pool established successfully")

	if cfg.Environment != "production" || cfg.EnableAutoMigrate {
		if err := db.AutoMigrate(
			&models.User{},
			&models.UserProfile{},
			&models.EmployerProfile{},
			&models.RefreshToken{},
			&models.UserSession{},
			&models.OAuthAccount{},
			&models.Company{},
			&models.Job{},
			&models.SavedJob{},
			&models.JobCategory{},
			&models.Application{},
		); err != nil {
			logger.Log.Warn("AutoMigrate encounter warning", zap.Error(err))
		}
	} else {
		logger.Log.Info("AutoMigrate skipped in production; run controlled migrations before release")
	}

	// Setup Router
	router := routes.SetupRouter(cfg, db, logger.Log)

	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", cfg.Port),
		Handler:      router,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Log.Fatal("HTTP server failed to listen", zap.Error(err))
		}
	}()

	logger.Log.Info("Server successfully started", zap.String("addr", srv.Addr))

	// Graceful Shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	logger.Log.Info("Shutting down server gracefully...")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		logger.Log.Error("Server forced to shutdown", zap.Error(err))
	}

	if err := sqlDB.Close(); err != nil {
		logger.Log.Error("Error closing database connections", zap.Error(err))
	}

	logger.Log.Info("Server exited cleanly")
}
