package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/workorajobs/backend-go/internal/service"
	"github.com/workorajobs/backend-go/pkg/response"
)

type AiMetadataController struct {
	aiService *service.AiMetadataService
}

func NewAiMetadataController(aiService *service.AiMetadataService) *AiMetadataController {
	return &AiMetadataController{aiService: aiService}
}

type GenerateRequest struct {
	EntityID string `json:"entityId" binding:"required"`
	Title    string `json:"title" binding:"required"`
	Location string `json:"location"`
}

type RollbackRequest struct {
	EntityID      string `json:"entityId" binding:"required"`
	TargetVersion int    `json:"targetVersion" binding:"required"`
}

type BulkGenerateRequest struct {
	EntityIDs []string `json:"entityIds" binding:"required"`
}

// GenerateMetadata handles single AI metadata generation pipeline request
func (ac *AiMetadataController) GenerateMetadata(c *gin.Context) {
	var req GenerateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid request payload", err.Error())
		return
	}

	pkg := ac.aiService.GenerateMetadataPackage(req.EntityID, req.Title, req.Location)
	response.Success(c, http.StatusOK, "AI metadata package generated successfully", pkg)
}

// GetVersions lists metadata history for an entity
func (ac *AiMetadataController) GetVersions(c *gin.Context) {
	entityID := c.Query("entityId")
	if entityID == "" {
		response.Error(c, http.StatusBadRequest, "entityId query parameter is required", "ENTITY_ID_REQUIRED")
		return
	}

	versions := ac.aiService.GetVersions(entityID)
	response.Success(c, http.StatusOK, "Metadata version history fetched successfully", versions)
}

// RollbackVersion rolls back metadata to specified version
func (ac *AiMetadataController) RollbackVersion(c *gin.Context) {
	var req RollbackRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid rollback payload", err.Error())
		return
	}

	rolledBackPkg, err := ac.aiService.RollbackVersion(req.EntityID, req.TargetVersion)
	if err != nil {
		response.Error(c, http.StatusNotFound, err.Error(), "ROLLBACK_FAILED")
		return
	}

	response.Success(c, http.StatusOK, "Metadata successfully rolled back", rolledBackPkg)
}

// BulkGenerate metadata for multiple entity IDs
func (ac *AiMetadataController) BulkGenerate(c *gin.Context) {
	var req BulkGenerateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid bulk generate payload", err.Error())
		return
	}

	count := ac.aiService.BulkRegenerate(req.EntityIDs)
	response.Success(c, http.StatusOK, "Bulk metadata regeneration queued successfully", gin.H{
		"processedCount": count,
		"message":        strconv.Itoa(count) + " entities processed",
	})
}
