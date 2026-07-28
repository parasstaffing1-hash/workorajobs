package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/workorajobs/backend-go/pkg/response"
)

type clientLimiter struct {
	lastSeen time.Time
	count    int
}

type RateLimiter struct {
	mu       sync.Mutex
	clients  map[string]*clientLimiter
	maxReqs  int
	window   time.Duration
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
