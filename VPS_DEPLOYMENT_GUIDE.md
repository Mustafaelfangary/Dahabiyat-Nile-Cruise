# 🚀 VPS Deployment Guide - Dahabiyat Nile Cruise

## 📋 **Prerequisites**

Before starting, ensure your VPS has:
- Ubuntu 20.04+ or similar Linux distribution
- Root or sudo access
- At least 2GB RAM and 20GB storage
- Domain name pointing to your VPS IP

## 🔧 **Step 1: Connect to Your VPS**

```bash
# Connect via SSH
ssh root@your-vps-ip
# or
ssh your-username@your-vps-ip
```

## 📦 **Step 2: Install Required Software**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Git
sudo apt install git -y

# Install Nginx
sudo apt install nginx -y

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install PostgreSQL (if using PostgreSQL)
sudo apt install postgresql postgresql-contrib -y

# Install certbot for SSL
sudo apt install certbot python3-certbot-nginx -y
```

## 📁 **Step 3: Clone Repository**

```bash
# Navigate to web directory
cd /var/www

# Clone your repository
sudo git clone https://github.com/Mustafaelfangary/Dahabiyat-Nile-Cruise.git dahabiyat-nile-cruise

# Change ownership
sudo chown -R $USER:$USER /var/www/dahabiyat-nile-cruise

# Navigate to project
cd dahabiyat-nile-cruise
```

## ⚙️ **Step 4: Configure Environment**

```bash
# Copy environment file
cp .env.example .env

# Edit environment variables
nano .env
```

**Update these variables in .env:**
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/dahabiyat_db"

# NextAuth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-secret-key-here"

# Email (if using)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@yourdomain.com"

# Production settings
NODE_ENV="production"
```

## 🗄️ **Step 5: Setup Database**

```bash
# Create PostgreSQL user and database
sudo -u postgres psql

# In PostgreSQL shell:
CREATE USER dahabiyat_user WITH PASSWORD 'your_password';
CREATE DATABASE dahabiyat_db OWNER dahabiyat_user;
GRANT ALL PRIVILEGES ON DATABASE dahabiyat_db TO dahabiyat_user;
\q

# Run database migrations
npx prisma migrate deploy
npx prisma generate
```

## 🏗️ **Step 6: Build Application**

```bash
# Install dependencies
npm ci --production

# Build Next.js application
npm run build
```

## 🔄 **Step 7: Setup PM2 Process Manager**

```bash
# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'dahabiyat-nile-cruise',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/dahabiyat-nile-cruise',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
EOF

# Start application with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

## 🌐 **Step 8: Configure Nginx**

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/dahabiyat-nile-cruise
```

**Add this configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files
    location /_next/static {
        alias /var/www/dahabiyat-nile-cruise/.next/static;
        expires 365d;
        access_log off;
    }

    # Images and assets
    location /images {
        alias /var/www/dahabiyat-nile-cruise/public/images;
        expires 30d;
        access_log off;
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/dahabiyat-nile-cruise /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## 🔒 **Step 9: Setup SSL Certificate**

```bash
# Get SSL certificate from Let's Encrypt
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

## 🚀 **Step 10: Deploy Using Scripts**

Make the deployment scripts executable and use them:

```bash
# Make scripts executable
chmod +x deploy-to-vps.sh
chmod +x fix-itineraries.sh

# Run initial deployment
sudo ./deploy-to-vps.sh

# Fix itineraries pages
sudo ./fix-itineraries.sh
```

## 🔄 **Step 11: Future Deployments**

For future updates, simply run:

```bash
cd /var/www/dahabiyat-nile-cruise
sudo ./deploy-to-vps.sh
```

This script will:
- ✅ Create automatic backups
- ✅ Pull latest changes from Git
- ✅ Update dependencies
- ✅ Run database migrations
- ✅ Build the application
- ✅ Restart services
- ✅ Clean up old files

## 🛠️ **Troubleshooting**

### Check Application Status
```bash
# Check PM2 processes
pm2 status
pm2 logs

# Check Nginx status
sudo systemctl status nginx
sudo nginx -t

# Check application logs
tail -f /var/log/dahabiyat-deploy.log
```

### Common Issues

**1. Port 3000 already in use:**
```bash
sudo lsof -i :3000
sudo kill -9 PID_NUMBER
pm2 restart all
```

**2. Database connection issues:**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test database connection
psql -h localhost -U dahabiyat_user -d dahabiyat_db
```

**3. Permission issues:**
```bash
# Fix file permissions
sudo chown -R www-data:www-data /var/www/dahabiyat-nile-cruise
sudo chmod -R 755 /var/www/dahabiyat-nile-cruise
```

## 📊 **Monitoring**

### Setup Basic Monitoring
```bash
# Install htop for system monitoring
sudo apt install htop -y

# Monitor PM2 processes
pm2 monit

# Check disk usage
df -h

# Check memory usage
free -h
```

## 🔐 **Security Recommendations**

1. **Firewall Setup:**
```bash
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
```

2. **Regular Updates:**
```bash
# Setup automatic security updates
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure unattended-upgrades
```

3. **Backup Strategy:**
- Database backups are created automatically by the deployment script
- Consider setting up automated offsite backups
- Test restore procedures regularly

## 🎉 **Verification**

After deployment, verify everything works:

1. **Website Access:** Visit `https://yourdomain.com`
2. **SSL Certificate:** Check for green lock icon
3. **Mobile App API:** Test API endpoints
4. **Admin Panel:** Access `/admin` with proper credentials
5. **Itineraries:** Check `/itineraries` and individual pages

## 📞 **Support**

If you encounter issues:
1. Check the deployment logs: `/var/log/dahabiyat-deploy.log`
2. Review PM2 logs: `pm2 logs`
3. Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`

---

**🌊 Your Dahabiyat Nile Cruise website is now live and ready for visitors!**
