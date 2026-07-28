package controllers

import (
	"math"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/workorajobs/backend-go/internal/api/middleware"
	"github.com/workorajobs/backend-go/internal/domain/models"
	"github.com/workorajobs/backend-go/internal/service"
	"github.com/workorajobs/backend-go/pkg/response"
)

type JobController struct {
	jobService *service.JobService
}

func NewJobController(jobService *service.JobService) *JobController {
	return &JobController{jobService: jobService}
}

func (ctrl *JobController) ListJobs(c *gin.Context) {
	var filter service.JobFilter
	if err := c.ShouldBindQuery(&filter); err != nil {
		response.BadRequest(c, "Invalid filter query parameters", err.Error())
		return
	}

	if filter.Page <= 0 {
		filter.Page = 1
	}
	if filter.Limit <= 0 || filter.Limit > 100 {
		filter.Limit = 20
	}

	jobs, total, err := ctrl.jobService.ListJobs(&filter)
	if err != nil {
		response.InternalServerError(c, "Failed to fetch jobs", err.Error())
		return
	}

	totalPages := int(math.Ceil(float64(total) / float64(filter.Limit)))

	meta := response.PaginationMeta{
		Page:       filter.Page,
		Limit:      filter.Limit,
		TotalItems: total,
		TotalPages: totalPages,
	}

	response.SuccessWithMeta(c, http.StatusOK, "Jobs retrieved successfully", jobs, meta)
}

func (ctrl *JobController) GetJobByID(c *gin.Context) {
	id := c.Param("id")
	job, err := ctrl.jobService.GetJobByID(id)
	if err != nil {
		response.NotFound(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Job retrieved successfully", job)
}

func (ctrl *JobController) CreateJob(c *gin.Context) {
	userIDVal, exists := c.Get(middleware.CtxUserID)
	if !exists {
		response.Unauthorized(c, "Unauthorized")
		return
	}
	userID := userIDVal.(string)

	var job models.Job
	if err := c.ShouldBindJSON(&job); err != nil {
		response.BadRequest(c, "Invalid payload", err.Error())
		return
	}

	createdJob, err := ctrl.jobService.CreateJob(userID, &job)
	if err != nil {
		response.InternalServerError(c, "Failed to create job", err.Error())
		return
	}

	response.Success(c, http.StatusCreated, "Job created successfully", createdJob)
}
