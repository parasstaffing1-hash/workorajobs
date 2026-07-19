# WorkoraJobs: Enterprise Backend System Architecture Blueprint

This document details the software engineering specifications, coding guidelines, and directory abstractions governing the server-side architecture of WorkoraJobs.

---

## 🏗️ 1. Folder Structure & Modular Domain Design

```text
src/
├── core/                       # Clean Architecture System Core
│   ├── config/                 # Zod validated dynamic environment parameters
│   ├── errors/                 # Standard enterprise application custom exceptions
│   ├── logger/                 # Pino JSON structured logger setup
│   ├── utils/                  # Shared data structures, pagination, and response serializations
│   ├── base/                   # Base classes for domain isolation (Controller, Service, Repository)
│   ├── middleware/             # Global filter pipeline (CORS, IDs, Error catchers, limiters)
│   ├── validators/             # Request interceptor validation wrapper
│   └── queues/                 # Resilient BullMQ & Redis connections provider
├── modules/                    # Localized business domains (Future expansion namespaces)
└── server.ts                   # Main application listener & Vite pipeline coordinator
```

---

## 🛠️ 2. Core Base Abstractions

### A. BaseRepository
An abstract class enclosing connection wrappers for Prisma and standard database context.
* **Database standard:** All database mutations must be located inside classes inheriting `BaseRepository`. Direct database access inside API routes is strictly prohibited.

### B. BaseService
Defines business logic scope boundaries.
* **Modularity rule:** Business rules are represented here. No framework-specific HTTP parameters (`req`, `res`, `next`) can leak into services.

### C. BaseController
Binds HTTP queries to Services and formats outgoing results with standard templates.

---

## 🛡️ 3. Standard Response Structures

All API transactions are wrapped using consistent JSON layout definitions:

### Successful Transaction Schema (HTTP 2xx):
```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {},
  "meta": {}
}
```

### Unsuccessful Failure Schema (HTTP 4xx / 5xx):
```json
{
  "success": false,
  "message": "Validation failed.",
  "error": {},
  "requestId": "UUIDv4"
}
```

---

## 📈 4. Exception Mapping Matrix

Standard errors are thrown in services and caught at the edge in `src/core/middleware/index.ts`:

| Exception Class | Associated HTTP Code | Core Operational Target |
| :--- | :--- | :--- |
| `ValidationError` | `400 Bad Request` | Form/Schema mismatch detected by Zod parser |
| `AuthenticationError` | `412 Precondition Failed` | Session cookie or JWT validation missing |
| `AuthorizationError` | `403 Forbidden` | Access control checks failed under RBAC tables |
| `NotFoundError` | `404 Not Found` | Requested slug/resource doesn't exist |
| `RateLimitError` | `429 Too Many Requests` | Client request thresholds breached |
| `DatabaseError` | `500 Server Error` | Unhandled SQL relational failures |

---

## 🔌 5. Resilient Connection Lifecycle (Redis & Database)

Background queues use dynamic lazy loading parameters to prevent startup failures if Redis/PostgreSQL are temporarily offline:
* **Retry Strategy:** Backoff algorithms retry connections up to 5 times instead of throwing exit fatal blocks.
* **Startup Health:** Diagnostic telemetry at `/api/v1/health` provides exact visibility into whether individual engines are responsive or degraded.
