package service

import (
	"bytes"
	"fmt"
	"testing"
)

func BenchmarkZeroAllocMemoryPool(b *testing.B) {
	svc := NewSeoOptimizationService(nil, "https://workorajobs.com")

	b.ReportAllocs()
	b.ResetTimer()

	for i := 0; i < b.N; i++ {
		buf := svc.GetBuffer()
		buf.WriteString("https://workorajobs.com/jobs/senior-golang-developer-")
		buf.WriteString(fmt.Sprintf("%d", i))
		svc.PutBuffer(buf)
	}
}

func BenchmarkMultiTierL1Caching(b *testing.B) {
	svc := NewSeoOptimizationService(nil, "https://workorajobs.com")

	key := "meta_job_100"
	generator := func() string {
		return "Senior Golang Developer Jobs in Bengaluru | WorkoraJobs"
	}

	// Warm cache
	svc.GetCachedMetadataOrGenerate(key, generator)

	b.ReportAllocs()
	b.ResetTimer()

	for i := 0; i < b.N; i++ {
		_ = svc.GetCachedMetadataOrGenerate(key, generator)
	}
}

func BenchmarkIncrementalFingerprintSkipping(b *testing.B) {
	svc := NewSeoOptimizationService(nil, "https://workorajobs.com")

	entityID := "job_1001"
	data := "Senior Golang Developer role overview content text..."
	generator := func() string {
		return "Generated full HTML page content"
	}

	// Warm fingerprint
	svc.IncrementalRegenerate(entityID, data, generator)

	b.ReportAllocs()
	b.ResetTimer()

	for i := 0; i < b.N; i++ {
		_, _ = svc.IncrementalRegenerate(entityID, data, generator)
	}
}

func TestStreamingSitemapChunkOutput(t *testing.T) {
	svc := NewSeoOptimizationService(nil, "https://workorajobs.com")

	var buf bytes.Buffer
	err := svc.StreamSitemapChunk(&buf, "jobs", 1)

	if err != nil {
		t.Fatalf("StreamSitemapChunk error: %v", err)
	}
	if buf.Len() == 0 {
		t.Fatalf("StreamSitemapChunk produced empty buffer")
	}

	metrics := svc.GetPerformanceMetrics()
	if metrics.TargetCapacity == "" {
		t.Errorf("TargetCapacity is empty")
	}
}
