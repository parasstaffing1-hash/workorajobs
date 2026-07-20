# Workora Jobs — Fast Local Production Deployment Guide

To prevent memory overload on low-RAM EC2 instances (e.g. `t3.micro`), **never run `npm run build` on the server**. Always build locally and transfer the pre-compiled standalone package to EC2.

---

## ⚡ Quick One-Command Deployment

Run the automated deployment script locally from the `workorajobs` root directory:

### Bash / Git Bash:
```bash
./deploy.sh
```

### PowerShell:
```powershell
# 1. Build locally
npm run build

# 2. Package build
Remove-Item -Recurse -Force build_output -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path build_output
Copy-Item -Recurse -Force .next\standalone\* build_output\
New-Item -ItemType Directory -Force -Path build_output\.next
Copy-Item -Recurse -Force .next\static build_output\.next\
Copy-Item -Recurse -Force public build_output\
tar -czf release_bundle.tar.gz -C build_output .
Remove-Item -Recurse -Force build_output

# 3. Upload & Deploy
scp -i C:\Users\HP\.ssh\temp_deploy.pem -o StrictHostKeyChecking=no release_bundle.tar.gz ec2-user@16.171.202.34:/tmp/release_bundle.tar.gz
ssh -i C:\Users\HP\.ssh\temp_deploy.pem -o StrictHostKeyChecking=no ec2-user@16.171.202.34 "sudo tar -xzf /tmp/release_bundle.tar.gz -C /opt/workora/runtime/ && sudo systemctl restart workora-web && sudo systemctl reload nginx"
```

---

## 📋 Architecture & Server Requirements

- **Target IP**: `16.171.202.34`
- **Domain**: `https://workorajobs.com`
- **Remote Runtime Path**: `/opt/workora/runtime`
- **Systemd Service**: `workora-web.service`
- **Web Server**: `nginx` (Proxying port 80/443 -> 127.0.0.1:3000)
- **SSH User / Key**: `ec2-user` with `C:\Users\HP\.ssh\temp_deploy.pem`

---

## 🔒 Preserved Assets During Deployment

The following files on the EC2 server are **never deleted or overwritten**:
- Environment variables & `.env` file (`/opt/workora/runtime/.env`)
- SSL certificates (`/etc/letsencrypt/`)
- Nginx configuration (`/etc/nginx/conf.d/workora.conf`)
- Database data & user uploads
