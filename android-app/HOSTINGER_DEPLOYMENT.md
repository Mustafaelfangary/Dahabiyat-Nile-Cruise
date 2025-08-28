# Hostinger VPS Deployment Guide
## Dahabiyat Nile Cruise Android App Backend Integration

This guide is specifically tailored for your Hostinger VPS running Ubuntu 22.04 with the domain `https://www.dahabiyatnilecruise.com`.

## 🎯 Pre-Deployment Overview

Your Android app is already configured to connect to:
- **API Base URL**: `https://www.dahabiyatnilecruise.com/api/`
- **Website URL**: `https://www.dahabiyatnilecruise.com`
- **Backend**: Node.js/Express.js with PostgreSQL

## 🚀 Step-by-Step Deployment

### Step 1: Access Your Hostinger VPS

```bash
# Connect via SSH (use your actual credentials)
ssh root@your-hostinger-ip
# or
ssh your-username@your-hostinger-ip
```

### Step 2: Locate Your Website Files

```bash
# Common locations for website files on Hostinger VPS:
cd /var/www/html/dahabiyatnilecruise.com
# or
cd /home/your-username/public_html
# or
cd /var/www/dahabiyatnilecruise.com
```

### Step 3: Add Mobile API Routes

1. **Create the mobile API directory:**
```bash
mkdir -p api/mobile
```

2. **Create the mobile routes file:**
```bash
nano api/mobile/routes.js
```

3. **Copy the content from `backend-extensions/mobile-api-routes.js`** into this file.

### Step 4: Update Your Main Server File

Find your main server file (usually `app.js`, `server.js`, or `index.js`) and add:

```javascript
// Add at the top with other requires
const mobileRoutes = require('./api/mobile/routes');

// Add after your existing routes
app.use('/api/mobile', mobileRoutes);

// Add CORS middleware for mobile app
app.use('/api', (req, res, next) => {
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

### Step 5: Update Database Schema

Connect to your PostgreSQL database and run:

```sql
-- Connect to your database
\c your_database_name

-- Add mobile-specific tables
CREATE TABLE IF NOT EXISTS user_devices (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    device_token VARCHAR(255) UNIQUE NOT NULL,
    platform VARCHAR(20) NOT NULL,
    app_version VARCHAR(20),
    device_info JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mobile_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    device_id INTEGER REFERENCES user_devices(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes
CREATE INDEX idx_user_devices_user_id ON user_devices(user_id);
CREATE INDEX idx_mobile_sessions_user_id ON mobile_sessions(user_id);
```

### Step 6: Install Required Dependencies

```bash
# Navigate to your project directory
cd /path/to/your/website

# Install additional packages if needed
npm install express-rate-limit helmet compression cors
```

### Step 7: Update Nginx Configuration

```bash
# Edit your Nginx site configuration
sudo nano /etc/nginx/sites-available/dahabiyatnilecruise.com
```

Add these location blocks inside your server block:

```nginx
# API routes for mobile app
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
    
    # CORS headers
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'Origin, X-Requested-With, Content-Type, Accept, Authorization' always;
}
```

Test and reload Nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Step 8: Restart Your Application

```bash
# If using PM2 (recommended)
pm2 restart all

# If using systemd
sudo systemctl restart your-app-name

# If running with forever
forever restart your-app.js

# If running directly, stop and restart your Node.js application
```

## 🧪 Testing Your Setup

### 1. Test API Connectivity

```bash
# Test health endpoint
curl -X GET https://www.dahabiyatnilecruise.com/api/health

# Test CORS
curl -X OPTIONS https://www.dahabiyatnilecruise.com/api/auth/signin \
  -H "Origin: http://localhost" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type"
```

### 2. Test Authentication

```bash
# Test login endpoint
curl -X POST https://www.dahabiyatnilecruise.com/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"your-test-email@example.com","password":"your-test-password"}'
```

### 3. Test from Android App

1. Build the Android app
2. Install on a device or emulator
3. Test the login flow
4. Browse dahabiyas and packages
5. Test the booking process

## 🔍 Monitoring and Troubleshooting

### Check Application Logs

```bash
# PM2 logs
pm2 logs

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System logs
journalctl -u your-service-name -f
```

### Common Issues and Solutions

1. **CORS Errors**
   - Verify CORS headers in both Express.js and Nginx
   - Check that OPTIONS requests are handled properly

2. **Database Connection Issues**
   - Verify PostgreSQL is running: `sudo systemctl status postgresql`
   - Check database credentials in your app configuration

3. **SSL/HTTPS Issues**
   - Ensure SSL certificate is valid: `sudo certbot certificates`
   - Check that all API calls use HTTPS

4. **Port Issues**
   - Verify your Node.js app is running on the correct port
   - Check that Nginx proxy_pass points to the right port

## 📱 Android App Configuration

The Android app is already configured with your domain:

- **Production API URL**: `https://www.dahabiyatnilecruise.com/api/`
- **Website URL**: `https://www.dahabiyatnilecruise.com`

No changes needed in the Android app code!

## 🔒 Security Checklist

- [ ] SSL certificate is valid and up to date
- [ ] Firewall rules are properly configured
- [ ] Database access is restricted
- [ ] API rate limiting is enabled
- [ ] CORS is configured securely
- [ ] Authentication tokens are properly secured

## 📞 Quick Support Commands

```bash
# Check service status
sudo systemctl status nginx
sudo systemctl status postgresql
pm2 status

# Restart services
sudo systemctl restart nginx
pm2 restart all
sudo systemctl restart postgresql

# View real-time logs
pm2 logs --lines 50
sudo tail -f /var/log/nginx/error.log
```

## 🎉 Final Steps

1. **Deploy the backend changes** following the steps above
2. **Test all API endpoints** using curl or Postman
3. **Build and test the Android app** on a device
4. **Monitor logs** for any errors during initial usage
5. **Set up automated backups** for your database
6. **Configure monitoring** for uptime and performance

---

**Your Android app is ready to connect to your live Hostinger VPS!** 🚀

The app will automatically use your production domain `https://www.dahabiyatnilecruise.com` for all API calls.
