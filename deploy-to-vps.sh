#!/bin/bash

# 🚀 Dahabiyat Nile Cruise - VPS Deployment Script
# This script pulls latest changes and deploys to production

set -e  # Exit on any error

echo "🌊 Starting Dahabiyat Nile Cruise Deployment..."
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/var/www/dahabiyat-nile-cruise"
BACKUP_DIR="/var/backups/dahabiyat"
LOG_FILE="/var/log/dahabiyat-deploy.log"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Function to log messages
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}" | tee -a "$LOG_FILE"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}" | tee -a "$LOG_FILE"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}" | tee -a "$LOG_FILE"
}

# Check if running as root or with sudo
if [[ $EUID -eq 0 ]]; then
    warning "Running as root. Consider using a dedicated user for deployments."
fi

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

log "🔄 Step 1: Creating backup..."
if [ -d "$PROJECT_DIR" ]; then
    tar -czf "$BACKUP_DIR/backup_$TIMESTAMP.tar.gz" -C "$PROJECT_DIR" . 2>/dev/null || warning "Backup creation failed"
    log "✅ Backup created: backup_$TIMESTAMP.tar.gz"
else
    warning "Project directory doesn't exist. Skipping backup."
fi

log "📥 Step 2: Pulling latest changes from repository..."
cd "$PROJECT_DIR" || error "Cannot access project directory: $PROJECT_DIR"

# Stash any local changes
git stash push -m "Auto-stash before deployment $TIMESTAMP" 2>/dev/null || true

# Pull latest changes
git fetch origin
git reset --hard origin/main
log "✅ Latest changes pulled successfully"

log "📦 Step 3: Installing/updating dependencies..."
# Install Node.js dependencies
if [ -f "package.json" ]; then
    npm ci --production
    log "✅ Node.js dependencies updated"
fi

# Install Python dependencies if requirements.txt exists
if [ -f "requirements.txt" ]; then
    pip3 install -r requirements.txt
    log "✅ Python dependencies updated"
fi

log "🗄️ Step 4: Database operations..."
# Run Prisma migrations
if [ -f "prisma/schema.prisma" ]; then
    npx prisma migrate deploy
    npx prisma generate
    log "✅ Database migrations completed"
fi

log "🏗️ Step 5: Building application..."
# Build Next.js application
npm run build
log "✅ Application built successfully"

log "🔧 Step 6: Updating configuration files..."
# Copy environment file if template exists
if [ -f ".env.example" ] && [ ! -f ".env" ]; then
    cp .env.example .env
    warning "Created .env from template. Please update with production values."
fi

# Set proper permissions
chown -R www-data:www-data "$PROJECT_DIR" 2>/dev/null || true
chmod -R 755 "$PROJECT_DIR" 2>/dev/null || true
log "✅ Permissions updated"

log "🔧 Step 7: Fixing application pages..."
# Fix itineraries pages
if [ -f "fix-itineraries.sh" ]; then
    chmod +x fix-itineraries.sh
    ./fix-itineraries.sh
    log "✅ Itineraries pages fixed"
fi

# Fix blog pages
if [ -f "fix-blogs.sh" ]; then
    chmod +x fix-blogs.sh
    ./fix-blogs.sh
    log "✅ Blog pages fixed"
fi

log "🔄 Step 8: Restarting services..."
# Restart PM2 processes
if command -v pm2 &> /dev/null; then
    pm2 restart all 2>/dev/null || pm2 start ecosystem.config.js 2>/dev/null || true
    log "✅ PM2 processes restarted"
fi

# Restart Nginx
if command -v nginx &> /dev/null; then
    nginx -t && systemctl reload nginx
    log "✅ Nginx reloaded"
fi

# Restart Apache if running
if systemctl is-active --quiet apache2; then
    systemctl reload apache2
    log "✅ Apache reloaded"
fi

log "🧹 Step 9: Cleanup..."
# Remove old backups (keep last 5)
cd "$BACKUP_DIR"
ls -t backup_*.tar.gz 2>/dev/null | tail -n +6 | xargs rm -f 2>/dev/null || true
log "✅ Old backups cleaned up"

# Clear application cache
if [ -d ".next" ]; then
    rm -rf .next/cache 2>/dev/null || true
fi

log "🎉 Deployment completed successfully!"
echo "================================================"
echo -e "${GREEN}🌊 Dahabiyat Nile Cruise is now updated!${NC}"
echo -e "${BLUE}📊 Deployment Summary:${NC}"
echo -e "   • Backup: backup_$TIMESTAMP.tar.gz"
echo -e "   • Log: $LOG_FILE"
echo -e "   • Time: $(date)"
echo "================================================"