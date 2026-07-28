package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/workorajobs/backend-go/internal/domain/models"
	"github.com/workorajobs/backend-go/internal/service"
	"github.com/workorajobs/backend-go/pkg/response"
)

type UniversalSearchController struct {
	searchService *service.UniversalSearchService
}

func NewUniversalSearchController(searchService *service.UniversalSearchService) *UniversalSearchController {
	return &UniversalSearchController{searchService: searchService}
}

func (ctrl *UniversalSearchController) Search(c *gin.Context) {
	var input models.UniversalSearchQueryDTO
	if err := c.ShouldBindQuery(&input); err != nil {
		response.BadRequest(c, "Search query is required", err.Error())
		return
	}

	input.Page, input.Limit, _ = response.SanitizePagination(input.Page, input.Limit)

	result, err := ctrl.searchService.Search(c.Request.Context(), &input)
	if err != nil {
		response.InternalServerError(c, "Search failed", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Universal search results", result)
}

func (ctrl *UniversalSearchController) Autocomplete(c *gin.Context) {
	q := c.Query("q")
	if q == "" {
		response.BadRequest(c, "Query parameter 'q' is required", "")
		return
	}

	result, err := ctrl.searchService.Autocomplete(c.Request.Context(), q)
	if err != nil {
		response.InternalServerError(c, "Autocomplete failed", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Autocomplete suggestions", result)
}

func (ctrl *UniversalSearchController) TrendingSearches(c *gin.Context) {
	trending, err := ctrl.searchService.GetTrendingSearches(c.Request.Context())
	if err != nil {
		response.InternalServerError(c, "Failed to fetch trending searches", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Trending searches fetched", trending)
}
