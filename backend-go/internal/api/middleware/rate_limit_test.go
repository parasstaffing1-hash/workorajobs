package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
	"go.uber.org/zap"
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
	logger := zap.NewNop()

	// 1. Memory Backend Selection by default
	mwMemory := NewConfiguredRateLimiter("memory", false, nil, 5, time.Minute, logger)
	if mwMemory == nil {
		t.Error("Expected non-nil middleware for memory backend")
	}

	// 2. Redis Backend Selection when client is provided
	dummyRDB := redis.NewClient(&redis.Options{Addr: "localhost:6379"})
	mwRedis := NewConfiguredRateLimiter("redis", false, dummyRDB, 5, time.Minute, logger)
	if mwRedis == nil {
		t.Error("Expected non-nil middleware for redis backend with client")
	}

	// 3. Production Redis backend with nil client returns 500 middleware
	mwProdNilRedis := NewConfiguredRateLimiter("redis", true, nil, 5, time.Minute, logger)
	r := gin.New()
	r.GET("/prod-test", mwProdNilRedis, func(c *gin.Context) { c.String(http.StatusOK, "ok") })
	wProd := httptest.NewRecorder()
	reqProd, _ := http.NewRequest("GET", "/prod-test", nil)
	r.ServeHTTP(wProd, reqProd)
	if wProd.Code != http.StatusInternalServerError {
		t.Errorf("Expected status 500 in production when Redis client is nil, got %d", wProd.Code)
	}

	// 4. Development Redis backend with nil client falls back to memory
	mwDevNilRedis := NewConfiguredRateLimiter("redis", false, nil, 5, time.Minute, logger)
	if mwDevNilRedis == nil {
		t.Error("Expected non-nil fallback middleware in dev when Redis client is nil")
	}

	// 5. Invalid backend value falls back to memory
	mwInvalid := NewConfiguredRateLimiter("invalid_backend", false, nil, 5, time.Minute, logger)
	if mwInvalid == nil {
		t.Error("Expected non-nil fallback middleware for invalid backend")
	}
}
