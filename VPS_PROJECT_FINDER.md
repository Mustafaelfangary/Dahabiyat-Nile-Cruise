# 🔍 Finding Your Project Path on VPS

## Quick Commands to Run on Your VPS

### **Step 1: Check Current Location**
```bash
pwd
ls -la
```

### **Step 2: Search for Your Project**
```bash
# Search by folder name
find / -name "Dahabiyat-Nile-Cruise" -type d 2>/dev/null

# Search by package.json content
find / -name "package.json" -exec grep -l "Dahabiyat-Nile-Cruise" {} \; 2>/dev/null
```

### **Step 3: Check Common Locations**
```bash
# Home directory
ls -la ~/Dahabiyat-Nile-Cruise

# Web directories
ls -la /var/www/Dahabiyat-Nile-Cruise
ls -la /var/www/html/Dahabiyat-Nile-Cruise

# Opt directory
ls -la /opt/Dahabiyat-Nile-Cruise
```

### **Step 4: Check Git History**
```bash
# See where you cloned it
history | grep "git clone"
history | grep "cd"
```

## 📂 **Most Likely Paths**

Based on how you cloned it, your project is probably at:

### **If you cloned in home directory:**
```bash
/home/your-username/Dahabiyat-Nile-Cruise
# or
/home/ubuntu/Dahabiyat-Nile-Cruise
# or
/root/Dahabiyat-Nile-Cruise
```

### **If you cloned in web directory:**
```bash
/var/www/Dahabiyat-Nile-Cruise
# or
/var/www/html/Dahabiyat-Nile-Cruise
```

## 🚀 **Once You Find It**

When you locate your project, navigate to it and verify:

```bash
# Navigate to project
cd /path/to/your/Dahabiyat-Nile-Cruise

# Verify it's the right project
ls -la
cat package.json | grep "name"
git remote -v

# Check if it's up to date
git status
git pull origin main
```

## 🔧 **Setup Commands for VPS**

Once you're in the correct directory:

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
nano .env  # Edit with your production settings

# 3. Set up database
npx prisma generate
npx prisma db push

# 4. Create admin user
node scripts/create-admin.js

# 5. Build for production
npm run build

# 6. Start the application
npm start
# or with PM2
pm2 start npm --name "dahabiyat" -- start
```

## 🔍 **If You Can't Find It**

If the project isn't found, you might need to clone it again:

```bash
# Navigate to desired location
cd /var/www  # or wherever you want it

# Clone the repository
git clone https://github.com/Mustafaelfangary/Dahabiyat-Nile-Cruise.git

# Navigate to project
cd Dahabiyat-Nile-Cruise

# Follow setup commands above
```

## 📋 **Environment Variables for VPS**

Make sure your `.env` file has production settings:

```bash
# Database (update with your VPS database)
DATABASE_URL="postgresql://username:password@localhost:5432/production_db"

# NextAuth (CRITICAL for production)
NEXTAUTH_SECRET="your-super-secure-secret-here"
NEXTAUTH_URL="https://your-domain.com"

# Email (optional)
EMAIL_SERVER_HOST="smtp.outlook.com"
EMAIL_SERVER_PORT=587
EMAIL_FROM="noreply@your-domain.com"
```

## ✅ **Verification**

After setup, test that everything works:

```bash
# Test admin user
node scripts/test-admin-login.js

# Test production readiness
node scripts/verify-production-ready.js

# Check if app is running
curl http://localhost:3000
# or
curl https://your-domain.com
```

## 🆘 **Need Help?**

If you're still having trouble, run these commands and share the output:

```bash
# Show current location
pwd

# Show directory contents
ls -la

# Show system info
whoami
uname -a

# Search for any Node.js projects
find /home /var/www /opt -name "package.json" 2>/dev/null | head -10
```

Your project path will be something like:
**`/home/username/Dahabiyat-Nile-Cruise`** or **`/var/www/Dahabiyat-Nile-Cruise`**
