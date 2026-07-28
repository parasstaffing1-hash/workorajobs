package service

import (
	"encoding/json"
	"fmt"
	"strings"

	"gorm.io/gorm"
)

type PseoDimension string

const (
	DimensionJobs            PseoDimension = "jobs"
	DimensionCompanies       PseoDimension = "companies"
	DimensionCities          PseoDimension = "cities"
	DimensionStates          PseoDimension = "states"
	DimensionCountries       PseoDimension = "countries"
	DimensionSkills          PseoDimension = "skills"
	DimensionIndustries      PseoDimension = "industries"
	DimensionSalaries        PseoDimension = "salaries"
	DimensionInterviewQs     PseoDimension = "interview-questions"
	DimensionCareerPaths     PseoDimension = "career-paths"
	DimensionCertifications  PseoDimension = "certifications"
	DimensionRemoteJobs      PseoDimension = "remote-jobs"
	DimensionGovtJobs        PseoDimension = "govt-jobs"
	DimensionStartupJobs     PseoDimension = "startup-jobs"
	DimensionWalkinJobs      PseoDimension = "walkin-jobs"
	DimensionVisaSponsorship PseoDimension = "visa-sponsorship-jobs"
)

type RelatedLink struct {
	Title string `json:"title"`
	URL   string `json:"url"`
	Type  string `json:"type"`
}

type PseoBreadcrumb struct {
	Name string `json:"name"`
	URL  string `json:"url"`
}

type PseoPageResponse struct {
	Dimension     string            `json:"dimension"`
	Slug          string            `json:"slug"`
	Title         string            `json:"title"`
	Description   string            `json:"description"`
	CanonicalURL  string            `json:"canonicalUrl"`
	JsonLd        string            `json:"jsonLd"`
	OpenGraph     map[string]string `json:"openGraph"`
	TwitterCard   map[string]string `json:"twitterCard"`
	Breadcrumbs   []PseoBreadcrumb  `json:"breadcrumbs"`
	RelatedPages  []RelatedLink     `json:"relatedPages"`
	InternalLinks []RelatedLink     `json:"internalLinks"`
}

type PseoService struct {
	db         *gorm.DB
	seoService *SeoService
	baseURL    string
}

func NewPseoService(db *gorm.DB, seoService *SeoService, baseURL string) *PseoService {
	if baseURL == "" {
		baseURL = "https://workorajobs.com"
	}
	if seoService == nil {
		seoService = NewSeoServiceWithBaseURL(db, baseURL)
	}
	return &PseoService{
		db:         db,
		seoService: seoService,
		baseURL:    strings.TrimRight(baseURL, "/"),
	}
}

func (s *PseoService) Titleize(slug string) string {
	parts := strings.Split(slug, "-")
	for i, p := range parts {
		if len(p) > 0 {
			parts[i] = strings.ToUpper(p[:1]) + p[1:]
		}
	}
	return strings.Join(parts, " ")
}

// -----------------------------------------------------------------------------
// Core Programmatic SEO Page Resolver (16 Dimensions)
// -----------------------------------------------------------------------------

func (s *PseoService) ResolvePseoPage(dimensionStr string, rawSlug string) (*PseoPageResponse, error) {
	dimension := PseoDimension(strings.ToLower(strings.TrimSpace(dimensionStr)))
	slug := strings.ToLower(strings.TrimSpace(rawSlug))
	if slug == "" {
		slug = "all"
	}

	titleName := s.Titleize(slug)
	siteName := "WorkoraJobs"

	var title string
	var description string
	var relativePath string
	var primaryType string

	switch dimension {
	case DimensionJobs:
		relativePath = fmt.Sprintf("/jobs/%s", slug)
		title = fmt.Sprintf("%s Jobs & Careers", titleName)
		description = fmt.Sprintf("Apply to active %s roles. Verified compensation, remote flexibility, and career insights on WorkoraJobs.", titleName)
		primaryType = "JobPosting"

	case DimensionCompanies:
		relativePath = fmt.Sprintf("/companies/%s", slug)
		title = fmt.Sprintf("%s Careers, Jobs & Company Profile", titleName)
		description = fmt.Sprintf("Explore open positions, company culture, salary insights, and tech stack at %s.", titleName)
		primaryType = "Organization"

	case DimensionCities:
		relativePath = fmt.Sprintf("/jobs/location/%s", slug)
		title = fmt.Sprintf("Tech & Remote Jobs in %s", titleName)
		description = fmt.Sprintf("Find top software engineering, product, and data jobs hiring in %s. Compare salaries and apply directly.", titleName)
		primaryType = "CollectionPage"

	case DimensionStates:
		relativePath = fmt.Sprintf("/jobs/location/state/%s", slug)
		title = fmt.Sprintf("Jobs in %s State | Hiring Openings", titleName)
		description = fmt.Sprintf("Browse verified technology, engineering, and remote career opportunities across %s.", titleName)
		primaryType = "CollectionPage"

	case DimensionCountries:
		relativePath = fmt.Sprintf("/companies/country/%s", slug)
		title = fmt.Sprintf("Global Tech Employers & Companies in %s", titleName)
		description = fmt.Sprintf("Discover leading technology companies hiring verified talent in %s with remote and international sponsorship.", titleName)
		primaryType = "CollectionPage"

	case DimensionSkills:
		relativePath = fmt.Sprintf("/skills/%s", slug)
		title = fmt.Sprintf("%s Developer Jobs & Hiring Companies", titleName)
		description = fmt.Sprintf("Find high-paying %s developer roles. Compare salaries, required skills, and top tech companies hiring %s experts.", titleName, titleName)
		primaryType = "ItemPage"

	case DimensionIndustries:
		relativePath = fmt.Sprintf("/industries/%s", slug)
		title = fmt.Sprintf("%s Industry Careers & Tech Roles", titleName)
		description = fmt.Sprintf("Explore career growth, hiring companies, and open engineering positions in the %s industry.", titleName)
		primaryType = "ItemPage"

	case DimensionSalaries:
		relativePath = fmt.Sprintf("/salary/%s", slug)
		title = fmt.Sprintf("%s Salary Benchmark & Compensation Guide", titleName)
		description = fmt.Sprintf("Check current %s salary averages, experience level breakdowns, and top paying locations on WorkoraJobs.", titleName)
		primaryType = "FAQPage"

	case DimensionInterviewQs:
		relativePath = fmt.Sprintf("/prep/interview-questions/%s", slug)
		title = fmt.Sprintf("Top %s Interview Questions & Answers", titleName)
		description = fmt.Sprintf("Master your %s technical interview with real questions, system design walkthroughs, and expert answers.", titleName)
		primaryType = "FAQPage"

	case DimensionCareerPaths:
		relativePath = fmt.Sprintf("/prep/career-paths/%s", slug)
		title = fmt.Sprintf("%s Career Path, Roadmap & Salary Growth", titleName)
		description = fmt.Sprintf("Complete %s career roadmap. Learn required skills, progression levels, certifications, and target salaries.", titleName)
		primaryType = "ItemPage"

	case DimensionCertifications:
		relativePath = fmt.Sprintf("/prep/certifications/%s", slug)
		title = fmt.Sprintf("%s Certification Prep & Exam Guide", titleName)
		description = fmt.Sprintf("Prepare for %s certification exam. Practice questions, syllabus highlights, and career impact insights.", titleName)
		primaryType = "ItemPage"

	case DimensionRemoteJobs:
		relativePath = fmt.Sprintf("/remote-jobs/%s", slug)
		title = fmt.Sprintf("Remote %s Jobs | Work From Anywhere", titleName)
		description = fmt.Sprintf("Find 100%% remote %s jobs from global startups and Fortune 500 technology companies.", titleName)
		primaryType = "CollectionPage"

	case DimensionGovtJobs:
		relativePath = fmt.Sprintf("/govt-jobs/%s", slug)
		title = fmt.Sprintf("Government & Public Sector Jobs in %s", titleName)
		description = fmt.Sprintf("Official public sector notifications, engineering exams, and government job updates in %s.", titleName)
		primaryType = "CollectionPage"

	case DimensionStartupJobs:
		relativePath = fmt.Sprintf("/companies/startups/%s", slug)
		title = fmt.Sprintf("High-Growth %s Startup Jobs & Equity Roles", titleName)
		description = fmt.Sprintf("Join funded %s startups. Explore competitive compensation, equity options, and high-impact engineering roles.", titleName)
		primaryType = "CollectionPage"

	case DimensionWalkinJobs:
		relativePath = fmt.Sprintf("/walkin-jobs/%s", slug)
		title = fmt.Sprintf("Walk-in Interviews & Direct Hiring Drives in %s", titleName)
		description = fmt.Sprintf("Upcoming walk-in interview drives in %s for freshers and experienced tech candidates.", titleName)
		primaryType = "CollectionPage"

	case DimensionVisaSponsorship:
		relativePath = fmt.Sprintf("/visa-sponsorship-jobs/%s", slug)
		title = fmt.Sprintf("Visa Sponsorship %s Jobs | Relocation Options", titleName)
		description = fmt.Sprintf("Discover international %s roles offering full visa sponsorship, work permits, and relocation packages.", titleName)
		primaryType = "JobPosting"

	default:
		return nil, fmt.Errorf("unsupported pSEO dimension: %s", dimensionStr)
	}

	canonicalURL := s.seoService.BuildCanonicalURL(relativePath)
	fullTitle := fmt.Sprintf("%s | %s", title, siteName)

	breadcrumbs := []PseoBreadcrumb{
		{Name: "Home", URL: s.baseURL},
		{Name: s.Titleize(string(dimension)), URL: fmt.Sprintf("%s/%s", s.baseURL, dimension)},
		{Name: titleName, URL: canonicalURL},
	}

	// Build JSON-LD
	jsonLdMap := map[string]interface{}{
		"@context": "https://schema.org",
		"@type":    primaryType,
		"name":     fullTitle,
		"url":      canonicalURL,
		"description": description,
		"breadcrumb": map[string]interface{}{
			"@type": "BreadcrumbList",
			"itemListElement": []map[string]interface{}{
				{"@type": "ListItem", "position": 1, "name": "Home", "item": s.baseURL},
				{"@type": "ListItem", "position": 2, "name": s.Titleize(string(dimension)), "item": fmt.Sprintf("%s/%s", s.baseURL, dimension)},
				{"@type": "ListItem", "position": 3, "name": titleName, "item": canonicalURL},
			},
		},
	}

	jsonLdBytes, _ := json.MarshalIndent(jsonLdMap, "", "  ")

	relatedPages, internalLinks := s.GenerateRelatedInternalLinks(dimension, slug)

	return &PseoPageResponse{
		Dimension:    string(dimension),
		Slug:         slug,
		Title:        fullTitle,
		Description:  description,
		CanonicalURL: canonicalURL,
		JsonLd:       string(jsonLdBytes),
		OpenGraph: map[string]string{
			"og:title":       fullTitle,
			"og:description": description,
			"og:url":         canonicalURL,
			"og:type":        "website",
			"og:image":       s.baseURL + "/opengraph-image",
		},
		TwitterCard: map[string]string{
			"twitter:card":        "summary_large_image",
			"twitter:title":       fullTitle,
			"twitter:description": description,
			"twitter:image":       s.baseURL + "/opengraph-image",
			"twitter:creator":     "@workorajobs",
		},
		Breadcrumbs:   breadcrumbs,
		RelatedPages:  relatedPages,
		InternalLinks: internalLinks,
	}, nil
}

// -----------------------------------------------------------------------------
// Internal Cross-Linking Graph Engine
// -----------------------------------------------------------------------------

func (s *PseoService) GenerateRelatedInternalLinks(dimension PseoDimension, slug string) ([]RelatedLink, []RelatedLink) {
	titleName := s.Titleize(slug)

	var relatedPages []RelatedLink
	var internalLinks []RelatedLink

	// Cross-link network algorithms
	relatedPages = append(relatedPages,
		RelatedLink{Title: fmt.Sprintf("Remote %s Jobs", titleName), URL: fmt.Sprintf("%s/remote-jobs/%s", s.baseURL, slug), Type: "remote"},
		RelatedLink{Title: fmt.Sprintf("%s Salary Guide", titleName), URL: fmt.Sprintf("%s/salary/%s", s.baseURL, slug), Type: "salary"},
		RelatedLink{Title: fmt.Sprintf("%s Interview Questions", titleName), URL: fmt.Sprintf("%s/prep/interview-questions/%s", s.baseURL, slug), Type: "prep"},
		RelatedLink{Title: fmt.Sprintf("Visa Sponsorship %s Roles", titleName), URL: fmt.Sprintf("%s/visa-sponsorship-jobs/%s", s.baseURL, slug), Type: "visa"},
	)

	internalLinks = append(internalLinks,
		RelatedLink{Title: "Browse All Jobs", URL: s.baseURL + "/jobs", Type: "jobs"},
		RelatedLink{Title: "Top Verified Companies", URL: s.baseURL + "/companies", Type: "companies"},
		RelatedLink{Title: "Tech Salaries & Benchmarks", URL: s.baseURL + "/salary/compare", Type: "salary"},
		RelatedLink{Title: "Career Prep & Practice", URL: s.baseURL + "/prep", Type: "prep"},
	)

	return relatedPages, internalLinks
}
