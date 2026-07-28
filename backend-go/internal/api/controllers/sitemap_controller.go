package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/workorajobs/backend-go/internal/service"
)

type SitemapController struct {
	sitemapService *service.SitemapService
}

func NewSitemapController(sitemapService *service.SitemapService) *SitemapController {
	return &SitemapController{sitemapService: sitemapService}
}

func (sc *SitemapController) respondXml(c *gin.Context, xmlData string) {
	if c.Query("gzip") == "true" {
		compressedBytes, err := sc.sitemapService.CompressXml(xmlData)
		if err == nil {
			c.Header("Content-Type", "application/xml; charset=utf-8")
			c.Header("Content-Encoding", "gzip")
			c.Header("Cache-Control", "public, max-age=3600, s-maxage=3600, stale-while-revalidate=600")
			c.Data(http.StatusOK, "application/xml", compressedBytes)
			return
		}
	}

	c.Header("Content-Type", "application/xml; charset=utf-8")
	c.Header("Cache-Control", "public, max-age=3600, s-maxage=3600, stale-while-revalidate=600")
	c.String(http.StatusOK, xmlData)
}

// GetIndex returns Sitemap Index XML
func (sc *SitemapController) GetIndex(c *gin.Context) {
	xml := sc.sitemapService.GetSitemapIndex()
	sc.respondXml(c, xml)
}

// GetJobs returns Jobs Sitemap XML
func (sc *SitemapController) GetJobs(c *gin.Context) {
	pageStr := c.DefaultQuery("page", "1")
	page, _ := strconv.Atoi(pageStr)
	if page < 1 {
		page = 1
	}

	xml := sc.sitemapService.GetJobsSitemap(page)
	sc.respondXml(c, xml)
}

// GetCompanies returns Companies Sitemap XML
func (sc *SitemapController) GetCompanies(c *gin.Context) {
	xml := sc.sitemapService.GetCompaniesSitemap()
	sc.respondXml(c, xml)
}

// GetSkills returns Skills Sitemap XML
func (sc *SitemapController) GetSkills(c *gin.Context) {
	xml := sc.sitemapService.GetSkillsSitemap()
	sc.respondXml(c, xml)
}

// GetCities returns Cities Sitemap XML
func (sc *SitemapController) GetCities(c *gin.Context) {
	xml := sc.sitemapService.GetCitiesSitemap()
	sc.respondXml(c, xml)
}

// GetStates returns States Sitemap XML
func (sc *SitemapController) GetStates(c *gin.Context) {
	xml := sc.sitemapService.GetStatesSitemap()
	sc.respondXml(c, xml)
}

// GetSalaries returns Salaries Sitemap XML
func (sc *SitemapController) GetSalaries(c *gin.Context) {
	xml := sc.sitemapService.GetSalariesSitemap()
	sc.respondXml(c, xml)
}

// GetCareers returns Careers Sitemap XML
func (sc *SitemapController) GetCareers(c *gin.Context) {
	xml := sc.sitemapService.GetCareersSitemap()
	sc.respondXml(c, xml)
}

// GetIndustries returns Industries Sitemap XML
func (sc *SitemapController) GetIndustries(c *gin.Context) {
	xml := sc.sitemapService.GetIndustriesSitemap()
	sc.respondXml(c, xml)
}

// GetFaq returns FAQ Sitemap XML
func (sc *SitemapController) GetFaq(c *gin.Context) {
	xml := sc.sitemapService.GetFaqSitemap()
	sc.respondXml(c, xml)
}

// GetBlog returns Blog Sitemap XML
func (sc *SitemapController) GetBlog(c *gin.Context) {
	xml := sc.sitemapService.GetBlogSitemap()
	sc.respondXml(c, xml)
}

// GetStatic returns Static Pages Sitemap XML
func (sc *SitemapController) GetStatic(c *gin.Context) {
	xml := sc.sitemapService.GetStaticSitemap()
	sc.respondXml(c, xml)
}
