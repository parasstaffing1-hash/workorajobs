# Workora Jobs — AWS EC2 Production Deployment Script (PowerShell)
$ErrorActionPreference = "Stop"

$SERVER_IP = "16.171.202.34"
$KEY_PATH = "C:\Users\HP\.ssh\temp_deploy.pem"
$USER = "ec2-user"

Write-Host "Starting Fast Local-to-EC2 Standalone Deployment..." -ForegroundColor Green
Write-Host "Target Server: ${USER}@${SERVER_IP}" -ForegroundColor Cyan
Write-Host "SSH Key: ${KEY_PATH}" -ForegroundColor Cyan

# 1. Local Production Build
Write-Host "Step 1/4: Building Next.js application locally..." -ForegroundColor Yellow
npx prisma@6.4.1 generate
npx next build

# 2. Package standalone build & static assets
Write-Host "Step 2/4: Creating release bundle..." -ForegroundColor Yellow
if (Test-Path release_bundle.tar.gz) { Remove-Item -Force release_bundle.tar.gz }

# Copy static assets into standalone folder directly before archiving
Copy-Item -Recurse -Force .next\static .next\standalone\.next\ -ErrorAction SilentlyContinue
Copy-Item -Recurse -Force public .next\standalone\ -ErrorAction SilentlyContinue

tar -czf release_bundle.tar.gz -C .next\standalone .


# 3. Upload package via SCP
Write-Host "Step 3/4: Uploading release bundle to EC2..." -ForegroundColor Yellow
scp -i "$KEY_PATH" -o StrictHostKeyChecking=no release_bundle.tar.gz "${USER}@${SERVER_IP}:/tmp/release_bundle.tar.gz"

# 4. Extract on EC2 and restart service
Write-Host "Step 4/4: Extracting bundle and restarting services on EC2..." -ForegroundColor Yellow
$remoteCmd = 'sudo tar -xzf /tmp/release_bundle.tar.gz -C /opt/workora/runtime/ ; sudo systemctl restart workora-web ; sudo systemctl reload nginx ; rm -f /tmp/release_bundle.tar.gz'
ssh -i "$KEY_PATH" -o StrictHostKeyChecking=no "${USER}@${SERVER_IP}" $remoteCmd

Remove-Item -Force release_bundle.tar.gz -ErrorAction SilentlyContinue

Write-Host "Deployment completed successfully! Website is live at https://workorajobs.com" -ForegroundColor Green
