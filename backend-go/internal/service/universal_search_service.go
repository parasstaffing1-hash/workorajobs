package service

import (
	"context"
	"fmt"
	"strings"
	"unicode"

	"github.com/workorajobs/backend-go/internal/domain/models"
	"gorm.io/gorm"
)

type UniversalSearchService struct {
	db       *gorm.DB
	synonyms map[string][]string
}

func NewUniversalSearchService(db *gorm.DB) *UniversalSearchService {
	return &UniversalSearchService{
		db: db,
		synonyms: map[string][]string{
			"developer":  {"engineer", "programmer", "coder", "dev"},
			"engineer":   {"developer", "programmer", "coder"},
			"manager":    {"lead", "head", "director"},
			"designer":   {"ui", "ux", "graphic"},
			"frontend":   {"front-end", "front end", "react", "angular", "vue"},
			"backend":    {"back-end", "back end", "server-side"},
			"fullstack":  {"full-stack", "full stack"},
			"devops":     {"sre", "infrastructure", "platform"},
			"data":       {"analytics", "ml", "machine learning", "ai"},
			"remote":     {"wfh", "work from home", "telecommute"},
			"internship": {"intern", "trainee", "apprentice"},
		},
	}
}

// CorrectSpelling applies Levenshtein-based typo tolerance
func (s *UniversalSearchService) CorrectSpelling(query string) string {
	words := strings.Fields(strings.ToLower(query))
	knownTerms := []string{
		"software", "engineer", "developer", "manager", "designer", "analyst",
		"marketing", "sales", "finance", "data", "product", "frontend", "backend",
		"devops", "remote", "intern", "internship", "government", "startup",
		"freelance", "contract", "bangalore", "mumbai", "delhi", "hyderabad",
	}

	var corrected []string
	for _, word := range words {
		bestMatch := word
		bestDist := 3 // Max edit distance threshold
		for _, known := range knownTerms {
			dist := levenshtein(word, known)
			if dist < bestDist && dist > 0 {
				bestDist = dist
				bestMatch = known
			}
		}
		corrected = append(corrected, bestMatch)
	}

	result := strings.Join(corrected, " ")
	if result != strings.ToLower(query) {
		return result
	}
	return ""
}

// ExpandSynonyms expands query with synonym terms
func (s *UniversalSearchService) ExpandSynonyms(query string) []string {
	words := strings.Fields(strings.ToLower(query))
	expanded := []string{query}

	for _, word := range words {
		if syns, ok := s.synonyms[word]; ok {
			for _, syn := range syns {
				expanded = append(expanded, strings.Replace(strings.ToLower(query), word, syn, 1))
			}
		}
	}

	return expanded
}

func (s *UniversalSearchService) Search(ctx context.Context, input *models.UniversalSearchQueryDTO) (*models.UniversalSearchResponseDTO, error) {
	corrected := s.CorrectSpelling(input.Query)

	searchQuery := input.Query
	if corrected != "" {
		searchQuery = corrected
	}

	q := "%" + searchQuery + "%"
	var results []models.UniversalSearchResultDTO
	facets := map[string][]models.FacetBucket{}

	if s.db != nil {
		// Search Jobs
		var jobs []models.Job
		jobQuery := s.db.Where("status = 'PUBLISHED' AND (title ILIKE ? OR description ILIKE ?)", q, q)
		if input.Location != "" {
			jobQuery = jobQuery.Where("location ILIKE ?", "%"+input.Location+"%")
		}
		jobQuery.Preload("Company").Limit(input.Limit).Find(&jobs)

		jobCount := int64(0)
		for _, job := range jobs {
			location := ""
			if job.Location != nil {
				location = *job.Location
			}
			results = append(results, models.UniversalSearchResultDTO{
				ID:       job.ID,
				Type:     models.SearchTypeJob,
				Title:    job.Title,
				Subtitle: location,
				URL:      fmt.Sprintf("/jobs/%s", job.ID),
				Score:    s.computeBoost(searchQuery, job.Title, string(models.SearchTypeJob)),
			})
			jobCount++
		}

		// Search Companies
		var companies []models.Company
		s.db.Where("name ILIKE ?", q).Limit(5).Find(&companies)
		companyCount := int64(0)
		for _, company := range companies {
			industry := ""
			if company.Industry != nil {
				industry = *company.Industry
			}
			slug := company.ID
			if company.Slug != nil {
				slug = *company.Slug
			}
			results = append(results, models.UniversalSearchResultDTO{
				ID:       company.ID,
				Type:     models.SearchTypeCompany,
				Title:    company.Name,
				Subtitle: industry,
				URL:      fmt.Sprintf("/companies/%s", slug),
				Score:    s.computeBoost(searchQuery, company.Name, string(models.SearchTypeCompany)),
			})
			companyCount++
		}

		facets["type"] = []models.FacetBucket{
			{Key: "JOB", Count: jobCount},
			{Key: "COMPANY", Count: companyCount},
		}
	}

	// Sort results by score descending
	for i := 0; i < len(results); i++ {
		for j := i + 1; j < len(results); j++ {
			if results[j].Score > results[i].Score {
				results[i], results[j] = results[j], results[i]
			}
		}
	}

	return &models.UniversalSearchResponseDTO{
		Query:          input.Query,
		CorrectedQuery: corrected,
		TotalResults:   int64(len(results)),
		Results:        results,
		Facets:         facets,
	}, nil
}

func (s *UniversalSearchService) Autocomplete(ctx context.Context, query string) (*models.AutocompleteResponseDTO, error) {
	var suggestions []models.AutocompleteSuggestion

	if s.db != nil {
		q := query + "%"

		var titles []string
		s.db.Model(&models.Job{}).Where("title ILIKE ? AND status = 'PUBLISHED'", q).
			Distinct().Limit(5).Pluck("title", &titles)
		for _, t := range titles {
			suggestions = append(suggestions, models.AutocompleteSuggestion{
				Text: t, Type: models.SearchTypeJob,
			})
		}

		var companyNames []string
		s.db.Model(&models.Company{}).Where("name ILIKE ?", q).
			Limit(3).Pluck("name", &companyNames)
		for _, c := range companyNames {
			suggestions = append(suggestions, models.AutocompleteSuggestion{
				Text: c, Type: models.SearchTypeCompany,
			})
		}
	}

	// Add synonym expansions as suggestions
	expanded := s.ExpandSynonyms(query)
	for _, exp := range expanded {
		if exp != query && len(suggestions) < 10 {
			suggestions = append(suggestions, models.AutocompleteSuggestion{
				Text: exp, Type: models.SearchTypeJob, Subtitle: "Related search",
			})
		}
	}

	return &models.AutocompleteResponseDTO{
		Query:       query,
		Suggestions: suggestions,
	}, nil
}

func (s *UniversalSearchService) GetTrendingSearches(ctx context.Context) ([]models.TrendingSearchDTO, error) {
	return []models.TrendingSearchDTO{
		{Query: "remote software engineer", SearchCount: 45200},
		{Query: "data scientist intern", SearchCount: 38700},
		{Query: "product manager startup", SearchCount: 31500},
		{Query: "devops engineer bangalore", SearchCount: 28900},
		{Query: "frontend developer react", SearchCount: 25600},
		{Query: "government jobs SSC", SearchCount: 22100},
		{Query: "visa sponsorship USA", SearchCount: 19800},
		{Query: "walk-in interview today", SearchCount: 17400},
		{Query: "fresher jobs IT", SearchCount: 15200},
		{Query: "work from home freelance", SearchCount: 12800},
	}, nil
}

// computeBoost applies boosted relevance scoring
func (s *UniversalSearchService) computeBoost(query, title, resultType string) float64 {
	score := 50.0
	queryLower := strings.ToLower(query)
	titleLower := strings.ToLower(title)

	// Exact title match
	if titleLower == queryLower {
		score += 50.0
	} else if strings.HasPrefix(titleLower, queryLower) {
		score += 30.0
	} else if strings.Contains(titleLower, queryLower) {
		score += 15.0
	}

	// Type boosting: jobs rank higher than companies in search
	switch resultType {
	case "JOB":
		score += 10.0
	case "COMPANY":
		score += 5.0
	}

	return score
}

// levenshtein computes edit distance between two strings
func levenshtein(a, b string) int {
	a = strings.ToLower(a)
	b = strings.ToLower(b)

	// Strip non-letter chars
	filterLetters := func(s string) string {
		var result []rune
		for _, r := range s {
			if unicode.IsLetter(r) {
				result = append(result, r)
			}
		}
		return string(result)
	}
	a = filterLetters(a)
	b = filterLetters(b)

	if a == b {
		return 0
	}

	la, lb := len(a), len(b)
	if la == 0 {
		return lb
	}
	if lb == 0 {
		return la
	}

	prev := make([]int, lb+1)
	curr := make([]int, lb+1)

	for j := 0; j <= lb; j++ {
		prev[j] = j
	}

	for i := 1; i <= la; i++ {
		curr[0] = i
		for j := 1; j <= lb; j++ {
			cost := 1
			if a[i-1] == b[j-1] {
				cost = 0
			}
			curr[j] = min3(curr[j-1]+1, prev[j]+1, prev[j-1]+cost)
		}
		prev, curr = curr, prev
	}

	return prev[lb]
}

func min3(a, b, c int) int {
	if a < b {
		if a < c {
			return a
		}
		return c
	}
	if b < c {
		return b
	}
	return c
}
