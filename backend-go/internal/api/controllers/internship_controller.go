package controllers

import (
	"math"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/workorajobs/backend-go/internal/domain/models"
	"github.com/workorajobs/backend-go/internal/service"
	"github.com/workorajobs/backend-go/pkg/response"
)

type InternshipController struct {
	internshipService *service.InternshipService
}

func NewInternshipController(internshipService *service.InternshipService) *InternshipController {
	return &InternshipController{internshipService: internshipService}
}

func (ctrl *InternshipController) SearchInternships(c *gin.Context) {
	var filter models.InternshipSearchFilterDTO
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

	jobs, total, err := ctrl.internshipService.SearchInternships(c.Request.Context(), &filter)
	if err != nil {
		response.InternalServerError(c, "Failed to fetch internships", err.Error())
		return
	}

	totalPages := int(math.Ceil(float64(total) / float64(filter.Limit)))

	meta := response.PaginationMeta{
		Page:       filter.Page,
		Limit:      filter.Limit,
		TotalItems: total,
		TotalPages: totalPages,
	}

	response.SuccessWithMeta(c, http.StatusOK, "Internships fetched successfully", jobs, meta)
}

func (ctrl *InternshipController) GetRecommendations(c *gin.Context) {
	var req models.InternshipRecommendationDTO
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid recommendation payload", err.Error())
		return
	}

	jobs, err := ctrl.internshipService.GetRecommendations(c.Request.Context(), &req)
	if err != nil {
		response.InternalServerError(c, "Failed to fetch recommendations", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Recommended internships fetched", jobs)
}
