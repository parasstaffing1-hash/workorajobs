package controllers

import (
	"math"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/workorajobs/backend-go/internal/domain/models"
	"github.com/workorajobs/backend-go/internal/service"
	"github.com/workorajobs/backend-go/pkg/response"
)

type WFHController struct {
	wfhService *service.WFHService
}

func NewWFHController(wfhService *service.WFHService) *WFHController {
	return &WFHController{wfhService: wfhService}
}

func (ctrl *WFHController) SearchWFHJobs(c *gin.Context) {
	var filter models.WFHFilterDTO
	if err := c.ShouldBindQuery(&filter); err != nil {
		response.BadRequest(c, "Invalid filter parameters", err.Error())
		return
	}

	filter.Page, filter.Limit, _ = response.SanitizePagination(filter.Page, filter.Limit)

	jobs, total, err := ctrl.wfhService.SearchWFHJobs(c.Request.Context(), &filter)
	if err != nil {
		response.InternalServerError(c, "Failed to fetch WFH jobs", err.Error())
		return
	}

	totalPages := int(math.Ceil(float64(total) / float64(filter.Limit)))

	meta := response.PaginationMeta{
		Page:       filter.Page,
		Limit:      filter.Limit,
		TotalItems: total,
		TotalPages: totalPages,
	}

	response.SuccessWithMeta(c, http.StatusOK, "Work from home jobs fetched successfully", jobs, meta)
}

func (ctrl *WFHController) ResolveSeoPage(c *gin.Context) {
	slug := c.Param("slug")
	seoPage, err := ctrl.wfhService.ResolveSeoPage(c.Request.Context(), slug)
	if err != nil {
		response.NotFound(c, "SEO page not found")
		return
	}

	response.Success(c, http.StatusOK, "WFH SEO page metadata fetched", seoPage)
}
