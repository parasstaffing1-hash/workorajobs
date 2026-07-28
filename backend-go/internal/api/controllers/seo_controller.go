package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/workorajobs/backend-go/internal/service"
	"github.com/workorajobs/backend-go/pkg/response"
)

type SeoController struct {
	seoService *service.SeoService
	jobService *service.JobService
}

func NewSeoController(seoService *service.SeoService, jobService *service.JobService) *SeoController {
	return &SeoController{
		seoService: seoService,
		jobService: jobService,
	}
}

// GetMetadata returns computed metadata, canonical URL, OpenGraph, and Twitter card tags
func (sc *SeoController) GetMetadata(c *gin.Context) {
	title := c.Query("title")
	description := c.Query("description")
	path := c.Query("path")
	pageStr := c.DefaultQuery("page", "1")

	page, _ := strconv.Atoi(pageStr)
	if page < 1 {
		page = 1
	}

	metadata := sc.seoService.GenerateMetadata(title, description, path, page)
	response.Success(c, http.StatusOK, "Metadata computed successfully", metadata)
}

// GetJobPostingSchema returns JobPosting JSON-LD schema by job ID
func (sc *SeoController) GetJobPostingSchema(c *gin.Context) {
	jobID := c.Param("id")
	if jobID == "" {
		response.Error(c, http.StatusBadRequest, "Job ID is required", "INVALID_JOB_ID")
		return
	}

	job, err := sc.jobService.GetJobByID(jobID)
	if err != nil || job == nil {
		response.Error(c, http.StatusNotFound, "Job not found", "JOB_NOT_FOUND")
		return
	}

	schemaJSON, err := sc.seoService.GenerateJobPostingSchema(job)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to generate job posting schema", "SCHEMA_GEN_ERROR")
		return
	}

	c.Header("Content-Type", "application/ld+json; charset=utf-8")
	c.String(http.StatusOK, schemaJSON)
}

// GetOrganizationSchema returns Organization JSON-LD schema
func (sc *SeoController) GetOrganizationSchema(c *gin.Context) {
	schemaJSON, err := sc.seoService.GenerateOrganizationSchema()
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to generate organization schema", "SCHEMA_GEN_ERROR")
		return
	}

	c.Header("Content-Type", "application/ld+json; charset=utf-8")
	c.String(http.StatusOK, schemaJSON)
}

// GetFAQSchema returns FAQPage JSON-LD schema
func (sc *SeoController) GetFAQSchema(c *gin.Context) {
	schemaJSON, err := sc.seoService.GenerateFAQSchema(nil)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to generate FAQ schema", "SCHEMA_GEN_ERROR")
		return
	}

	c.Header("Content-Type", "application/ld+json; charset=utf-8")
	c.String(http.StatusOK, schemaJSON)
}

// GetBreadcrumbSchema returns BreadcrumbList JSON-LD schema
func (sc *SeoController) GetBreadcrumbSchema(c *gin.Context) {
	schemaJSON, err := sc.seoService.GenerateBreadcrumbSchema(nil)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to generate breadcrumb schema", "SCHEMA_GEN_ERROR")
		return
	}

	c.Header("Content-Type", "application/ld+json; charset=utf-8")
	c.String(http.StatusOK, schemaJSON)
}

// GetRobotsTxt returns dynamic robots.txt file
func (sc *SeoController) GetRobotsTxt(c *gin.Context) {
	isProd := c.DefaultQuery("env", "production") == "production"
	robotsTxt := sc.seoService.GenerateRobotsTxt(isProd)

	c.Header("Content-Type", "text/plain; charset=utf-8")
	c.String(http.StatusOK, robotsTxt)
}
