package controllers

import (
	"math"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/workorajobs/backend-go/internal/domain/models"
	"github.com/workorajobs/backend-go/internal/service"
	"github.com/workorajobs/backend-go/pkg/response"
)

type GovtController struct {
	govtService *service.GovtService
}

func NewGovtController(govtService *service.GovtService) *GovtController {
	return &GovtController{govtService: govtService}
}

func (ctrl *GovtController) SearchGovtJobs(c *gin.Context) {
	var filter models.GovtJobFilterDTO
	if err := c.ShouldBindQuery(&filter); err != nil {
		response.BadRequest(c, "Invalid filter parameters", err.Error())
		return
	}

	filter.Page, filter.Limit, _ = response.SanitizePagination(filter.Page, filter.Limit)

	jobs, total, err := ctrl.govtService.SearchGovtJobs(c.Request.Context(), &filter)
	if err != nil {
		response.InternalServerError(c, "Failed to fetch government jobs", err.Error())
		return
	}

	totalPages := int(math.Ceil(float64(total) / float64(filter.Limit)))

	meta := response.PaginationMeta{
		Page:       filter.Page,
		Limit:      filter.Limit,
		TotalItems: total,
		TotalPages: totalPages,
	}

	response.SuccessWithMeta(c, http.StatusOK, "Government jobs fetched successfully", jobs, meta)
}

func (ctrl *GovtController) GetExamCalendar(c *gin.Context) {
	calendar, err := ctrl.govtService.GetExamCalendar(c.Request.Context())
	if err != nil {
		response.InternalServerError(c, "Failed to fetch exam calendar", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Exam calendar fetched successfully", calendar)
}
