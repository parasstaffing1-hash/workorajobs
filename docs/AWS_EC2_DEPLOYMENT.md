# AWS EC2 Deployment Guide

## EC2 Baseline

1. Provision Ubuntu LTS EC2 instance.
2. Attach security group allowing `80`, `443` and SSH from trusted IPs.
3. Install Docker and Docker Compose.
4. Configure DNS to the EC2 public IP or load balancer.
5. Copy the repository and production `.env`.

## Deploy

```bash
docker compose --profile proxy up --build -d
docker compose exec api pnpm --filter @workora/api prisma:deploy
```

## Recommended AWS Services

- RDS PostgreSQL for production database
- ElastiCache Redis for Redis
- S3 for media and document storage
- CloudWatch for logs and metrics
- ACM and ALB for TLS termination
- Secrets Manager or SSM Parameter Store for secrets

## Post-Deploy

- Verify `/api/v1/health`.
- Verify web routes.
- Verify uploads to S3.
- Verify Stripe webhook delivery.
- Configure backups and monitoring alarms.
