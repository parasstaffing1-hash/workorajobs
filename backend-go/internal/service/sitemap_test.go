package service

import (
	"bytes"
	"compress/gzip"
	"io"
	"strings"
	"testing"
)

func TestSitemapEngineGenerators(t *testing.T) {
	svc := NewSitemapService(nil, "https://workorajobs.com")

	// 1. Sitemap Index
	indexXml := svc.GetSitemapIndex()
	if !strings.Contains(indexXml, "<sitemapindex") || !strings.Contains(indexXml, "jobs.xml") {
		t.Errorf("GetSitemapIndex failed, got:\n%s", indexXml)
	}

	// 2. Jobs Sitemap
	jobsXml := svc.GetJobsSitemap(1)
	if !strings.Contains(jobsXml, "<urlset") || !strings.Contains(jobsXml, "/jobs") {
		t.Errorf("GetJobsSitemap failed, got:\n%s", jobsXml)
	}

	// 3. Companies Sitemap
	companiesXml := svc.GetCompaniesSitemap()
	if !strings.Contains(companiesXml, "/companies") {
		t.Errorf("GetCompaniesSitemap failed, got:\n%s", companiesXml)
	}

	// 4. Skills Sitemap
	skillsXml := svc.GetSkillsSitemap()
	if !strings.Contains(skillsXml, "/skills/golang") {
		t.Errorf("GetSkillsSitemap failed, got:\n%s", skillsXml)
	}

	// 5. Cities Sitemap
	citiesXml := svc.GetCitiesSitemap()
	if !strings.Contains(citiesXml, "/jobs/location/bengaluru") {
		t.Errorf("GetCitiesSitemap failed, got:\n%s", citiesXml)
	}

	// 6. States Sitemap
	statesXml := svc.GetStatesSitemap()
	if !strings.Contains(statesXml, "/jobs/location/karnataka") {
		t.Errorf("GetStatesSitemap failed, got:\n%s", statesXml)
	}

	// 7. Salaries Sitemap
	salariesXml := svc.GetSalariesSitemap()
	if !strings.Contains(salariesXml, "/salary/compare") {
		t.Errorf("GetSalariesSitemap failed, got:\n%s", salariesXml)
	}

	// 8. Careers Sitemap
	careersXml := svc.GetCareersSitemap()
	if !strings.Contains(careersXml, "/prep") {
		t.Errorf("GetCareersSitemap failed, got:\n%s", careersXml)
	}

	// 9. Industries Sitemap
	industriesXml := svc.GetIndustriesSitemap()
	if !strings.Contains(industriesXml, "/industries/software-engineering") {
		t.Errorf("GetIndustriesSitemap failed, got:\n%s", industriesXml)
	}

	// 10. FAQ Sitemap
	faqXml := svc.GetFaqSitemap()
	if !strings.Contains(faqXml, "/faq") {
		t.Errorf("GetFaqSitemap failed, got:\n%s", faqXml)
	}

	// 11. Blog Sitemap
	blogXml := svc.GetBlogSitemap()
	if !strings.Contains(blogXml, "/blog/") {
		t.Errorf("GetBlogSitemap failed, got:\n%s", blogXml)
	}

	// 12. Static Sitemap
	staticXml := svc.GetStaticSitemap()
	if !strings.Contains(staticXml, "/privacy") {
		t.Errorf("GetStaticSitemap failed, got:\n%s", staticXml)
	}
}

func TestSitemapGzipCompression(t *testing.T) {
	svc := NewSitemapService(nil, "https://workorajobs.com")
	originalXml := svc.GetStaticSitemap()

	compressedBytes, err := svc.CompressXml(originalXml)
	if err != nil {
		t.Fatalf("CompressXml failed: %v", err)
	}

	gzReader, err := gzip.NewReader(bytes.NewReader(compressedBytes))
	if err != nil {
		t.Fatalf("Failed to create gzip reader: %v", err)
	}
	defer gzReader.Close()

	decompressedBytes, err := io.ReadAll(gzReader)
	if err != nil {
		t.Fatalf("Failed to decompress bytes: %v", err)
	}

	if string(decompressedBytes) != originalXml {
		t.Errorf("Decompressed XML does not match original XML")
	}
}
