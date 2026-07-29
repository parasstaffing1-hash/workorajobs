package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/workorajobs/backend-go/internal/service"
	"github.com/workorajobs/backend-go/pkg/response"
)

type SeoAutomationController struct {
	autoService *service.SeoAutomationService
}

func NewSeoAutomationController(autoService *service.SeoAutomationService) *SeoAutomationController {
	return &SeoAutomationController{autoService: autoService}
}

// GetConfig returns current configurable settings
func (ac *SeoAutomationController) GetConfig(c *gin.Context) {
	cfg := ac.autoService.GetConfig()
	response.Success(c, http.StatusOK, "SEO Automation configuration fetched successfully", cfg)
}

// UpdateConfig updates configurable settings
func (ac *SeoAutomationController) UpdateConfig(c *gin.Context) {
	var newCfg service.SeoAutomationConfig
	if err := c.ShouldBindJSON(&newCfg); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid configuration payload", err.Error())
		return
	}

	updated := ac.autoService.UpdateConfig(newCfg)
	response.Success(c, http.StatusOK, "SEO Automation configuration updated successfully", updated)
}

// TriggerCycle manually executes an immediate automation pass
func (ac *SeoAutomationController) TriggerCycle(c *gin.Context) {
	result := ac.autoService.RunAutomationCycle()
	response.Success(c, http.StatusOK, "SEO Automation cycle executed successfully", result)
}

// GetWorkerStatus returns live worker status
func (ac *SeoAutomationController) GetWorkerStatus(c *gin.Context) {
	status := ac.autoService.GetWorkerStatus()
	response.Success(c, http.StatusOK, "SEO Automation worker status fetched successfully", status)
}
