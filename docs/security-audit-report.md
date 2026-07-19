# WorkoraJobs Security Audit & Threat Modeling Report (RC1)

This document outlines the security architecture, risk mitigation protocols, and access controls implemented in WorkoraJobs. This audit follows the **OWASP Top 10** standards to certify the system for secure, enterprise-grade production launch.

---

## 1. Executive Security Rating

| Audit Area | Status | Mitigation Strategy | Risk Category |
| :--- | :---: | :--- | :--- |
| **SQL Injection (A03:2021)** | **PASS** | Complete parameterization using Prisma ORM. No dynamic string raw query interpolations. | Critical |
| **Broken Authentication (A01:2021)**| **PASS** | Strong JWT encryption, bcryptjs salting, secure password storage, and automated timeouts. | Critical |
| **Broken Access Control (A01:2021)** | **PASS** | Strict endpoint authorization middleware using declarative RBAC mapping. Privilege escalations rejected. | High |
| **XSS Prevention (A03:2021)** | **PASS** | Input sanitation and markdown purification on html templates before render delivery. | High |
| **SSRF Mitigation (A10:2021)** | **PASS** | Restrictive URL validation schemas on crawl parameters and target external APIs. | Medium |
| **Path Traversal / LFI** | **PASS** | Absolute filepath validation prevents parent directory traversal relative to workspace roots. | Medium |

---

## 2. Security Controls Implementation Detail

### SQL Injection Prevention
- All analytical and operations querying is handled by the **Prisma ORM**, which utilizes pre-compiled parameterized queries natively.
- Custom database-level searches employ strict Zod schema validation to verify input parameters before database query execution, eliminating unsafe input parsing patterns.

### Authentication and Session Integrity
- **Password Salting**: Password fields are hashed with `bcryptjs` using a minimum cost factor of 10.
- **JWT Cryptography**: Authorization tokens are signed with HMAC-SHA256, requiring a high-entropy secret (`JWT_SECRET`).
- **Authorization Enforcement**: Every API route requires a valid Bearer token, which is decoded and bound to the request context:
```ts
// src/middlewares/auth.ts
export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'UNAUTHORIZED' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'INVALID_TOKEN' });
  }
}
```

### Role-Based Access Control (RBAC) & Privilege Escalation Block
The platform enforces strict role permission rules:
- **System Admin**: Allowed to query, write, delete, and alter system configurations.
- **SEO Manager**: Confined to keyword processing and SERP cluster updates.
- **Candidate/Recruiter**: Limited strictly to job applications and company dashboard modules.

We tested privilege escalation scenarios (e.g., trying to access `/api/v1/users/roles` with Recruiter tokens) and verified that all attempts yield immediate `403 FORBIDDEN` responses.

---

## 3. Vulnerability Analysis & Defensive Coding

1. **Broken Object Level Authorization (IDOR)**:
   All records that associate with particular companies or user entities are checked against the authenticated user's ID inside the Prisma queries.
2. **Rate Limiting**:
   Custom API route handlers are protected with Express-level rate limiting, blocking potential DDoS attempts or automated brute-force attacks.
3. **Secret Leakage Prevention**:
   The system's build configuration excludes all `.env` files from bundles. `.env.example` lists the required environment config placeholders without storing actual API credentials.
