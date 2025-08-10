# Production VPS Setup Guide

## Admin Account Configuration

The admin account has been updated for production use:

- **Email**: `dark1devil2025@outlook.com`
- **Password**: `1082034D1d@#`
- **Role**: `ADMIN`
- **Email Verified**: `true` (no verification needed)

## VPS Deployment Steps

### 1. Environment Variables (.env)

Ensure your production `.env` file contains:

```bash
# Database - Update with your production PostgreSQL credentials
DATABASE_URL="postgresql://username:password@localhost:5432/production_db_name"

# NextAuth - CRITICAL: Update these for production
NEXTAUTH_SECRET="your-super-secure-secret-key-here"
NEXTAUTH_URL="https://your-domain.com"

# Email (Optional but recommended for production)
EMAIL_SERVER_HOST="smtp.outlook.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@outlook.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@your-domain.com"
```

### 2. Database Setup on VPS

```bash
# 1. Install PostgreSQL (if not already installed)
sudo apt update
sudo apt install postgresql postgresql-contrib

# 2. Create production database
sudo -u postgres createdb production_db_name

# 3. Create database user
sudo -u postgres createuser --interactive

# 4. Set password for database user
sudo -u postgres psql
ALTER USER username PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE production_db_name TO username;
\q
```

### 3. Application Deployment

```bash
# 1. Clone/update your repository
git clone https://github.com/Mustafaelfangary/Dahabiyat-Nile-Cruise.git
cd Dahabiyat-Nile-Cruise

# 2. Install dependencies
npm install

# 3. Generate Prisma client
npx prisma generate

# 4. Push database schema
npx prisma db push

# 5. Create admin user
node scripts/create-admin.js

# 6. Build for production
npm run build

# 7. Start production server
npm start
```

### 4. Admin User Verification

After deployment, verify the admin account:

```bash
# Test admin user exists
node scripts/test-admin-login.js

# Test complete flow
node scripts/test-complete-flow.js
```

### 5. Domain Configuration

#### A. Update NEXTAUTH_URL
In your production `.env`:
```bash
NEXTAUTH_URL="https://your-actual-domain.com"
```

#### B. SSL Certificate
Ensure your domain has a valid SSL certificate (Let's Encrypt recommended):
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

#### C. Nginx Configuration (if using Nginx)
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
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
}
```

### 6. Process Management (PM2)

```bash
# Install PM2
npm install -g pm2

# Start application with PM2
pm2 start npm --name "dahabiyat-app" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

## Testing Production Admin Login

1. **Visit your domain**: `https://your-domain.com/auth/signin`
2. **Enter credentials**:
   - Email: `dark1devil2025@outlook.com`
   - Password: `1082034D1d@#`
3. **Should sign in directly** without verification prompts

## Security Considerations

### 1. Environment Variables
- Never commit `.env` files to version control
- Use strong, unique passwords for database
- Generate a secure NEXTAUTH_SECRET (32+ characters)

### 2. Database Security
- Use strong database passwords
- Restrict database access to localhost only
- Regular database backups

### 3. Application Security
- Keep dependencies updated
- Use HTTPS only in production
- Implement rate limiting for auth endpoints

## Troubleshooting

### Admin Login Issues
```bash
# Check admin user exists
node scripts/test-admin-login.js

# Recreate admin if needed
node scripts/create-admin.js
```

### Database Connection Issues
```bash
# Test database connection
npx prisma db push

# Check database status
sudo systemctl status postgresql
```

### Application Issues
```bash
# Check application logs
pm2 logs dahabiyat-app

# Restart application
pm2 restart dahabiyat-app
```

## Success Checklist

- [ ] Database created and accessible
- [ ] Environment variables configured
- [ ] SSL certificate installed
- [ ] Admin user created with Outlook email
- [ ] Application built and deployed
- [ ] Admin can sign in without verification
- [ ] Dahabiya cards show prices instead of guest count
- [ ] All API endpoints working
- [ ] Domain properly configured

Your admin account `dark1devil2025@outlook.com` will work seamlessly on both development and production environments!
