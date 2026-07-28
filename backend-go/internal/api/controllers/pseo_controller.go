package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/workorajobs/backend-go/internal/service"
	"github.com/workorajobs/backend-go/pkg/response"
)

type PseoController struct {
	pseoService *service.PseoService
}

func NewPseoController(pseoService *service.PseoService) *PseoController {
	return &PseoController{pseoService: pseoService}
}

// GetPseoPage handles dynamic resolution for all 16 Programmatic SEO dimensions
func (pc *PseoController) GetPseoPage(c *gin.Context) {
	dimension := c.Query("dimension")
	slug := c.Query("slug")

	if dimension == "" {
		response.Error(c, http.StatusBadRequest, "Dimension query parameter is required", "DIMENSION_REQUIRED")
		return
	}

	pageData, err := pc.pseoService.ResolvePseoPage(dimension, slug)
	if err != nil {
		response.Error(c, http.StatusNotFound, err.Error(), "PSEO_PAGE_NOT_FOUND")
		return
	}

	response.Success(c, http.StatusOK, "Programmatic SEO page resolved successfully", pageData)
}

// GetRelatedLinks handles cross-linking graph suggestions for any dimension and slug
func (pc *PseoController) GetRelatedLinks(c *gin.Context) {
	dimension := service.PseoDimension(c.Query("dimension"))
	slug := c.Query("slug")

	relatedPages, internalLinks := pc.pseoService.GenerateRelatedInternalLinks(dimension, slug)
	response.Success(c, http.StatusOK, "Related links fetched successfully", gin.H{
		"relatedPages":  relatedPages,
		"internalLinks": internalLinks,
	})
}
