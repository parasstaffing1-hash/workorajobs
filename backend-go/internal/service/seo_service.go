package service

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/workorajobs/backend-go/internal/domain/models"
	"gorm.io/gorm"
)

type SeoService struct {
	db      *gorm.DB
	baseURL string
}

func NewSeoService(db *gorm.DB) *SeoService {
	return &SeoService{
		db:      db,
		baseURL: "https://workorajobs.com",
	}
}

func NewSeoServiceWithBaseURL(db *gorm.DB, baseURL string) *SeoService {
	if baseURL == "" {
		baseURL = "https://workorajobs.com"
	}
	return &SeoService{
		db:      db,
		baseURL: strings.TrimRight(baseURL, "/"),
	}
}

// -----------------------------------------------------------------------------
// Schema.org Struct Definitions
// -----------------------------------------------------------------------------

type JobPostingSchema struct {
	Context            string                 `json:"@context"`
	Type               string                 `json:"@type"`
	Title              string                 `json:"title"`
	Description        string                 `json:"description"`
	DatePosted         string                 `json:"datePosted"`
	ValidThrough       string                 `json:"validThrough,omitempty"`
	EmploymentType     string                 `json:"employmentType"`
	HiringOrganization map[string]interface{} `json:"hiringOrganization"`
	JobLocation        map[string]interface{} `json:"jobLocation"`
	BaseSalary         map[string]interface{} `json:"baseSalary,omitempty"`
	DirectApply        bool                   `json:"directApply,omitempty"`
	Identifier         map[string]interface{} `json:"identifier,omitempty"`
}

type OrganizationSchema struct {
	Context     string                 `json:"@context"`
	Type        string                 `json:"@type"`
	ID          string                 `json:"@id"`
	Name        string                 `json:"name"`
	URL         string                 `json:"url"`
	Logo        string                 `json:"logo"`
	Description string                 `json:"description"`
	SameAs      []string               `json:"sameAs"`
	Contact     map[string]interface{} `json:"contactPoint,omitempty"`
}

type FAQItem struct {
	Question string `json:"question"`
	Answer   string `json:"answer"`
}

type FAQPageSchema struct {
	Context    string                   `json:"@context"`
	Type       string                   `json:"@type"`
	MainEntity []map[string]interface{} `json:"mainEntity"`
}

type BreadcrumbItem struct {
	Name string `json:"name"`
	URL  string `json:"url"`
}

type BreadcrumbListSchema struct {
	Context         string                   `json:"@context"`
	Type            string                   `json:"@type"`
	ItemListElement []map[string]interface{} `json:"itemListElement"`
}

type WebSiteSchema struct {
	Context         string                 `json:"@context"`
	Type            string                 `json:"@type"`
	ID              string                 `json:"@id"`
	URL             string                 `json:"url"`
	Name            string                 `json:"name"`
	Description     string                 `json:"description"`
	Publisher       map[string]interface{} `json:"publisher"`
	PotentialAction map[string]interface{} `json:"potentialAction"`
}

type SeoMetadataResponse struct {
	Title          string            `json:"title"`
	Description    string            `json:"description"`
	CanonicalURL   string            `json:"canonicalUrl"`
	Keywords       []string          `json:"keywords"`
	Robots         string            `json:"robots"`
	OpenGraph      map[string]string `json:"openGraph"`
	TwitterCard    map[string]string `json:"twitterCard"`
	Hreflang       map[string]string `json:"hreflang"`
	FaviconLinks   []map[string]string `json:"faviconLinks"`
}

// -----------------------------------------------------------------------------
// Schema Generators
// -----------------------------------------------------------------------------

func (s *SeoService) GenerateJobPostingSchema(job *models.Job) (string, error) {
	if job == nil {
		return "", fmt.Errorf("job is nil")
	}

	companyName := "WorkoraJobs Verified Partner"
	companyURL := s.baseURL
	companyLogo := s.baseURL + "/workora-jobs-logo-scraped.png"

	if job.Company != nil {
		companyName = job.Company.Name
		if job.Company.WebsiteURL != nil && *job.Company.WebsiteURL != "" {
			companyURL = *job.Company.WebsiteURL
		}
		if job.Company.LogoURL != nil && *job.Company.LogoURL != "" {
			companyLogo = *job.Company.LogoURL
		}
	}

	locationName := "Remote / Global"
	if job.Location != nil && *job.Location != "" {
		locationName = *job.Location
	}

	empType := "FULL_TIME"
	if job.Type != "" {
		empType = strings.ToUpper(string(job.Type))
		empType = strings.ReplaceAll(empType, "-", "_")
	}

	datePosted := time.Now().Format(time.RFC3339)
	if !job.PostedAt.IsZero() {
		datePosted = job.PostedAt.Format(time.RFC3339)
	}

	schema := JobPostingSchema{
		Context:        "https://schema.org",
		Type:           "JobPosting",
		Title:          job.Title,
		Description:    job.Description,
		DatePosted:     datePosted,
		EmploymentType: empType,
		DirectApply:    true,
		Identifier: map[string]interface{}{
			"@type": "PropertyValue",
			"name":  "WorkoraJobs",
			"value": job.ID,
		},
		HiringOrganization: map[string]interface{}{
			"@type": "Organization",
			"name":  companyName,
			"sameAs": companyURL,
			"logo":   companyLogo,
		},
		JobLocation: map[string]interface{}{
			"@type": "Place",
			"address": map[string]interface{}{
				"@type":           "PostalAddress",
				"addressLocality": locationName,
			},
		},
	}

	if job.DeadlineAt != nil && !job.DeadlineAt.IsZero() {
		schema.ValidThrough = job.DeadlineAt.Format(time.RFC3339)
	}

	if job.SalaryMin != nil || job.SalaryMax != nil || job.Salary != nil {
		currency := "USD"
		if job.Currency != nil && *job.Currency != "" {
			currency = *job.Currency
		}

		minVal := 0.0
		maxVal := 0.0

		if job.SalaryMin != nil {
			minVal = float64(*job.SalaryMin)
		}
		if job.SalaryMax != nil {
			maxVal = float64(*job.SalaryMax)
		}
		if minVal == 0 && job.Salary != nil {
			minVal = float64(*job.Salary)
		}
		if maxVal == 0 && job.Salary != nil {
			maxVal = float64(*job.Salary)
		}

		schema.BaseSalary = map[string]interface{}{
			"@type":    "MonetaryAmount",
			"currency": currency,
			"value": map[string]interface{}{
				"@type":    "QuantitativeValue",
				"minValue": minVal,
				"maxValue": maxVal,
				"unitText": "YEAR",
			},
		}
	}

	bytes, err := json.MarshalIndent(schema, "", "  ")
	if err != nil {
		return "", err
	}

	return string(bytes), nil
}

func (s *SeoService) GenerateOrganizationSchema() (string, error) {
	schema := OrganizationSchema{
		Context:     "https://schema.org",
		Type:        "Organization",
		ID:          s.baseURL + "/#organization",
		Name:        "WorkoraJobs",
		URL:         s.baseURL,
		Logo:        s.baseURL + "/workora-jobs-logo-scraped.png",
		Description: "Global technology staffing and AI recruitment platform connecting verified tech professionals with remote and international career opportunities.",
		SameAs: []string{
			"https://www.linkedin.com/company/workorajobs",
			"https://twitter.com/workorajobs",
		},
		Contact: map[string]interface{}{
			"@type":       "ContactPoint",
			"email":       "support@workorajobs.com",
			"contactType": "customer service",
		},
	}

	bytes, err := json.MarshalIndent(schema, "", "  ")
	if err != nil {
		return "", err
	}

	return string(bytes), nil
}

func (s *SeoService) GenerateFAQSchema(faqs []FAQItem) (string, error) {
	if len(faqs) == 0 {
		faqs = []FAQItem{
			{
				Question: "How does WorkoraJobs help candidates find remote jobs?",
				Answer:   "WorkoraJobs curates verified engineering, product, and tech roles from global employers with clear compensation and visa sponsorship options.",
			},
			{
				Question: "Can companies post jobs directly on WorkoraJobs?",
				Answer:   "Yes, employers and recruiters can create verified company profiles and publish tech job opportunities.",
			},
		}
	}

	entities := make([]map[string]interface{}, len(faqs))
	for i, faq := range faqs {
		entities[i] = map[string]interface{}{
			"@type": "Question",
			"name":  faq.Question,
			"acceptedAnswer": map[string]interface{}{
				"@type": "Answer",
				"text":  faq.Answer,
			},
		}
	}

	schema := FAQPageSchema{
		Context:    "https://schema.org",
		Type:       "FAQPage",
		MainEntity: entities,
	}

	bytes, err := json.MarshalIndent(schema, "", "  ")
	if err != nil {
		return "", err
	}

	return string(bytes), nil
}

func (s *SeoService) GenerateBreadcrumbSchema(items []BreadcrumbItem) (string, error) {
	if len(items) == 0 {
		items = []BreadcrumbItem{
			{Name: "Home", URL: s.baseURL},
			{Name: "Jobs", URL: s.baseURL + "/jobs"},
		}
	}

	elements := make([]map[string]interface{}, len(items))
	for i, item := range items {
		itemURL := item.URL
		if !strings.HasPrefix(itemURL, "http") {
			itemURL = s.baseURL + "/" + strings.TrimLeft(itemURL, "/")
		}

		elements[i] = map[string]interface{}{
			"@type":    "ListItem",
			"position": i + 1,
			"name":     item.Name,
			"item":     itemURL,
		}
	}

	schema := BreadcrumbListSchema{
		Context:         "https://schema.org",
		Type:            "BreadcrumbList",
		ItemListElement: elements,
	}

	bytes, err := json.MarshalIndent(schema, "", "  ")
	if err != nil {
		return "", err
	}

	return string(bytes), nil
}

func (s *SeoService) GenerateWebSiteSchema() (string, error) {
	schema := WebSiteSchema{
		Context:     "https://schema.org",
		Type:        "WebSite",
		ID:          s.baseURL + "/#website",
		URL:         s.baseURL,
		Name:        "WorkoraJobs",
		Description: "AI recruitment and global technology staffing platform.",
		Publisher: map[string]interface{}{
			"@id": s.baseURL + "/#organization",
		},
		PotentialAction: map[string]interface{}{
			"@type":       "SearchAction",
			"target":      s.baseURL + "/jobs?q={search_term_string}",
			"query-input": "required name=search_term_string",
		},
	}

	bytes, err := json.MarshalIndent(schema, "", "  ")
	if err != nil {
		return "", err
	}

	return string(bytes), nil
}

// -----------------------------------------------------------------------------
// Canonical URL & Metadata Cleaner
// -----------------------------------------------------------------------------

func (s *SeoService) BuildCanonicalURL(rawPath string) string {
	if rawPath == "" {
		rawPath = "/"
	}

	u, err := url.Parse(rawPath)
	if err != nil {
		return s.baseURL + "/" + strings.TrimLeft(rawPath, "/")
	}

	base := u.Path
	q := u.Query()

	// Strip tracking, marketing, and page 1 params
	stripParams := []string{
		"utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
		"gclid", "fbclid", "ref", "sort", "filter", "session_id",
	}

	for _, p := range stripParams {
		q.Del(p)
	}

	if q.Get("page") == "1" {
		q.Del("page")
	}

	cleanQuery := q.Encode()
	if cleanQuery != "" {
		return s.baseURL + base + "?" + cleanQuery
	}

	return s.baseURL + base
}

func (s *SeoService) GenerateMetadata(title, description, rawPath string, page int) *SeoMetadataResponse {
	siteName := "WorkoraJobs"
	defaultTitle := "Find Jobs in India | AI Job Search Platform | WorkoraJobs"

	fullTitle := defaultTitle
	if title != "" {
		fullTitle = fmt.Sprintf("%s | %s", title, siteName)
	}

	if description == "" {
		description = "WorkoraJobs is an AI-powered global staffing and recruitment platform for companies hiring trusted talent across borders."
	}

	canonicalURL := s.BuildCanonicalURL(rawPath)

	robots := "index, follow"
	if page > 5 {
		robots = "noindex, follow"
	}

	ogImage := s.baseURL + "/opengraph-image"

	return &SeoMetadataResponse{
		Title:        fullTitle,
		Description:  description,
		CanonicalURL: canonicalURL,
		Keywords: []string{
			"global staffing", "recruitment platform", "AI hiring",
			"remote hiring", "enterprise recruiting", "talent marketplace", "WorkoraJobs",
		},
		Robots: robots,
		OpenGraph: map[string]string{
			"og:title":       fullTitle,
			"og:description": description,
			"og:url":         canonicalURL,
			"og:site_name":   siteName,
			"og:type":        "website",
			"og:image":       ogImage,
		},
		TwitterCard: map[string]string{
			"twitter:card":        "summary_large_image",
			"twitter:title":       fullTitle,
			"twitter:description": description,
			"twitter:image":       ogImage,
			"twitter:creator":     "@workorajobs",
		},
		Hreflang: map[string]string{
			"en-US":     canonicalURL,
			"en-IN":     canonicalURL,
			"en-GB":     canonicalURL,
			"x-default": canonicalURL,
		},
		FaviconLinks: []map[string]string{
			{"rel": "icon", "href": "/favicon.ico", "sizes": "any"},
			{"rel": "icon", "href": "/favicon-32x32.png", "sizes": "32x32", "type": "image/png"},
			{"rel": "apple-touch-icon", "href": "/apple-touch-icon.png", "sizes": "180x180"},
		},
	}
}

// -----------------------------------------------------------------------------
// Dynamic Robots.txt Generator
// -----------------------------------------------------------------------------

func (s *SeoService) GenerateRobotsTxt(isProd bool) string {
	if !isProd {
		return "User-agent: *\nDisallow: /\n"
	}

	var sb strings.Builder
	sb.WriteString("User-agent: *\n")
	sb.WriteString("Allow: /\n")
	sb.WriteString("Disallow: /admin/\n")
	sb.WriteString("Disallow: /api/\n")
	sb.WriteString("Disallow: /candidate/dashboard\n")
	sb.WriteString("Disallow: /employer/dashboard\n")
	sb.WriteString("Disallow: /auth/\n")
	sb.WriteString("Disallow: /*?*utm_\n")
	sb.WriteString("Disallow: /*?*gclid\n\n")
	sb.WriteString(fmt.Sprintf("Sitemap: %s/sitemap.xml\n", s.baseURL))
	sb.WriteString(fmt.Sprintf("Sitemap: %s/sitemap-jobs.xml\n", s.baseURL))

	return sb.String()
}

// -----------------------------------------------------------------------------
// IndexNow API Integration
// -----------------------------------------------------------------------------

type IndexNowPayload struct {
	Host        string   `json:"host"`
	Key         string   `json:"key"`
	KeyLocation string   `json:"keyLocation,omitempty"`
	URLList     []string `json:"urlList"`
}

func (s *SeoService) SubmitUrlsToIndexNow(host string, apiKey string, urls []string) error {
	payload := IndexNowPayload{
		Host:    host,
		Key:     apiKey,
		URLList: urls,
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	req, err := http.NewRequest("POST", "https://api.indexnow.org/IndexNow", bytes.NewBuffer(body))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json; charset=utf-8")

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return fmt.Errorf("IndexNow API returned status code %d", resp.StatusCode)
	}

	return nil
}
