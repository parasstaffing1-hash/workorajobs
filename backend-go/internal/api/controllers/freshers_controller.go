package controllers

import (
	"math"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/workorajobs/backend-go/internal/domain/models"
	"github.com/workorajobs/backend-go/internal/service"
	"github.com/workorajobs/backend-go/pkg/response"
)

type FreshersController struct {
	freshersService *service.FreshersService
}

func NewFreshersController(freshersService *service.FreshersService) *FreshersController {
	return &FreshersController{freshersService: freshersService}
}

func (ctrl *FreshersController) SearchFresherJobs(c *gin.Context) {
	var filter models.FresherFilterDTO
	if err := c.ShouldBindQuery(&filter); err != nil {
		response.BadRequest(c, "Invalid filter parameters", err.Error())
		return
	}

	if filter.Page <= 0 {
		filter.Page = 1
	}
	if filter.Limit <= 0 || filter.Limit > 100 {
		filter.Limit = 20
	}

	jobs, total, err := ctrl.freshersService.SearchFresherJobs(c.Request.Context(), &filter)
	if err != nil {
		response.InternalServerError(c, "Failed to fetch fresher jobs", err.Error())
		return
	}

	totalPages := int(math.Ceil(float64(total) / float64(filter.Limit)))

	meta := response.PaginationMeta{
		Page:       filter.Page,
		Limit:      filter.Limit,
		TotalItems: total,
		TotalPages: totalPages,
	}

	response.SuccessWithMeta(c, http.StatusOK, "Fresher jobs fetched successfully", jobs, meta)
}

func (ctrl *FreshersController) ResolveSeoPage(c *gin.Context) {
	slug := c.Param("slug")
	seoPage, err := ctrl.freshersService.ResolveSeoPage(c.Request.Context(), slug)
	if err != nil {
		response.NotFound(c, "SEO page not found")
		return
	}

	response.Success(c, http.StatusOK, "Fresher SEO page metadata fetched", seoPage)
}
