export function getOpenApiSpec() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://workorajobs.com";

  return {
    openapi: "3.1.0",
    info: {
      title: "WorkoraJobs Public REST API",
      version: "1.0.0",
      description: "Production-grade REST API for job discovery, ATS ingestion, applicant tracking, candidate search, and webhooks.",
      contact: {
        name: "WorkoraJobs Engineering Team",
        email: "api@workorajobs.com",
        url: baseUrl,
      },
    },
    servers: [
      {
        url: `${baseUrl}/api/v1`,
        description: "Production API v1 Server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "X-API-Key",
        },
      },
    },
    security: [
      { BearerAuth: [] },
      { ApiKeyAuth: [] },
    ],
    paths: {
      "/search": {
        get: {
          summary: "Full-text Job Search Engine",
          description: "Search millions of active tech job listings with filtering by skills, location, workMode, and salary range.",
          parameters: [
            { name: "q", in: "query", schema: { type: "string" }, description: "Search keyword" },
            { name: "location", in: "query", schema: { type: "string" }, description: "City or country" },
            { name: "workMode", in: "query", schema: { type: "string", enum: ["Remote", "Hybrid", "On-site"] } },
            { name: "minSalary", in: "query", schema: { type: "integer" } },
            { name: "sort", in: "query", schema: { type: "string", enum: ["MOST_RECENT", "HIGHEST_SALARY", "COMPANY_NAME"] } },
          ],
          responses: {
            "200": { description: "Successful job search response" },
          },
        },
      },
      "/jobs": {
        get: {
          summary: "List Ingested Jobs",
          responses: { "200": { description: "List of active jobs" } },
        },
      },
      "/applications": {
        post: {
          summary: "Submit Candidate Application",
          responses: { "201": { description: "Application created" } },
        },
      },
      "/webhooks/subscribe": {
        post: {
          summary: "Subscribe to Webhook Events",
          responses: { "201": { description: "Webhook subscription registered" } },
        },
      },
    },
  };
}
