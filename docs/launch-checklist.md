# WorkoraJobs Production Launch Checklist (RC1)

This checklist covers the final steps required for the official public launch of **WorkoraJobs**. Follow these steps to ensure a flawless launch.

---

## 🚀 Pre-Launch Verification Checklist

### 1. Database & Schema Verification
- [ ] Prisma schema successfully generated via `npx prisma generate`
- [ ] Database migrations applied successfully on production PostgreSQL instance
- [ ] DB unique indices verified on `slug` and `url` columns for high-speed queries
- [ ] Database connection limits configured to prevent exhaustion

### 2. Infrastructure & Caching
- [ ] Redis instance is online and healthy
- [ ] BullMQ queues configured with correct exponential retry schedules
- [ ] Session tokens authenticated via strong, custom HMAC-SHA256 secrets (`JWT_SECRET`)
- [ ] Daily automatic PostgreSQL backups scheduled with 7-day retention

### 3. Technical SEO Configuration
- [ ] Dynamic `/robots.txt` endpoint verified and active
- [ ] Dynamic `/sitemap.xml` index successfully registers all programmatic pages
- [ ] Meta tags, descriptions, and Open Graph tags verified across all templates
- [ ] Absolute canonical URLs matching corresponding page URLs verified

### 4. Search Engine Connections
- [ ] Google Search Console API access verified
- [ ] Bing Webmaster API credentials configured in system settings
- [ ] GSC Site URL ownership verified via DNS TXT or HTML tag records
- [ ] Initial Sitemap index submitted to Google and Bing search consoles

### 5. Automation & Notifications
- [ ] n8n Webhook URL verified for downstream notifications and SEO alerts
- [ ] System health monitoring endpoint `/api/health` active
- [ ] Pino logger structured JSON outputs routing correctly to cloud logging dashboards
- [ ] Automatic email delivery verified for recruiter alerts and application confirmations
