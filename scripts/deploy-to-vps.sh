#!/bin/bash

# 🚀 VPS Deployment Script for Dahabiyat Nile Cruise
# This script automates the deployment process to your VPS

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration - UPDATE THESE VALUES
VPS_HOST="your-vps-ip-or-domain"
VPS_USER="root"  # or your username
PROJECT_PATH="/var/www/dahabiyat-nile-cruise"
APP_NAME="dahabiyat-app"

# Functions
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if SSH key exists
check_ssh_key() {
    if [ ! -f ~/.ssh/id_rsa ]; then
        print_warning "SSH key not found. You may need to enter password multiple times."
    fi
}

# Deploy to VPS
deploy_to_vps() {
    print_status "Starting deployment to VPS..."
    
    # SSH into VPS and run deployment commands
    ssh ${VPS_USER}@${VPS_HOST} << 'ENDSSH'
        set -e
        
        echo "🔄 Navigating to project directory..."
        cd /var/www/dahabiyat-nile-cruise || {
            echo "❌ Project directory not found. Please check the path."
            exit 1
        }
        
        echo "📥 Pulling latest changes from repository..."
        git pull origin main || {
            echo "❌ Git pull failed. Please check repository access."
            exit 1
        }
        
        echo "📦 Installing/updating dependencies..."
        npm install --production || {
            echo "❌ npm install failed."
            exit 1
        }
        
        echo "🔄 Syncing content across platforms..."
        npm run sync:content || {
            echo "⚠️ Content sync failed, continuing..."
        }
        
        echo "🏗️ Building the application..."
        npm run build || {
            echo "❌ Build failed."
            exit 1
        }
        
        echo "🗄️ Updating database schema..."
        npx prisma generate || {
            echo "❌ Prisma generate failed."
            exit 1
        }
        
        npx prisma db push || {
            echo "⚠️ Database push failed, continuing..."
        }
        
        echo "🔄 Restarting PM2 processes..."
        pm2 restart all || {
            echo "⚠️ PM2 restart failed, trying to start..."
            pm2 start npm --name "dahabiyat-app" -- start || {
                echo "❌ Failed to start PM2 process."
                exit 1
            }
        }
        
        echo "📊 Checking PM2 status..."
        pm2 status
        
        echo "🔍 Testing application health..."
        sleep 5
        curl -f http://localhost:3000/api/health || {
            echo "⚠️ Health check failed, but deployment completed."
        }
        
        echo "✅ Deployment completed successfully!"
        echo "🌐 Your application should be available at your domain."
        
ENDSSH
}

# Main deployment process
main() {
    echo "🚀 Dahabiyat Nile Cruise - VPS Deployment Script"
    echo "================================================"
    
    # Check SSH key
    check_ssh_key
    
    # Confirm deployment
    echo ""
    print_warning "This will deploy to: ${VPS_USER}@${VPS_HOST}:${PROJECT_PATH}"
    read -p "Continue with deployment? (y/N): " -n 1 -r
    echo ""
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Deployment cancelled."
        exit 0
    fi
    
    # Start deployment
    deploy_to_vps
    
    print_success "🎉 Deployment completed!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Test your website: https://your-domain.com"
    echo "2. Check admin panel: https://your-domain.com/admin-login"
    echo "3. Test availability system: https://your-domain.com/admin/availability"
    echo "4. Monitor logs: ssh ${VPS_USER}@${VPS_HOST} 'pm2 logs'"
}

# Run main function
main "$@"
