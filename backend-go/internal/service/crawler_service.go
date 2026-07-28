package service

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/workorajobs/backend-go/internal/crawler"
	"github.com/workorajobs/backend-go/internal/domain/models"
	"github.com/workorajobs/backend-go/pkg/logger"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type CrawlerService struct {
	db      *gorm.DB
	fetcher *crawler.Fetcher
	dedup   *crawler.Deduplicator
}

func NewCrawlerService(db *gorm.DB) *CrawlerService {
	return &CrawlerService{
		db:      db,
		fetcher: crawler.NewFetcher(),
		dedup:   crawler.NewDeduplicator(),
	}
}

func (s *CrawlerService) CrawlSource(ctx context.Context, source *models.CrawlSource) (int, error) {
	logger.Log.Info("Starting crawl task for source",
		zap.String("sourceId", source.ID),
		zap.String("targetUrl", source.TargetURL),
	)

	var etag, lastMod string
	if source.ETag != nil {
		etag = *source.ETag
	}
	if source.LastModified != nil {
		lastMod = *source.LastModified
	}

	resp, err := s.fetcher.Fetch(ctx, source.TargetURL, etag, lastMod)
	if err != nil {
		return 0, fmt.Errorf("fetch error: %w", err)
	}
	if resp == nil {
		logger.Log.Info("Source not modified since last crawl, skipping", zap.String("sourceId", source.ID))
		return 0, nil
	}
	defer resp.Body.Close()

	items, err := crawler.ParseRSSFeed(resp.Body, source.ID)
	if err != nil {
		return 0, fmt.Errorf("parsing error: %w", err)
	}

	importedCount := 0
	for _, item := range items {
		// Check for duplicate fingerprint in database
		var existingCount int64
		s.db.Model(&models.Job{}).Where("slug = ?", item.ContentHash).Count(&existingCount)
		if existingCount > 0 {
			continue // Skip duplicate job
		}

		job := models.Job{
			ID:               uuid.New().String(),
			Title:            item.Title,
			Slug:             &item.ContentHash,
			Description:      item.Description,
			Location:         &item.Location,
			ExternalApplyURL: &item.ApplyURL,
			Status:           models.JobStatusPublished,
			PostedAt:         item.PublishedAt,
		}

		if err := s.db.Create(&job).Error; err == nil {
			importedCount++
		}
	}

	now := time.Now()
	source.LastCrawledAt = &now
	s.db.Save(source)

	logger.Log.Info("Crawl completed successfully",
		zap.String("sourceId", source.ID),
		zap.Int("importedJobs", importedCount),
	)

	return importedCount, nil
}
