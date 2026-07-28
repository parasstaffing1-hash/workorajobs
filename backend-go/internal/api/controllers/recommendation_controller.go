package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/workorajobs/backend-go/internal/domain/models"
	"github.com/workorajobs/backend-go/internal/service"
	"github.com/workorajobs/backend-go/pkg/response"
)

type RecommendationController struct {
	recommendationService *service.RecommendationService
}

func NewRecommendationController(recommendationService *service.RecommendationService) *RecommendationController {
	return &RecommendationController{recommendationService: recommendationService}
}

func (ctrl *RecommendationController) GetHybridRecommendations(c *gin.Context) {
	var profile models.UserProfileVector
	if err := c.ShouldBindJSON(&profile); err != nil {
		response.BadRequest(c, "Invalid user profile", err.Error())
		return
	}

	results, err := ctrl.recommendationService.HybridRecommendations(c.Request.Context(), &profile, 20)
	if err != nil {
		response.InternalServerError(c, "Failed to generate recommendations", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Recommendations generated", results)
}

func (ctrl *RecommendationController) PredictSalary(c *gin.Context) {
	var input models.SalaryPredictionInputDTO
	if err := c.ShouldBindJSON(&input); err != nil {
		response.BadRequest(c, "Invalid salary prediction input", err.Error())
		return
	}

	result, err := ctrl.recommendationService.PredictSalary(c.Request.Context(), &input)
	if err != nil {
		response.InternalServerError(c, "Failed to predict salary", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Salary prediction computed", result)
}

func (ctrl *RecommendationController) MatchResume(c *gin.Context) {
	var input models.ResumeMatchInputDTO
	if err := c.ShouldBindJSON(&input); err != nil {
		response.BadRequest(c, "Invalid resume match input", err.Error())
		return
	}

	result, err := ctrl.recommendationService.ComputeResumeMatchScore(c.Request.Context(), &input)
	if err != nil {
		response.InternalServerError(c, "Failed to compute resume match", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Resume match score computed", result)
}
