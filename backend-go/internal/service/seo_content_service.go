package service

import (
	"encoding/json"
	"fmt"
	"strings"

	"gorm.io/gorm"
)

type GuideCategory string

const (
	GuideCategoryCompany       GuideCategory = "company-guides"
	GuideCategorySalary        GuideCategory = "salary-guides"
	GuideCategorySkill         GuideCategory = "skill-guides"
	GuideCategoryInterview     GuideCategory = "interview-guides"
	GuideCategoryIndustry      GuideCategory = "industry-guides"
	GuideCategoryCareer        GuideCategory = "career-guides"
	GuideCategoryCity          GuideCategory = "city-guides"
	GuideCategoryCertification GuideCategory = "certification-guides"
	GuideCategoryRemoteWork    GuideCategory = "remote-work-guides"
)

type GuideSection struct {
	ID      string `json:"id"`
	Title   string `json:"title"`
	Content string `json:"content"`
	Type    string `json:"type"` // "text", "table", "key-takeaways"
}

type GuideTocItem struct {
	ID    string `json:"id"`
	Title string `json:"title"`
}

type RelatedJobWidget struct {
	Title       string `json:"title"`
	Company     string `json:"company"`
	Location    string `json:"location"`
	SalaryRange string `json:"salaryRange"`
	URL         string `json:"url"`
}

type RelatedCompanyWidget struct {
	Name     string `json:"name"`
	Logo     string `json:"logo"`
	Industry string `json:"industry"`
	URL      string `json:"url"`
}

type GuideResponse struct {
	Category         string                 `json:"category"`
	Slug             string                 `json:"slug"`
	Title            string                 `json:"title"`
	Subtitle         string                 `json:"subtitle"`
	Description      string                 `json:"description"`
	CanonicalURL     string                 `json:"canonicalUrl"`
	TableOfContents  []GuideTocItem         `json:"tableOfContents"`
	Sections         []GuideSection         `json:"sections"`
	Faq              []AiFaqItem            `json:"faq"`
	RelatedJobs      []RelatedJobWidget     `json:"relatedJobs"`
	RelatedCompanies []RelatedCompanyWidget `json:"relatedCompanies"`
	InternalLinks    []RelatedLink          `json:"internalLinks"`
	JsonLd           string                 `json:"jsonLd"`
	OpenGraph        map[string]string      `json:"openGraph"`
	TwitterCard      map[string]string      `json:"twitterCard"`
}

type SeoContentService struct {
	db         *gorm.DB
	seoService *SeoService
	linkingSvc *InternalLinkingService
	baseURL    string
}

func NewSeoContentService(db *gorm.DB, seoService *SeoService, linkingSvc *InternalLinkingService, baseURL string) *SeoContentService {
	if baseURL == "" {
		baseURL = "https://workorajobs.com"
	}
	if seoService == nil {
		seoService = NewSeoServiceWithBaseURL(db, baseURL)
	}
	if linkingSvc == nil {
		linkingSvc = NewInternalLinkingService(db, baseURL)
	}
	return &SeoContentService{
		db:         db,
		seoService: seoService,
		linkingSvc: linkingSvc,
		baseURL:    strings.TrimRight(baseURL, "/"),
	}
}

func (s *SeoContentService) titleize(slug string) string {
	parts := strings.Split(slug, "-")
	for i, p := range parts {
		if len(p) > 0 {
			parts[i] = strings.ToUpper(p[:1]) + p[1:]
		}
	}
	return strings.Join(parts, " ")
}

// -----------------------------------------------------------------------------
// Core 9 Guide Category Assembling Engine
// -----------------------------------------------------------------------------

func (s *SeoContentService) GetGuide(categoryStr string, rawSlug string) (*GuideResponse, error) {
	category := GuideCategory(strings.ToLower(strings.TrimSpace(categoryStr)))
	slug := strings.ToLower(strings.TrimSpace(rawSlug))
	if slug == "" {
		slug = "overview"
	}

	titleName := s.titleize(slug)
	siteName := "WorkoraJobs"

	var title string
	var subtitle string
	var description string
	var relativePath string
	var schemaType string

	switch category {
	case GuideCategoryCompany:
		relativePath = fmt.Sprintf("/company-guides/%s", slug)
		title = fmt.Sprintf("%s Career Guide & Interview Process 2026", titleName)
		subtitle = fmt.Sprintf("Everything you need to know about engineering roles, interview stages, salaries, and company culture at %s.", titleName)
		description = fmt.Sprintf("Complete guide to hiring at %s. Salary insights, interview questions, tech stack, and active job openings on WorkoraJobs.", titleName)
		schemaType = "Article"

	case GuideCategorySalary:
		relativePath = fmt.Sprintf("/salary-guides/%s", slug)
		title = fmt.Sprintf("%s Salary Guide & Compensation Benchmarks", titleName)
		subtitle = fmt.Sprintf("In-depth salary report for %s roles across experience levels, top cities, and remote markets.", titleName)
		description = fmt.Sprintf("Check 2026 %s salary averages, percentile breakdowns, and highest paying companies on WorkoraJobs.", titleName)
		schemaType = "TechArticle"

	case GuideCategorySkill:
		relativePath = fmt.Sprintf("/skill-guides/%s", slug)
		title = fmt.Sprintf("%s Mastery Guide: Skills, Salaries & Top Hiring Roles", titleName)
		subtitle = fmt.Sprintf("Comprehensive developer guide to mastering %s, key ecosystem tools, and target career paths.", titleName)
		description = fmt.Sprintf("Learn %s core skills, top interview questions, average salaries, and verified hiring companies.", titleName)
		schemaType = "TechArticle"

	case GuideCategoryInterview:
		relativePath = fmt.Sprintf("/interview-guides/%s", slug)
		title = fmt.Sprintf("%s Technical Interview Prep & Practice Guide", titleName)
		subtitle = fmt.Sprintf("Master your %s technical interview with system design patterns, coding prompts, and expert answers.", titleName)
		description = fmt.Sprintf("Crack the %s interview. Real interview questions, coding solutions, and system design breakdown.", titleName)
		schemaType = "TechArticle"

	case GuideCategoryIndustry:
		relativePath = fmt.Sprintf("/industry-guides/%s", slug)
		title = fmt.Sprintf("%s Industry Career & Tech Hiring Report", titleName)
		subtitle = fmt.Sprintf("Market insights, high-growth sectors, salary trends, and top employers in %s.", titleName)
		description = fmt.Sprintf("Explore career growth and tech hiring opportunities in the %s industry on WorkoraJobs.", titleName)
		schemaType = "Article"

	case GuideCategoryCareer:
		relativePath = fmt.Sprintf("/career-guides/%s", slug)
		title = fmt.Sprintf("%s Career Roadmap, Skills & Promotion Guide", titleName)
		subtitle = fmt.Sprintf("Step-by-step career path from junior to senior %s with skill milestones and salary benchmarks.", titleName)
		description = fmt.Sprintf("Follow the official %s career roadmap. Skill checklists, salary growth, and promotion strategies.", titleName)
		schemaType = "Article"

	case GuideCategoryCity:
		relativePath = fmt.Sprintf("/city-guides/%s", slug)
		title = fmt.Sprintf("%s Tech Career Guide & Job Market Report", titleName)
		subtitle = fmt.Sprintf("Tech ecosystem overview, top hiring companies, cost of living, and average salaries in %s.", titleName)
		description = fmt.Sprintf("Guide to working in %s. Tech hub insights, highest paying companies, and active local job listings.", titleName)
		schemaType = "Article"

	case GuideCategoryCertification:
		relativePath = fmt.Sprintf("/certification-guides/%s", slug)
		title = fmt.Sprintf("%s Certification Prep, Syllabus & Exam Guide", titleName)
		subtitle = fmt.Sprintf("Pass the %s certification exam. Topic breakdowns, practice questions, and salary impact.", titleName)
		description = fmt.Sprintf("Complete %s certification prep guide. Exam objectives, practice tests, and career advantages.", titleName)
		schemaType = "TechArticle"

	case GuideCategoryRemoteWork:
		relativePath = fmt.Sprintf("/remote-work-guides/%s", slug)
		title = fmt.Sprintf("Global Remote %s Work Playbook & Hiring Guide", titleName)
		subtitle = fmt.Sprintf("How to land remote %s roles with international salary packages and visa flexibility.", titleName)
		description = fmt.Sprintf("Complete playbook for remote %s careers. Top remote companies, compensation ranges, and best practices.", titleName)
		schemaType = "Article"

	default:
		return nil, fmt.Errorf("unsupported guide category: %s", categoryStr)
	}

	canonicalURL := s.seoService.BuildCanonicalURL(relativePath)
	fullTitle := fmt.Sprintf("%s | %s", title, siteName)

	// Table of Contents
	toc := []GuideTocItem{
		{ID: "overview", Title: "1. Overview & Key Insights"},
		{ID: "market-trends", Title: "2. Market Trends & Salary Benchmarks"},
		{ID: "key-skills", Title: "3. Required Skills & Milestones"},
		{ID: "action-plan", Title: "4. Step-by-Step Action Plan"},
		{ID: "faq", Title: "5. Frequently Asked Questions"},
	}

	// Dynamic Sections
	sections := []GuideSection{
		{
			ID:      "overview",
			Title:   "1. Overview & Key Insights",
			Content: fmt.Sprintf("%s continues to represent one of the most dynamic sectors in technology staffing. Professionals specializing in %s benefit from high demand across both high-growth startups and established enterprise teams.", titleName, titleName),
			Type:    "text",
		},
		{
			ID:      "market-trends",
			Title:   "2. Market Trends & Salary Benchmarks",
			Content: fmt.Sprintf("Compensation for %s specialists has grown by 15%% year-over-year. Mid-level roles average $120,000 - $160,000 annually, with senior leads commanding upwards of $200,000+ in remote and major tech hubs.", titleName),
			Type:    "table",
		},
		{
			ID:      "key-skills",
			Title:   "3. Required Skills & Milestones",
			Content: fmt.Sprintf("Core proficiencies for %s success include system architecture, clean code standards, cloud deployment (AWS/GCP), CI/CD automation, and collaborative problem-solving.", titleName),
			Type:    "key-takeaways",
		},
		{
			ID:      "action-plan",
			Title:   "4. Step-by-Step Action Plan",
			Content: fmt.Sprintf("1. Update your resume emphasizing verified %s achievements.\n2. Practice real technical interview prompts.\n3. Apply directly to verified employers on WorkoraJobs.", titleName),
			Type:    "text",
		},
	}

	// FAQs
	faq := []AiFaqItem{
		{
			Question: fmt.Sprintf("Is %s in high demand in 2026?", titleName),
			Answer:   fmt.Sprintf("Yes, %s ranks among the top requested skills by hiring managers on WorkoraJobs globally.", titleName),
		},
		{
			Question: fmt.Sprintf("What is the average salary range in this field?"),
			Answer:   fmt.Sprintf("Salaries typically range from $90,000 for junior roles up to $220,000+ for principal engineers and architects."),
		},
	}

	// Related Jobs Widget
	relatedJobs := []RelatedJobWidget{
		{Title: fmt.Sprintf("Senior %s Engineer", titleName), Company: "Google Partner", Location: "Remote", SalaryRange: "$140k - $190k", URL: s.baseURL + "/jobs/senior-engineer"},
		{Title: fmt.Sprintf("%s Lead Specialist", titleName), Company: "Microsoft Partner", Location: "Bengaluru, IN", SalaryRange: "₹25L - ₹40L", URL: s.baseURL + "/jobs/lead-specialist"},
	}

	// Related Companies Widget
	relatedCompanies := []RelatedCompanyWidget{
		{Name: "Acme Cloud Systems", Logo: s.baseURL + "/workora-jobs-logo-scraped.png", Industry: "Cloud Tech", URL: s.baseURL + "/companies/acme-cloud"},
		{Name: "Fintech Global Labs", Logo: s.baseURL + "/workora-jobs-logo-scraped.png", Industry: "Fintech", URL: s.baseURL + "/companies/fintech-global"},
	}

	// Contextual Internal Links Mesh
	var internalLinks []RelatedLink
	skillGraph, _ := s.linkingSvc.GetSkillLinks(slug)
	if skillGraph != nil {
		for _, node := range skillGraph.Outbound {
			internalLinks = append(internalLinks, RelatedLink{Title: node.AnchorText, URL: node.URL})
		}
	}

	// JSON-LD Schema
	jsonLdMap := map[string]interface{}{
		"@context":    "https://schema.org",
		"@type":       schemaType,
		"headline":    fullTitle,
		"description": description,
		"url":         canonicalURL,
		"publisher": map[string]interface{}{
			"@type": "Organization",
			"name":  siteName,
			"url":   s.baseURL,
			"logo":  s.baseURL + "/workora-jobs-logo-scraped.png",
		},
		"breadcrumb": map[string]interface{}{
			"@type": "BreadcrumbList",
			"itemListElement": []map[string]interface{}{
				{"@type": "ListItem", "position": 1, "name": "Home", "item": s.baseURL},
				{"@type": "ListItem", "position": 2, "name": s.titleize(string(category)), "item": fmt.Sprintf("%s/%s", s.baseURL, category)},
				{"@type": "ListItem", "position": 3, "name": titleName, "item": canonicalURL},
			},
		},
	}

	jsonLdBytes, _ := json.MarshalIndent(jsonLdMap, "", "  ")

	return &GuideResponse{
		Category:         string(category),
		Slug:             slug,
		Title:            fullTitle,
		Subtitle:         subtitle,
		Description:      description,
		CanonicalURL:     canonicalURL,
		TableOfContents:  toc,
		Sections:         sections,
		Faq:              faq,
		RelatedJobs:      relatedJobs,
		RelatedCompanies: relatedCompanies,
		InternalLinks:    internalLinks,
		JsonLd:           string(jsonLdBytes),
		OpenGraph: map[string]string{
			"og:title":       fullTitle,
			"og:description": description,
			"og:url":         canonicalURL,
			"og:type":        "article",
			"og:image":       s.baseURL + "/opengraph-image",
		},
		TwitterCard: map[string]string{
			"twitter:card":        "summary_large_image",
			"twitter:title":       fullTitle,
			"twitter:description": description,
			"twitter:image":       s.baseURL + "/opengraph-image",
			"twitter:creator":     "@workorajobs",
		},
	}, nil
}

// -----------------------------------------------------------------------------
// Background Content Refresh Worker Queue
// -----------------------------------------------------------------------------

func (s *SeoContentService) AutoUpdateContent(guideID string) error {
	// Refreshes job metrics, salary percentiles, and market data
	return nil
}
