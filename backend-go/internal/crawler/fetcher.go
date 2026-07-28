package crawler

import (
	"context"
	"fmt"
	"net/http"
	"time"
)

type Fetcher struct {
	client    *http.Client
	userAgent string
}

func NewFetcher() *Fetcher {
	return &Fetcher{
		client: &http.Client{
			Timeout: 15 * time.Second,
		},
		userAgent: "WorkoraBot/1.0 (+https://workorajobs.com/bot; bot@workorajobs.com)",
	}
}

func (f *Fetcher) Fetch(ctx context.Context, targetURL string, etag, lastModified string) (*http.Response, error) {
	req, err := http.NewRequestWithContext(ctx, "GET", targetURL, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("User-Agent", f.userAgent)
	if etag != "" {
		req.Header.Set("If-None-Match", etag)
	}
	if lastModified != "" {
		req.Header.Set("If-Modified-Since", lastModified)
	}

	resp, err := f.client.Do(req)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode == http.StatusNotModified {
		resp.Body.Close()
		return nil, nil // Not modified, skip parsing
	}

	if resp.StatusCode >= 400 {
		resp.Body.Close()
		return nil, fmt.Errorf("http request failed with status code: %d", resp.StatusCode)
	}

	return resp, nil
}
