package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/workorajobs/backend-go/internal/domain/models"
	"github.com/workorajobs/backend-go/internal/service"
	"github.com/workorajobs/backend-go/pkg/response"
)

type SalaryController struct {
	salaryService *service.SalaryService
}

func NewSalaryController(salaryService *service.SalaryService) *SalaryController {
	return &SalaryController{salaryService: salaryService}
}

func (ctrl *SalaryController) CompareSalaries(c *gin.Context) {
	var input models.SalaryCompareInputDTO
	if err := c.ShouldBindQuery(&input); err != nil {
		response.BadRequest(c, "Invalid salary comparison input", err.Error())
		return
	}

	result, err := ctrl.salaryService.CompareSalaries(c.Request.Context(), &input)
	if err != nil {
		response.InternalServerError(c, "Failed to compute salary comparison", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Salary comparison fetched", result)
}

func (ctrl *SalaryController) GetChartData(c *gin.Context) {
	jobTitle := c.Query("jobTitle")
	if jobTitle == "" {
		response.BadRequest(c, "jobTitle is required", "")
		return
	}

	chart, err := ctrl.salaryService.GetChartData(c.Request.Context(), jobTitle)
	if err != nil {
		response.InternalServerError(c, "Failed to fetch chart data", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Salary chart data fetched", chart)
}
