# AWS Domain Setup for workorajobs.com

## Current DNS State

`workorajobs.com` currently resolves to:

- A record: `16.171.202.34`
- `www.workorajobs.com`: CNAME to `workorajobs.com`

Port `80` redirects to HTTPS.
Port `443` serves the Workora frontend through Apache with a Let's Encrypt certificate.

## Required AWS/EC2 State

1. Confirm `16.171.202.34` is the intended EC2 Elastic IP or public IP.
2. EC2 security group must allow inbound:
   - TCP `80` from `0.0.0.0/0`
   - TCP `443` from `0.0.0.0/0`
3. Deploy this repository to the EC2 host.
4. Copy `.env.production.example` to `.env` and replace all secrets.
5. Start the stack:

```bash
docker compose --profile proxy up --build -d
```

6. Apply database migrations:

```bash
docker compose exec api pnpm --filter @workora/api prisma:deploy
```

7. Verify the app locally on the EC2 host:

```bash
curl http://localhost:8080
curl http://localhost:8080/api/v1/health
```

## HTTPS Options

### Recommended: AWS Application Load Balancer

Use an ACM certificate for:

- `workorajobs.com`
- `www.workorajobs.com`

Then point Route 53 A/AAAA Alias records to the ALB and forward:

- `80` to `443` redirect
- `443` to the EC2 target group on port `8080`

### Direct EC2 Option

Install Certbot on EC2 and terminate TLS on the host, then proxy to Docker Nginx on port `8080`.

### Direct Next.js Systemd Option

When deploying the frontend as a standalone Next.js service on EC2, enable
standalone output only for the Linux production build:

```bash
NEXT_OUTPUT_STANDALONE=1 pnpm build:web
```

Local Windows builds intentionally leave standalone output disabled to avoid
Next.js symlink copy failures under restricted Windows permissions.

## Production Environment Values

Use:

```env
APP_URL=https://workorajobs.com
API_URL=https://workorajobs.com
NEXT_PUBLIC_API_URL=https://workorajobs.com/api/v1
CORS_ORIGINS=https://workorajobs.com,https://www.workorajobs.com
GOOGLE_CALLBACK_URL=https://workorajobs.com/api/v1/auth/google/callback
LINKEDIN_CALLBACK_URL=https://workorajobs.com/api/v1/auth/linkedin/callback
STRIPE_SUCCESS_URL=https://workorajobs.com/billing?checkout=success
STRIPE_CANCEL_URL=https://workorajobs.com/billing?checkout=cancel
```

## Route 53 Records

If using the current EC2 IP directly:

```text
workorajobs.com      A      16.171.202.34
www.workorajobs.com  CNAME  workorajobs.com
```

If using an ALB or CloudFront, replace the apex A record with an Alias record to the AWS target.
