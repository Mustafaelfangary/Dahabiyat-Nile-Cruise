#!/usr/bin/env node

/**
 * Script to clean up unused and duplicate admin panel sections
 */

const fs = require('fs');
const path = require('path');

// List of unused/duplicate admin sections to remove
const sectionsToRemove = [
  // Debug and test sections
  'src/app/admin/availability-debug',
  'src/app/admin/cleanup-test',
  'src/app/admin/diagnostics',
  'src/app/admin/force-fix-tabs',
  'src/app/admin/test-password-reset',
  
  // Duplicate email sections (keep only main ones)
  'src/app/admin/email-deliverability-guide',
  'src/app/admin/email-diagnostics',
  'src/app/admin/email-fix',
  'src/app/admin/email-setup-guide',
  
  // Unused content sections
  'src/app/admin/add-itineraries-content',
  'src/app/admin/profile-fixes-guide',
  
  // Duplicate gallery (keep media)
  'src/app/admin/gallery',
];

// List of sections to keep (core functionality)
const coreSections = [
  'src/app/admin/dashboard',
  'src/app/admin/bookings',
  'src/app/admin/users',
  'src/app/admin/dahabiyas',
  'src/app/admin/packages',
  'src/app/admin/itineraries',
  'src/app/admin/blogs',
  'src/app/admin/media',
  'src/app/admin/reviews',
  'src/app/admin/tailor-made',
  'src/app/admin/availability',
  'src/app/admin/settings',
  'src/app/admin/email-settings',
  'src/app/admin/email-templates',
  'src/app/admin/notification-settings',
  'src/app/admin/whatsapp-settings',
  'src/app/admin/developer-settings',
  'src/app/admin/loyalty-system',
  'src/app/admin/memories',
  'src/app/admin/pdf-manager',
  'src/app/admin/website',
  'src/app/admin/package-editor',
  'src/app/admin/email-setup'
];

function removeDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    console.log(`🗑️  Removing: ${dirPath}`);
    fs.rmSync(dirPath, { recursive: true, force: true });
    return true;
  }
  return false;
}

function cleanupAdminPanel() {
  console.log('🧹 Starting Admin Panel Cleanup...\n');
  
  let removedCount = 0;
  let totalSize = 0;
  
  // Remove unused sections
  sectionsToRemove.forEach(sectionPath => {
    const fullPath = path.resolve(sectionPath);
    
    if (removeDirectory(fullPath)) {
      removedCount++;
    }
  });
  
  console.log(`\n✅ Cleanup completed!`);
  console.log(`📊 Removed ${removedCount} unused admin sections`);
  console.log(`🎯 Kept ${coreSections.length} core admin sections`);
  
  console.log('\n📋 Remaining Core Admin Sections:');
  coreSections.forEach(section => {
    const sectionName = section.split('/').pop();
    console.log(`   ✓ ${sectionName}`);
  });
  
  console.log('\n🎨 Admin Panel Benefits:');
  console.log('   • Cleaner navigation');
  console.log('   • Faster loading times');
  console.log('   • Reduced confusion');
  console.log('   • Better organization');
  console.log('   • Easier maintenance');
}

// Run the cleanup
try {
  cleanupAdminPanel();
} catch (error) {
  console.error('❌ Error during cleanup:', error);
  process.exit(1);
}
