package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
)

func TestRateLimitMiddleware(t *testing.T) {
	gin.SetMode(gin.TestMode)

	r := gin.New()
	r.Use(RateLimitMiddleware(2, 5*time.Second))
	r.GET("/test", func(c *gin.Context) {
		c.String(http.StatusOK, "ok")
	})

	// First request - OK
	w1 := httptest.NewRecorder()
	req1, _ := http.NewRequest("GET", "/test", nil)
	r.ServeHTTP(w1, req1)
	if w1.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w1.Code)
	}

	// Second request - OK
	w2 := httptest.NewRecorder()
	req2, _ := http.NewRequest("GET", "/test", nil)
	r.ServeHTTP(w2, req2)
	if w2.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w2.Code)
	}

	// Third request - 429 Too Many Requests
	w3 := httptest.NewRecorder()
	req3, _ := http.NewRequest("GET", "/test", nil)
	r.ServeHTTP(w3, req3)
	if w3.Code != http.StatusTooManyRequests {
		t.Errorf("Expected status 429, got %d", w3.Code)
	}
}

func TestNewConfiguredRateLimiter(t *testing.T) {
	gin.SetMode(gin.TestMode)

	// Memory Backend Selection
	mwMemory := NewConfiguredRateLimiter("memory", false, nil, 5, time.Minute)
	if mwMemory == nil {
		t.Error("Expected non-nil middleware for memory backend")
	}

	// Redis Backend Selection with nil client (Development fallback)
	mwRedisFallback := NewConfiguredRateLimiter("redis", false, nil, 5, time.Minute)
	if mwRedisFallback == nil {
		t.Error("Expected non-nil middleware for redis backend with fallback")
	}
}
