package crawler

import (
	"encoding/xml"
	"io"
	"time"

	"github.com/workorajobs/backend-go/internal/domain/models"
)

type RSSChannel struct {
	Items []RSSItem `xml:"channel>item"`
}

type RSSItem struct {
	Title       string `xml:"title"`
	Link        string `xml:"link"`
	Description string `xml:"description"`
	PubDate     string `xml:"pubDate"`
	GUID        string `xml:"guid"`
}

func ParseRSSFeed(r io.Reader, sourceID string) ([]models.CrawledJobItem, error) {
	var channel RSSChannel
	decoder := xml.NewDecoder(r)
	if err := decoder.Decode(&channel); err != nil {
		return nil, err
	}

	dedup := NewDeduplicator()
	var jobs []models.CrawledJobItem

	for _, item := range channel.Items {
		pubTime, err := time.Parse(time.RFC1123, item.PubDate)
		if err != nil {
			pubTime = time.Now()
		}

		hash := dedup.ComputeFingerprint("RSS Source", item.Title, "Global", item.Description)

		jobs = append(jobs, models.CrawledJobItem{
			SourceID:    sourceID,
			ExternalID:  item.GUID,
			Title:       item.Title,
			Company:     "Verified Feed Company",
			Location:    "Remote",
			Description: item.Description,
			ApplyURL:    item.Link,
			JobType:     "FULL_TIME",
			WorkMode:    "Remote",
			ContentHash: hash,
			PublishedAt: pubTime,
		})
	}

	return jobs, nil
}
