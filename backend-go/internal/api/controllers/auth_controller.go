package controllers

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/workorajobs/backend-go/internal/api/middleware"
	"github.com/workorajobs/backend-go/internal/service"
	"github.com/workorajobs/backend-go/pkg/response"
)

type AuthController struct {
	authService *service.AuthService
}

func NewAuthController(authService *service.AuthService) *AuthController {
	return &AuthController{authService: authService}
}

func (ctrl *AuthController) Register(c *gin.Context) {
	var dto service.RegisterDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		response.BadRequest(c, "Invalid payload", err.Error())
		return
	}

	res, err := ctrl.authService.Register(&dto)
	if err != nil {
		if errors.Is(err, service.ErrInvalidRegistrationRole) {
			response.Forbidden(c, err.Error())
			return
		}
		response.BadRequest(c, err.Error(), nil)
		return
	}

	response.Success(c, http.StatusCreated, "User registered successfully", res)
}

func (ctrl *AuthController) Login(c *gin.Context) {
	var dto service.LoginDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		response.BadRequest(c, "Invalid payload", err.Error())
		return
	}

	res, err := ctrl.authService.Login(&dto)
	if err != nil {
		response.Unauthorized(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Login successful", res)
}

func (ctrl *AuthController) Refresh(c *gin.Context) {
	var dto service.RefreshTokenDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		response.BadRequest(c, "Invalid refresh payload", err.Error())
		return
	}

	res, err := ctrl.authService.Refresh(&dto)
	if err != nil {
		response.Unauthorized(c, "Invalid or expired refresh token")
		return
	}

	response.Success(c, http.StatusOK, "Token refreshed successfully", res)
}

func (ctrl *AuthController) Logout(c *gin.Context) {
	var dto service.LogoutDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		response.BadRequest(c, "Invalid logout payload", err.Error())
		return
	}

	if err := ctrl.authService.Logout(&dto); err != nil {
		response.Unauthorized(c, "Invalid or expired refresh token")
		return
	}

	response.Success(c, http.StatusOK, "Logged out successfully", nil)
}

func (ctrl *AuthController) Me(c *gin.Context) {
	userID, _ := c.Get(middleware.CtxUserID)
	email, _ := c.Get(middleware.CtxUserEmail)
	role, _ := c.Get(middleware.CtxUserRole)

	response.Success(c, http.StatusOK, "User details fetched", gin.H{
		"userId": userID,
		"email":  email,
		"role":   role,
	})
}
