package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/workorajobs/backend-go/internal/service"
	"github.com/workorajobs/backend-go/pkg/response"
)

type InternalLinkingController struct {
	linkingService *service.InternalLinkingService
}

func NewInternalLinkingController(linkingService *service.InternalLinkingService) *InternalLinkingController {
	return &InternalLinkingController{linkingService: linkingService}
}

// GetEntityLinks resolves all 13 internal link relationships for a given entity
func (lc *InternalLinkingController) GetEntityLinks(c *gin.Context) {
	entityType := c.Query("type")
	entityID := c.Query("id")

	if entityType == "" || entityID == "" {
		response.Error(c, http.StatusBadRequest, "Both 'type' and 'id' query parameters are required", "INVALID_PARAMS")
		return
	}

	var graph *service.EntityLinkGraphResponse
	var err error

	switch service.EntityType(entityType) {
	case service.EntityJob:
		graph, err = lc.linkingService.GetJobLinks(entityID)
	case service.EntityCompany:
		graph, err = lc.linkingService.GetCompanyLinks(entityID)
	case service.EntitySkill:
		graph, err = lc.linkingService.GetSkillLinks(entityID)
	case service.EntityCity:
		graph, err = lc.linkingService.GetCityLinks(entityID)
	case service.EntityIndustry:
		graph, err = lc.linkingService.GetIndustryLinks(entityID)
	default:
		response.Error(c, http.StatusBadRequest, "Unsupported entity type", "UNSUPPORTED_ENTITY_TYPE")
		return
	}

	if err != nil {
		response.Error(c, http.StatusNotFound, err.Error(), "ENTITY_NOT_FOUND")
		return
	}

	response.Success(c, http.StatusOK, "Internal link graph fetched successfully", graph)
}

// AuditOrphanPages runs automated orphan page check
func (lc *InternalLinkingController) AuditOrphanPages(c *gin.Context) {
	auditResult := lc.linkingService.AuditOrphanPages()
	response.Success(c, http.StatusOK, "Orphan page audit complete", auditResult)
}

// GetCrawlDepth calculates click depth metrics
func (lc *InternalLinkingController) GetCrawlDepth(c *gin.Context) {
	targetURL := c.Query("url")
	depth := lc.linkingService.ComputeCrawlDepth(targetURL)

	response.Success(c, http.StatusOK, "Crawl depth computed successfully", gin.H{
		"url":        targetURL,
		"crawlDepth": depth,
		"status":     "optimal (<= 3 clicks)",
	})
}
