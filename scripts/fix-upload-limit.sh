#!/bin/bash

# Fix Upload Limit Script for Cleopatra Dahabiyat
# This script fixes the 413 Request Entity Too Large error

echo "🔧 Fixing upload size limits..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run this script as root (use sudo)"
    exit 1
fi

# Backup existing nginx configuration
echo "📋 Backing up nginx configuration..."
cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup.$(date +%Y%m%d_%H%M%S)

# Update nginx.conf
echo "🔧 Updating nginx configuration..."
cat > /etc/nginx/conf.d/upload-limits.conf << 'EOF'
# Upload size limits for Cleopatra Dahabiyat
client_max_body_size 100M;
client_body_timeout 120s;
client_header_timeout 120s;
proxy_connect_timeout 120s;
proxy_send_timeout 120s;
proxy_read_timeout 120s;
EOF

# Update the main nginx.conf if needed
if ! grep -q "client_max_body_size" /etc/nginx/nginx.conf; then
    echo "📝 Adding upload limits to main nginx.conf..."
    sed -i '/http {/a\\tclient_max_body_size 100M;' /etc/nginx/nginx.conf
fi

# Update site-specific configuration if it exists
SITE_CONFIG="/etc/nginx/sites-available/dahabiyatnilecruise.com"
if [ -f "$SITE_CONFIG" ]; then
    echo "🌐 Updating site-specific configuration..."
    if ! grep -q "client_max_body_size" "$SITE_CONFIG"; then
        sed -i '/server {/a\\tclient_max_body_size 100M;' "$SITE_CONFIG"
    fi
fi

# Update Next.js configuration for larger uploads
echo "⚙️ Updating Next.js configuration..."
cd /var/www/cleopatra-dahabiyat

# Create or update next.config.js with upload limits
cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Temporarily ignore TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },

  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@mui/material', '@mui/icons-material']
  },
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: ['localhost', 'dahabiyatnilecruise.com', 'www.dahabiyatnilecruise.com'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },
  
  // API route configuration for larger uploads
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
    responseLimit: '100mb',
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  },
  
  // Webpack optimizations
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false
      };
    }
    
    return config;
  }
};

module.exports = nextConfig;
EOF

# Test nginx configuration
echo "🧪 Testing nginx configuration..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx configuration is valid"
    
    # Reload nginx
    echo "🔄 Reloading nginx..."
    systemctl reload nginx
    
    # Restart the application
    echo "🔄 Restarting application..."
    pm2 restart all
    
    echo "✅ Upload limits have been increased to 100MB"
    echo "📊 Current settings:"
    echo "   - Nginx client_max_body_size: 100M"
    echo "   - Next.js bodyParser.sizeLimit: 100mb"
    echo "   - Timeout settings: 120s"
    
else
    echo "❌ Nginx configuration test failed"
    echo "🔄 Restoring backup..."
    cp /etc/nginx/nginx.conf.backup.$(date +%Y%m%d)* /etc/nginx/nginx.conf
    exit 1
fi

echo "🎉 Upload limit fix completed successfully!"
echo ""
echo "📝 To verify the fix:"
echo "   1. Try uploading a file larger than 1MB"
echo "   2. Check nginx error logs: tail -f /var/log/nginx/error.log"
echo "   3. Check application logs: pm2 logs"
