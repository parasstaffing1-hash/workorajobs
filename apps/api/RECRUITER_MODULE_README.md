# WorkoraJobs - Enterprise Recruiter & Employer Management Module

The Enterprise Recruiter & Employer Management Module provides a highly scalable, secure, and production-ready architecture designed to support millions of companies, recruiters, hiring teams, and fine-grained role-based permission policies.

---

## 1. Recruiter Architecture

The architecture decouples core system user credentials from employer-specific organization structures.

```
                  +-------------------+
                  |       User        |
                  +---------+---------+
                            | (1:1)
                  +---------v---------+
                  |  RecruiterProfile | <---------+
                  +---------+---------+           |
                            | (Many:1)            | (Many:Many via Membership)
                  +---------v---------+           |
                  |     Company       |           |
                  +---------+---------+           |
                            | (1:Many)            |
                  +---------v---------+           |
                  |    HiringTeam     |           |
                  +---------+---------+           |
                            | (1:Many)            |
                  +---------v---------+           |
                  | HiringTeamMember  +-----------+
                  +-------------------+
```

### Key Components

1. **RecruiterProfile**: Connects a User with the company. Contains personal recruiter contact details (phone, profile picture, business title), current verification status, and organizational permissions.
2. **Company**: Represents the employer organization. Tracks branding data (logo, banner) and global verification state.
3. **HiringTeam**: Subdivisions of recruiters (e.g., "Engineering Team", "Sales Recruitment") managing specific pipelines.
4. **HiringTeamInvitation**: Secure tokens that expire in 7 days, allowing recruiters to be safely invited to a team and auto-join the parent company.
5. **QueueService (BullMQ-Inspired)**: A reliable Redis-backed task queue handling high-throughput operations in the background (Invitations, Domain/Business document verification, and Search indexing).

---

## 2. Permission Matrix (RBAC & Recruiter Roles)

Existing core authorization uses standard `UserRole` policies. The Enterprise Module layers fine-grained `RecruiterRole` restrictions for company-level resources:

| Feature / Resource | OWNER (Company) | ADMIN (Company) | RECRUITER | HIRING_MANAGER | HR_EXECUTIVE | INTERVIEWER | READ_ONLY |
|---|---|---|---|---|---|---|---|
| **Edit Company Settings** | Yes | Yes | No | No | No | No | No |
| **Request Verification** | Yes | Yes | No | No | No | No | No |
| **Manage Recruiters** | Yes | Yes | No | No | No | No | No |
| **Create Hiring Teams** | Yes | Yes | Yes | Yes | No | No | No |
| **Invite Team Members** | Yes | Yes | Yes | Yes | No | No | No |
| **Delete Hiring Team** | Yes | Yes (Owned) | No | No | No | No | No |
| **Manage Candidate Notes**| Yes | Yes | Yes | Yes | Yes | Yes | No |
| **Review Candidate Profile**| Yes | Yes | Yes | Yes | Yes | Yes | Yes |

---

## 3. Database Schema Mapping

### Models Definition (`Prisma`)

#### RecruiterProfile
```prisma
model RecruiterProfile {
  id             String          @id @default(uuid()) @db.Uuid
  userId         String          @unique @db.Uuid
  companyId      String?         @db.Uuid
  title          String?
  phone          String?
  profilePicture String?
  status         RecruiterStatus @default(PENDING)
  role           RecruiterRole   @default(RECRUITER)
  isVerified     Boolean         @default(false)
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt
}
```

#### CompanyVerification
```prisma
model CompanyVerification {
  id              String             @id @default(uuid()) @db.Uuid
  companyId       String             @db.Uuid
  businessDocUrl  String?
  emailVerified   Boolean            @default(false)
  domainVerified  Boolean            @default(false)
  status          VerificationStatus @default(PENDING)
  rejectionReason String?
  reviewedAt      DateTime?
  reviewedById    String?            @db.Uuid
  createdAt       DateTime           @default(now())
}
```

#### HiringTeam
```prisma
model HiringTeam {
  id        String   @id @default(uuid()) @db.Uuid
  companyId String   @db.Uuid
  name      String
  ownerId   String   @db.Uuid
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## 4. REST API Documentation

### Recruiter Profiles (`/api/recruiter/*`)

* **POST `/recruiter/register`**: Register a recruiter profile.
  * *Request Body*: `RegisterRecruiterDto` (`{ companyId?, title?, phone? }`)
* **GET `/recruiter/profile`**: Retrieve active recruiter profile.
* **PATCH `/recruiter/profile`**: Update profile contact details.
  * *Request Body*: `UpdateRecruiterProfileDto` (`{ title?, phone?, profilePicture?, status?, role? }`)
* **POST `/recruiter/company/assign`**: Assigns recruiter to a company.
  * *Request Body*: `AssignCompanyDto` (`{ companyId }`)
* **GET `/recruiter/company/recruiters`**: List recruiters belonging to the user's company.
* **PATCH `/recruiter/company/recruiters/:id`**: Update recruiter status/role (Company Owner/Admin only).

### Hiring Teams (`/api/recruiter/teams/*`)

* **POST `/recruiter/teams`**: Create a new Hiring Team.
  * *Request Body*: `CreateHiringTeamDto` (`{ name }`)
* **GET `/recruiter/teams`**: List all hiring teams within the company.
* **GET `/recruiter/teams/:id`**: Retrieve a specific team (including members and outstanding invitations).
* **PATCH `/recruiter/teams/:id`**: Update team metadata (e.g. name).
* **DELETE `/recruiter/teams/:id`**: Dissolve a Hiring Team.
* **POST `/recruiter/teams/:id/members`**: Add a member directly.
  * *Request Body*: `AddTeamMemberDto` (`{ userId, role }`)
* **DELETE `/recruiter/teams/:id/members/:memberId`**: Remove a member.
* **POST `/recruiter/teams/:id/invitations`**: Generate and email an invitation token (enqueues `recruiter-invitations` background job).
  * *Request Body*: `InviteTeamMemberDto` (`{ email, role }`)
* **GET `/recruiter/teams/:id/invitations`**: List pending team invitations.
* **POST `/recruiter/teams/invitations/accept?token=...`**: Accepting recruiter invitation link.

### Company Management & Verification (`/api/employer/*`)

* **POST `/employer/company/banner`**: Upload company branding banner. (Multipart Form-Data)
* **POST `/employer/company/verification`**: Submit business registration documents for official verification (enqueues `company-verification` background task).
* **GET `/employer/company/verification`**: Retrieve verification requests submission history and results.
* **GET `/employer/admin/verifications`**: Retrieve pending company verifications queue (System Admin Only. Supports Pagination, Filtering by Status, and Sorting).
* **PATCH `/employer/admin/verifications/:id`**: Approve or reject verification request (System Admin Only).
  * *Request Body*: `ReviewVerificationDto` (`{ status, rejectionReason? }`)

---

## 5. Background Processing (BullMQ Inspired Task Engine)

Workora's queue processor runs asynchronously in Redis:

1. **`company-verification`**: Performs automated validation of uploaded business registry files and handles domain match checks.
2. **`recruiter-invitations`**: Handles notification dispatch, email invitation generation, and logging.
3. **`activity-processing`**: Consumes recruiter interaction logs, aggregating activity telemetry for audit logs and executive summaries.
4. **`company-indexing`**: Propagates company edits/verification updates to the search and SEO engine dynamically.
