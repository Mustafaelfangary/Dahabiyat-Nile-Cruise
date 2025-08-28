# Git Commit Preparation

## Files Ready for Commit

### Android App Structure
```
android-app/
├── app/
│   ├── src/main/java/com/dahabiyat/nilecruise/
│   │   ├── data/                 # API services, models, repositories
│   │   ├── ui/                   # Screens, components, viewmodels
│   │   ├── di/                   # Dependency injection
│   │   └── utils/                # Utilities and constants
│   ├── src/main/res/             # Resources (layouts, colors, strings)
│   └── build.gradle.kts          # App build configuration
├── backend-extensions/           # Server-side mobile API routes
├── gradle/                       # Gradle wrapper
├── build.gradle.kts             # Project build configuration
├── settings.gradle.kts          # Project settings
├── README.md                    # Complete documentation
├── DEPLOYMENT.md                # Deployment guide
├── SERVER_SETUP.md              # Server setup guide
├── HOSTINGER_DEPLOYMENT.md      # Hostinger-specific guide
├── test-api.sh                  # API testing script
└── .gitignore                   # Git ignore rules
```

## Git Commands to Run

```bash
# Navigate to your project root
cd /path/to/Dahabiyat-Nile-Cruise

# Add all Android app files
git add android-app/

# Commit with descriptive message
git commit -m "feat: Add complete Android mobile application

- Complete Android app with Egyptian-themed UI
- Integration with existing PostgreSQL database
- Mobile API routes for backend integration
- Authentication, booking, and content management
- Production-ready for Hostinger VPS deployment
- Configured for https://www.dahabiyatnilecruise.com"

# Push to repository
git push origin main
```

## On Your Hostinger VPS

After pushing to your repository, run these commands on your VPS:

```bash
# SSH into your VPS
ssh root@your-hostinger-ip

# Navigate to your website directory
cd /var/www/html/dahabiyatnilecruise.com
# or wherever your site is located

# Pull the latest changes
git pull origin main

# Navigate to the backend extensions
cd android-app/backend-extensions

# Copy mobile API routes to your main app
cp mobile-api-routes.js ../../routes/mobile-api.js
# Adjust the path based on your actual project structure

# Install any new dependencies
npm install

# Restart your application
pm2 restart all
# or however you restart your Node.js app
```

## Database Updates

Run these SQL commands on your PostgreSQL database:

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

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_devices_user_id ON user_devices(user_id);
CREATE INDEX IF NOT EXISTS idx_user_devices_token ON user_devices(device_token);
CREATE INDEX IF NOT EXISTS idx_mobile_sessions_user_id ON mobile_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_mobile_sessions_token ON mobile_sessions(session_token);
```

## Verification Steps

After deployment:

1. **Test API endpoints:**
   ```bash
   curl -X GET https://www.dahabiyatnilecruise.com/api/health
   ```

2. **Check mobile routes:**
   ```bash
   curl -X GET https://www.dahabiyatnilecruise.com/api/mobile/featured-dahabiyas
   ```

3. **Test CORS:**
   ```bash
   curl -X OPTIONS https://www.dahabiyatnilecruise.com/api/auth/signin \
     -H "Origin: http://localhost" \
     -H "Access-Control-Request-Method: POST"
   ```

## Ready for Android Build

Once the backend is deployed and tested, you can build the Android APK using the instructions in the next section.
