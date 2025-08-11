#!/bin/bash

echo "🔍 Finding Dahabiyat-Nile-Cruise project path on VPS..."
echo "=================================================="

# Method 1: Check current directory
echo ""
echo "1️⃣ Current directory:"
echo "📍 $(pwd)"

# Check if we're already in the project
if [ -f "package.json" ] && grep -q "Dahabiyat-Nile-Cruise" package.json 2>/dev/null; then
    echo "✅ You are currently IN the project directory!"
    echo "🎯 Project path: $(pwd)"
    exit 0
fi

# Method 2: Search common locations
echo ""
echo "2️⃣ Searching common locations..."

# Check home directory
if [ -d "$HOME/Dahabiyat-Nile-Cruise" ]; then
    echo "✅ Found in home directory: $HOME/Dahabiyat-Nile-Cruise"
    PROJECT_PATH="$HOME/Dahabiyat-Nile-Cruise"
fi

# Check /var/www
if [ -d "/var/www/Dahabiyat-Nile-Cruise" ]; then
    echo "✅ Found in /var/www: /var/www/Dahabiyat-Nile-Cruise"
    PROJECT_PATH="/var/www/Dahabiyat-Nile-Cruise"
fi

# Check /var/www/html
if [ -d "/var/www/html/Dahabiyat-Nile-Cruise" ]; then
    echo "✅ Found in /var/www/html: /var/www/html/Dahabiyat-Nile-Cruise"
    PROJECT_PATH="/var/www/html/Dahabiyat-Nile-Cruise"
fi

# Check /opt
if [ -d "/opt/Dahabiyat-Nile-Cruise" ]; then
    echo "✅ Found in /opt: /opt/Dahabiyat-Nile-Cruise"
    PROJECT_PATH="/opt/Dahabiyat-Nile-Cruise"
fi

# Method 3: System-wide search (may take time)
echo ""
echo "3️⃣ Performing system-wide search..."
FOUND_PATHS=$(find / -name "Dahabiyat-Nile-Cruise" -type d 2>/dev/null | head -5)

if [ ! -z "$FOUND_PATHS" ]; then
    echo "✅ Found project at:"
    echo "$FOUND_PATHS"
    PROJECT_PATH=$(echo "$FOUND_PATHS" | head -1)
else
    echo "❌ Project not found in system-wide search"
fi

# Method 4: Check for git repositories
echo ""
echo "4️⃣ Searching for git repositories..."
GIT_REPOS=$(find /home /var/www /opt -name ".git" -type d 2>/dev/null | head -10)

if [ ! -z "$GIT_REPOS" ]; then
    echo "📁 Found git repositories:"
    for repo in $GIT_REPOS; do
        repo_dir=$(dirname "$repo")
        if [ -f "$repo_dir/package.json" ]; then
            echo "   $repo_dir"
            # Check if it's our project
            if grep -q "Dahabiyat-Nile-Cruise" "$repo_dir/package.json" 2>/dev/null; then
                echo "   ✅ This is your project!"
                PROJECT_PATH="$repo_dir"
            fi
        fi
    done
fi

# Summary
echo ""
echo "📋 SUMMARY:"
echo "=========="

if [ ! -z "$PROJECT_PATH" ]; then
    echo "🎯 Project found at: $PROJECT_PATH"
    echo ""
    echo "🚀 To navigate to your project:"
    echo "cd $PROJECT_PATH"
    echo ""
    echo "🔧 To verify it's the right project:"
    echo "cd $PROJECT_PATH && ls -la"
    echo "cd $PROJECT_PATH && cat package.json | grep name"
    echo ""
    echo "📦 To set up the project:"
    echo "cd $PROJECT_PATH"
    echo "npm install"
    echo "npx prisma generate"
    echo "npx prisma db push"
    echo "node scripts/create-admin.js"
    echo "npm run build"
    echo "npm start"
else
    echo "❌ Project not found automatically."
    echo ""
    echo "🔍 Manual search suggestions:"
    echo "1. Check where you cloned it:"
    echo "   history | grep 'git clone'"
    echo ""
    echo "2. Search manually:"
    echo "   find /home -name 'package.json' -exec grep -l 'Dahabiyat-Nile-Cruise' {} \\;"
    echo ""
    echo "3. Check your bash history:"
    echo "   history | grep 'cd'"
fi

echo ""
echo "✅ Search completed!"
