package middleware

import (
	"fmt"
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
	"github.com/workorajobs/backend-go/pkg/response"
	"go.uber.org/zap"
)

type clientLimiter struct {
	lastSeen time.Time
	count    int
}

type RateLimiter struct {
	mu      sync.Mutex
	clients map[string]*clientLimiter
	maxReqs int
	window  time.Duration
}

func NewRateLimiter(maxReqs int, window time.Duration) *RateLimiter {
	rl := &RateLimiter{
		clients: make(map[string]*clientLimiter),
		maxReqs: maxReqs,
		window:  window,
	}

	// Cleanup stale entries every 5 minutes
	go func() {
		for {
			time.Sleep(5 * time.Minute)
			rl.mu.Lock()
			for ip, cl := range rl.clients {
				if time.Since(cl.lastSeen) > rl.window {
					delete(rl.clients, ip)
				}
			}
			rl.mu.Unlock()
		}
	}()

	return rl
}

func RateLimitMiddleware(maxReqs int, window time.Duration) gin.HandlerFunc {
	limiter := NewRateLimiter(maxReqs, window)

	return func(c *gin.Context) {
		ip := c.ClientIP()
		userID := c.GetString(CtxUserID)
		key := ip
		if userID != "" {
			key = userID
		}

		limiter.mu.Lock()
		cl, exists := limiter.clients[key]
		now := time.Now()

		if !exists || now.Sub(cl.lastSeen) > window {
			limiter.clients[key] = &clientLimiter{
				lastSeen: now,
				count:    1,
			}
			limiter.mu.Unlock()
			c.Next()
			return
		}

		if cl.count >= maxReqs {
			limiter.mu.Unlock()
			response.Error(c, http.StatusTooManyRequests, "Rate limit exceeded. Please try again later.", "TOO_MANY_REQUESTS")
			c.Abort()
			return
		}

		cl.count++
		cl.lastSeen = now
		limiter.mu.Unlock()
		c.Next()
	}
}

// RedisRateLimitMiddleware performs atomic Redis INCR & EXPIRE rate limiting for multi-instance deployments
func RedisRateLimitMiddleware(rdb *redis.Client, maxReqs int, window time.Duration) gin.HandlerFunc {
	if rdb == nil {
		return RateLimitMiddleware(maxReqs, window)
	}

	return func(c *gin.Context) {
		ip := c.ClientIP()
		userID := c.GetString(CtxUserID)
		entityKey := ip
		if userID != "" {
			entityKey = userID
		}

		ctx := c.Request.Context()
		key := fmt.Sprintf("rl:%s:%d", entityKey, time.Now().Unix()/int64(window.Seconds()))

		count, err := rdb.Incr(ctx, key).Result()
		if err != nil {
			// Fail soft if Redis is temporarily unreachable
			c.Next()
			return
		}

		if count == 1 {
			_ = rdb.Expire(ctx, key, window).Err()
		}

		if count > int64(maxReqs) {
			response.Error(c, http.StatusTooManyRequests, "Rate limit exceeded. Please try again later.", "TOO_MANY_REQUESTS")
			c.Abort()
			return
		}

		c.Next()
	}
}

// NewConfiguredRateLimiter returns the appropriate rate-limiting middleware based on configuration
func NewConfiguredRateLimiter(backend string, isProd bool, rdb *redis.Client, maxReqs int, window time.Duration, logger *zap.Logger) gin.HandlerFunc {
	if backend == "redis" {
		if rdb != nil {
			return RedisRateLimitMiddleware(rdb, maxReqs, window)
		}
		if isProd {
			if logger != nil {
				logger.Error("RATE_LIMIT_BACKEND=redis requested but Redis client is nil in production")
			}
			return func(c *gin.Context) {
				response.Error(c, http.StatusInternalServerError, "Rate limiter configuration error", "RATE_LIMIT_CONFIG_ERROR")
				c.Abort()
			}
		}
		if logger != nil {
			logger.Warn("RATE_LIMIT_BACKEND=redis requested but Redis client is nil; falling back to in-memory rate limiter")
		}
	} else if backend != "" && backend != "memory" {
		if logger != nil {
			logger.Warn("Unknown RATE_LIMIT_BACKEND configured, falling back to in-memory rate limiter", zap.String("backend", backend))
		}
	}
	return RateLimitMiddleware(maxReqs, window)
}
