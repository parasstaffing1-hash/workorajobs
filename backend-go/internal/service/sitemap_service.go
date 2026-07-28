package service

import (
	"bytes"
	"compress/gzip"
	"fmt"
	"net/url"
	"strings"
	"time"

	"github.com/workorajobs/backend-go/internal/domain/models"
	"gorm.io/gorm"
)

const SitemapUrlLimit = 50000

type SitemapEntry struct {
	Loc        string
	LastMod    time.Time
	ChangeFreq string
	Priority   float64
}

type SitemapIndexItem struct {
	Loc     string
	LastMod time.Time
}

type SitemapService struct {
	db      *gorm.DB
	baseURL string
}

func NewSitemapService(db *gorm.DB, baseURL string) *SitemapService {
	if baseURL == "" {
		baseURL = "https://workorajobs.com"
	}
	return &SitemapService{
		db:      db,
		baseURL: strings.TrimRight(baseURL, "/"),
	}
}

// -----------------------------------------------------------------------------
// XML Rendering Helpers & Compression
// -----------------------------------------------------------------------------

func (s *SitemapService) XmlEscape(val string) string {
	val = strings.ReplaceAll(val, "&", "&amp;")
	val = strings.ReplaceAll(val, "<", "&lt;")
	val = strings.ReplaceAll(val, ">", "&gt;")
	val = strings.ReplaceAll(val, "\"", "&quot;")
	val = strings.ReplaceAll(val, "'", "&apos;")
	return val
}

func (s *SitemapService) RenderSitemapIndex(items []SitemapIndexItem) string {
	var sb strings.Builder
	sb.WriteString("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n")
	sb.WriteString("<sitemapindex xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n")

	for _, item := range items {
		lastModStr := item.LastMod.Format(time.RFC3339)
		if item.LastMod.IsZero() {
			lastModStr = time.Now().Format(time.RFC3339)
		}
		sb.WriteString("  <sitemap>\n")
		sb.WriteString(fmt.Sprintf("    <loc>%s</loc>\n", s.XmlEscape(item.Loc)))
		sb.WriteString(fmt.Sprintf("    <lastmod>%s</lastmod>\n", lastModStr))
		sb.WriteString("  </sitemap>\n")
	}

	sb.WriteString("</sitemapindex>")
	return sb.String()
}

func (s *SitemapService) RenderUrlSet(entries []SitemapEntry) string {
	var sb strings.Builder
	sb.WriteString("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n")
	sb.WriteString("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n")

	for _, entry := range entries {
		lastModStr := entry.LastMod.Format(time.RFC3339)
		if entry.LastMod.IsZero() {
			lastModStr = time.Now().Format(time.RFC3339)
		}

		changeFreq := entry.ChangeFreq
		if changeFreq == "" {
			changeFreq = "weekly"
		}

		priority := entry.Priority
		if priority == 0 {
			priority = 0.5
		}

		sb.WriteString("  <url>\n")
		sb.WriteString(fmt.Sprintf("    <loc>%s</loc>\n", s.XmlEscape(entry.Loc)))
		sb.WriteString(fmt.Sprintf("    <lastmod>%s</lastmod>\n", lastModStr))
		sb.WriteString(fmt.Sprintf("    <changefreq>%s</changefreq>\n", changeFreq))
		sb.WriteString(fmt.Sprintf("    <priority>%.1f</priority>\n", priority))
		sb.WriteString("  </url>\n")
	}

	sb.WriteString("</urlset>")
	return sb.String()
}

func (s *SitemapService) CompressXml(xmlData string) ([]byte, error) {
	var buf bytes.Buffer
	gz := gzip.NewWriter(&buf)
	if _, err := gz.Write([]byte(xmlData)); err != nil {
		return nil, err
	}
	if err := gz.Close(); err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}

// -----------------------------------------------------------------------------
// Category Sitemap Generators
// -----------------------------------------------------------------------------

func (s *SitemapService) GetSitemapIndex() string {
	now := time.Now()
	items := []SitemapIndexItem{
		{Loc: s.baseURL + "/api/v1/sitemaps/jobs.xml", LastMod: now},
		{Loc: s.baseURL + "/api/v1/sitemaps/companies.xml", LastMod: now},
		{Loc: s.baseURL + "/api/v1/sitemaps/skills.xml", LastMod: now},
		{Loc: s.baseURL + "/api/v1/sitemaps/cities.xml", LastMod: now},
		{Loc: s.baseURL + "/api/v1/sitemaps/states.xml", LastMod: now},
		{Loc: s.baseURL + "/api/v1/sitemaps/salaries.xml", LastMod: now},
		{Loc: s.baseURL + "/api/v1/sitemaps/careers.xml", LastMod: now},
		{Loc: s.baseURL + "/api/v1/sitemaps/industries.xml", LastMod: now},
		{Loc: s.baseURL + "/api/v1/sitemaps/faq.xml", LastMod: now},
		{Loc: s.baseURL + "/api/v1/sitemaps/blog.xml", LastMod: now},
		{Loc: s.baseURL + "/api/v1/sitemaps/static.xml", LastMod: now},
	}
	return s.RenderSitemapIndex(items)
}

func (s *SitemapService) GetJobsSitemap(page int) string {
	var entries []SitemapEntry

	if s.db != nil {
		var jobs []models.Job
		offset := (page - 1) * SitemapUrlLimit
		err := s.db.Where("status = ? AND deleted_at IS NULL", "PUBLISHED").
			Order("updated_at desc").
			Limit(SitemapUrlLimit).
			Offset(offset).
			Find(&jobs).Error

		if err == nil && len(jobs) > 0 {
			for _, j := range jobs {
				slug := j.ID
				if j.Slug != nil && *j.Slug != "" {
					slug = *j.Slug
				}
				lastMod := j.UpdatedAt
				if lastMod.IsZero() {
					lastMod = j.PostedAt
				}
				entries = append(entries, SitemapEntry{
					Loc:        fmt.Sprintf("%s/jobs/%s", s.baseURL, slug),
					LastMod:    lastMod,
					ChangeFreq: "daily",
					Priority:   0.9,
				})
			}
			return s.RenderUrlSet(entries)
		}
	}

	// Static fallback
	entries = append(entries, SitemapEntry{
		Loc:        s.baseURL + "/jobs",
		LastMod:    time.Now(),
		ChangeFreq: "daily",
		Priority:   0.9,
	})

	return s.RenderUrlSet(entries)
}

func (s *SitemapService) GetCompaniesSitemap() string {
	var entries []SitemapEntry

	if s.db != nil {
		var companies []models.Company
		err := s.db.Where("deleted_at IS NULL").Order("updated_at desc").Limit(SitemapUrlLimit).Find(&companies).Error
		if err == nil && len(companies) > 0 {
			for _, c := range companies {
				slug := c.ID
				if c.Slug != nil && *c.Slug != "" {
					slug = *c.Slug
				}
				entries = append(entries, SitemapEntry{
					Loc:        fmt.Sprintf("%s/companies/%s", s.baseURL, slug),
					LastMod:    c.UpdatedAt,
					ChangeFreq: "weekly",
					Priority:   0.8,
				})
			}
			return s.RenderUrlSet(entries)
		}
	}

	entries = append(entries, SitemapEntry{
		Loc:        s.baseURL + "/companies",
		LastMod:    time.Now(),
		ChangeFreq: "weekly",
		Priority:   0.8,
	})

	return s.RenderUrlSet(entries)
}

func (s *SitemapService) GetSkillsSitemap() string {
	skills := []string{"react", "golang", "python", "java", "node-js", "typescript", "aws", "docker", "kubernetes", "sql"}
	var entries []SitemapEntry
	now := time.Now()

	for _, skill := range skills {
		entries = append(entries, SitemapEntry{
			Loc:        fmt.Sprintf("%s/skills/%s", s.baseURL, skill),
			LastMod:    now,
			ChangeFreq: "weekly",
			Priority:   0.8,
		})
	}

	return s.RenderUrlSet(entries)
}

func (s *SitemapService) GetCitiesSitemap() string {
	cities := []string{"bengaluru", "hyderabad", "mumbai", "delhi-ncr", "pune", "chennai", "san-francisco", "london", "singapore"}
	var entries []SitemapEntry
	now := time.Now()

	for _, city := range cities {
		entries = append(entries, SitemapEntry{
			Loc:        fmt.Sprintf("%s/jobs/location/%s", s.baseURL, city),
			LastMod:    now,
			ChangeFreq: "weekly",
			Priority:   0.7,
		})
	}

	return s.RenderUrlSet(entries)
}

func (s *SitemapService) GetStatesSitemap() string {
	states := []string{"karnataka", "telangana", "maharashtra", "delhi", "california", "texas", "new-york"}
	var entries []SitemapEntry
	now := time.Now()

	for _, state := range states {
		entries = append(entries, SitemapEntry{
			Loc:        fmt.Sprintf("%s/jobs/location/%s", s.baseURL, state),
			LastMod:    now,
			ChangeFreq: "weekly",
			Priority:   0.7,
		})
	}

	return s.RenderUrlSet(entries)
}

func (s *SitemapService) GetSalariesSitemap() string {
	var entries []SitemapEntry
	now := time.Now()

	entries = append(entries, SitemapEntry{
		Loc:        s.baseURL + "/salary/compare",
		LastMod:    now,
		ChangeFreq: "weekly",
		Priority:   0.7,
	})

	return s.RenderUrlSet(entries)
}

func (s *SitemapService) GetCareersSitemap() string {
	var entries []SitemapEntry
	now := time.Now()

	entries = append(entries, SitemapEntry{
		Loc:        s.baseURL + "/prep",
		LastMod:    now,
		ChangeFreq: "monthly",
		Priority:   0.7,
	})

	return s.RenderUrlSet(entries)
}

func (s *SitemapService) GetIndustriesSitemap() string {
	industries := []string{"software-engineering", "fintech", "ai-machine-learning", "cloud-computing", "cybersecurity", "e-commerce"}
	var entries []SitemapEntry
	now := time.Now()

	for _, ind := range industries {
		entries = append(entries, SitemapEntry{
			Loc:        fmt.Sprintf("%s/industries/%s", s.baseURL, ind),
			LastMod:    now,
			ChangeFreq: "weekly",
			Priority:   0.8,
		})
	}

	return s.RenderUrlSet(entries)
}

func (s *SitemapService) GetFaqSitemap() string {
	var entries []SitemapEntry
	now := time.Now()

	entries = append(entries, SitemapEntry{
		Loc:        s.baseURL + "/faq",
		LastMod:    now,
		ChangeFreq: "monthly",
		Priority:   0.6,
	})

	return s.RenderUrlSet(entries)
}

func (s *SitemapService) GetBlogSitemap() string {
	posts := []string{
		"building-a-global-hiring-operating-model",
		"candidate-experience-as-a-growth-advantage",
		"what-ai-should-and-should-not-do-in-recruiting",
	}
	var entries []SitemapEntry
	now := time.Now()

	for _, post := range posts {
		entries = append(entries, SitemapEntry{
			Loc:        fmt.Sprintf("%s/blog/%s", s.baseURL, url.PathEscape(post)),
			LastMod:    now,
			ChangeFreq: "weekly",
			Priority:   0.7,
		})
	}

	return s.RenderUrlSet(entries)
}

func (s *SitemapService) GetStaticSitemap() string {
	staticPaths := []string{
		"/about",
		"/pricing",
		"/contact",
		"/terms",
		"/privacy",
		"/cookie-policy",
		"/trust",
	}
	var entries []SitemapEntry
	now := time.Now()

	for _, path := range staticPaths {
		entries = append(entries, SitemapEntry{
			Loc:        s.baseURL + path,
			LastMod:    now,
			ChangeFreq: "monthly",
			Priority:   0.6,
		})
	}

	return s.RenderUrlSet(entries)
}
