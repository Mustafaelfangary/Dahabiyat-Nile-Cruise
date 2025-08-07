#!/usr/bin/env node

/**
 * Android App Configuration Test
 * Validates that the mobile app is properly configured for production
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Android App Configuration\n');

const mobileAppDir = path.join(__dirname, '../mobile-app');
const errors = [];
const warnings = [];
const successes = [];

function addError(message) {
  errors.push(`❌ ${message}`);
}

function addWarning(message) {
  warnings.push(`⚠️  ${message}`);
}

function addSuccess(message) {
  successes.push(`✅ ${message}`);
}

// Test 1: Check if mobile-app directory exists
console.log('1️⃣ Checking mobile app directory...');
if (!fs.existsSync(mobileAppDir)) {
  addError('mobile-app directory not found');
} else {
  addSuccess('mobile-app directory exists');
}

// Test 2: Check package.json
console.log('2️⃣ Checking package.json...');
const packageJsonPath = path.join(mobileAppDir, 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  addError('package.json not found');
} else {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    if (packageJson.version === '3.0.0') {
      addSuccess('App version is 3.0.0');
    } else {
      addWarning(`App version is ${packageJson.version}, expected 3.0.0`);
    }
    
    if (packageJson.dependencies.expo) {
      addSuccess(`Expo version: ${packageJson.dependencies.expo}`);
    } else {
      addError('Expo dependency not found');
    }
    
    if (packageJson.scripts['build:android']) {
      addSuccess('Android build script configured');
    } else {
      addError('Android build script not found');
    }
  } catch (error) {
    addError(`Failed to parse package.json: ${error.message}`);
  }
}

// Test 3: Check app.json
console.log('3️⃣ Checking app.json...');
const appJsonPath = path.join(mobileAppDir, 'app.json');
if (!fs.existsSync(appJsonPath)) {
  addError('app.json not found');
} else {
  try {
    const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
    const expo = appJson.expo;
    
    if (expo.name === 'Dahabiyat Nile Cruise') {
      addSuccess('App name is correct');
    } else {
      addWarning(`App name is "${expo.name}"`);
    }
    
    if (expo.version === '3.0.0') {
      addSuccess('App version in app.json is 3.0.0');
    } else {
      addWarning(`App version in app.json is ${expo.version}`);
    }
    
    if (expo.android && expo.android.package === 'com.dahabiyat.nilecruise') {
      addSuccess('Android package name is correct');
    } else {
      addError('Android package name is incorrect or missing');
    }
    
    if (expo.extra && expo.extra.apiUrl === 'https://dahabiyatnilecruise.com') {
      addSuccess('Production API URL configured in app.json');
    } else {
      addError('Production API URL not configured in app.json');
    }
    
    if (expo.android && expo.android.usesCleartextTraffic === false) {
      addSuccess('Cleartext traffic disabled (SSL only)');
    } else {
      addWarning('Cleartext traffic setting not properly configured');
    }
  } catch (error) {
    addError(`Failed to parse app.json: ${error.message}`);
  }
}

// Test 4: Check EAS configuration
console.log('4️⃣ Checking EAS configuration...');
const easJsonPath = path.join(mobileAppDir, 'eas.json');
if (!fs.existsSync(easJsonPath)) {
  addWarning('eas.json not found - EAS builds may not work');
} else {
  try {
    const easJson = JSON.parse(fs.readFileSync(easJsonPath, 'utf8'));
    
    if (easJson.build && easJson.build.production) {
      addSuccess('EAS production build profile configured');
    } else {
      addError('EAS production build profile not found');
    }
    
    if (easJson.build && easJson.build.preview) {
      addSuccess('EAS preview build profile configured');
    } else {
      addWarning('EAS preview build profile not found');
    }
  } catch (error) {
    addError(`Failed to parse eas.json: ${error.message}`);
  }
}

// Test 5: Check environment configuration
console.log('5️⃣ Checking environment configuration...');
const envPath = path.join(mobileAppDir, 'config/environment.ts');
if (!fs.existsSync(envPath)) {
  addError('environment.ts not found');
} else {
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  if (envContent.includes('https://dahabiyatnilecruise.com')) {
    addSuccess('Production domain configured in environment.ts');
  } else {
    addError('Production domain not found in environment.ts');
  }
  
  if (envContent.includes('production:')) {
    addSuccess('Production environment configuration found');
  } else {
    addError('Production environment configuration not found');
  }
}

// Test 6: Check app constants
console.log('6️⃣ Checking app constants...');
const constantsPath = path.join(mobileAppDir, 'constants/AppConstants.ts');
if (!fs.existsSync(constantsPath)) {
  addError('AppConstants.ts not found');
} else {
  const constantsContent = fs.readFileSync(constantsPath, 'utf8');
  
  if (constantsContent.includes('https://dahabiyatnilecruise.com')) {
    addSuccess('Production API base URL configured in AppConstants.ts');
  } else {
    addError('Production API base URL not found in AppConstants.ts');
  }
}

// Test 7: Check content configuration
console.log('7️⃣ Checking content configuration...');
const contentPath = path.join(mobileAppDir, 'config/content.json');
if (!fs.existsSync(contentPath)) {
  addWarning('content.json not found');
} else {
  try {
    const contentJson = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
    
    if (contentJson.apiEndpoint === 'https://dahabiyatnilecruise.com') {
      addSuccess('Production API endpoint configured in content.json');
    } else {
      addError(`API endpoint in content.json is: ${contentJson.apiEndpoint}`);
    }
  } catch (error) {
    addError(`Failed to parse content.json: ${error.message}`);
  }
}

// Test 8: Check required assets
console.log('8️⃣ Checking required assets...');
const requiredAssets = ['icon.png', 'adaptive-icon.png', 'splash.png'];
const assetsDir = path.join(mobileAppDir, 'assets');

if (!fs.existsSync(assetsDir)) {
  addError('assets directory not found');
} else {
  requiredAssets.forEach(asset => {
    const assetPath = path.join(assetsDir, asset);
    if (fs.existsSync(assetPath)) {
      addSuccess(`Asset found: ${asset}`);
    } else {
      addError(`Missing asset: ${asset}`);
    }
  });
}

// Test 9: Check API service
console.log('9️⃣ Checking API service...');
const apiServicePath = path.join(mobileAppDir, 'services/ApiService.ts');
if (!fs.existsSync(apiServicePath)) {
  addError('ApiService.ts not found');
} else {
  const apiServiceContent = fs.readFileSync(apiServicePath, 'utf8');
  
  if (apiServiceContent.includes('API_URL')) {
    addSuccess('API service uses environment configuration');
  } else {
    addWarning('API service may not be using environment configuration');
  }
}

// Print results
console.log('\n📊 Test Results Summary:\n');

if (successes.length > 0) {
  console.log('✅ Successes:');
  successes.forEach(success => console.log(`   ${success}`));
  console.log();
}

if (warnings.length > 0) {
  console.log('⚠️  Warnings:');
  warnings.forEach(warning => console.log(`   ${warning}`));
  console.log();
}

if (errors.length > 0) {
  console.log('❌ Errors:');
  errors.forEach(error => console.log(`   ${error}`));
  console.log();
}

// Final assessment
console.log('🎯 Final Assessment:');
if (errors.length === 0) {
  if (warnings.length === 0) {
    console.log('🎉 Perfect! Your Android app is fully configured for production.');
  } else {
    console.log('✅ Good! Your Android app is ready for production with minor warnings.');
  }
  console.log('\n🚀 You can proceed with building the Android app.');
} else {
  console.log('❌ Issues found! Please fix the errors before building.');
  console.log('\n🔧 Fix the errors and run this test again.');
}

console.log('\n📱 Next Steps:');
console.log('   1. Run: cd mobile-app && npm install');
console.log('   2. Run: npx expo start (for development)');
console.log('   3. Run: npx eas build --platform android --profile preview (for APK)');
console.log('   4. Run: npx eas build --platform android --profile production (for Play Store)');

console.log('\n🔗 Production Domain: https://dahabiyatnilecruise.com');
console.log('📋 Build Status:', errors.length === 0 ? '✅ Ready' : '❌ Not Ready');

process.exit(errors.length > 0 ? 1 : 0);
