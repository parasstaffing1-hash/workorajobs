package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/workorajobs/backend-go/internal/api/middleware"
	"github.com/workorajobs/backend-go/internal/storage"
	"github.com/workorajobs/backend-go/pkg/response"
)

type UploadController struct {
	s3Service *storage.S3Service
}

func NewUploadController(s3Service *storage.S3Service) *UploadController {
	return &UploadController{s3Service: s3Service}
}

func (ctrl *UploadController) PresignUpload(c *gin.Context) {
	userID := c.GetString(middleware.CtxUserID)
	role := c.GetString(middleware.CtxUserRole)
	if userID == "" {
		response.Unauthorized(c, "Authentication required: user context missing")
		return
	}

	var req storage.PresignUploadRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid presign upload payload", err.Error())
		return
	}

	res, err := ctrl.s3Service.GeneratePresignedUpload(c.Request.Context(), &req, userID, role)
	if err != nil {
		if err == storage.ErrInvalidMimeType || err == storage.ErrFileTooLarge || err == storage.ErrInvalidPurpose || err == storage.ErrTargetIDRequired {
			response.BadRequest(c, err.Error(), "")
			return
		}
		if err == storage.ErrUnauthorizedAccess {
			response.Forbidden(c, "Forbidden: you do not have permission to manage this company's assets")
			return
		}
		response.InternalServerError(c, "Failed to generate presigned upload URL", err.Error())
		return
	}

	c.JSON(http.StatusOK, res)
}

func (ctrl *UploadController) PresignDownload(c *gin.Context) {
	userID := c.GetString(middleware.CtxUserID)
	role := c.GetString(middleware.CtxUserRole)
	if userID == "" {
		response.Unauthorized(c, "Authentication required: user context missing")
		return
	}

	key := c.Query("key")
	if key == "" {
		response.BadRequest(c, "Query parameter 'key' is required", "")
		return
	}

	url, err := ctrl.s3Service.GeneratePresignedDownload(c.Request.Context(), key, userID, role)
	if err != nil {
		if err == storage.ErrUnauthorizedAccess {
			response.Forbidden(c, "Forbidden: unauthorized to access this object")
			return
		}
		response.InternalServerError(c, "Failed to generate presigned download URL", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Presigned download URL generated", gin.H{
		"downloadUrl": url,
		"key":         key,
	})
}

func (ctrl *UploadController) DeleteObject(c *gin.Context) {
	userID := c.GetString(middleware.CtxUserID)
	role := c.GetString(middleware.CtxUserRole)
	if userID == "" {
		response.Unauthorized(c, "Authentication required: user context missing")
		return
	}

	var req storage.DeleteObjectRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid delete payload; 'key' is required", err.Error())
		return
	}

	if err := ctrl.s3Service.DeleteObject(c.Request.Context(), req.Key, userID, role); err != nil {
		if err == storage.ErrUnauthorizedAccess {
			response.Forbidden(c, "Forbidden: unauthorized to delete this object")
			return
		}
		response.InternalServerError(c, "Failed to delete storage object", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Object deleted successfully", gin.H{"key": req.Key})
}
