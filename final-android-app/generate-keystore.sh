#!/bin/bash

# Generate Release Keystore for Dahabiyat Nile Cruise App
# This creates a production-ready keystore for Google Play Store

set -e

echo "🔐 Generating Release Keystore for Dahabiyat Nile Cruise"
echo "======================================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Keystore configuration
KEYSTORE_NAME="dahabiyat-release.keystore"
KEY_ALIAS="dahabiyat-release"
KEYSTORE_PATH="android/app/$KEYSTORE_NAME"
PROPERTIES_PATH="android/app/keystore.properties"

echo -e "${BLUE}🔑 Keystore: $KEYSTORE_NAME${NC}"
echo -e "${BLUE}🏷️  Alias: $KEY_ALIAS${NC}"
echo ""

# Check if keystore already exists
if [ -f "$KEYSTORE_PATH" ]; then
    echo -e "${YELLOW}⚠️  Keystore already exists at: $KEYSTORE_PATH${NC}"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}ℹ️  Keeping existing keystore${NC}"
        exit 0
    fi
    rm -f "$KEYSTORE_PATH"
fi

echo -e "${YELLOW}📝 Please provide the following information for your keystore:${NC}"
echo ""

# Collect keystore information
read -p "Store Password (min 6 characters): " -s STORE_PASSWORD
echo
read -p "Confirm Store Password: " -s STORE_PASSWORD_CONFIRM
echo

if [ "$STORE_PASSWORD" != "$STORE_PASSWORD_CONFIRM" ]; then
    echo -e "${RED}❌ Passwords don't match!${NC}"
    exit 1
fi

if [ ${#STORE_PASSWORD} -lt 6 ]; then
    echo -e "${RED}❌ Password must be at least 6 characters!${NC}"
    exit 1
fi

read -p "Key Password (min 6 characters, can be same as store password): " -s KEY_PASSWORD
echo

if [ ${#KEY_PASSWORD} -lt 6 ]; then
    echo -e "${RED}❌ Key password must be at least 6 characters!${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}📋 Certificate Information:${NC}"
read -p "First and Last Name (e.g., Dahabiyat Nile Cruise): " CN
read -p "Organization (e.g., Dahabiyat Nile Cruise Company): " O
read -p "Organizational Unit (e.g., Mobile Development): " OU
read -p "City (e.g., Aswan): " L
read -p "State/Province (e.g., Aswan): " ST
read -p "Country Code (e.g., EG): " C

echo ""
echo -e "${YELLOW}🔧 Generating keystore...${NC}"

# Generate the keystore
keytool -genkey -v \
    -keystore "$KEYSTORE_PATH" \
    -alias "$KEY_ALIAS" \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -storepass "$STORE_PASSWORD" \
    -keypass "$KEY_PASSWORD" \
    -dname "CN=$CN, OU=$OU, O=$O, L=$L, ST=$ST, C=$C"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Keystore generated successfully!${NC}"
else
    echo -e "${RED}❌ Failed to generate keystore!${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}📝 Creating keystore.properties...${NC}"

# Create keystore.properties file
cat > "$PROPERTIES_PATH" << EOF
storeFile=$KEYSTORE_NAME
storePassword=$STORE_PASSWORD
keyAlias=$KEY_ALIAS
keyPassword=$KEY_PASSWORD
EOF

echo -e "${GREEN}✅ keystore.properties created${NC}"

# Set proper permissions
chmod 600 "$PROPERTIES_PATH"
chmod 600 "$KEYSTORE_PATH"

echo ""
echo -e "${YELLOW}📊 Keystore Information:${NC}"
echo "================================"
echo -e "${BLUE}📁 Keystore File: $KEYSTORE_PATH${NC}"
echo -e "${BLUE}🏷️  Key Alias: $KEY_ALIAS${NC}"
echo -e "${BLUE}⏰ Validity: 10000 days (~27 years)${NC}"
echo -e "${BLUE}🔐 Algorithm: RSA 2048-bit${NC}"
echo ""

echo -e "${YELLOW}🔍 Certificate Details:${NC}"
keytool -list -v -keystore "$KEYSTORE_PATH" -alias "$KEY_ALIAS" -storepass "$STORE_PASSWORD" | head -20

echo ""
echo -e "${GREEN}🎉 Release keystore setup complete!${NC}"
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "1. Keep your keystore file and passwords SECURE"
echo "2. Backup the keystore file to a safe location"
echo "3. Run ./build-release.sh to build signed APK/AAB"
echo "4. Upload AAB to Google Play Console"
echo ""

echo -e "${RED}⚠️  IMPORTANT SECURITY NOTES:${NC}"
echo "• Never commit keystore.properties to version control"
echo "• Store keystore file and passwords securely"
echo "• If you lose the keystore, you cannot update your app on Google Play"
echo "• Make multiple backups of your keystore file"
echo ""

echo -e "${BLUE}📁 Files created:${NC}"
echo "• $KEYSTORE_PATH (keystore file)"
echo "• $PROPERTIES_PATH (configuration)"
echo ""

# Add to .gitignore if it exists
if [ -f ".gitignore" ]; then
    if ! grep -q "keystore.properties" .gitignore; then
        echo "" >> .gitignore
        echo "# Keystore files" >> .gitignore
        echo "android/app/keystore.properties" >> .gitignore
        echo "android/app/*.keystore" >> .gitignore
        echo -e "${GREEN}✅ Added keystore files to .gitignore${NC}"
    fi
fi

echo -e "${GREEN}🔐 Keystore generation completed successfully!${NC}"
