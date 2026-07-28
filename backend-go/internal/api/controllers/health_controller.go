package controllers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/workorajobs/backend-go/pkg/response"
	"gorm.io/gorm"
)

type HealthController struct {
	db *gorm.DB
}

func NewHealthController(db *gorm.DB) *HealthController {
	return &HealthController{db: db}
}

func (h *HealthController) Liveness(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":    "ALIVE",
		"timestamp": time.Now().UTC().Format(time.RFC3339Nano),
	})
}

func (h *HealthController) Readiness(c *gin.Context) {
	sqlDB, err := h.db.DB()
	if err != nil || sqlDB.Ping() != nil {
		response.Error(c, http.StatusServiceUnavailable, "Database connection unready", err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":    "READY",
		"database":  "CONNECTED",
		"timestamp": time.Now().UTC().Format(time.RFC3339Nano),
	})
}
