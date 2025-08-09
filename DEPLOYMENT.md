# Deployment Configuration

## Environment Variables for VPS

When deploying to your VPS, make sure to update the following environment variables:

### Required Updates:

1. **NEXTAUTH_URL**: Update to your actual domain
   ```bash
   # For production
   NEXTAUTH_URL="https://your-domain.com"
   
   # For development/testing
   NEXTAUTH_URL="http://your-vps-ip:3000"
   ```

2. **DATABASE_URL**: Update to your VPS database connection
   ```bash
   DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
   ```

3. **Email Configuration**: Verify email settings work on VPS
   ```bash
   EMAIL_SERVER_HOST="smtp.gmail.com"
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER="your-email@gmail.com"
   EMAIL_SERVER_PASSWORD="your-app-password"
   EMAIL_FROM="your-email@gmail.com"
   ```

### Deployment Steps:

1. **Pull latest changes**:
   ```bash
   git pull origin main
   ```

2. **Update environment variables**:
   ```bash
   nano .env
   # Update NEXTAUTH_URL to your domain/IP
   ```

3. **Install dependencies and build**:
   ```bash
   npm install
   npm run build
   ```

4. **Restart application**:
   ```bash
   pm2 restart your-app-name
   # or
   sudo systemctl restart your-service-name
   ```

### Testing Authentication:

1. **Admin Verification** (if needed):
   - Go to `https://your-domain.com/admin-verify`
   - Use admin key: `admin-verify-2024`
   - Verify admin email

2. **Test Sign-in Flow**:
   - Try signing in as admin → should redirect to `/admin`
   - Try signing in as user → should redirect to `/profile`
   - No more localhost:3003 redirects

### Troubleshooting:

- If still redirecting to localhost:3003, check NEXTAUTH_URL in .env
- Clear browser cache and cookies
- Check PM2 logs: `pm2 logs your-app-name`
- Verify database connection and user email verification status
