import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import xss from "xss";
import crypto from "crypto";

export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { verifyJwt, signJwt, type JwtPayload } from "@/lib/jwt";

// ==========================================
// 1. DTO & VALIDATION LAYER
// ==========================================

const JobCreateSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  location: z.string().optional(),
  salary: z.number().int().positive().optional(),
  type: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "FREELANCE"]),
  companyId: z.string().cuid(),
  postedById: z.string().cuid(),
});

const JobBulkCreateSchema = z.object({
  jobs: z.array(JobCreateSchema).min(1),
});

const CompanyCreateSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  websiteUrl: z.string().url().optional(),
  logoUrl: z.string().url().optional(),
  domain: z.string().min(3).optional(),
  ownerId: z.string().cuid(),
});

const BlogCreateSchema = z.object({
  slug: z.string().min(2),
  title: z.string().min(5),
  category: z.string().min(2),
  excerpt: z.string().min(10),
  content: z.array(z.string()).min(1),
  image: z.string().url(),
  date: z.string(),
  readTime: z.string(),
});

const ApplicationCreateSchema = z.object({
  applicantId: z.string().cuid(),
  jobId: z.string().cuid(),
  resumeUrl: z.string().url().optional(),
});

// Helper to sanitize dynamic string inputs from XSS
function cleanString(input: string): string {
  return xss(input.trim());
}

// ==========================================
// 2. RATE LIMITER & MIDDLEWARE LAYER
// ==========================================

async function checkRateLimit(ip: string): Promise<boolean> {
  const currentMinute = Math.floor(Date.now() / 60000);
  const redisKey = `rate-limit:${ip}:${currentMinute}`;
  
  try {
    const requests = await redis.incr(redisKey);
    if (requests === 1) {
      await redis.expire(redisKey, 60);
    }
    // Limit to 100 requests per minute
    return requests <= 100;
  } catch (e) {
    console.error("Rate limiting failure:", e);
    return true; // fail-open in production if Redis is unresponsive
  }
}

function verifyIpAllowlist(ip: string): boolean {
  const allowlistEnv = process.env.IP_ALLOWLIST;
  if (!allowlistEnv) return true; // Disabled if not set
  const allowedIps = allowlistEnv.split(",").map(item => item.trim());
  return allowedIps.includes(ip);
}

// Custom handler resolver output interface
interface AuthResult {
  isAuthenticated: boolean;
  user?: JwtPayload;
  errorResponse?: NextResponse;
}

function authenticateRequest(req: NextRequest): AuthResult {
  // Check API Key first (standard for n8n/automation)
  const apiKey = req.headers.get("x-api-key");
  const configApiKey = process.env.AUTOMATION_API_KEY || "workora-automation-secure-key-2026";
  
  if (apiKey === configApiKey) {
    return {
      isAuthenticated: true,
      user: {
        userId: "system-automation",
        role: "ADMIN",
        email: "automation@workorajobs.com",
      },
    };
  }

  // Check Bearer JWT token
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    const decoded = verifyJwt(token);
    if (decoded) {
      return { isAuthenticated: true, user: decoded };
    }
  }

  return {
    isAuthenticated: false,
    errorResponse: NextResponse.json(
      { success: false, error: "Unauthorized. Missing or invalid authentication token." },
      { status: 401 }
    ),
  };
}

async function createAuditLog(userId: string, action: string, req: NextRequest) {
  const ipAddress = req.headers.get("x-forwarded-for") || (req as any).ip || "127.0.0.1";
  const userAgent = req.headers.get("user-agent") || "unknown";
  
  try {
    await prisma.auditLog.create({
      data: {
        userId: userId === "system-automation" ? null : userId,
        action,
        ipAddress,
        userAgent,
      },
    });
  } catch (e) {
    console.error("Audit log creation failed:", e);
  }
}

// ==========================================
// 3. REPOSITORIES & SERVICES LAYER
// ==========================================

const JobRepository = {
  async findById(id: string) {
    return prisma.job.findUnique({
      where: { id },
      include: { company: true },
    });
  },

  async create(data: z.infer<typeof JobCreateSchema>) {
    return prisma.job.create({
      data: {
        title: cleanString(data.title),
        description: cleanString(data.description),
        location: data.location ? cleanString(data.location) : undefined,
        salary: data.salary,
        type: data.type,
        companyId: data.companyId,
        postedById: data.postedById,
      },
    });
  },

  async update(id: string, data: Partial<z.infer<typeof JobCreateSchema>>) {
    return prisma.job.update({
      where: { id },
      data: {
        title: data.title ? cleanString(data.title) : undefined,
        description: data.description ? cleanString(data.description) : undefined,
        location: data.location ? cleanString(data.location) : undefined,
        salary: data.salary,
        type: data.type,
      },
    });
  },

  async delete(id: string) {
    return prisma.job.delete({
      where: { id },
    });
  },
};

const CompanyRepository = {
  async create(data: z.infer<typeof CompanyCreateSchema>) {
    return prisma.company.create({
      data: {
        name: cleanString(data.name),
        description: data.description ? cleanString(data.description) : undefined,
        websiteUrl: data.websiteUrl,
        logoUrl: data.logoUrl,
        domain: data.domain,
        ownerId: data.ownerId,
      },
    });
  },

  async update(id: string, data: Partial<z.infer<typeof CompanyCreateSchema>>) {
    return prisma.company.update({
      where: { id },
      data: {
        name: data.name ? cleanString(data.name) : undefined,
        description: data.description ? cleanString(data.description) : undefined,
        websiteUrl: data.websiteUrl,
        logoUrl: data.logoUrl,
        domain: data.domain,
      },
    });
  },
};

// Background Webhook Event Sender
async function dispatchWebhook(event: string, payload: Record<string, unknown>) {
  try {
    // In production, fetch webhook subscribers from DB
    const endpoints = [process.env.N8N_WEBHOOK_URL].filter(Boolean) as string[];
    
    for (const url of endpoints) {
      // Non-blocking fire and forget
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-webhook-event": event,
          "x-webhook-signature": crypto
            .createHmac("sha256", "webhook-secret-signing-key")
            .update(JSON.stringify(payload))
            .digest("hex"),
        },
        body: JSON.stringify(payload),
      }).catch((e) => console.error(`Webhook target ${url} trigger failed:`, e));
    }
  } catch (e) {
    console.error("Webhook dispatching exception:", e);
  }
}

// ==========================================
// 4. API CONTROLLER & ROUTER DISPATCHER
// ==========================================

export async function GET(req: NextRequest, { params }: { params: Promise<{ route?: string[] }> }) {
  const routeParams = await params;
  const path = routeParams.route || [];
  const ip = req.headers.get("x-forwarded-for") || (req as any).ip || "127.0.0.1";

  // Rate Limiting
  if (!(await checkRateLimit(ip))) {
    return NextResponse.json({ success: false, error: "Too many requests. Rate limit exceeded." }, { status: 429 });
  }

  // IP Allowlist Check
  if (!verifyIpAllowlist(ip)) {
    return NextResponse.json({ success: false, error: "Forbidden: IP address not allowed." }, { status: 403 });
  }

  // 1. Health check (Observability Endpoint)
  if (path[0] === "health") {
    const start = Date.now();
    let dbStatus = "UP";
    let redisStatus = "UP";
    
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = "DOWN";
    }

    try {
      await redis.get("health-check");
    } catch {
      redisStatus = "DOWN";
    }

    return NextResponse.json({
      status: dbStatus === "UP" && redisStatus === "UP" ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      database: dbStatus,
      redis: redisStatus,
      latencyMs: Date.now() - start,
    });
  }

  // 2. Swagger / OpenAPI 3.1 Spec Generator
  if (path[0] === "docs") {
    return NextResponse.json(openApiSpec);
  }

  // Auth Guard for remaining paths
  const auth = authenticateRequest(req);
  if (!auth.isAuthenticated) return auth.errorResponse!;

  // 3. Search endpoint
  if (path[0] === "search") {
    const url = new URL(req.url);
    const query = url.searchParams.get("q") || "";
    
    const results = await prisma.job.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 10,
    });

    return NextResponse.json({ success: true, results });
  }

  // 4. Job GET operations
  if (path[0] === "jobs") {
    const id = path[1];
    if (id) {
      const job = await JobRepository.findById(id);
      if (!job) {
        return NextResponse.json({ success: false, error: "Job listing not found." }, { status: 404 });
      }
      return NextResponse.json({ success: true, job });
    }

    const allJobs = await prisma.job.findMany({ take: 20 });
    return NextResponse.json({ success: true, jobs: allJobs });
  }

  // 5. Companies GET operations
  if (path[0] === "companies") {
    const allCompanies = await prisma.company.findMany({ take: 20 });
    return NextResponse.json({ success: true, companies: allCompanies });
  }

  return NextResponse.json({ success: false, error: "Route not found" }, { status: 404 });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ route?: string[] }> }) {
  const routeParams = await params;
  const path = routeParams.route || [];
  const ip = req.headers.get("x-forwarded-for") || (req as any).ip || "127.0.0.1";

  // Rate Limiting & IP Allowlist
  if (!(await checkRateLimit(ip)) || !verifyIpAllowlist(ip)) {
    return NextResponse.json({ success: false, error: "Access limits exceeded or IP disallowed." }, { status: 403 });
  }

  // Authenticate
  const auth = authenticateRequest(req);
  if (!auth.isAuthenticated) return auth.errorResponse!;

  // 1. Create Job Listing
  if (path[0] === "jobs") {
    // Bulk create
    if (path[1] === "bulk") {
      const body = await req.json();
      const validated = JobBulkCreateSchema.safeParse(body);
      if (!validated.success) {
        return NextResponse.json({ success: false, errors: validated.error.issues }, { status: 400 });
      }

      const createdJobs = await prisma.$transaction(
        validated.data.jobs.map((job) =>
          prisma.job.create({
            data: {
              title: cleanString(job.title),
              description: cleanString(job.description),
              location: job.location ? cleanString(job.location) : undefined,
              salary: job.salary,
              type: job.type,
              companyId: job.companyId,
              postedById: job.postedById,
            },
          })
        )
      );

      await createAuditLog(auth.user!.userId, `Bulk Created ${createdJobs.length} Jobs`, req);
      return NextResponse.json({ success: true, count: createdJobs.length, jobs: createdJobs });
    }

    const body = await req.json();
    const validated = JobCreateSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ success: false, errors: validated.error.issues }, { status: 400 });
    }

    // Duplicate detection check
    const duplicate = await prisma.job.findFirst({
      where: {
        title: validated.data.title,
        companyId: validated.data.companyId,
        postedById: validated.data.postedById,
      },
    });

    if (duplicate) {
      return NextResponse.json({ success: false, error: "Duplicate job listing detected." }, { status: 409 });
    }

    const newJob = await JobRepository.create(validated.data);
    await createAuditLog(auth.user!.userId, `Created Job ID ${newJob.id}`, req);
    dispatchWebhook("job.created", { jobId: newJob.id, title: newJob.title });

    return NextResponse.json({ success: true, job: newJob }, { status: 21 });
  }

  // 2. Create Company profile
  if (path[0] === "companies") {
    const body = await req.json();
    const validated = CompanyCreateSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ success: false, errors: validated.error.issues }, { status: 400 });
    }

    const newCompany = await CompanyRepository.create(validated.data);
    await createAuditLog(auth.user!.userId, `Created Company ID ${newCompany.id}`, req);

    return NextResponse.json({ success: true, company: newCompany });
  }

  // 3. Verify Company status
  if (path[0] === "companies" && path[2] === "verify") {
    const companyId = path[1];
    const updated = await prisma.company.update({
      where: { id: companyId },
      data: { rating: 5.0 }, // Marks as pre-vetted top tier
    });

    await createAuditLog(auth.user!.userId, `Verified Company ID ${companyId}`, req);
    return NextResponse.json({ success: true, company: updated });
  }

  // 4. Create Blog article
  if (path[0] === "content" && path[1] === "blog") {
    const body = await req.json();
    const validated = BlogCreateSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ success: false, errors: validated.error.issues }, { status: 400 });
    }

    // Create dynamic blog SEO page mapping
    const newSeoPage = await prisma.seoPage.create({
      data: {
        slug: `blog/${validated.data.slug}`,
        title: validated.data.title,
        pageType: "CAREER_ROADMAP",
        status: "PUBLISHED",
        qualityScore: 95,
        canonicalUrl: `https://workorajobs.com/blog/${validated.data.slug}`,
      },
    });

    await createAuditLog(auth.user!.userId, `Published Blog slug ${validated.data.slug}`, req);
    return NextResponse.json({ success: true, seoPage: newSeoPage });
  }

  // 5. Submit candidate Resume parsing metadata
  if (path[0] === "resumes") {
    const body = await req.json();
    const validated = z.object({
      name: z.string().min(2),
      email: z.string().email(),
      skills: z.array(z.string()),
      parsedText: z.string().optional(),
    }).safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ success: false, errors: validated.error.issues }, { status: 400 });
    }

    const profile = await prisma.candidateProfile.create({
      data: {
        name: validated.data.name,
        email: validated.data.email,
        skills: validated.data.skills,
        parsedText: validated.data.parsedText,
        source: "AUTOMATION_API",
      },
    });

    await createAuditLog(auth.user!.userId, `Parsed Resume candidate ID ${profile.id}`, req);
    return NextResponse.json({ success: true, candidateProfile: profile });
  }

  // 6. Submit Job applications
  if (path[0] === "applications") {
    const body = await req.json();
    const validated = ApplicationCreateSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ success: false, errors: validated.error.issues }, { status: 400 });
    }

    const application = await prisma.application.create({
      data: {
        applicantId: validated.data.applicantId,
        jobId: validated.data.jobId,
        resumeUrl: validated.data.resumeUrl,
      },
    });

    await createAuditLog(auth.user!.userId, `Created Application ID ${application.id}`, req);
    return NextResponse.json({ success: true, application });
  }

  // 7. Webhook subscribing endpoint
  if (path[0] === "webhooks") {
    const body = await req.json();
    const validated = z.object({
      url: z.string().url(),
      event: z.string(),
    }).safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ success: false, errors: validated.error.issues }, { status: 400 });
    }

    // Save configuration inside system settings mapping
    await prisma.systemSetting.create({
      data: {
        key: `webhook_subscription_${Date.now()}`,
        valueJson: { url: validated.data.url, event: validated.data.event },
        description: "Automation layer webhook registration",
      },
    });

    await createAuditLog(auth.user!.userId, `Registered Webhook target URL ${validated.data.url}`, req);
    return NextResponse.json({ success: true, message: "Webhook subscription registered successfully." });
  }

  return NextResponse.json({ success: false, error: "Route not found" }, { status: 404 });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ route?: string[] }> }) {
  const routeParams = await params;
  const path = routeParams.route || [];
  
  const auth = authenticateRequest(req);
  if (!auth.isAuthenticated) return auth.errorResponse!;

  // 1. Update Job Listing
  if (path[0] === "jobs" && path[1]) {
    const body = await req.json();
    const validated = JobCreateSchema.partial().safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ success: false, errors: validated.error.issues }, { status: 400 });
    }

    const updatedJob = await JobRepository.update(path[1], validated.data);
    await createAuditLog(auth.user!.userId, `Updated Job ID ${path[1]}`, req);

    return NextResponse.json({ success: true, job: updatedJob });
  }

  // 2. Update Company profile
  if (path[0] === "companies" && path[1]) {
    const body = await req.json();
    const validated = CompanyCreateSchema.partial().safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ success: false, errors: validated.error.issues }, { status: 400 });
    }

    const updated = await CompanyRepository.update(path[1], validated.data);
    await createAuditLog(auth.user!.userId, `Updated Company ID ${path[1]}`, req);

    return NextResponse.json({ success: true, company: updated });
  }

  return NextResponse.json({ success: false, error: "Route not found" }, { status: 404 });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ route?: string[] }> }) {
  const routeParams = await params;
  const path = routeParams.route || [];

  const auth = authenticateRequest(req);
  if (!auth.isAuthenticated) return auth.errorResponse!;

  // 1. Delete Job Listing
  if (path[0] === "jobs" && path[1]) {
    await JobRepository.delete(path[1]);
    await createAuditLog(auth.user!.userId, `Deleted Job ID ${path[1]}`, req);
    return NextResponse.json({ success: true, message: "Job deleted successfully." });
  }

  return NextResponse.json({ success: false, error: "Route not found" }, { status: 404 });
}

// ==========================================
// 5. OPENAPI 3.1 DOCUMENTATION CONFIG
// ==========================================

const openApiSpec = {
  openapi: "3.1.0",
  info: {
    title: "WorkoraJobs Automation API Layer",
    version: "1.0.0",
    description: "Production-grade backend automation layer endpoints for WorkoraJobs consumed by n8n, AI agents, mobile apps, and developer portals.",
  },
  servers: [
    {
      url: "https://workorajobs.com/api/v1",
      description: "Production Gateway",
    },
  ],
  paths: {
    "/health": {
      get: {
        summary: "Observability health check",
        responses: {
          "200": {
            description: "System health and service connectivity latencies",
          },
        },
      },
    },
    "/jobs": {
      post: {
        summary: "Create a job listing",
        security: [{ ApiKeyAuth: [] }, { BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  location: { type: "string" },
                  salary: { type: "integer" },
                  type: { type: "string", enum: ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "FREELANCE"] },
                  companyId: { type: "string" },
                  postedById: { type: "string" },
                },
                required: ["title", "description", "type", "companyId", "postedById"],
              },
            },
          },
        },
        responses: {
          "201": { description: "Job listing created successfully" },
          "400": { description: "Invalid validation inputs" },
          "409": { description: "Duplicate listing detected" },
        },
      },
      get: {
        summary: "Retrieve all job listings",
        responses: {
          "200": { description: "Lists matching jobs" },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "x-api-key",
      },
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};
