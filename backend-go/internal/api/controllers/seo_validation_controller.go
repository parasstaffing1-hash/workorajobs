package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/workorajobs/backend-go/internal/service"
	"github.com/workorajobs/backend-go/pkg/response"
)

type SeoValidationController struct {
	valService *service.SeoValidationService
}

func NewSeoValidationController(valService *service.SeoValidationService) *SeoValidationController {
	return &SeoValidationController{valService: valService}
}

// GetReport returns latest site validation report
func (vc *SeoValidationController) GetReport(c *gin.Context) {
	report := vc.valService.GetReport()
	response.Success(c, http.StatusOK, "SEO Validation site report fetched successfully", report)
}

// ValidateURL validates a single page input payload across 15 rules
func (vc *SeoValidationController) ValidateURL(c *gin.Context) {
	var input service.PageInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid page validation payload", err.Error())
		return
	}

	pageReport := vc.valService.ValidatePage(input)
	response.Success(c, http.StatusOK, "Page validation completed successfully", pageReport)
}

// AuditSite triggers site-wide audit
func (vc *SeoValidationController) AuditSite(c *gin.Context) {
	report := vc.valService.AuditSite(nil)
	response.Success(c, http.StatusOK, "Site-wide SEO audit completed successfully", report)
}
