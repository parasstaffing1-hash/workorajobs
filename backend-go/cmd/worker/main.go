package main

import (
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/workorajobs/backend-go/internal/config"
	"github.com/workorajobs/backend-go/pkg/logger"
	"go.uber.org/zap"
)

func main() {
	cfg, err := config.LoadConfig(".")
	if err != nil {
		fmt.Printf("Failed to load configuration for worker: %v\n", err)
		os.Exit(1)
	}

	logger.InitLogger(cfg.Environment)
	defer logger.Sync()

	logger.Log.Info("Starting WorkoraJobs Background Worker Process",
		zap.String("environment", cfg.Environment),
	)

	// Worker loops
	go runSitemapGeneratorCron()
	go runEmailQueueConsumer()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	logger.Log.Info("Worker process stopping gracefully...")
}

func runSitemapGeneratorCron() {
	ticker := time.NewTicker(24 * time.Hour)
	defer ticker.Stop()

	logger.Log.Info("Sitemap generator cron worker started")

	for range ticker.C {
		logger.Log.Info("Running scheduled XML sitemap regeneration job...")
	}
}

func runEmailQueueConsumer() {
	logger.Log.Info("Email queue consumer worker started")
}
