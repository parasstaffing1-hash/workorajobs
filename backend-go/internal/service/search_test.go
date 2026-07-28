package service

import (
	"testing"
	"time"

	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)

func TestPostgresSearchBaseline(t *testing.T) {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		t.Fatalf("Failed to open sqlite memory DB: %v", err)
	}

	if err := db.AutoMigrate(&TestJob{}); err != nil {
		t.Fatalf("Failed to migrate TestJob: %v", err)
	}

	compID := "comp_1"
	userID := "user_1"
	jobs := []TestJob{
		{ID: "j1", Title: "Senior Go Developer", Description: "Backend microservices", Status: "PUBLISHED", CompanyID: &compID, PostedByID: &userID, PostedAt: time.Now().Add(-1 * time.Hour)},
		{ID: "j2", Title: "React Frontend Engineer", Description: "Next.js web app", Status: "PUBLISHED", CompanyID: &compID, PostedByID: &userID, PostedAt: time.Now().Add(-2 * time.Hour)},
		{ID: "j3", Title: "DevOps Engineer", Description: "AWS Kubernetes terraform", Status: "PUBLISHED", CompanyID: &compID, PostedByID: &userID, PostedAt: time.Now().Add(-3 * time.Hour)},
	}
	for _, j := range jobs {
		db.Create(&j)
	}

	// 1. Empty query returns all published jobs
	var results []TestJob
	db.Where("status = ?", "PUBLISHED").Order("posted_at DESC").Find(&results)
	if len(results) != 3 {
		t.Errorf("Expected 3 jobs for empty query, got %d", len(results))
	}

	// 2. Filter query
	var queryResults []TestJob
	q := "%Go%"
	db.Where("status = ? AND title LIKE ?", "PUBLISHED", q).Find(&queryResults)
	if len(queryResults) != 1 || queryResults[0].ID != "j1" {
		t.Errorf("Expected job j1 for query 'Go', got %+v", queryResults)
	}

	// 3. Stable ordering by posted_at DESC
	if results[0].ID != "j1" || results[1].ID != "j2" || results[2].ID != "j3" {
		t.Errorf("Expected stable DESC ordering (j1, j2, j3), got (%s, %s, %s)", results[0].ID, results[1].ID, results[2].ID)
	}
}
