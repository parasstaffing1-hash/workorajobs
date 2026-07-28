package crawler

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"strings"
)

type Deduplicator struct{}

func NewDeduplicator() *Deduplicator {
	return &Deduplicator{}
}

func (d *Deduplicator) ComputeFingerprint(company, title, location, description string) string {
	cleanCompany := strings.ToLower(strings.TrimSpace(company))
	cleanTitle := strings.ToLower(strings.TrimSpace(title))
	cleanLocation := strings.ToLower(strings.TrimSpace(location))
	cleanDesc := strings.ToLower(strings.TrimSpace(description))

	if len(cleanDesc) > 200 {
		cleanDesc = cleanDesc[:200] // Fingerprint first 200 chars of normalized text
	}

	raw := fmt.Sprintf("%s|%s|%s|%s", cleanCompany, cleanTitle, cleanLocation, cleanDesc)
	hash := sha256.Sum256([]byte(raw))
	return hex.EncodeToString(hash[:])
}
