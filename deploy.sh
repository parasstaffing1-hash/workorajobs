#!/bin/bash
# ==============================================================================
# Workora Jobs — Fast Local-to-EC2 Standalone Deployment Script
# ==============================================================================
set -e

SERVER_IP="${1:-16.171.202.34}"
KEY_PATH="${2:-C:/Users/HP/.ssh/temp_deploy.pem}"
USER="ec2-user"

echo "🚀 Starting Fast Local Production Deployment..."
echo "📍 Target Server: ${USER}@${SERVER_IP}"
echo "🔑 SSH Key: ${KEY_PATH}"

# 1. Local Production Build
echo "📦 Step 1/5: Building Next.js application locally..."
npm run build

# 2. Package standalone build & static assets
echo "📦 Step 2/5: Creating release bundle..."
rm -rf build_output release_bundle.tar.gz
mkdir -p build_output
cp -r .next/standalone/* build_output/
mkdir -p build_output/.next
cp -r .next/static build_output/.next/
cp -r public build_output/
tar -czf release_bundle.tar.gz -C build_output .
rm -rf build_output

# 3. Upload package via SCP
echo "📤 Step 3/5: Uploading release bundle to EC2..."
scp -i "${KEY_PATH}" -o StrictHostKeyChecking=no release_bundle.tar.gz "${USER}@${SERVER_IP}:/tmp/release_bundle.tar.gz"

# 4. Extract on EC2 and restart service (Zero build overhead on server)
echo "🔄 Step 4/5: Extracting bundle and restarting services on EC2..."
ssh -i "${KEY_PATH}" -o StrictHostKeyChecking=no "${USER}@${SERVER_IP}" "
    sudo tar -xzf /tmp/release_bundle.tar.gz -C /opt/workora/runtime/ && \
    sudo systemctl restart workora-web && \
    sudo systemctl reload nginx && \
    rm -f /tmp/release_bundle.tar.gz
"

# 5. Live health check
echo "✅ Step 5/5: Verifying live deployment..."
curl -sI "http://${SERVER_IP}" | head -n 5

echo "🎉 Deployment completed successfully! Website is live."
