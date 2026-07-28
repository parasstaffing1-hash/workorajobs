package controllers

import (
	"fmt"
	"math"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/workorajobs/backend-go/internal/domain/models"
	"github.com/workorajobs/backend-go/internal/service"
	"github.com/workorajobs/backend-go/pkg/response"
)

type WalkinController struct {
	walkinService *service.WalkinService
}

func NewWalkinController(walkinService *service.WalkinService) *WalkinController {
	return &WalkinController{walkinService: walkinService}
}

func (ctrl *WalkinController) SearchWalkins(c *gin.Context) {
	var filter models.WalkinFilterDTO
	if err := c.ShouldBindQuery(&filter); err != nil {
		response.BadRequest(c, "Invalid query parameters", err.Error())
		return
	}

	filter.Page, filter.Limit, _ = response.SanitizePagination(filter.Page, filter.Limit)

	walkins, total, err := ctrl.walkinService.SearchWalkins(c.Request.Context(), &filter)
	if err != nil {
		response.InternalServerError(c, "Failed to search walk-in drives", err.Error())
		return
	}

	totalPages := int(math.Ceil(float64(total) / float64(filter.Limit)))

	meta := response.PaginationMeta{
		Page:       filter.Page,
		Limit:      filter.Limit,
		TotalItems: total,
		TotalPages: totalPages,
	}

	response.SuccessWithMeta(c, http.StatusOK, "Walk-in drives fetched successfully", walkins, meta)
}

func (ctrl *WalkinController) DownloadCalendar(c *gin.Context) {
	walkinID := c.Param("id")
	icsContent, err := ctrl.walkinService.GenerateICalendar(c.Request.Context(), walkinID)
	if err != nil {
		response.NotFound(c, "Walk-in drive not found")
		return
	}

	c.Header("Content-Type", "text/calendar")
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=walkin-%s.ics", walkinID))
	c.String(http.StatusOK, icsContent)
}

func (ctrl *WalkinController) SetReminder(c *gin.Context) {
	var req models.WalkinReminderDTO
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid reminder request", err.Error())
		return
	}

	if err := ctrl.walkinService.SetReminder(c.Request.Context(), &req); err != nil {
		response.InternalServerError(c, "Failed to schedule reminder", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Walk-in reminder scheduled successfully", nil)
}

func (ctrl *WalkinController) ResolveSeoPage(c *gin.Context) {
	slug := c.Param("slug")
	seoPage, err := ctrl.walkinService.ResolveSeoPage(c.Request.Context(), slug)
	if err != nil {
		response.NotFound(c, "SEO page not found")
		return
	}

	response.Success(c, http.StatusOK, "Walk-in SEO page metadata fetched", seoPage)
}
