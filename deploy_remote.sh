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

echo "Updating standalone assets..."
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public

echo "Restarting workora service..."
sudo systemctl restart workora
sudo systemctl status workora --no-pager

echo "🎉 Deployment to 16.171.202.34 completed successfully!"
