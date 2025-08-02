#!/bin/bash

# VPS Content Cleanup Script for Cleopatra Dahabiyat
# This script fixes the duplicate content issue on the VPS server

echo "🧹 Starting VPS content cleanup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_info "Starting content cleanup on VPS..."

# 1. Pull latest changes
print_info "1. Pulling latest changes..."
git pull origin main

if [ $? -ne 0 ]; then
    print_error "Failed to pull latest changes"
    exit 1
fi

print_status "Latest changes pulled successfully"

# 2. Install dependencies
print_info "2. Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    print_error "Failed to install dependencies"
    exit 1
fi

print_status "Dependencies installed successfully"

# 3. Run database cleanup
print_info "3. Running content cleanup..."
node scripts/cleanup-content.js

if [ $? -ne 0 ]; then
    print_warning "Content cleanup script failed, but continuing..."
else
    print_status "Content cleanup completed successfully"
fi

# 4. Run admin panel fix
print_info "4. Running admin panel fix..."
node scripts/fix-admin-panel.js

if [ $? -ne 0 ]; then
    print_warning "Admin panel fix failed, but continuing..."
else
    print_status "Admin panel fix completed successfully"
fi

# 5. Build the application
print_info "5. Building application..."
npm run build

if [ $? -ne 0 ]; then
    print_error "Build failed"
    exit 1
fi

print_status "Application built successfully"

# 6. Restart PM2
print_info "6. Restarting PM2..."
pm2 restart all

if [ $? -ne 0 ]; then
    print_error "Failed to restart PM2"
    exit 1
fi

print_status "PM2 restarted successfully"

# 7. Check PM2 status
print_info "7. Checking PM2 status..."
pm2 status

# 8. Test the admin panel
print_info "8. Testing admin panel endpoints..."

# Test debug endpoint
echo "Testing debug endpoint..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/admin/debug
echo ""

# Test website content endpoint
echo "Testing website content endpoint..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/website-content?page=homepage
echo ""

print_status "VPS content cleanup completed!"

echo ""
echo "🎯 VERIFICATION STEPS:"
echo "1. Visit: https://dahabiyatnilecruise.com/admin/website"
echo "2. Check that old duplicate fields are gone"
echo "3. Verify content matches the live homepage"
echo "4. Test content editing functionality"
echo ""
echo "📊 MONITORING:"
echo "- Check PM2 logs: pm2 logs"
echo "- Check nginx logs: sudo tail -f /var/log/nginx/error.log"
echo "- Monitor application: pm2 monit"
echo ""
echo "🔧 TROUBLESHOOTING:"
echo "If admin panel still shows old content:"
echo "1. Clear browser cache and cookies"
echo "2. Try incognito/private browsing mode"
echo "3. Check browser console for errors"
echo "4. Restart PM2: pm2 restart all"
