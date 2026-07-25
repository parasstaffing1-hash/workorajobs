# WorkoraJobs AWS S3 Storage Service Integration Guide

## Executive Summary
WorkoraJobs uses **AWS SDK v3** (`@aws-sdk/client-s3`) as its primary enterprise file storage engine. The implementation provides:
- **Server-Side File Processing**: Uploads flow strictly through Server Actions or Next.js Route Handlers (`/api/v1/uploads`), keeping AWS credentials 100% hidden from the client.
- **Strict Validation**: Double-layer validation enforcing size boundaries (10MB for resumes/certificates, 5MB for images), extension whitelisting, MIME type checks, and binary **Magic Bytes Header** inspection.
- **Path Traversal Prevention & UUID Keys**: All uploaded keys use UUID v4 prefixing (`/folder/uuid-sanitizedName.ext`) to eliminate filename collision and directory traversal vulnerabilities (`..`).
- **Private vs Public Separation**: Resumes and certificates are stored under `private` ACL and accessed via **Presigned URLs** (`getSignedDownloadUrl`), while profile photos and company logos are stored as public assets.
- **Antivirus Scan Hook Readiness**: Pre-built scanner hook (`scanBufferForThreats`) inspecting EICAR signatures and formatted for AWS GuardDuty Malware Protection or ClamAV integration.

---

## 1. Environment Variables Configuration

Add the following environment variables to your `.env` (or AWS Secrets Manager / EC2 systemd environment):

```env
# AWS S3 Storage Service Credentials
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
AWS_REGION=eu-north-1
AWS_S3_BUCKET=workorajobs-production-assets
AWS_S3_PUBLIC_BASE_URL=https://workorajobs-production-assets.s3.eu-north-1.amazonaws.com
```

---

## 2. Directory Folder Organization & Boundaries

| Folder Path | Description | Access Level | Max File Size | Allowed Extensions | Allowed MIME Types |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/resumes/` | Candidate Resumes & CVs | `private` | **10 MB** | `.pdf`, `.doc`, `.docx` | `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document` |
| `/profile-images/` | User Avatars & Photos | `public-read` | **5 MB** | `.jpg`, `.jpeg`, `.png`, `.webp` | `image/jpeg`, `image/png`, `image/webp` |
| `/company-logos/` | Employer Logos | `public-read` | **5 MB** | `.jpg`, `.jpeg`, `.png`, `.webp` | `image/jpeg`, `image/png`, `image/webp` |
| `/certificates/` | Skill/Education Proofs | `private` | **10 MB** | `.pdf`, `.doc`, `.docx`, `.jpg`, `.png`, `.webp` | Resumes + Image MIME types |

---

## 3. Required AWS IAM Policy (`docs/s3-iam-policy.json`)

Attach this minimal IAM Policy to your EC2 IAM Role or IAM User (`WorkoraJobsS3User`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "WorkoraJobsS3BucketAccess",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:PutObjectAcl",
        "s3:GetObjectAcl",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::workorajobs-production-assets",
        "arn:aws:s3:::workorajobs-production-assets/*"
      ]
    }
  ]
}
```

---

## 4. Recommended S3 Bucket Policy (`docs/s3-bucket-policy.json`)

Enforce public accessibility ONLY on public asset folders while blocking direct public access to candidate resumes:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadForPublicFolders",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": [
        "arn:aws:s3:::workorajobs-production-assets/profile-images/*",
        "arn:aws:s3:::workorajobs-production-assets/company-logos/*"
      ]
    },
    {
      "Sid": "DenyPublicReadForPrivateFolders",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": [
        "arn:aws:s3:::workorajobs-production-assets/resumes/*",
        "arn:aws:s3:::workorajobs-production-assets/certificates/*"
      ],
      "Condition": {
        "StringNotLike": {
          "aws:PrincipalArn": "arn:aws:iam::YOUR_ACCOUNT_ID:role/WorkoraJobsEC2Role"
        }
      }
    }
  ]
}
```

---

## 5. S3 CORS Configuration (`docs/s3-cors-config.json`)

If using presigned upload URLs directly from the browser:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": ["https://workorajobs.com", "https://www.workorajobs.com", "http://localhost:3000"],
    "ExposeHeaders": ["ETag", "x-amz-server-side-encryption"],
    "MaxAgeSeconds": 3000
  }
]
```

---

## 6. Enterprise Code Usage Examples

### A. Reusable Domain Helpers (`src/lib/aws/s3.ts`)

```typescript
import {
  uploadResume,
  uploadProfilePhoto,
  uploadCompanyLogo,
  uploadCertificate,
  getSignedDownloadUrl,
  deleteFromS3
} from "@/lib/aws/s3";

// 1. Upload Resume
const resumeOutput = await uploadResume(fileBuffer, "John_Doe_CV.pdf", "application/pdf", userId);
console.log(resumeOutput.key); // "resumes/9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d-John_Doe_CV.pdf"

// 2. Generate Presigned URL for Candidate Resume
const signedUrl = await getSignedDownloadUrl(resumeOutput.key, 3600);

// 3. Delete File
await deleteFromS3(resumeOutput.key);
```

### B. Server Actions (`src/lib/actions/upload-actions.ts`)

```typescript
import { uploadResumeAction, deleteFileAction } from "@/lib/actions/upload-actions";

// In your Client / Server Component:
const formData = new FormData();
formData.append("file", fileInput);

const response = await uploadResumeAction(formData, currentUserId);
if (response.success) {
  console.log("Resume Uploaded:", response.data?.key);
}
```

---

## 7. Production Deployment Checklist

- [x] `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner` installed.
- [x] Environment variables configured (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET`).
- [x] IAM policy configured with minimal S3 actions.
- [x] S3 Bucket Created with Server-Side Encryption (SSE-S3 / KMS) enabled by default.
- [x] Public access block settings set appropriately (Objects can be public via ACLs or bucket policies for `/profile-images/` and `/company-logos/`).
- [x] Magic bytes header validation enabled to block extension spoofing.
- [x] Docker Compose environment updated to pass AWS environment variables into `app` container.
- [x] Server-side build clean (`npm run build` passing with 0 errors).
