# Server Setup Guide - Hostinger VPS Ubuntu 22.04

This guide will help you set up the mobile API endpoints on your existing Hostinger VPS for the Dahabiyat Nile Cruise Android app.

## 🖥️ Server Environment
- **Provider**: Hostinger VPS
- **OS**: Ubuntu LTS 22.04
- **Domain**: https://www.dahabiyatnilecruise.com
- **Existing Stack**: Node.js/Express.js with PostgreSQL

## 🚀 Quick Setup Steps

### 1. Connect to Your VPS
```bash
ssh root@your-server-ip
# or
ssh your-username@your-server-ip
```

### 2. Navigate to Your Website Directory
```bash
cd /var/www/dahabiyatnilecruise.com
# or wherever your website files are located
```

### 3. Add Mobile API Routes
Copy the mobile API routes to your existing Express.js application:

```bash
# Create mobile API directory
mkdir -p routes/mobile

# Copy the mobile routes file
cp /path/to/android-app/backend-extensions/mobile-api-routes.js routes/mobile/
```

### 4. Update Your Main Server File
Add these lines to your main server file (usually `app.js`, `server.js`, or `index.js`):

```javascript
// Add mobile API routes
const mobileRoutes = require('./routes/mobile/mobile-api-routes');
app.use('/api/mobile', mobileRoutes);

// Enable CORS for mobile app
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});
```

### 5. Install Additional Dependencies (if needed)
```bash
npm install express-rate-limit helmet compression
```

### 6. Update Database Schema
Add mobile-specific tables to your PostgreSQL database:

```sql
-- User devices for push notifications
CREATE TABLE IF NOT EXISTS user_devices (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    device_token VARCHAR(255) UNIQUE NOT NULL,
    platform VARCHAR(20) NOT NULL, -- 'android' or 'ios'
    app_version VARCHAR(20),
    device_info JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mobile app sessions
CREATE TABLE IF NOT EXISTS mobile_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    device_id INTEGER REFERENCES user_devices(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- App analytics
CREATE TABLE IF NOT EXISTS mobile_analytics (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB,
    device_info JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for performance
CREATE INDEX idx_user_devices_user_id ON user_devices(user_id);
CREATE INDEX idx_user_devices_token ON user_devices(device_token);
CREATE INDEX idx_mobile_sessions_user_id ON mobile_sessions(user_id);
CREATE INDEX idx_mobile_sessions_token ON mobile_sessions(session_token);
CREATE INDEX idx_mobile_analytics_user_id ON mobile_analytics(user_id);
CREATE INDEX idx_mobile_analytics_event_type ON mobile_analytics(event_type);
```

### 7. Restart Your Application
```bash
# If using PM2
pm2 restart your-app-name

# If using systemd
sudo systemctl restart your-service-name

# If running directly
# Stop the current process and restart
```

## 🔧 Nginx Configuration

Update your Nginx configuration to handle mobile API routes:

```bash
sudo nano /etc/nginx/sites-available/dahabiyatnilecruise.com
```

Add these location blocks:

```nginx
server {
    listen 443 ssl http2;
    server_name www.dahabiyatnilecruise.com dahabiyatnilecruise.com;

    # Existing SSL configuration...

    # Mobile API routes
    location /api/ {
        proxy_pass http://localhost:3000;  # Your Node.js port
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # CORS headers for mobile app
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Origin, X-Requested-With, Content-Type, Accept, Authorization' always;
        
        # Handle preflight requests
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' '*';
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
            add_header 'Access-Control-Allow-Headers' 'Origin, X-Requested-With, Content-Type, Accept, Authorization';
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }
    }

    # Existing location blocks...
}
```

Test and reload Nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 🔒 Security Configuration

### 1. Firewall Rules
```bash
# Allow HTTP and HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Allow SSH (if not already allowed)
sudo ufw allow 22

# Enable firewall
sudo ufw enable
```

### 2. SSL Certificate (if not already configured)
```bash
# Install Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d dahabiyatnilecruise.com -d www.dahabiyatnilecruise.com
```

### 3. Rate Limiting
Add to your Express.js app:

```javascript
const rateLimit = require('express-rate-limit');

// API rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', apiLimiter);
```

## 📱 Testing the Setup

### 1. Test API Endpoints
```bash
# Test basic connectivity
curl -X GET https://www.dahabiyatnilecruise.com/api/health

# Test authentication endpoint
curl -X POST https://www.dahabiyatnilecruise.com/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass"}'
```

### 2. Test from Android App
1. Update the `BASE_URL` in the Android app if needed
2. Build and run the app
3. Test login, browsing, and booking features

## 🔍 Monitoring and Logs

### 1. Application Logs
```bash
# View Node.js application logs
pm2 logs your-app-name

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 2. Database Monitoring
```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Check mobile-specific tables
\dt *mobile*
\dt *device*
```

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure CORS headers are properly set
   - Check Nginx configuration
   - Verify API endpoints are accessible

2. **Database Connection Issues**
   - Check PostgreSQL service status
   - Verify database credentials
   - Ensure database tables exist

3. **SSL Certificate Issues**
   - Renew certificates if expired
   - Check certificate chain
   - Verify domain configuration

### Quick Fixes
```bash
# Restart services
sudo systemctl restart nginx
pm2 restart all
sudo systemctl restart postgresql

# Check service status
sudo systemctl status nginx
pm2 status
sudo systemctl status postgresql
```

## 📞 Support

If you encounter any issues during setup:
1. Check the application logs
2. Verify all configuration files
3. Test API endpoints manually
4. Contact support with specific error messages

---

**Note**: Replace placeholder values (like port numbers, service names) with your actual configuration values.
