package controllers

import (
	"math"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/workorajobs/backend-go/internal/domain/models"
	"github.com/workorajobs/backend-go/internal/service"
	"github.com/workorajobs/backend-go/pkg/response"
)

type SearchController struct {
	searchService *service.SearchService
}

func NewSearchController(searchService *service.SearchService) *SearchController {
	return &SearchController{searchService: searchService}
}

func (ctrl *SearchController) SearchJobs(c *gin.Context) {
	var filter models.SearchFilterDTO
	if err := c.ShouldBindQuery(&filter); err != nil {
		response.BadRequest(c, "Invalid query parameters", err.Error())
		return
	}

	filter.Page, filter.Limit, _ = response.SanitizePagination(filter.Page, filter.Limit)

	jobs, total, err := ctrl.searchService.SearchJobs(c.Request.Context(), &filter)
	if err != nil {
		response.InternalServerError(c, "Failed to search jobs", err.Error())
		return
	}

	totalPages := int(math.Ceil(float64(total) / float64(filter.Limit)))

	meta := response.PaginationMeta{
		Page:       filter.Page,
		Limit:      filter.Limit,
		TotalItems: total,
		TotalPages: totalPages,
	}

	response.SuccessWithMeta(c, http.StatusOK, "Search results fetched", jobs, meta)
}

func (ctrl *SearchController) Autocomplete(c *gin.Context) {
	q := c.Query("q")
	results, err := ctrl.searchService.Autocomplete(c.Request.Context(), q)
	if err != nil {
		response.InternalServerError(c, "Failed to fetch autocomplete", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Autocomplete suggestions", results)
}

func (ctrl *SearchController) GetTrendingJobs(c *gin.Context) {
	jobs, err := ctrl.searchService.GetTrendingJobs(c.Request.Context())
	if err != nil {
		response.InternalServerError(c, "Failed to fetch trending jobs", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Trending jobs fetched", jobs)
}

func (ctrl *SearchController) GetSimilarJobs(c *gin.Context) {
	jobID := c.Param("id")
	jobs, err := ctrl.searchService.GetSimilarJobs(c.Request.Context(), jobID)
	if err != nil {
		response.NotFound(c, "Similar jobs not found")
		return
	}

	response.Success(c, http.StatusOK, "Similar jobs fetched", jobs)
}
