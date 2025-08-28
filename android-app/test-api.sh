#!/bin/bash

# API Testing Script for Dahabiyat Nile Cruise
# Tests the mobile API endpoints on your Hostinger VPS

BASE_URL="https://www.dahabiyatnilecruise.com/api"
echo "🚢 Testing Dahabiyat Nile Cruise Mobile API"
echo "Base URL: $BASE_URL"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3
    local data=$4
    
    echo -e "\n${YELLOW}Testing: $description${NC}"
    echo "Endpoint: $method $BASE_URL$endpoint"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -H "Accept: application/json")
    elif [ "$method" = "POST" ] && [ -n "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -H "Accept: application/json" \
            -d "$data")
    elif [ "$method" = "OPTIONS" ]; then
        response=$(curl -s -w "\n%{http_code}" -X OPTIONS "$BASE_URL$endpoint" \
            -H "Origin: http://localhost" \
            -H "Access-Control-Request-Method: POST" \
            -H "Access-Control-Request-Headers: Content-Type")
    fi
    
    # Extract HTTP status code (last line)
    http_code=$(echo "$response" | tail -n1)
    # Extract response body (all lines except last)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 201 ] || [ "$http_code" -eq 204 ]; then
        echo -e "${GREEN}✓ Success (HTTP $http_code)${NC}"
        if [ -n "$body" ] && [ "$body" != "null" ]; then
            echo "Response: $(echo "$body" | head -c 200)..."
        fi
    else
        echo -e "${RED}✗ Failed (HTTP $http_code)${NC}"
        if [ -n "$body" ]; then
            echo "Error: $body"
        fi
    fi
}

# Test basic connectivity
echo -e "\n${YELLOW}=== Basic Connectivity Tests ===${NC}"
test_endpoint "GET" "/" "Root endpoint"
test_endpoint "GET" "/health" "Health check"

# Test CORS
echo -e "\n${YELLOW}=== CORS Tests ===${NC}"
test_endpoint "OPTIONS" "/auth/signin" "CORS preflight for auth"

# Test authentication endpoints
echo -e "\n${YELLOW}=== Authentication Endpoints ===${NC}"
test_endpoint "POST" "/auth/signin" "Sign in endpoint" '{"email":"test@example.com","password":"testpass"}'
test_endpoint "POST" "/auth/signup" "Sign up endpoint" '{"name":"Test User","email":"test@example.com","password":"testpass","confirmPassword":"testpass"}'
test_endpoint "POST" "/auth/forgot-password" "Forgot password" '{"email":"test@example.com"}'

# Test content endpoints
echo -e "\n${YELLOW}=== Content Endpoints ===${NC}"
test_endpoint "GET" "/dahabiyas" "Get dahabiyas"
test_endpoint "GET" "/packages" "Get packages"
test_endpoint "GET" "/gallery" "Get gallery"
test_endpoint "GET" "/blogs" "Get blog posts"

# Test mobile-specific endpoints
echo -e "\n${YELLOW}=== Mobile-Specific Endpoints ===${NC}"
test_endpoint "GET" "/mobile/featured-dahabiyas" "Featured dahabiyas"
test_endpoint "GET" "/mobile/featured-packages" "Featured packages"
test_endpoint "POST" "/contact" "Contact form" '{"name":"Test User","email":"test@example.com","subject":"Test","message":"Test message"}'

# Summary
echo -e "\n${YELLOW}=========================================="
echo "API Testing Complete!"
echo "==========================================${NC}"
echo ""
echo "If you see mostly green checkmarks, your API is ready!"
echo "If you see red X marks, check the server setup guide."
echo ""
echo "Next steps:"
echo "1. Fix any failing endpoints"
echo "2. Test the Android app"
echo "3. Monitor logs for any issues"
echo ""
echo "For detailed setup instructions, see:"
echo "- SERVER_SETUP.md"
echo "- HOSTINGER_DEPLOYMENT.md"
