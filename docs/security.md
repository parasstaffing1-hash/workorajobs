# WorkoraJobs Security, Compliance & Enterprise Readiness Architecture

This document details the security controls, GDPR compliance mechanisms, SOC 2 auditability, and OWASP Top 10 mitigations built into WorkoraJobs.

---

## 1. Authentication Security & Account Hardening

- **Password Hashing**: Cryptographically salted **bcrypt (cost factor 12)** hashing.
- **Multi-Factor Authentication (2FA/TOTP)**: Supported via `MfaService` (`POST /api/v1/security/mfa/setup` & `/verify`).
- **JWT Token Rotation**:
  - Access Token: Short-lived (15 minutes).
  - Refresh Token: Long-lived (30 days) stored as a SHA-256 hash in PostgreSQL and rotated automatically on refresh (`POST /api/v1/auth/refresh`).
- **Account Lockout Guard**: Automatically locks out accounts after 5 failed login attempts within 15 minutes (`MfaService.recordLoginAttempt`).

---

## 2. Granular Role-Based Access Control (RBAC)

Supported Roles:
- **`ADMIN`**: Full platform-wide system control and access to audit logs (`/api/v1/security/audit-logs`).
- **`EMPLOYER` / `OWNER` / `ADMIN`**: Multi-tenant employer workspace control (company profiles, job postings, team management).
- **`RECRUITER`**: Job creation, candidate evaluation, interview scheduling, candidate notes/ratings.
- **`HIRING_MANAGER`**: Candidate review, status transitions, interview feedback.
- **`JOB_SEEKER` / `USER`**: Profile updates, resume uploads, 1-click job application submission.

---

## 3. API Security & Security Headers

Configured in `nginx/nginx.conf`:
- **Strict-Transport-Security (HSTS)**: `max-age=31536000; includeSubDomains; preload`
- **X-Frame-Options**: `SAMEORIGIN` (Clickjacking mitigation)
- **X-Content-Type-Options**: `nosniff` (MIME sniffing mitigation)
- **Referrer-Policy**: `strict-origin-when-cross-origin`

---

## 4. GDPR & Data Privacy Compliance

- **Data Export (Right of Access)**: Users can download a full JSON dump of their personal profile, resumes, applications, and saved jobs via `GET /api/v1/privacy/export`.
- **Right to be Forgotten**: Candidates can request account deletion via `DELETE /api/v1/privacy/account`. PII fields (`name`, `email`) are scrubbed and anonymized in PostgreSQL.
- **Automatic PII Log Redaction**: Log payloads pass through `PiiRedactor.redactObject()` to prevent passwords, JWT tokens, credit card numbers, or SSNs from being written to log files.

---

## 5. OWASP Top 10 Mitigations Summary

| Vulnerability | Mitigation Strategy |
|---|---|
| **A01: Broken Access Control** | Enforced via `RbacGuard` and `EmployerAtsService.verifyEmployerAccess` multi-tenant tenant isolation. |
| **A02: Cryptographic Failures** | Bcrypt password hashing, SHA-256 refresh token hashing, TLS 1.2/1.3 HTTPS enforcement. |
| **A03: Injection (SQLi / XSS)** | Parameterized Prisma ORM queries, tsquery sanitization in `SearchQueryBuilder`. |
| **A04: Insecure Design** | Rate limiting, account lockout after 5 failed attempts, immutable audit logging. |
| **A05: Security Misconfiguration** | Production Docker container running non-root `nextjs:nodejs` user, production environment validation. |
