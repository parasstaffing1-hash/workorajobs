package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/workorajobs/backend-go/internal/service"
	"github.com/workorajobs/backend-go/pkg/response"
)

type SeoAnalyticsController struct {
	analyticsService *service.SeoAnalyticsService
}

func NewSeoAnalyticsController(analyticsService *service.SeoAnalyticsService) *SeoAnalyticsController {
	return &SeoAnalyticsController{analyticsService: analyticsService}
}

// GetOverview returns 13 core tracked SEO metrics
func (ac *SeoAnalyticsController) GetOverview(c *gin.Context) {
	overview := ac.analyticsService.GetOverviewMetrics()
	response.Success(c, http.StatusOK, "SEO Analytics overview metrics fetched successfully", overview)
}

// GetCharts returns 30-day chart data series
func (ac *SeoAnalyticsController) GetCharts(c *gin.Context) {
	chartData := ac.analyticsService.GetChartData()
	response.Success(c, http.StatusOK, "SEO Analytics chart data series fetched successfully", chartData)
}

// GetPerformance returns search performance analytics
func (ac *SeoAnalyticsController) GetPerformance(c *gin.Context) {
	perfData := ac.analyticsService.GetSearchPerformanceData()
	response.Success(c, http.StatusOK, "SEO Search Performance analytics fetched successfully", perfData)
}
