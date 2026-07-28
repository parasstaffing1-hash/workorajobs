package routes

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/workorajobs/backend-go/internal/config"
	"go.uber.org/zap"
)

func TestAuthProtectedRoutes(t *testing.T) {
	gin.SetMode(gin.TestMode)
	cfg := &config.Config{
		Environment:       "test",
		JWTAccessSecret:   "test-jwt-secret-key-32-chars-long!",
		JWTRefreshSecret:  "test-jwt-refresh-secret-32-chars!",
		EnableS3Uploads:   false,
		RateLimitBackend:  "memory",
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

func TestPublicSearchRoutesAccessible(t *testing.T) {
	gin.SetMode(gin.TestMode)
	cfg := &config.Config{
		Environment:      "test",
		JWTAccessSecret:  "test-jwt-secret-key-32-chars-long!",
		RateLimitBackend: "memory",
	}

	logger := zap.NewNop()
	router := SetupRouter(cfg, nil, logger)

	publicRoutes := []string{
		"/api/v1/health/liveness",
		"/api/v1/universal-search/autocomplete?q=dev",
		"/api/v1/universal-search/trending",
	}

	for _, path := range publicRoutes {
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", path, nil)
		router.ServeHTTP(w, req)

		if w.Code == http.StatusUnauthorized {
			t.Errorf("Public route %s should not return 401 Unauthorized", path)
		}
	}
}
