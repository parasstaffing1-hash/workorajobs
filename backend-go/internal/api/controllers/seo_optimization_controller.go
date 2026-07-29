package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/workorajobs/backend-go/internal/service"
	"github.com/workorajobs/backend-go/pkg/response"
)

type SeoOptimizationController struct {
	optService *service.SeoOptimizationService
}

func NewSeoOptimizationController(optService *service.SeoOptimizationService) *SeoOptimizationController {
	return &SeoOptimizationController{optService: optService}
}

// StreamSitemap streams dynamic XML sitemap chunks using HTTP chunked transfer encoding
func (oc *SeoOptimizationController) StreamSitemap(c *gin.Context) {
	category := c.DefaultQuery("category", "jobs")
	pageStr := c.DefaultQuery("page", "1")
	page, _ := strconv.Atoi(pageStr)

	c.Header("Content-Type", "application/xml; charset=utf-8")
	c.Header("Transfer-Encoding", "chunked")
	c.Status(http.StatusOK)

	err := oc.optService.StreamSitemapChunk(c.Writer, category, page)
	if err != nil {
		c.Error(err)
	}
}

// GetMetrics returns real-time optimization metrics
func (oc *SeoOptimizationController) GetMetrics(c *gin.Context) {
	metrics := oc.optService.GetPerformanceMetrics()
	response.Success(c, http.StatusOK, "SEO Optimization metrics fetched successfully", metrics)
}

// ClearCache flushes L1/L2 Redis caches
func (oc *SeoOptimizationController) ClearCache(c *gin.Context) {
	oc.optService.ClearCache()
	response.Success(c, http.StatusOK, "SEO Optimization caches cleared successfully", nil)
}
