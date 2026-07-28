package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/workorajobs/backend-go/internal/api/controllers"
	"github.com/workorajobs/backend-go/internal/api/middleware"
	"github.com/workorajobs/backend-go/internal/config"
	"github.com/workorajobs/backend-go/internal/service"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

func SetupRouter(cfg *config.Config, db *gorm.DB, log *zap.Logger) *gin.Engine {
	if cfg.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.New()

	// Global Middlewares
	r.Use(gin.Recovery())
	r.Use(middleware.ZapLogger(log))
	r.Use(middleware.CORSMiddleware(cfg.CORSOrigins))
	r.Use(middleware.SecurityHeadersMiddleware())
	r.Use(middleware.GzipMiddleware())

	// Prometheus Metrics
	r.GET("/metrics", gin.WrapH(promhttp.Handler()))

	// Services
	authService := service.NewAuthService(db, cfg)
	jobService := service.NewJobService(db)

	// Controllers
	healthCtrl := controllers.NewHealthController(db)
	authCtrl := controllers.NewAuthController(authService)
	jobCtrl := controllers.NewJobController(jobService)

	// Health Endpoints
	healthGroup := r.Group("/api/v1/health")
	{
		healthGroup.GET("/liveness", healthCtrl.Liveness)
		healthGroup.GET("/readiness", healthCtrl.Readiness)
	}

	// Auth Endpoints
	authGroup := r.Group("/api/v1/auth")
	{
		authGroup.POST("/register", authCtrl.Register)
		authGroup.POST("/login", authCtrl.Login)
		authGroup.GET("/me", middleware.AuthMiddleware(cfg.JWTAccessSecret), authCtrl.Me)
	}

	// Job Endpoints
	jobGroup := r.Group("/api/v1/jobs")
	{
		jobGroup.GET("", jobCtrl.ListJobs)
		jobGroup.GET("/:id", jobCtrl.GetJobByID)
		jobGroup.POST("", middleware.AuthMiddleware(cfg.JWTAccessSecret), middleware.RequireRoles("EMPLOYER", "RECRUITER", "ADMIN"), jobCtrl.CreateJob)
	}

	return r
}
