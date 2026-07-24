import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const spec = {
    openapi: "3.0.3",
    info: {
      title: "WorkoraJobs Enterprise Candidate & Employer REST API",
      version: "2.0.0",
      description:
        "Enterprise REST API documentation for WorkoraJobs Job Seekers & Employer Ecosystem supporting millions of users, jobs, ATS pipelines, candidate sourcing, and analytics.",
      contact: {
        name: "WorkoraJobs Engineering Team",
        email: "engineering@workorajobs.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1",
        description: "Local Development Server",
      },
      {
        url: "https://workorajobs.com/api/v1",
        description: "Production Server",
      },
    ],
    paths: {
      "/employer/auth/signup": {
        post: {
          summary: "Employer Registration & Company Auto-Discovery",
          tags: ["Employer Auth"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password", "name", "companyName"],
                  properties: {
                    email: { type: "string", format: "email" },
                    password: { type: "string", minLength: 8 },
                    name: { type: "string" },
                    companyName: { type: "string" },
                    phone: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Employer registered successfully" },
            400: { description: "Validation error" },
          },
        },
      },
      "/employer/auth/login": {
        post: {
          summary: "Employer Portal Login",
          tags: ["Employer Auth"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: { type: "string" },
                    password: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Employer authenticated successfully" },
          },
        },
      },
      "/employer/company": {
        get: {
          summary: "Get Employer Company Profile & Completion Score",
          tags: ["Employer Company"],
          responses: {
            200: { description: "Company profile details & completion report" },
          },
        },
        put: {
          summary: "Update Company Profile & GST/CIN Information",
          tags: ["Employer Company"],
          responses: {
            200: { description: "Company profile updated" },
          },
        },
      },
      "/employer/jobs": {
        get: {
          summary: "List Employer Jobs with Pagination & Status Filter",
          tags: ["Employer Jobs"],
          parameters: [
            { name: "status", in: "query", schema: { type: "string" } },
            { name: "query", in: "query", schema: { type: "string" } },
            { name: "page", in: "query", schema: { type: "integer", default: 1 } },
            { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
          ],
          responses: {
            200: { description: "Paginated list of employer jobs" },
          },
        },
        post: {
          summary: "Create Job Posting or Save Draft",
          tags: ["Employer Jobs"],
          responses: {
            201: { description: "Job posting created" },
          },
        },
      },
      "/employer/ats": {
        get: {
          summary: "Get ATS Pipeline Applicants (Applied, Screening, Interview, Offer, Hired)",
          tags: ["Applicant Tracking System"],
          responses: {
            200: { description: "Recruitment pipeline stages & applicants" },
          },
        },
        post: {
          summary: "Move Applicant Stage, Add Note, Rating, or Tag",
          tags: ["Applicant Tracking System"],
          responses: {
            200: { description: "Applicant stage updated" },
          },
        },
      },
      "/employer/team": {
        get: {
          summary: "Get Company Team Members & Role Scope",
          tags: ["Team & RBAC"],
          responses: {
            200: { description: "Team members list" },
          },
        },
        post: {
          summary: "Invite New Team Member",
          tags: ["Team & RBAC"],
          responses: {
            200: { description: "Invitation dispatched" },
          },
        },
      },
      "/employer/candidates/search": {
        get: {
          summary: "Search & Source Candidates by Skills, Experience, Location, Notice Period",
          tags: ["Candidate Search & Sourcing"],
          responses: {
            200: { description: "Search results with candidate cards" },
          },
        },
        post: {
          summary: "Save Candidate Search or Send Job Invitation",
          tags: ["Candidate Search & Sourcing"],
          responses: {
            200: { description: "Operation completed" },
          },
        },
      },
      "/employer/dashboard": {
        get: {
          summary: "Get Employer Dashboard Metrics & Hiring Funnel Data",
          tags: ["Employer Analytics"],
          responses: {
            200: { description: "Real-time metrics, funnel, and trends" },
          },
        },
      },
      "/employer/analytics": {
        get: {
          summary: "Get Enterprise Analytics (Conversion Rates, Time-to-Hire, Cost-per-Hire)",
          tags: ["Employer Analytics"],
          responses: {
            200: { description: "Detailed analytics metrics" },
          },
        },
      },
      "/notifications": {
        get: {
          summary: "Get User Notifications & Unread Counter",
          tags: ["Notifications"],
          responses: {
            200: { description: "Notifications list" },
          },
        },
        post: {
          summary: "Mark Notification Read or Mark All Read",
          tags: ["Notifications"],
          responses: {
            200: { description: "Notifications updated" },
          },
        },
      },
    },
  };

  return NextResponse.json(spec);
}
