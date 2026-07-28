package controllers

import (
	"math"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/workorajobs/backend-go/internal/domain/models"
	"github.com/workorajobs/backend-go/internal/service"
	"github.com/workorajobs/backend-go/pkg/response"
)

type VisaController struct {
	visaService *service.VisaService
}

func NewVisaController(visaService *service.VisaService) *VisaController {
	return &VisaController{visaService: visaService}
}

func (ctrl *VisaController) SearchVisaJobs(c *gin.Context) {
	var filter models.VisaFilterDTO
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

	jobs, total, err := ctrl.visaService.SearchVisaJobs(c.Request.Context(), &filter)
	if err != nil {
		response.InternalServerError(c, "Failed to fetch visa sponsorship jobs", err.Error())
		return
	}

	totalPages := int(math.Ceil(float64(total) / float64(filter.Limit)))

	meta := response.PaginationMeta{
		Page:       filter.Page,
		Limit:      filter.Limit,
		TotalItems: total,
		TotalPages: totalPages,
	}

	response.SuccessWithMeta(c, http.StatusOK, "Visa sponsorship jobs fetched successfully", jobs, meta)
}

func (ctrl *VisaController) ResolveSeoPage(c *gin.Context) {
	slug := c.Param("slug")
	seoPage, err := ctrl.visaService.ResolveSeoPage(c.Request.Context(), slug)
	if err != nil {
		response.NotFound(c, "SEO page not found")
		return
	}

	response.Success(c, http.StatusOK, "Visa SEO page metadata fetched", seoPage)
}
