package crawler

import (
	"testing"
)

func TestDeduplicatorFingerprint(t *testing.T) {
	dedup := NewDeduplicator()

	fp1 := dedup.ComputeFingerprint("Acme Corp", "Senior Go Engineer", "Remote", "We are hiring a Senior Go Engineer...")
	fp2 := dedup.ComputeFingerprint("acme corp", "Senior Go Engineer ", "remote", "WE ARE HIRING A SENIOR GO ENGINEER...")

	if fp1 != fp2 {
		t.Fatalf("Expected identical fingerprint for normalized inputs, got %s vs %s", fp1, fp2)
	}

	fpDifferent := dedup.ComputeFingerprint("Acme Corp", "Senior React Engineer", "Remote", "We are hiring...")
	if fp1 == fpDifferent {
		t.Fatalf("Expected different fingerprint for different title")
	}
}
