# 🚀 Complete Deployment & Sync Guide

## 📋 **Recent Changes Summary**
- ✅ Fixed "View Details" buttons - smaller, pharaonic styling with new hieroglyphic text `𓎢𓃭𓅂𓅱𓊪𓄿𓏏𓂋𓄿`
- ✅ Fixed availability management system - proper green/red colors and date matching
- ✅ Updated pharaonic text across all components
- ✅ Enhanced button styling with Material-UI sx props

---

## 🔄 **1. Local Repository Sync**

### **Commit Current Changes**
```bash
# Add all changes
git add .

# Commit with descriptive message
git commit -m "🎨 Fix: Enhanced pharaonic buttons & availability system

- Updated View Details buttons with smaller pharaonic styling
- Added new hieroglyphic text 𓎢𓃭𓅂𓅱𓊪𓄿𓏏𓂋𓄿 to all buttons
- Fixed availability calendar date matching issue
- Implemented proper green/red colors for availability buttons
- Enhanced button styling with Material-UI sx props"

# Push to remote repository
git push origin main
```

### **Sync Content Across Platforms**
```bash
# Sync content to mobile apps and generate config files
npm run sync:content

# Build the project to ensure everything works
npm run build
```

---

## 📱 **2. Android App Synchronization**

### **Update Mobile App Constants**
```bash
# Navigate to mobile app directory
cd mobile-app

# Update dependencies
npm install

# Sync latest content from web app
npm run sync:from-web

# Build Android APK
npm run build:android

# Or build for development
npm run android
```

### **Manual Mobile App Updates**
If automatic sync doesn't work, manually update:

**File: `mobile-app/constants/AppConstants.ts`**
```typescript
export const HIEROGLYPHIC_TEXT = {
  MAIN: '𓎢𓃭𓅂𓅱𓊪𓄿𓏏𓂋𓄿', // Updated text
  VIEW_DETAILS: '𓎢𓃭𓅂𓅱𓊪𓄿𓏏𓂋𓄿'
};
```

**File: `mobile-app/components/DahabiyaCard.tsx`**
```typescript
// Update button styling to match web app
const styles = StyleSheet.create({
  viewButton: {
    backgroundColor: '#D4AF37',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#B8860B'
  }
});
```

---

## 🖥️ **3. VPS Deployment Commands**

### **SSH into VPS**
```bash
# Replace with your VPS details
ssh root@your-vps-ip
# or
ssh username@your-domain.com
```

### **Pull Latest Changes**
```bash
# Navigate to project directory
cd /var/www/dahabiyat-nile-cruise
# or wherever your project is located

# Pull latest changes from repository
git pull origin main

# Install/update dependencies
npm install

# Sync content across platforms
npm run sync:content

# Build the project
npm run build
```

### **Database Migration (if needed)**
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Seed database if needed
npx prisma db seed
```

### **Restart Services**
```bash
# Restart PM2 processes
pm2 restart all

# Or restart specific app
pm2 restart dahabiyat-app

# Check status
pm2 status

# View logs
pm2 logs
```

### **Nginx Configuration Update (if needed)**
```bash
# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx

# Restart nginx if needed
sudo systemctl restart nginx
```

---

## 🔧 **4. Environment Variables Check**

### **Verify Environment Variables**
```bash
# Check if .env file exists and has correct values
cat .env

# Key variables to verify:
# DATABASE_URL=
# NEXTAUTH_SECRET=
# NEXTAUTH_URL=
# GOOGLE_CLIENT_ID=
# GOOGLE_CLIENT_SECRET=
```

---

## 📊 **5. Health Checks**

### **Verify Deployment**
```bash
# Check if application is running
curl http://localhost:3000/api/health

# Check database connection
npx prisma db pull

# Test API endpoints
curl http://localhost:3000/api/dashboard/dahabiyat

# Check logs for errors
pm2 logs --lines 50
```

### **Test Key Features**
1. **Admin Login**: `https://yourdomain.com/admin-login`
2. **Availability Management**: `https://yourdomain.com/admin/availability`
3. **Dahabiya Cards**: Check button styling and hieroglyphic text
4. **Mobile App**: Test if content syncs properly

---

## 🚨 **6. Troubleshooting**

### **Common Issues & Solutions**

**Build Errors:**
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

**Database Issues:**
```bash
# Reset database connection
npx prisma db push --force-reset
npx prisma generate
```

**PM2 Issues:**
```bash
# Delete and recreate PM2 process
pm2 delete dahabiyat-app
pm2 start npm --name "dahabiyat-app" -- start
```

**Nginx Issues:**
```bash
# Check nginx error logs
sudo tail -f /var/log/nginx/error.log

# Test configuration
sudo nginx -t
```

---

## ✅ **7. Verification Checklist**

- [ ] Repository updated with latest changes
- [ ] Mobile app synced with new hieroglyphic text
- [ ] VPS pulled latest code successfully
- [ ] Database migrations applied
- [ ] PM2 processes restarted
- [ ] Nginx configuration updated
- [ ] Environment variables verified
- [ ] Health checks passed
- [ ] Admin availability system working
- [ ] Button styling updated (green/red colors)
- [ ] New hieroglyphic text `𓎢𓃭𓅂𓅱𓊪𓄿𓏏𓂋𓄿` displaying correctly

---

## 📞 **8. Quick Commands Summary**

**Local:**
```bash
git add . && git commit -m "Update" && git push
npm run sync:content && npm run build
```

**VPS:**
```bash
cd /var/www/dahabiyat-nile-cruise
git pull && npm install && npm run build
pm2 restart all && pm2 status
```

**Mobile:**
```bash
cd mobile-app && npm run sync:from-web && npm run build:android
```

---

🎉 **Your Dahabiyat Nile Cruise application is now fully synchronized and deployed!**
