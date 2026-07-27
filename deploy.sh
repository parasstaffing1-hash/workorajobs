#!/bin/bash
# ==============================================================================
# Workora Jobs — Sub-5-Minute Production Deployment Script
# Offloads build overhead from EC2 to local machine for maximum speed & reliability.
# ==============================================================================
set -e

START_TIME=$(date +%s)

SERVER_IP="${1:-16.171.202.34}"
KEY_PATH="${2:-C:/Users/HP/.ssh/temp_deploy.pem}"
USER="ec2-user"

echo "================================================================="
echo "🚀 WORKORA JOBS — AWS PRODUCTION DEPLOYMENT PIPELINE"
echo "================================================================="
echo "📍 Target Instance: ${USER}@${SERVER_IP}"
echo "🔑 SSH Key Path:   ${KEY_PATH}"
echo "-----------------------------------------------------------------"

# 1. Local Prisma Client Generation
echo "⚡ [1/5] Generating Prisma Client locally..."
npx prisma generate

# 2. Local Production Build (Next.js Standalone)
echo "📦 [2/5] Building Next.js application locally (offloaded build)..."
NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 npm run build

# 3. Create Standalone Release Bundle
echo "🗜️ [3/5] Packaging standalone release bundle..."
rm -rf build_output release_bundle.tar.gz
mkdir -p build_output
cp -r .next/standalone/* build_output/
mkdir -p build_output/.next
cp -r .next/static build_output/.next/
cp -r public build_output/
tar -czf release_bundle.tar.gz -C build_output .
rm -rf build_output

BUNDLE_SIZE=$(du -h release_bundle.tar.gz | cut -f1)
echo "  ✓ Release bundle created (${BUNDLE_SIZE})"

# 4. Upload Package via SCP
echo "📤 [4/5] Uploading release bundle to EC2..."
scp -i "${KEY_PATH}" -o StrictHostKeyChecking=no release_bundle.tar.gz "${USER}@${SERVER_IP}:/tmp/release_bundle.tar.gz"

# 5. Extract on EC2 & Trigger Zero-Downtime Service Restart
echo "🔄 [5/5] Unpacking bundle and restarting web services on EC2..."
ssh -i "${KEY_PATH}" -o StrictHostKeyChecking=no "${USER}@${SERVER_IP}" "
    sudo tar -xzf /tmp/release_bundle.tar.gz -C /opt/workora/runtime/ && \
    rm -f /tmp/release_bundle.tar.gz && \
    sudo systemctl restart workora-web && \
    sudo systemctl reload nginx
"

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo "================================================================="
echo "✅ DEPLOYMENT COMPLETED SUCCESSFULLY IN ${DURATION} SECONDS!"
echo "🌐 Live URL: http://${SERVER_IP}"
echo "================================================================="
