package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
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
	var req storage.PresignUploadRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid presign upload payload", err.Error())
		return
	}

	userID := c.GetString("userId")
	if userID == "" {
		userID = c.GetString("userID")
	}
	if userID == "" {
		userID = "anonymous_user"
	}
	role := c.GetString("role")

	res, err := ctrl.s3Service.GeneratePresignedUpload(c.Request.Context(), &req, userID, role)
	if err != nil {
		if err == storage.ErrInvalidMimeType || err == storage.ErrFileTooLarge || err == storage.ErrInvalidPurpose {
			response.BadRequest(c, err.Error(), "")
			return
		}
		response.InternalServerError(c, "Failed to generate presigned upload URL", err.Error())
		return
	}

	c.JSON(http.StatusOK, res)
}

func (ctrl *UploadController) PresignDownload(c *gin.Context) {
	key := c.Query("key")
	if key == "" {
		response.BadRequest(c, "Query parameter 'key' is required", "")
		return
	}

	userID := c.GetString("userId")
	if userID == "" {
		userID = c.GetString("userID")
	}
	if userID == "" {
		userID = "anonymous_user"
	}
	role := c.GetString("role")

	url, err := ctrl.s3Service.GeneratePresignedDownload(c.Request.Context(), key, userID, role)
	if err != nil {
		if err == storage.ErrUnauthorizedAccess {
			response.Unauthorized(c, "Unauthorized to access this object")
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
	var req storage.DeleteObjectRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid delete payload; 'key' is required", err.Error())
		return
	}

	userID := c.GetString("userId")
	if userID == "" {
		userID = c.GetString("userID")
	}
	if userID == "" {
		userID = "anonymous_user"
	}
	role := c.GetString("role")

	if err := ctrl.s3Service.DeleteObject(c.Request.Context(), req.Key, userID, role); err != nil {
		if err == storage.ErrUnauthorizedAccess {
			response.Unauthorized(c, "Unauthorized to delete this object")
			return
		}
		response.InternalServerError(c, "Failed to delete storage object", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Object deleted successfully", gin.H{"key": req.Key})
}
