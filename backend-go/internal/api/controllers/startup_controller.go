package controllers

import (
	"math"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/workorajobs/backend-go/internal/domain/models"
	"github.com/workorajobs/backend-go/internal/service"
	"github.com/workorajobs/backend-go/pkg/response"
)

type StartupController struct {
	startupService *service.StartupService
}

func NewStartupController(startupService *service.StartupService) *StartupController {
	return &StartupController{startupService: startupService}
}

func (ctrl *StartupController) SearchStartups(c *gin.Context) {
	var filter models.StartupFilterDTO
	if err := c.ShouldBindQuery(&filter); err != nil {
		response.BadRequest(c, "Invalid filter parameters", err.Error())
		return
	}

	filter.Page, filter.Limit, _ = response.SanitizePagination(filter.Page, filter.Limit)

	startups, total, err := ctrl.startupService.SearchStartups(c.Request.Context(), &filter)
	if err != nil {
		response.InternalServerError(c, "Failed to search startups", err.Error())
		return
	}

	totalPages := int(math.Ceil(float64(total) / float64(filter.Limit)))

	meta := response.PaginationMeta{
		Page:       filter.Page,
		Limit:      filter.Limit,
		TotalItems: total,
		TotalPages: totalPages,
	}

	response.SuccessWithMeta(c, http.StatusOK, "Startups fetched successfully", startups, meta)
}

func (ctrl *StartupController) GetProfileBySlug(c *gin.Context) {
	slug := c.Param("slug")
	profile, err := ctrl.startupService.GetProfileBySlug(c.Request.Context(), slug)
	if err != nil {
		response.NotFound(c, "Startup profile not found")
		return
	}

	response.Success(c, http.StatusOK, "Startup profile fetched", profile)
}
