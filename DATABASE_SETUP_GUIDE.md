# 🔧 Database Setup and Content Fix Guide

This guide helps you fix the database connection issues and missing content warnings.

## 🚨 Current Issues

1. **Database Error**: `Database 'cleopatra_db' does not exist`
2. **Missing Content Keys**: Multiple content keys missing from database
3. **Sitemap Generation Error**: Due to database connection issues

## 🛠️ Quick Fix (Automated)

### Option 1: Run Setup Script (Windows)
```bash
# Navigate to your project directory
cd cleopatra-dahabiyat

# Run the setup script
scripts\setup-database-and-content.bat
```

### Option 2: Run Setup Script (Linux/macOS)
```bash
# Navigate to your project directory
cd cleopatra-dahabiyat

# Make script executable
chmod +x scripts/setup-database-and-content.sh

# Run the setup script
./scripts/setup-database-and-content.sh
```

## 🔧 Manual Fix Steps

### Step 1: Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE cleopatra_db;

# Exit PostgreSQL
\q
```

### Step 2: Run Migrations
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Optional: Reset database if needed
npx prisma migrate reset
```

### Step 3: Populate Missing Content
```bash
# Run the content population script
node scripts/fix-database-and-content.js
```

### Step 4: Seed Database (Optional)
```bash
# Seed with sample data
npx prisma db seed
```

## 🔍 Verify Setup

### Check Database Connection
```bash
# Test database connection
npx prisma db pull
```

### Check Content Population
```bash
# Open Prisma Studio to view data
npx prisma studio
```

### Test Build
```bash
# Clean build
rm -rf .next
npm run build
```

## 📋 Missing Content Keys Fixed

The script will populate these missing content keys:

- `footer_loading_text` - Footer loading text
- `about_loading_text` - About page loading text  
- `contact_loading_text` - Contact page loading text
- `faq_hero_title` - FAQ page hero title
- `faq_hero_subtitle` - FAQ page hero subtitle
- `faq_1_question` through `faq_5_question` - FAQ questions
- `faq_1_answer` through `faq_5_answer` - FAQ answers
- `loading_text` - General loading text
- `itineraries_loading_text` - Itineraries loading text
- `packages_loading_text` - Packages loading text

## 🚨 Troubleshooting

### PostgreSQL Not Running
```bash
# Windows
net start postgresql-x64-14

# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql
```

### Permission Issues
```bash
# Grant permissions to postgres user
sudo -u postgres createdb cleopatra_db
```

### Connection Issues
Check your `.env` file:
```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/cleopatra_db"
```

### Migration Issues
```bash
# Reset migrations if needed
npx prisma migrate reset --force

# Generate new migration
npx prisma migrate dev --name init
```

## ✅ Success Indicators

After running the setup, you should see:

1. ✅ Database `cleopatra_db` exists
2. ✅ All Prisma migrations applied
3. ✅ Missing content keys populated
4. ✅ Build completes without database errors
5. ✅ Sitemap generates successfully
6. ✅ No content warnings during build

## 🎯 Next Steps

1. **Build the application**: `npm run build`
2. **Start the application**: `npm start`
3. **Test admin panel**: Visit `/admin/website`
4. **Test language functionality**: Test language switching
5. **Verify booking forms**: Test unified booking forms

## 📞 Need Help?

If you encounter issues:

1. Check PostgreSQL service is running
2. Verify database credentials in `.env`
3. Run the setup script again
4. Check the error logs for specific issues

The setup scripts will handle most common issues automatically!
