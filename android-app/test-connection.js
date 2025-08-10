#!/usr/bin/env node

/**
 * Quick Connection Test Script
 * Test your live backend endpoints before running the Android app
 */

const https = require('https');
const http = require('http');

const BASE_URL = 'https://www.dahabiyatnilecruise.com';
const API_BASE = `${BASE_URL}/api`;

console.log('🧪 Testing connection to your live backend...\n');
console.log(`🔗 Base URL: ${BASE_URL}`);
console.log(`🔗 API Base: ${API_BASE}\n`);

// Test endpoints
const endpoints = [
    { path: '/api/dahabiyas', name: 'Dahabiyas', method: 'GET' },
    { path: '/api/packages', name: 'Packages', method: 'GET' },
    { path: '/api/gallery', name: 'Gallery', name: 'GET' },
    { path: '/api/blogs', name: 'Blogs', method: 'GET' },
    { path: '/api/website-content?page=homepage', name: 'Website Content', method: 'GET' },
    { path: '/api/itineraries', name: 'Itineraries', method: 'GET' }
];

// Authentication test data
const authTests = [
    {
        path: '/api/auth/signin',
        name: 'Sign In',
        method: 'POST',
        data: {
            email: 'test@example.com',
            password: 'testpassword'
        }
    },
    {
        path: '/api/auth/verify-admin',
        name: 'Admin Verification',
        method: 'POST',
        data: {
            email: 'admin@dahabiyatnilecruise.com',
            adminKey: 'admin-verify-2024'
        }
    }
];

/**
 * Make HTTP request
 */
function makeRequest(options, postData = null) {
    return new Promise((resolve, reject) => {
        const protocol = options.protocol === 'https:' ? https : http;
        
        const req = protocol.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    statusMessage: res.statusMessage,
                    headers: res.headers,
                    data: data
                });
            });
        });
        
        req.on('error', (error) => {
            reject(error);
        });
        
        if (postData) {
            req.write(postData);
        }
        
        req.end();
    });
}

/**
 * Test a single endpoint
 */
async function testEndpoint(endpoint) {
    const url = new URL(`${BASE_URL}${endpoint.path}`);
    
    const options = {
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname + url.search,
        method: endpoint.method,
        protocol: url.protocol,
        headers: {
            'User-Agent': 'Dahabiyat-Android-App/1.0.0',
            'Accept': 'application/json'
        }
    };
    
    let postData = null;
    if (endpoint.data) {
        postData = JSON.stringify(endpoint.data);
        options.headers['Content-Type'] = 'application/json';
        options.headers['Content-Length'] = Buffer.byteLength(postData);
    }
    
    try {
        console.log(`🔍 Testing: ${endpoint.method} ${endpoint.path}`);
        
        const response = await makeRequest(options, postData);
        
        const statusIcon = response.statusCode >= 200 && response.statusCode < 300 ? '✅' : '❌';
        console.log(`${statusIcon} ${endpoint.name}: ${response.statusCode} ${response.statusMessage}`);
        
        // Try to parse JSON response
        try {
            const jsonData = JSON.parse(response.data);
            if (jsonData.success !== undefined) {
                console.log(`   📊 Success: ${jsonData.success}`);
            }
            if (jsonData.message) {
                console.log(`   💬 Message: ${jsonData.message}`);
            }
            if (jsonData.data && Array.isArray(jsonData.data)) {
                console.log(`   📦 Data: ${jsonData.data.length} items`);
            } else if (jsonData.data) {
                console.log(`   📦 Data: Object returned`);
            }
        } catch (e) {
            // Not JSON or parsing failed
            if (response.data.length > 0) {
                console.log(`   📄 Response: ${response.data.substring(0, 100)}${response.data.length > 100 ? '...' : ''}`);
            }
        }
        
        return {
            endpoint: endpoint.name,
            success: response.statusCode >= 200 && response.statusCode < 300,
            statusCode: response.statusCode,
            statusMessage: response.statusMessage
        };
        
    } catch (error) {
        console.log(`❌ ${endpoint.name}: Error - ${error.message}`);
        return {
            endpoint: endpoint.name,
            success: false,
            error: error.message
        };
    }
}

/**
 * Run all tests
 */
async function runTests() {
    console.log('🚀 Starting endpoint tests...\n');
    
    const results = [];
    
    // Test basic endpoints
    console.log('📋 Testing Content Endpoints:');
    console.log('─'.repeat(50));
    
    for (const endpoint of endpoints) {
        const result = await testEndpoint(endpoint);
        results.push(result);
        console.log(''); // Empty line for readability
    }
    
    // Test authentication endpoints
    console.log('\n🔐 Testing Authentication Endpoints:');
    console.log('─'.repeat(50));
    
    for (const endpoint of authTests) {
        const result = await testEndpoint(endpoint);
        results.push(result);
        console.log(''); // Empty line for readability
    }
    
    // Summary
    console.log('\n📊 Test Summary:');
    console.log('═'.repeat(50));
    
    const successful = results.filter(r => r.success).length;
    const total = results.length;
    
    console.log(`✅ Successful: ${successful}/${total}`);
    console.log(`❌ Failed: ${total - successful}/${total}`);
    console.log(`📈 Success Rate: ${Math.round((successful / total) * 100)}%`);
    
    if (successful === total) {
        console.log('\n🎉 All tests passed! Your backend is ready for the Android app.');
        console.log('📱 You can now build and test the Android application.');
    } else {
        console.log('\n⚠️  Some tests failed. Please check your backend configuration.');
        console.log('🔧 Make sure your API endpoints are working correctly.');
    }
    
    // Failed tests details
    const failed = results.filter(r => !r.success);
    if (failed.length > 0) {
        console.log('\n❌ Failed Tests:');
        failed.forEach(test => {
            console.log(`   • ${test.endpoint}: ${test.error || test.statusMessage}`);
        });
    }
    
    console.log('\n🔗 Next Steps:');
    console.log('1. Fix any failed endpoints');
    console.log('2. Open Android Studio');
    console.log('3. Build and run the Android app');
    console.log('4. Test the app with your live data');
    
    return results;
}

/**
 * Test SSL certificate
 */
async function testSSL() {
    console.log('🔒 Testing SSL Certificate...\n');
    
    try {
        const url = new URL(BASE_URL);
        const options = {
            hostname: url.hostname,
            port: 443,
            path: '/',
            method: 'GET',
            protocol: 'https:'
        };
        
        const response = await makeRequest(options);
        console.log(`✅ SSL Certificate: Valid (${response.statusCode})`);
        return true;
    } catch (error) {
        console.log(`❌ SSL Certificate: Error - ${error.message}`);
        return false;
    }
}

// Main execution
async function main() {
    console.log('🏺 Dahabiyat Nile Cruise - Backend Connection Test');
    console.log('═'.repeat(60));
    console.log('');
    
    // Test SSL first
    await testSSL();
    console.log('');
    
    // Run endpoint tests
    await runTests();
}

// Run the tests
main().catch(console.error);
