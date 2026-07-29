package routes

import (
	"context"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/redis/go-redis/v9"
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
	paymentService := service.NewPaymentService(cfg)
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

	rdb, redisLimiterReady := initRateLimitRedisClient(cfg, log)
	if cfg.Environment == "production" && cfg.RateLimitBackend == "redis" && !redisLimiterReady {
		log.Fatal("RATE_LIMIT_BACKEND=redis is required in production but Redis is unavailable")
	}

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
	authCtrl := controllers.NewAuthController(authService, cfg)
	paymentCtrl := controllers.NewPaymentController(paymentService)
	jobCtrl := controllers.NewJobController(jobService)
	searchCtrl := controllers.NewSearchController(searchService)
	remoteCtrl := controllers.NewRemoteController(remoteService)
	internshipCtrl := controllers.NewInternshipController(internshipService)
	freshersCtrl := controllers.NewFreshersController(freshersService)
	govtCtrl := controllers.NewGovtController(govtService)
	walkinCtrl := controllers.NewWalkinController(walkinService)
	startupCtrl := controllers.NewStartupController(startupService)
	wfhCtrl := controllers.NewWFHController(wfhService)
	seoService := service.NewSeoServiceWithBaseURL(db, cfg.AppURL)
	sitemapService := service.NewSitemapService(db, cfg.AppURL)
	pseoService := service.NewPseoService(db, seoService, cfg.AppURL)
	linkingService := service.NewInternalLinkingService(db, cfg.AppURL)
	aiMetadataService := service.NewAiMetadataService(db, cfg.AppURL)
	seoContentService := service.NewSeoContentService(db, seoService, linkingService, cfg.AppURL)
	indexingService := service.NewSearchIndexingService(db, sitemapService, cfg.AppURL)
	crawlOptService := service.NewCrawlOptimizationService(db, cfg.AppURL)
	seoAnalyticsService := service.NewSeoAnalyticsService(db, crawlOptService, indexingService, aiMetadataService, sitemapService, cfg.AppURL)
	seoAutoService := service.NewSeoAutomationService(db, seoService, sitemapService, linkingService, aiMetadataService, indexingService, cfg.AppURL)
	seoValService := service.NewSeoValidationService(db, cfg.AppURL)

	visaCtrl := controllers.NewVisaController(visaService)
	salaryCtrl := controllers.NewSalaryController(salaryService)
	recommendationCtrl := controllers.NewRecommendationController(recommendationService)
	universalSearchCtrl := controllers.NewUniversalSearchController(universalSearchService)
	seoCtrl := controllers.NewSeoController(seoService, jobService)
	sitemapCtrl := controllers.NewSitemapController(sitemapService)
	pseoCtrl := controllers.NewPseoController(pseoService)
	linkingCtrl := controllers.NewInternalLinkingController(linkingService)
	aiMetadataCtrl := controllers.NewAiMetadataController(aiMetadataService)
	seoContentCtrl := controllers.NewSeoContentController(seoContentService)
	indexingCtrl := controllers.NewSearchIndexingController(indexingService)
	crawlOptCtrl := controllers.NewCrawlOptimizationController(crawlOptService)
	seoAnalyticsCtrl := controllers.NewSeoAnalyticsController(seoAnalyticsService)
	seoAutoCtrl := controllers.NewSeoAutomationController(seoAutoService)
	seoValCtrl := controllers.NewSeoValidationController(seoValService)
	var uploadCtrl *controllers.UploadController
	if s3Service != nil {
		uploadCtrl = controllers.NewUploadController(s3Service)
	}

	// Technical SEO Engine Endpoints
	seoGroup := r.Group("/api/v1/seo")
	{
		seoGroup.GET("/metadata", seoCtrl.GetMetadata)
		seoGroup.GET("/schema/job/:id", seoCtrl.GetJobPostingSchema)
		seoGroup.GET("/schema/organization", seoCtrl.GetOrganizationSchema)
		seoGroup.GET("/schema/faq", seoCtrl.GetFAQSchema)
		seoGroup.GET("/schema/breadcrumb", seoCtrl.GetBreadcrumbSchema)
		seoGroup.GET("/robots.txt", seoCtrl.GetRobotsTxt)
	}

	// SEO Validation Engine Endpoints
	seoValGroup := r.Group("/api/v1/seo-val")
	{
		seoValGroup.GET("/report", seoValCtrl.GetReport)
		seoValGroup.POST("/validate-url", seoValCtrl.ValidateURL)
		seoValGroup.POST("/audit-site", seoValCtrl.AuditSite)
	}

	// SEO Automation Engine Endpoints
	seoAutoGroup := r.Group("/api/v1/seo-auto")
	{
		seoAutoGroup.GET("/config", seoAutoCtrl.GetConfig)
		seoAutoGroup.PUT("/config", seoAutoCtrl.UpdateConfig)
		seoAutoGroup.POST("/trigger-cycle", seoAutoCtrl.TriggerCycle)
		seoAutoGroup.GET("/worker-status", seoAutoCtrl.GetWorkerStatus)
	}

	// SEO Analytics Dashboard Endpoints
	seoAnalyticsGroup := r.Group("/api/v1/seo-analytics")
	{
		seoAnalyticsGroup.GET("/overview", seoAnalyticsCtrl.GetOverview)
		seoAnalyticsGroup.GET("/charts", seoAnalyticsCtrl.GetCharts)
		seoAnalyticsGroup.GET("/performance", seoAnalyticsCtrl.GetPerformance)
	}

	// Crawl Optimization Engine Endpoints
	crawlOptGroup := r.Group("/api/v1/crawl-opt")
	{
		crawlOptGroup.GET("/report", crawlOptCtrl.GetReport)
		crawlOptGroup.POST("/audit", crawlOptCtrl.TriggerAudit)
		crawlOptGroup.GET("/issues", crawlOptCtrl.GetIssues)
	}

	// Search Engine Indexing System Endpoints
	indexingGroup := r.Group("/api/v1/indexing")
	{
		indexingGroup.GET("/dashboard", indexingCtrl.GetDashboard)
		indexingGroup.POST("/trigger", indexingCtrl.TriggerJob)
		indexingGroup.POST("/retry", indexingCtrl.RetryFailed)
		indexingGroup.GET("/queue", indexingCtrl.GetQueue)
	}

	// SEO Content Engine Endpoints
	seoContentGroup := r.Group("/api/v1/seo-content")
	{
		seoContentGroup.GET("/guide", seoContentCtrl.GetGuide)
		seoContentGroup.POST("/refresh", seoContentCtrl.RefreshGuide)
	}

	// AI Metadata Engine Endpoints
	aiMetadataGroup := r.Group("/api/v1/ai-metadata")
	{
		aiMetadataGroup.POST("/generate", aiMetadataCtrl.GenerateMetadata)
		aiMetadataGroup.POST("/bulk-generate", aiMetadataCtrl.BulkGenerate)
		aiMetadataGroup.GET("/versions", aiMetadataCtrl.GetVersions)
		aiMetadataGroup.POST("/rollback", aiMetadataCtrl.RollbackVersion)
	}

	// Programmatic SEO Engine Endpoints
	pseoGroup := r.Group("/api/v1/pseo")
	{
		pseoGroup.GET("/page", pseoCtrl.GetPseoPage)
		pseoGroup.GET("/related", pseoCtrl.GetRelatedLinks)
	}

	// Internal Linking Engine Endpoints
	linkingGroup := r.Group("/api/v1/linking")
	{
		linkingGroup.GET("/entity", linkingCtrl.GetEntityLinks)
		linkingGroup.GET("/orphan-audit", linkingCtrl.AuditOrphanPages)
		linkingGroup.GET("/crawl-depth", linkingCtrl.GetCrawlDepth)
	}

	// XML Sitemap Engine Endpoints
	sitemapGroup := r.Group("/api/v1/sitemaps")
	{
		sitemapGroup.GET("/index.xml", sitemapCtrl.GetIndex)
		sitemapGroup.GET("/jobs.xml", sitemapCtrl.GetJobs)
		sitemapGroup.GET("/companies.xml", sitemapCtrl.GetCompanies)
		sitemapGroup.GET("/skills.xml", sitemapCtrl.GetSkills)
		sitemapGroup.GET("/cities.xml", sitemapCtrl.GetCities)
		sitemapGroup.GET("/states.xml", sitemapCtrl.GetStates)
		sitemapGroup.GET("/salaries.xml", sitemapCtrl.GetSalaries)
		sitemapGroup.GET("/careers.xml", sitemapCtrl.GetCareers)
		sitemapGroup.GET("/industries.xml", sitemapCtrl.GetIndustries)
		sitemapGroup.GET("/faq.xml", sitemapCtrl.GetFaq)
		sitemapGroup.GET("/blog.xml", sitemapCtrl.GetBlog)
		sitemapGroup.GET("/static.xml", sitemapCtrl.GetStatic)
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
	isProd := cfg.Environment == "production"
	recoGroup := r.Group("/api/v1/recommendations",
		middleware.AuthMiddleware(cfg.JWTAccessSecret),
		middleware.NewConfiguredRateLimiter(cfg.RateLimitBackend, isProd, rdb, 30, time.Minute, log),
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
		walkinGroup.POST("/:id/remind", middleware.AuthMiddleware(cfg.JWTAccessSecret), middleware.NewConfiguredRateLimiter(cfg.RateLimitBackend, isProd, rdb, 10, time.Minute, log), walkinCtrl.SetReminder)
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
		internshipGroup.POST("/recommendations", middleware.AuthMiddleware(cfg.JWTAccessSecret), middleware.NewConfiguredRateLimiter(cfg.RateLimitBackend, isProd, rdb, 30, time.Minute, log), internshipCtrl.GetRecommendations)
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
		authGroup.POST("/refresh", authCtrl.Refresh)
		authGroup.POST("/logout", authCtrl.Logout)
		authGroup.POST("/email-verification/request", authCtrl.RequestEmailVerification)
		authGroup.POST("/email-verification/verify", authCtrl.VerifyEmail)
		authGroup.POST("/password-reset/request", authCtrl.RequestPasswordReset)
		authGroup.POST("/password-reset/confirm", authCtrl.ResetPassword)
		authGroup.GET("/oauth/:provider", authCtrl.StartOAuth)
		authGroup.GET("/oauth/:provider/callback", authCtrl.OAuthCallback)
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

	// Payment Endpoints (Razorpay)
	paymentGroup := r.Group("/api/v1/payments")
	{
		paymentGroup.POST("/razorpay/orders", middleware.AuthMiddleware(cfg.JWTAccessSecret), paymentCtrl.CreateRazorpayOrder)
		paymentGroup.POST("/razorpay/verify", paymentCtrl.VerifyRazorpayPayment)
		paymentGroup.POST("/razorpay/webhook", paymentCtrl.RazorpayWebhook)
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

func initRateLimitRedisClient(cfg *config.Config, log *zap.Logger) (*redis.Client, bool) {
	if cfg.RateLimitBackend != "redis" {
		return nil, false
	}

	redisURL := cfg.RedisURL
	if redisURL == "" {
		redisURL = "redis://localhost:6379/0"
	}

	opts, err := redis.ParseURL(redisURL)
	if err != nil {
		log.Warn("Failed to parse Redis URL for rate limiter", zap.Error(err))
		return nil, false
	}

	rdb := redis.NewClient(opts)
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	if err := rdb.Ping(ctx).Err(); err != nil {
		_ = rdb.Close()
		log.Warn("Failed to ping Redis for rate limiter", zap.Error(err))
		return nil, false
	}

	return rdb, true
}
