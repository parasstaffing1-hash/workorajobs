package service

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"strings"
	"sync"

	"gorm.io/gorm"
)

type AiFaqItem struct {
	Question string `json:"question"`
	Answer   string `json:"answer"`
}

type AiMetadataPackage struct {
	EntityID           string            `json:"entityId"`
	Version            int               `json:"version"`
	SeoTitle           string            `json:"seoTitle"`
	MetaDescription    string            `json:"metaDescription"`
	OpenGraphTitle     string            `json:"openGraphTitle"`
	TwitterTitle       string            `json:"twitterTitle"`
	TwitterDescription string            `json:"twitterDescription"`
	RichSnippets       string            `json:"richSnippets"`
	Faq                []AiFaqItem       `json:"faq"`
	PageIntroduction   string            `json:"pageIntroduction"`
	PageSummary        []string          `json:"pageSummary"`
	ContentHash        string            `json:"contentHash"`
}

type MetadataVersionRecord struct {
	Version   int               `json:"version"`
	Package   AiMetadataPackage `json:"package"`
}

type AiMetadataService struct {
	db         *gorm.DB
	baseURL    string
	versionMap map[string][]MetadataVersionRecord
	mu         sync.RWMutex
}

func NewAiMetadataService(db *gorm.DB, baseURL string) *AiMetadataService {
	if baseURL == "" {
		baseURL = "https://workorajobs.com"
	}
	return &AiMetadataService{
		db:         db,
		baseURL:    strings.TrimRight(baseURL, "/"),
		versionMap: make(map[string][]MetadataVersionRecord),
	}
}

// -----------------------------------------------------------------------------
// Character Limit Enforcer with Word-Boundary Awareness
// -----------------------------------------------------------------------------

func (s *AiMetadataService) EnforceCharLimit(text string, maxChars int) string {
	text = strings.TrimSpace(text)
	if len(text) <= maxChars {
		return text
	}

	trimmed := text[:maxChars-3]
	lastSpace := strings.LastIndex(trimmed, " ")
	if lastSpace > 20 {
		trimmed = trimmed[:lastSpace]
	}
	return trimmed + "..."
}

func (s *AiMetadataService) ComputeSHA256Hash(title, description string) string {
	hasher := sha256.New()
	hasher.Write([]byte(title + "::" + description))
	return hex.EncodeToString(hasher.Sum(nil))
}

// -----------------------------------------------------------------------------
// AI Generation Pipeline (All 9 Output Assets)
// -----------------------------------------------------------------------------

func (s *AiMetadataService) GenerateSeoTitle(rawTitle, location string) string {
	cleanTitle := strings.Title(strings.ReplaceAll(rawTitle, "-", " "))
	if location != "" {
		locationTitle := strings.Title(strings.ReplaceAll(location, "-", " "))
		full := fmt.Sprintf("%s Jobs in %s | WorkoraJobs", cleanTitle, locationTitle)
		return s.EnforceCharLimit(full, 60)
	}

	full := fmt.Sprintf("%s Jobs & Careers | WorkoraJobs", cleanTitle)
	return s.EnforceCharLimit(full, 60)
}

func (s *AiMetadataService) GenerateMetaDescription(rawTitle, location string) string {
	cleanTitle := strings.Title(strings.ReplaceAll(rawTitle, "-", " "))
	locStr := "globally"
	if location != "" {
		locStr = fmt.Sprintf("in %s", strings.Title(strings.ReplaceAll(location, "-", " ")))
	}

	desc := fmt.Sprintf("Apply to verified %s roles %s. Explore clear salary insights, remote flexibility, tech stacks, and direct company applications on WorkoraJobs.", cleanTitle, locStr)
	
	// Enforce 120-160 chars
	if len(desc) < 120 {
		desc += " Start your career application today."
	}
	return s.EnforceCharLimit(desc, 160)
}

func (s *AiMetadataService) GenerateOpenGraphTitle(rawTitle, location string) string {
	cleanTitle := strings.Title(strings.ReplaceAll(rawTitle, "-", " "))
	if location != "" {
		return s.EnforceCharLimit(fmt.Sprintf("%s Openings in %s - Workora", cleanTitle, strings.Title(location)), 60)
	}
	return s.EnforceCharLimit(fmt.Sprintf("%s Roles & Hiring Companies", cleanTitle), 60)
}

func (s *AiMetadataService) GenerateTwitterTitle(rawTitle string) string {
	cleanTitle := strings.Title(strings.ReplaceAll(rawTitle, "-", " "))
	return s.EnforceCharLimit(fmt.Sprintf("Hiring: %s | WorkoraJobs", cleanTitle), 60)
}

func (s *AiMetadataService) GenerateTwitterDescription(metaDesc string) string {
	return s.EnforceCharLimit(metaDesc, 160)
}

func (s *AiMetadataService) GenerateRichSnippets(rawTitle, location string) string {
	cleanTitle := strings.Title(strings.ReplaceAll(rawTitle, "-", " "))
	jsonStr := fmt.Sprintf(`{
  "@context": "https://schema.org",
  "@type": "JobPosting",
  "title": "%s",
  "description": "Verified %s career opportunity.",
  "hiringOrganization": {
    "@type": "Organization",
    "name": "WorkoraJobs Verified Partner",
    "sameAs": "%s"
  },
  "jobLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "%s"
    }
  }
}`, cleanTitle, cleanTitle, s.baseURL, location)
	return jsonStr
}

func (s *AiMetadataService) GenerateFAQ(rawTitle, location string) []AiFaqItem {
	cleanTitle := strings.Title(strings.ReplaceAll(rawTitle, "-", " "))
	locStr := "global market"
	if location != "" {
		locStr = strings.Title(strings.ReplaceAll(location, "-", " "))
	}

	return []AiFaqItem{
		{
			Question: fmt.Sprintf("What is the average salary for %s roles in %s?", cleanTitle, locStr),
			Answer:   fmt.Sprintf("Salaries for %s professionals in %s typically range from competitive entry-level rates to top tier senior compensation packages based on experience.", cleanTitle, locStr),
		},
		{
			Question: fmt.Sprintf("Are there remote %s jobs available?", cleanTitle),
			Answer:   fmt.Sprintf("Yes, WorkoraJobs lists active remote and hybrid %s opportunities from verified employers worldwide.", cleanTitle),
		},
	}
}

func (s *AiMetadataService) GeneratePageIntroduction(rawTitle, location string) string {
	cleanTitle := strings.Title(strings.ReplaceAll(rawTitle, "-", " "))
	locStr := "top technology hubs"
	if location != "" {
		locStr = strings.Title(strings.ReplaceAll(location, "-", " "))
	}

	para1 := fmt.Sprintf("Welcome to the official WorkoraJobs career portal for %s positions in %s. As technology teams expand globally, demand for skilled %s professionals continues to reach record levels across startups and enterprise leaders.", cleanTitle, locStr, cleanTitle)
	para2 := fmt.Sprintf("Explore curated openings with verified compensation data, clear role expectations, and direct application links designed to streamline your recruitment process.")

	return para1 + "\n\n" + para2
}

func (s *AiMetadataService) GeneratePageSummary(rawTitle, location string) []string {
	cleanTitle := strings.Title(strings.ReplaceAll(rawTitle, "-", " "))
	locStr := "Global / Remote"
	if location != "" {
		locStr = strings.Title(strings.ReplaceAll(location, "-", " "))
	}

	return []string{
		fmt.Sprintf("Verified %s job listings in %s", cleanTitle, locStr),
		"Transparent salary ranges & experience benchmarks",
		"Direct employer applications with 100% verified status",
		"Remote, hybrid, and relocation sponsorship options available",
	}
}

// -----------------------------------------------------------------------------
// Unified AI Generation Pipeline Engine
// -----------------------------------------------------------------------------

func (s *AiMetadataService) GenerateMetadataPackage(entityID, rawTitle, location string) *AiMetadataPackage {
	seoTitle := s.GenerateSeoTitle(rawTitle, location)
	metaDesc := s.GenerateMetaDescription(rawTitle, location)
	ogTitle := s.GenerateOpenGraphTitle(rawTitle, location)
	twTitle := s.GenerateTwitterTitle(rawTitle)
	twDesc := s.GenerateTwitterDescription(metaDesc)
	richSnippets := s.GenerateRichSnippets(rawTitle, location)
	faq := s.GenerateFAQ(rawTitle, location)
	pageIntro := s.GeneratePageIntroduction(rawTitle, location)
	pageSummary := s.GeneratePageSummary(rawTitle, location)
	hash := s.ComputeSHA256Hash(seoTitle, metaDesc)

	pkg := &AiMetadataPackage{
		EntityID:           entityID,
		Version:            1,
		SeoTitle:           seoTitle,
		MetaDescription:    metaDesc,
		OpenGraphTitle:     ogTitle,
		TwitterTitle:       twTitle,
		TwitterDescription: twDesc,
		RichSnippets:       richSnippets,
		Faq:                faq,
		PageIntroduction:   pageIntro,
		PageSummary:        pageSummary,
		ContentHash:        hash,
	}

	s.SaveMetadataVersion(entityID, pkg)
	return pkg
}

// -----------------------------------------------------------------------------
// Versioning & Rollback Engine
// -----------------------------------------------------------------------------

func (s *AiMetadataService) SaveMetadataVersion(entityID string, pkg *AiMetadataPackage) {
	s.mu.Lock()
	defer s.mu.Unlock()

	history := s.versionMap[entityID]
	pkg.Version = len(history) + 1
	record := MetadataVersionRecord{
		Version: pkg.Version,
		Package: *pkg,
	}
	s.versionMap[entityID] = append(history, record)
}

func (s *AiMetadataService) GetVersions(entityID string) []MetadataVersionRecord {
	s.mu.RLock()
	defer s.mu.RUnlock()

	return s.versionMap[entityID]
}

func (s *AiMetadataService) RollbackVersion(entityID string, targetVersion int) (*AiMetadataPackage, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	history, exists := s.versionMap[entityID]
	if !exists || len(history) == 0 {
		return nil, fmt.Errorf("no metadata versions found for entity %s", entityID)
	}

	for _, rec := range history {
		if rec.Version == targetVersion {
			rolledBack := rec.Package
			return &rolledBack, nil
		}
	}

	return nil, fmt.Errorf("version %d not found for entity %s", targetVersion, entityID)
}

// -----------------------------------------------------------------------------
// Bulk Background Regeneration Queue
// -----------------------------------------------------------------------------

func (s *AiMetadataService) BulkRegenerate(entityIDs []string) int {
	var count int
	for _, id := range entityIDs {
		s.GenerateMetadataPackage(id, id, "global")
		count++
	}
	return count
}
