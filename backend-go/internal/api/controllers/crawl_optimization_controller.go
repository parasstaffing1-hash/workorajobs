package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/workorajobs/backend-go/internal/service"
	"github.com/workorajobs/backend-go/pkg/response"
)

type CrawlOptimizationController struct {
	optService *service.CrawlOptimizationService
}

func NewCrawlOptimizationController(optService *service.CrawlOptimizationService) *CrawlOptimizationController {
	return &CrawlOptimizationController{optService: optService}
}

// GetReport returns latest crawl diagnostic report
func (cc *CrawlOptimizationController) GetReport(c *gin.Context) {
	report := cc.optService.GetReport()
	response.Success(c, http.StatusOK, "Crawl diagnostic report fetched successfully", report)
}

// TriggerAudit runs manual full crawl health audit
func (cc *CrawlOptimizationController) TriggerAudit(c *gin.Context) {
	report := cc.optService.RunFullAudit()
	response.Success(c, http.StatusOK, "Full crawl health audit completed", report)
}

// GetIssues returns list of detected issues filtered by severity
func (cc *CrawlOptimizationController) GetIssues(c *gin.Context) {
	severity := c.Query("severity")
	report := cc.optService.GetReport()

	if severity == "" {
		response.Success(c, http.StatusOK, "All crawl issues fetched", report.Issues)
		return
	}

	var filtered []service.CrawlIssue
	for _, issue := range report.Issues {
		if string(issue.Severity) == severity {
			filtered = append(filtered, issue)
		}
	}

	response.Success(c, http.StatusOK, "Filtered crawl issues fetched", filtered)
}
