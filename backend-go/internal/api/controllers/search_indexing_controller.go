package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/workorajobs/backend-go/internal/service"
	"github.com/workorajobs/backend-go/pkg/response"
)

type SearchIndexingController struct {
	indexingService *service.SearchIndexingService
}

func NewSearchIndexingController(indexingService *service.SearchIndexingService) *SearchIndexingController {
	return &SearchIndexingController{indexingService: indexingService}
}

type TriggerIndexingRequest struct {
	URL        string                 `json:"url" binding:"required"`
	EntityType string                 `json:"entityType" binding:"required"`
	Action     service.IndexingAction `json:"action" binding:"required"`
	Priority   int                    `json:"priority"`
}

// GetDashboard returns real-time indexing monitoring stats
func (ic *SearchIndexingController) GetDashboard(c *gin.Context) {
	metrics := ic.indexingService.GetDashboardMetrics()
	response.Success(c, http.StatusOK, "Search indexing monitoring dashboard fetched", metrics)
}

// TriggerJob manually queues an indexing job
func (ic *SearchIndexingController) TriggerJob(c *gin.Context) {
	var req TriggerIndexingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid indexing trigger payload", err.Error())
		return
	}

	if req.Priority == 0 {
		req.Priority = 2
	}

	job := ic.indexingService.QueueJob(req.URL, req.EntityType, req.Action, req.Priority)
	success, failed := ic.indexingService.ProcessBatchQueue(10)

	response.Success(c, http.StatusOK, "Indexing job triggered successfully", gin.H{
		"job":     job,
		"success": success,
		"failed":  failed,
	})
}

// RetryFailed triggers retry of failed items
func (ic *SearchIndexingController) RetryFailed(c *gin.Context) {
	retriedCount := ic.indexingService.ExecuteRetryBackoff()
	success, failed := ic.indexingService.ProcessBatchQueue(50)

	response.Success(c, http.StatusOK, "Failed indexing jobs retry processed", gin.H{
		"retried": retriedCount,
		"success": success,
		"failed":  failed,
	})
}

// GetQueue lists active pending indexing jobs
func (ic *SearchIndexingController) GetQueue(c *gin.Context) {
	queue := ic.indexingService.GetQueue()
	response.Success(c, http.StatusOK, "Pending indexing queue fetched", queue)
}
