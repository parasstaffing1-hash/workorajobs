package routes

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/workorajobs/backend-go/internal/api/controllers"
	"github.com/workorajobs/backend-go/internal/api/middleware"
	"github.com/workorajobs/backend-go/internal/config"
	"github.com/workorajobs/backend-go/internal/service"
	"github.com/workorajobs/backend-go/internal/storage"
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

	if cfg.Environment != "production" || cfg.MetricsBearerToken != "" {
		r.GET("/metrics", middleware.MetricsAuthMiddleware(cfg.MetricsBearerToken), gin.WrapH(promhttp.Handler()))
	}

	// Services
	authService := service.NewAuthService(db, cfg)
	jobService := service.NewJobService(db)
	searchService := service.NewSearchService(db, nil)
	remoteService := service.NewRemoteService(db)
	internshipService := service.NewInternshipService(db)
	freshersService := service.NewFreshersService(db)
	govtService := service.NewGovtService(db)
	walkinService := service.NewWalkinService(db)
	startupService := service.NewStartupService(db)
	wfhService := service.NewWFHService(db)
	visaService := service.NewVisaService(db)
	salaryService := service.NewSalaryService(db)
	recommendationService := service.NewRecommendationService(db)
	universalSearchService := service.NewUniversalSearchService(db)

	var s3Service *storage.S3Service
	if cfg.EnableS3Uploads || cfg.S3Bucket != "" {
		var err error
		s3Service, err = storage.NewS3Service(cfg, log, db)
		if err != nil {
			if cfg.Environment == "production" && cfg.EnableS3Uploads {
				log.Fatal("Failed to initialize S3 storage service in production", zap.Error(err))
			} else {
				log.Warn("S3 storage service disabled: invalid configuration", zap.Error(err))
			}
		}
	}

	// Controllers
	healthCtrl := controllers.NewHealthController(db)
	authCtrl := controllers.NewAuthController(authService)
	jobCtrl := controllers.NewJobController(jobService)
	searchCtrl := controllers.NewSearchController(searchService)
	remoteCtrl := controllers.NewRemoteController(remoteService)
	internshipCtrl := controllers.NewInternshipController(internshipService)
	freshersCtrl := controllers.NewFreshersController(freshersService)
	govtCtrl := controllers.NewGovtController(govtService)
	walkinCtrl := controllers.NewWalkinController(walkinService)
	startupCtrl := controllers.NewStartupController(startupService)
	wfhCtrl := controllers.NewWFHController(wfhService)
	visaCtrl := controllers.NewVisaController(visaService)
	salaryCtrl := controllers.NewSalaryController(salaryService)
	recommendationCtrl := controllers.NewRecommendationController(recommendationService)
	universalSearchCtrl := controllers.NewUniversalSearchController(universalSearchService)
	var uploadCtrl *controllers.UploadController
	if s3Service != nil {
		uploadCtrl = controllers.NewUploadController(s3Service)
	}

	// Health Endpoints
	healthGroup := r.Group("/api/v1/health")
	{
		healthGroup.GET("/liveness", healthCtrl.Liveness)
		healthGroup.GET("/readiness", healthCtrl.Readiness)
	}

	// Universal Search Endpoints
	uSearchGroup := r.Group("/api/v1/universal-search")
	{
		uSearchGroup.GET("", universalSearchCtrl.Search)
		uSearchGroup.GET("/autocomplete", universalSearchCtrl.Autocomplete)
		uSearchGroup.GET("/trending", universalSearchCtrl.TrendingSearches)
	}

	// Salary Comparison Endpoints
	salaryGroup := r.Group("/api/v1/salary")
	{
		salaryGroup.GET("/compare", salaryCtrl.CompareSalaries)
		salaryGroup.GET("/chart", salaryCtrl.GetChartData)
	}

	// AI Recommendation Endpoints (Protected & Rate Limited)
	recoGroup := r.Group("/api/v1/recommendations",
		middleware.AuthMiddleware(cfg.JWTAccessSecret),
		middleware.RateLimitMiddleware(30, time.Minute),
	)
	{
		recoGroup.POST("/jobs", recommendationCtrl.GetHybridRecommendations)
		recoGroup.POST("/salary-predict", recommendationCtrl.PredictSalary)
		recoGroup.POST("/resume-match", recommendationCtrl.MatchResume)
	}

	// Work From Home Endpoints
	wfhGroup := r.Group("/api/v1/wfh")
	{
		wfhGroup.GET("/jobs", wfhCtrl.SearchWFHJobs)
		wfhGroup.GET("/seo-page/:slug", wfhCtrl.ResolveSeoPage)
	}

	// Visa Sponsorship Endpoints
	visaGroup := r.Group("/api/v1/visa")
	{
		visaGroup.GET("/jobs", visaCtrl.SearchVisaJobs)
		visaGroup.GET("/seo-page/:slug", visaCtrl.ResolveSeoPage)
	}

	// Startup Job Endpoints
	startupGroup := r.Group("/api/v1/startups")
	{
		startupGroup.GET("", startupCtrl.SearchStartups)
		startupGroup.GET("/profile/:slug", startupCtrl.GetProfileBySlug)
	}

	// Walk-in Job Endpoints
	walkinGroup := r.Group("/api/v1/walkins")
	{
		walkinGroup.GET("", walkinCtrl.SearchWalkins)
		walkinGroup.GET("/:id/calendar.ics", walkinCtrl.DownloadCalendar)
		walkinGroup.POST("/:id/remind", middleware.AuthMiddleware(cfg.JWTAccessSecret), middleware.RateLimitMiddleware(10, time.Minute), walkinCtrl.SetReminder)
		walkinGroup.GET("/seo-page/:slug", walkinCtrl.ResolveSeoPage)
	}

	// Freshers Jobs Endpoints
	freshersGroup := r.Group("/api/v1/freshers")
	{
		freshersGroup.GET("/jobs", freshersCtrl.SearchFresherJobs)
		freshersGroup.GET("/seo-page/:slug", freshersCtrl.ResolveSeoPage)
	}

	// Government Jobs Endpoints
	govtGroup := r.Group("/api/v1/govt")
	{
		govtGroup.GET("/jobs", govtCtrl.SearchGovtJobs)
		govtGroup.GET("/exam-calendar", govtCtrl.GetExamCalendar)
	}

	// Remote Jobs Endpoints
	remoteGroup := r.Group("/api/v1/remote")
	{
		remoteGroup.GET("/jobs", remoteCtrl.SearchRemoteJobs)
		remoteGroup.GET("/seo-page/:slug", remoteCtrl.ResolveSeoPage)
	}

	// Internship Endpoints
	internshipGroup := r.Group("/api/v1/internships")
	{
		internshipGroup.GET("", internshipCtrl.SearchInternships)
		internshipGroup.POST("/recommendations", middleware.AuthMiddleware(cfg.JWTAccessSecret), middleware.RateLimitMiddleware(30, time.Minute), internshipCtrl.GetRecommendations)
	}

	// Search Endpoints
	searchGroup := r.Group("/api/v1/search")
	{
		searchGroup.GET("/jobs", searchCtrl.SearchJobs)
		searchGroup.GET("/autocomplete", searchCtrl.Autocomplete)
		searchGroup.GET("/trending", searchCtrl.GetTrendingJobs)
		searchGroup.GET("/jobs/:id/similar", searchCtrl.GetSimilarJobs)
	}

	// Auth Endpoints
	authGroup := r.Group("/api/v1/auth")
	{
		authGroup.POST("/register", authCtrl.Register)
		authGroup.POST("/login", authCtrl.Login)
		authGroup.GET("/me", middleware.AuthMiddleware(cfg.JWTAccessSecret), authCtrl.Me)
	}

	// Upload Endpoints (S3)
	if uploadCtrl != nil {
		uploadGroup := r.Group("/api/v1/uploads", middleware.AuthMiddleware(cfg.JWTAccessSecret))
		{
			uploadGroup.POST("/presign", uploadCtrl.PresignUpload)
			uploadGroup.GET("/presign-download", uploadCtrl.PresignDownload)
			uploadGroup.DELETE("", uploadCtrl.DeleteObject)
		}
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
