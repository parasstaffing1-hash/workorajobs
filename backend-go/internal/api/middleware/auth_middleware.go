package middleware

import (
	"crypto/subtle"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/workorajobs/backend-go/internal/auth"
	"github.com/workorajobs/backend-go/pkg/response"
)

const (
	AuthorizationHeader = "Authorization"
	BearerPrefix        = "Bearer "
	CtxUserID           = "userID"
	CtxUserEmail        = "userEmail"
	CtxUserRole         = "userRole"
)

func AuthMiddleware(jwtSecret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader(AuthorizationHeader)
		if authHeader == "" {
			response.Unauthorized(c, "Authorization header required")
			c.Abort()
			return
		}

		if !strings.HasPrefix(authHeader, BearerPrefix) {
			response.Unauthorized(c, "Invalid authorization header format")
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, BearerPrefix)
		claims, err := auth.ValidateToken(tokenString, jwtSecret)
		if err != nil {
			response.Unauthorized(c, "Invalid or expired token")
			c.Abort()
			return
		}

		c.Set(CtxUserID, claims.UserID)
		c.Set(CtxUserEmail, claims.Email)
		c.Set(CtxUserRole, claims.Role)

		c.Next()
	}
}

func MetricsAuthMiddleware(metricsToken string) gin.HandlerFunc {
	return func(c *gin.Context) {
		if metricsToken == "" {
			c.Next()
			return
		}

		authHeader := c.GetHeader(AuthorizationHeader)
		if !strings.HasPrefix(authHeader, BearerPrefix) {
			response.Unauthorized(c, "Metrics authorization required")
			c.Abort()
			return
		}

		token := strings.TrimPrefix(authHeader, BearerPrefix)
		if subtle.ConstantTimeCompare([]byte(token), []byte(metricsToken)) != 1 {
			response.Unauthorized(c, "Invalid metrics authorization")
			c.Abort()
			return
		}

		c.Next()
	}
}

func RequireRoles(roles ...string) gin.HandlerFunc {
	roleMap := make(map[string]bool)
	for _, r := range roles {
		roleMap[r] = true
	}

	return func(c *gin.Context) {
		userRole, exists := c.Get(CtxUserRole)
		if !exists {
			response.Unauthorized(c, "User context missing")
			c.Abort()
			return
		}

		roleStr, ok := userRole.(string)
		if !ok || !roleMap[roleStr] {
			response.Forbidden(c, "Permission denied: insufficient privileges")
			c.Abort()
			return
		}

		c.Next()
	}
}
