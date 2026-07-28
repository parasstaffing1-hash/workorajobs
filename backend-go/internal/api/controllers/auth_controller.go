package controllers

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/workorajobs/backend-go/internal/api/middleware"
	"github.com/workorajobs/backend-go/internal/config"
	"github.com/workorajobs/backend-go/internal/service"
	"github.com/workorajobs/backend-go/pkg/response"
)

type AuthController struct {
	authService *service.AuthService
	cfg         *config.Config
	httpClient  *http.Client
}

func NewAuthController(authService *service.AuthService, cfg *config.Config) *AuthController {
	return &AuthController{
		authService: authService,
		cfg:         cfg,
		httpClient:  &http.Client{Timeout: 10 * time.Second},
	}
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

func (ctrl *AuthController) RequestEmailVerification(c *gin.Context) {
	var dto service.RequestEmailVerificationDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		response.BadRequest(c, "Invalid email verification payload", err.Error())
		return
	}

	_, err := ctrl.authService.RequestEmailVerification(&dto)
	if err != nil {
		response.InternalServerError(c, "Failed to request email verification", nil)
		return
	}

	response.Success(c, http.StatusOK, "If the account exists and is unverified, verification instructions will be sent.", nil)
}

func (ctrl *AuthController) VerifyEmail(c *gin.Context) {
	var dto service.VerifyEmailDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		response.BadRequest(c, "Invalid email verification payload", err.Error())
		return
	}

	if err := ctrl.authService.VerifyEmail(&dto); err != nil {
		response.BadRequest(c, "Invalid or expired email verification token", nil)
		return
	}

	response.Success(c, http.StatusOK, "Email verified successfully", nil)
}

func (ctrl *AuthController) RequestPasswordReset(c *gin.Context) {
	var dto service.RequestPasswordResetDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		response.BadRequest(c, "Invalid password reset payload", err.Error())
		return
	}

	_, err := ctrl.authService.RequestPasswordReset(&dto)
	if err != nil {
		response.InternalServerError(c, "Failed to request password reset", nil)
		return
	}

	response.Success(c, http.StatusOK, "If the account exists, password reset instructions will be sent.", nil)
}

func (ctrl *AuthController) ResetPassword(c *gin.Context) {
	var dto service.ResetPasswordDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		response.BadRequest(c, "Invalid password reset payload", err.Error())
		return
	}

	if err := ctrl.authService.ResetPassword(&dto); err != nil {
		response.BadRequest(c, "Invalid or expired password reset token", nil)
		return
	}

	response.Success(c, http.StatusOK, "Password reset successfully", nil)
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

func (ctrl *AuthController) StartOAuth(c *gin.Context) {
	provider := strings.ToLower(c.Param("provider"))
	clientID, _, callbackURL, authURL, scope, ok := ctrl.oauthProviderConfig(provider)
	if !ok {
		response.NotFound(c, "Unsupported OAuth provider")
		return
	}
	if clientID == "" || callbackURL == "" {
		response.Error(c, http.StatusServiceUnavailable, "OAuth provider is not configured", nil)
		return
	}

	state, err := randomURLToken(32)
	if err != nil {
		response.InternalServerError(c, "Failed to initialize OAuth", nil)
		return
	}
	c.SetCookie("workora_oauth_state_"+provider, state, 600, "/api/v1/auth/oauth", "", ctrl.cfg.Environment == "production", true)

	u, _ := url.Parse(authURL)
	q := u.Query()
	q.Set("client_id", clientID)
	q.Set("redirect_uri", callbackURL)
	q.Set("response_type", "code")
	q.Set("scope", scope)
	q.Set("state", state)
	if provider == "google" {
		q.Set("access_type", "offline")
		q.Set("prompt", "select_account")
	}
	u.RawQuery = q.Encode()
	c.Redirect(http.StatusFound, u.String())
}

func (ctrl *AuthController) OAuthCallback(c *gin.Context) {
	provider := strings.ToLower(c.Param("provider"))
	clientID, clientSecret, callbackURL, _, _, ok := ctrl.oauthProviderConfig(provider)
	if !ok {
		response.NotFound(c, "Unsupported OAuth provider")
		return
	}
	if clientID == "" || clientSecret == "" || callbackURL == "" {
		response.Error(c, http.StatusServiceUnavailable, "OAuth provider is not configured", nil)
		return
	}

	expectedState, err := c.Cookie("workora_oauth_state_" + provider)
	c.SetCookie("workora_oauth_state_"+provider, "", -1, "/api/v1/auth/oauth", "", ctrl.cfg.Environment == "production", true)
	if err != nil || expectedState == "" || !constantTimeEqual(expectedState, c.Query("state")) {
		response.BadRequest(c, "Invalid or expired OAuth state", nil)
		return
	}
	if c.Query("error") != "" {
		response.BadRequest(c, "OAuth provider returned an error", nil)
		return
	}
	code := strings.TrimSpace(c.Query("code"))
	if code == "" {
		response.BadRequest(c, "OAuth callback code is required", nil)
		return
	}

	token, err := ctrl.exchangeOAuthCode(c, provider, clientID, clientSecret, callbackURL, code)
	if err != nil {
		response.BadRequest(c, "OAuth token exchange failed", nil)
		return
	}
	profile, err := ctrl.fetchOAuthProfile(c, provider, token.AccessToken)
	if err != nil {
		response.BadRequest(c, "OAuth profile lookup failed", nil)
		return
	}

	authResp, err := ctrl.authService.AuthenticateOAuth(profile)
	if err != nil {
		response.BadRequest(c, "OAuth authentication failed", nil)
		return
	}

	redirectURL := strings.TrimRight(ctrl.cfg.AppURL, "/") + "/candidate/dashboard"
	c.SetCookie("workora_access_token", authResp.AccessToken, 15*60, "/", "", ctrl.cfg.Environment == "production", true)
	c.SetCookie("workora_refresh_token", authResp.RefreshToken, 30*24*60*60, "/", "", ctrl.cfg.Environment == "production", true)
	c.Redirect(http.StatusFound, redirectURL)
}

func (ctrl *AuthController) oauthProviderConfig(provider string) (clientID, clientSecret, callbackURL, authURL, scope string, ok bool) {
	switch provider {
	case "google":
		callback := strings.TrimSpace(ctrl.cfg.GoogleCallbackURL)
		if callback == "" && ctrl.cfg.AppURL != "" {
			callback = strings.TrimRight(ctrl.cfg.AppURL, "/") + "/api/v1/auth/oauth/google/callback"
		}
		return ctrl.cfg.GoogleClientID, ctrl.cfg.GoogleClientSecret, callback, "https://accounts.google.com/o/oauth2/v2/auth", "openid email profile", true
	case "linkedin":
		callback := strings.TrimSpace(ctrl.cfg.LinkedInCallbackURL)
		if callback == "" && ctrl.cfg.AppURL != "" {
			callback = strings.TrimRight(ctrl.cfg.AppURL, "/") + "/api/v1/auth/oauth/linkedin/callback"
		}
		return ctrl.cfg.LinkedInClientID, ctrl.cfg.LinkedInClientSecret, callback, "https://www.linkedin.com/oauth/v2/authorization", "openid profile email", true
	default:
		return "", "", "", "", "", false
	}
}

type oauthTokenResponse struct {
	AccessToken string `json:"access_token"`
	TokenType   string `json:"token_type"`
	ExpiresIn   int    `json:"expires_in"`
	Scope       string `json:"scope"`
}

func (ctrl *AuthController) exchangeOAuthCode(c *gin.Context, provider, clientID, clientSecret, callbackURL, code string) (*oauthTokenResponse, error) {
	tokenURL := "https://oauth2.googleapis.com/token"
	if provider == "linkedin" {
		tokenURL = "https://www.linkedin.com/oauth/v2/accessToken"
	}
	form := url.Values{}
	form.Set("grant_type", "authorization_code")
	form.Set("code", code)
	form.Set("redirect_uri", callbackURL)
	form.Set("client_id", clientID)
	form.Set("client_secret", clientSecret)

	req, err := http.NewRequestWithContext(c.Request.Context(), http.MethodPost, tokenURL, strings.NewReader(form.Encode()))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := ctrl.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		return nil, fmt.Errorf("token endpoint returned status %d", resp.StatusCode)
	}
	var token oauthTokenResponse
	if err := json.NewDecoder(io.LimitReader(resp.Body, 1<<20)).Decode(&token); err != nil {
		return nil, err
	}
	if token.AccessToken == "" {
		return nil, errors.New("provider did not return access token")
	}
	return &token, nil
}

type providerUserInfo struct {
	Sub           string `json:"sub"`
	ID            string `json:"id"`
	Email         string `json:"email"`
	EmailVerified bool   `json:"email_verified"`
	Name          string `json:"name"`
	Picture       string `json:"picture"`
}

func (ctrl *AuthController) fetchOAuthProfile(c *gin.Context, provider, accessToken string) (*service.OAuthProfile, error) {
	profileURL := "https://openidconnect.googleapis.com/v1/userinfo"
	if provider == "linkedin" {
		profileURL = "https://api.linkedin.com/v2/userinfo"
	}
	req, err := http.NewRequestWithContext(c.Request.Context(), http.MethodGet, profileURL, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+accessToken)

	resp, err := ctrl.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		return nil, fmt.Errorf("userinfo endpoint returned status %d", resp.StatusCode)
	}
	var info providerUserInfo
	if err := json.NewDecoder(io.LimitReader(resp.Body, 1<<20)).Decode(&info); err != nil {
		return nil, err
	}
	providerAccountID := info.Sub
	if providerAccountID == "" {
		providerAccountID = info.ID
	}
	if info.Email == "" || providerAccountID == "" {
		return nil, service.ErrInvalidOAuthProfile
	}
	if provider == "google" && !info.EmailVerified {
		return nil, service.ErrInvalidOAuthProfile
	}
	return &service.OAuthProfile{
		Provider:          provider,
		ProviderAccountID: providerAccountID,
		Email:             info.Email,
		Name:              info.Name,
		Picture:           info.Picture,
	}, nil
}

func randomURLToken(size int) (string, error) {
	raw := make([]byte, size)
	if _, err := rand.Read(raw); err != nil {
		return "", err
	}
	return base64.RawURLEncoding.EncodeToString(raw), nil
}

func constantTimeEqual(a, b string) bool {
	if len(a) != len(b) {
		return false
	}
	var result byte
	for i := 0; i < len(a); i++ {
		result |= a[i] ^ b[i]
	}
	return result == 0
}
