package routes

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/glebarez/sqlite"
	"github.com/workorajobs/backend-go/internal/config"
	"github.com/workorajobs/backend-go/internal/domain/models"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

func TestAuthProtectedRoutes(t *testing.T) {
	gin.SetMode(gin.TestMode)
	cfg := &config.Config{
		Environment:      "test",
		JWTAccessSecret:  "test-jwt-secret-key-32-chars-long!",
		JWTRefreshSecret: "test-jwt-refresh-secret-32-chars!",
		EnableS3Uploads:  false,
		RateLimitBackend: "memory",
	}

	logger := zap.NewNop()
	router := SetupRouter(cfg, nil, logger)

	protectedRoutes := []struct {
		method string
		path   string
	}{
		{"POST", "/api/v1/recommendations/jobs"},
		{"POST", "/api/v1/recommendations/resume-match"},
		{"POST", "/api/v1/internships/recommendations"},
		{"POST", "/api/v1/walkins/w1/remind"},
		{"POST", "/api/v1/jobs"},
		{"GET", "/api/v1/seo-opt/metrics"},
		{"GET", "/api/v1/seo-val/report"},
		{"GET", "/api/v1/seo-auto/config"},
		{"GET", "/api/v1/seo-analytics/overview"},
		{"GET", "/api/v1/crawl-opt/report"},
		{"GET", "/api/v1/indexing/dashboard"},
		{"GET", "/api/v1/ai-metadata/versions"},
		{"GET", "/api/v1/linking/entity"},
	}

	for _, route := range protectedRoutes {
		w := httptest.NewRecorder()
		req, _ := http.NewRequest(route.method, route.path, nil)
		router.ServeHTTP(w, req)

		if w.Code != http.StatusUnauthorized {
			t.Errorf("Expected status 401 for unauthenticated %s %s, got %d", route.method, route.path, w.Code)
		}
	}
}

func TestPublicSearchRoutesHealthy(t *testing.T) {
	gin.SetMode(gin.TestMode)
	cfg := &config.Config{
		Environment:      "test",
		JWTAccessSecret:  "test-jwt-secret-key-32-chars-long!",
		RateLimitBackend: "memory",
	}

	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		t.Fatalf("Failed to open test db: %v", err)
	}

	_ = db.AutoMigrate(&models.Company{}, &models.User{})
	_ = db.Exec(`CREATE TABLE "Job" (id VARCHAR(255) PRIMARY KEY, title VARCHAR(255), status VARCHAR(50) DEFAULT 'PUBLISHED', company_id VARCHAR(255), posted_at DATETIME, deleted_at DATETIME)`)

	logger := zap.NewNop()
	router := SetupRouter(cfg, db, logger)

	// 1. GET /api/v1/health/liveness MUST return 200 OK
	wLive := httptest.NewRecorder()
	reqLive, _ := http.NewRequest("GET", "/api/v1/health/liveness", nil)
	router.ServeHTTP(wLive, reqLive)
	if wLive.Code != http.StatusOK {
		t.Errorf("Expected 200 OK for liveness health route, got %d", wLive.Code)
	}

	// 2. GET /api/v1/universal-search/trending MUST return 200 OK
	wTrend := httptest.NewRecorder()
	reqTrend, _ := http.NewRequest("GET", "/api/v1/universal-search/trending", nil)
	router.ServeHTTP(wTrend, reqTrend)
	if wTrend.Code != http.StatusOK {
		t.Errorf("Expected 200 OK for trending search route, got %d", wTrend.Code)
	}

	// 3. GET /api/v1/jobs MUST return 200 OK
	wJobs := httptest.NewRecorder()
	reqJobs, _ := http.NewRequest("GET", "/api/v1/jobs", nil)
	router.ServeHTTP(wJobs, reqJobs)
	if wJobs.Code != http.StatusOK {
		t.Errorf("Expected 200 OK for public jobs route, got %d", wJobs.Code)
	}
}

func TestInitRateLimitRedisClient(t *testing.T) {
	logger := zap.NewNop()

	memoryCfg := &config.Config{RateLimitBackend: "memory"}
	if client, ready := initRateLimitRedisClient(memoryCfg, logger); client != nil || ready {
		t.Fatal("memory rate limit backend must not initialize Redis")
	}

	invalidRedisCfg := &config.Config{
		RateLimitBackend: "redis",
		RedisURL:         "://bad-url",
	}
	if client, ready := initRateLimitRedisClient(invalidRedisCfg, logger); client != nil || ready {
		t.Fatal("invalid Redis URL must not return a ready client")
	}

	unreachableRedisCfg := &config.Config{
		RateLimitBackend: "redis",
		RedisURL:         "redis://127.0.0.1:1/0",
	}
	if client, ready := initRateLimitRedisClient(unreachableRedisCfg, logger); client != nil || ready {
		t.Fatal("unreachable Redis must not return a ready client")
	}
}
