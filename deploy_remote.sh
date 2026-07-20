#!/bin/bash
set -e
echo "🚀 Starting deployment on remote server 16.171.202.34..."

if [ ! -d "/opt/workora/current/.git" ]; then
    echo "Cloning repository..."
    rm -rf /opt/workora/current_tmp
    git clone https://github.com/parasstaffing1-hash/workorajobs /opt/workora/current_tmp
    rm -rf /opt/workora/current
    mv /opt/workora/current_tmp /opt/workora/current
else
    echo "Pulling latest repository updates..."
    cd /opt/workora/current
    git pull origin main
fi

cd /opt/workora/current
echo "Installing dependencies..."
pnpm install --no-frozen-lockfile

echo "Building standalone production application..."
NEXT_OUTPUT_STANDALONE=1 pnpm build

echo "Updating runtime server files..."
cp -r .next/standalone/* /opt/workora/runtime/
mkdir -p /opt/workora/runtime/.next
cp -r .next/static /opt/workora/runtime/.next/
cp -r public /opt/workora/runtime/

echo "Restarting workora-web service..."
sudo systemctl restart workora-web
sudo systemctl status workora-web --no-pager

echo "🎉 Deployment to 16.171.202.34 completed successfully!"
