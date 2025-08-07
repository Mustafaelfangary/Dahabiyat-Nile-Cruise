// Final cleanup script to remove all remaining orange/amber colors
const fs = require('fs');
const path = require('path');

// Files to update
const filesToUpdate = [
  'src/components/homepage/ShareYourMemories.tsx',
  'src/app/gallery-new/page.tsx',
  'src/components/ui/pharaonic-elements.tsx'
];

// Color mappings
const colorReplacements = [
  // Background gradients
  ['from-orange-50 to-amber-50', 'from-blue-50 to-ocean-blue-lightest'],
  ['from-amber-50 to-orange-50', 'from-blue-50 to-ocean-blue-lightest'],
  ['from-egyptian-gold to-sunset-orange', 'from-ocean-blue to-deep-blue'],
  ['from-sunset-orange to-egyptian-amber', 'from-deep-blue to-navy-blue'],
  ['from-egyptian-amber to-egyptian-gold', 'from-navy-blue to-ocean-blue'],
  
  // Text colors
  ['text-egyptian-gold', 'text-ocean-blue'],
  ['text-sunset-orange', 'text-blue-300'],
  ['text-egyptian-amber', 'text-ocean-blue'],
  
  // Background colors
  ['bg-egyptian-gold', 'bg-ocean-blue'],
  ['bg-sunset-orange', 'bg-deep-blue'],
  ['bg-egyptian-amber', 'bg-ocean-blue'],
  ['bg-hieroglyph-brown', 'bg-deep-blue'],
  
  // Specific color fixes
  ['egyptian-gold', 'ocean-blue'],
  ['sunset-orange', 'blue-300'],
  ['egyptian-amber', 'ocean-blue'],
  ['hieroglyph-brown', 'deep-blue']
];

function updateFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  console.log(`📝 Updating: ${path.basename(filePath)}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let changes = 0;

  // Apply color replacements
  colorReplacements.forEach(([oldColor, newColor]) => {
    const regex = new RegExp(oldColor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const matches = content.match(regex);
    if (matches) {
      content = content.replace(regex, newColor);
      changes += matches.length;
      console.log(`   ✅ ${oldColor} → ${newColor} (${matches.length} occurrences)`);
    }
  });

  // Write updated content
  if (changes > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`   📊 Total changes: ${changes}\n`);
  } else {
    console.log(`   ℹ️  No changes needed\n`);
  }
}

function runCleanup() {
  console.log('🎨 Final Orange Schema Cleanup...\n');
  
  filesToUpdate.forEach(updateFile);
  
  console.log('✅ Final cleanup completed!');
  console.log('🌊 All remaining orange/amber colors have been converted to ocean blue theme.');
}

// Run the cleanup
runCleanup();
