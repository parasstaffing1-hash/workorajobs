package service

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/workorajobs/backend-go/internal/domain/models"
	"gorm.io/gorm"
)

type SeoService struct {
	db *gorm.DB
}

func NewSeoService(db *gorm.DB) *SeoService {
	return &SeoService{db: db}
}

type JobPostingSchema struct {
	Context     string `json:"@context"`
	Type        string `json:"@type"`
	Title       string `json:"title"`
	Description string `json:"description"`
	DatePosted  string `json:"datePosted"`
	ValidThrough string `json:"validThrough,omitempty"`
	EmploymentType string `json:"employmentType"`
	HiringOrganization map[string]interface{} `json:"hiringOrganization"`
	JobLocation map[string]interface{} `json:"jobLocation"`
}

func (s *SeoService) GenerateJobPostingSchema(job *models.Job) (string, error) {
	companyName := "WorkoraJobs Verified Partner"
	if job.Company != nil {
		companyName = job.Company.Name
	}

	locationName := "Remote / Global"
	if job.Location != nil {
		locationName = *job.Location
	}

	schema := JobPostingSchema{
		Context:     "https://schema.org",
		Type:        "JobPosting",
		Title:       job.Title,
		Description: job.Description,
		DatePosted:  job.PostedAt.Format(time.RFC3339),
		EmploymentType: string(job.Type),
		HiringOrganization: map[string]interface{}{
			"@type": "Organization",
			"name":  companyName,
		},
		JobLocation: map[string]interface{}{
			"@type": "Place",
			"address": map[string]interface{}{
				"@type": "PostalAddress",
				"addressLocality": locationName,
			},
		},
	}

	bytes, err := json.MarshalIndent(schema, "", "  ")
	if err != nil {
		return "", err
	}

	return string(bytes), nil
}

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
