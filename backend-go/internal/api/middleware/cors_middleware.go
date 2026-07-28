package middleware

import (
	"time"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

func CORSMiddleware(allowedOrigins []string) gin.HandlerFunc {
	originMap := make(map[string]bool)
	for _, o := range allowedOrigins {
		originMap[o] = true
	}

	return func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")
		if originMap[origin] || len(allowedOrigins) == 0 || allowedOrigins[0] == "*" {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
		}

		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, PATCH, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func ZapLogger(log *zap.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		query := c.Request.URL.RawQuery

		c.Next()

		latency := time.Since(start)
		status := c.Writer.Status()

		if status >= 400 {
			log.Error("HTTP Request Error",
				zap.Int("status", status),
				zap.String("method", c.Request.Method),
				zap.String("path", path),
				zap.String("query", query),
				zap.String("ip", c.ClientIP()),
				zap.Duration("latency", latency),
				zap.String("user-agent", c.Request.UserAgent()),
			)
		} else {
			log.Info("HTTP Request Success",
				zap.Int("status", status),
				zap.String("method", c.Request.Method),
				zap.String("path", path),
				zap.String("ip", c.ClientIP()),
				zap.Duration("latency", latency),
			)
		}
	}
}
