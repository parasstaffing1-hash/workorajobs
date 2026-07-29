package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/workorajobs/backend-go/internal/service"
	"github.com/workorajobs/backend-go/pkg/response"
)

type SeoContentController struct {
	contentService *service.SeoContentService
}

func NewSeoContentController(contentService *service.SeoContentService) *SeoContentController {
	return &SeoContentController{contentService: contentService}
}

type RefreshRequest struct {
	GuideID string `json:"guideId" binding:"required"`
}

// GetGuide returns complete guide payload across all 9 categories
func (cc *SeoContentController) GetGuide(c *gin.Context) {
	category := c.Query("category")
	slug := c.Query("slug")

	if category == "" {
		response.Error(c, http.StatusBadRequest, "Category query parameter is required", "CATEGORY_REQUIRED")
		return
	}

	guide, err := cc.contentService.GetGuide(category, slug)
	if err != nil {
		response.Error(c, http.StatusNotFound, err.Error(), "GUIDE_NOT_FOUND")
		return
	}

	response.Success(c, http.StatusOK, "SEO content guide fetched successfully", guide)
}

// RefreshGuide triggers background update worker
func (cc *SeoContentController) RefreshGuide(c *gin.Context) {
	var req RefreshRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid refresh payload", err.Error())
		return
	}

	if err := cc.contentService.AutoUpdateContent(req.GuideID); err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to trigger refresh", "REFRESH_ERROR")
		return
	}

	response.Success(c, http.StatusOK, "Guide content background update triggered", gin.H{
		"guideId": req.GuideID,
		"status":  "queued",
	})
}
