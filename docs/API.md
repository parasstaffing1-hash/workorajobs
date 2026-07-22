# WorkoraJobs Public REST API & Webhooks Developer Guide

This document details the versioned REST API (`/api/v1`), OpenAPI 3.1 specifications, HMAC signed webhooks, batch import/export APIs, and authentication mechanisms for WorkoraJobs.

---

## 1. Authentication Mechanisms

The API supports **JWT Bearer Tokens** and **API Keys**. Include your secret credential in the request header:

```http
Authorization: Bearer <YOUR_JWT_ACCESS_TOKEN>
```
OR
```http
X-API-Key: <YOUR_WORKORA_API_KEY>
```

---

## 2. OpenAPI 3.1 & Swagger Specification

Fetch the live OpenAPI 3.1 schema specification:

```http
GET /api/v1/docs
```

Response:
```json
{
  "openapi": "3.1.0",
  "info": {
    "title": "WorkoraJobs Public REST API",
    "version": "1.0.0"
  },
  "servers": [{ "url": "https://workorajobs.com/api/v1" }]
}
```

---

## 3. Webhooks & Event Signatures

WorkoraJobs dispatches HTTP POST webhooks when key domain events occur.

### Supported Events
- `JOB_CREATED`, `JOB_UPDATED`, `JOB_DELETED`
- `APPLICATION_SUBMITTED`, `APPLICATION_UPDATED`
- `INTERVIEW_SCHEDULED`, `OFFER_SENT`

### Payload Signature Verification
Every webhook request includes an HMAC SHA-256 signature in the `X-Workora-Signature` header calculated using your secret key.

**Node.js Verification Example**:
```javascript
const crypto = require("crypto");

function verifyWebhookSignature(rawBody, signatureHeader, secret) {
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
    
  return crypto.timingSafeEqual(
    Buffer.from(signatureHeader),
    Buffer.from(expectedSignature)
  );
}
```

---

## 4. Batch Import APIs

Import bulk job listings in JSON format:

```http
POST /api/v1/import/jobs
Content-Type: application/json
Authorization: Bearer <TOKEN>

{
  "jobs": [
    {
      "title": "Staff Backend Engineer (Golang)",
      "description": "Build high-throughput microservices using Go and PostgreSQL.",
      "location": "San Francisco, CA",
      "salary": 185000,
      "workMode": "Remote",
      "type": "FULL_TIME"
    }
  ]
}
```

---

## 5. Rate Limits

- **Public Endpoints**: 100 requests / minute
- **Authenticated APIs**: 1,000 requests / minute
- **Batch Imports**: 500 records / batch
