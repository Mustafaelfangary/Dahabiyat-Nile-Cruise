const fs = require('fs');
const path = require('path');

// Color mapping from amber/orange to ocean blue
const colorMappings = {
  // Amber to Ocean Blue
  'amber-50': 'blue-50',
  'amber-100': 'blue-100',
  'amber-200': 'blue-200',
  'amber-300': 'blue-300',
  'amber-400': 'ocean-blue',
  'amber-500': 'ocean-blue',
  'amber-600': 'ocean-blue-dark',
  'amber-700': 'ocean-blue-dark',
  'amber-800': 'ocean-blue-dark',
  'amber-900': 'navy-blue',
  
  // Orange to Ocean Blue variants
  'orange-50': 'blue-50',
  'orange-100': 'blue-100',
  'orange-200': 'blue-200',
  'orange-300': 'blue-300',
  'orange-400': 'ocean-blue',
  'orange-500': 'ocean-blue',
  'orange-600': 'deep-blue',
  'orange-700': 'deep-blue',
  'orange-800': 'navy-blue',
  'orange-900': 'navy-blue',
  
  // Red to Navy Blue
  'red-600': 'navy-blue',
  'red-700': 'navy-blue',
  'red-800': 'navy-blue',
  'red-900': 'navy-blue',
  
  // Yellow to Sky Blue
  'yellow-400': 'sky-blue',
  'yellow-500': 'sky-blue'
};

function updateBlogsColors() {
  console.log('🎨 Updating blog page colors to ocean blue theme...\n');
  
  const blogsPagePath = path.join(__dirname, '../src/app/blogs/page.tsx');
  const blogSlugPagePath = path.join(__dirname, '../src/app/blogs/[slug]/page.tsx');
  
  const files = [blogsPagePath, blogSlugPagePath];
  
  files.forEach(filePath => {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return;
    }
    
    console.log(`📝 Updating: ${path.basename(filePath)}`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    let changes = 0;
    
    // Apply color mappings
    Object.entries(colorMappings).forEach(([oldColor, newColor]) => {
      const regex = new RegExp(`\\b${oldColor}\\b`, 'g');
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, newColor);
        changes += matches.length;
        console.log(`   ✅ ${oldColor} → ${newColor} (${matches.length} occurrences)`);
      }
    });
    
    // Additional specific replacements
    const specificReplacements = [
      // Text colors
      ['text-amber-', 'text-ocean-blue-'],
      ['text-orange-', 'text-ocean-blue-'],
      
      // Background colors
      ['bg-amber-', 'bg-blue-'],
      ['bg-orange-', 'bg-blue-'],
      
      // Border colors
      ['border-amber-', 'border-blue-'],
      ['border-orange-', 'border-blue-'],
      
      // Hover states
      ['hover:text-amber-', 'hover:text-ocean-blue-'],
      ['hover:bg-amber-', 'hover:bg-blue-'],
      ['hover:border-amber-', 'hover:border-blue-'],
      
      // Gradients
      ['from-amber-', 'from-ocean-blue-'],
      ['via-amber-', 'via-deep-blue-'],
      ['to-amber-', 'to-deep-blue-'],
      ['from-orange-', 'from-deep-blue-'],
      ['via-orange-', 'via-navy-blue-'],
      ['to-orange-', 'to-navy-blue-'],
      ['to-red-', 'to-navy-blue-']
    ];
    
    specificReplacements.forEach(([oldPattern, newPattern]) => {
      const regex = new RegExp(oldPattern, 'g');
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, newPattern);
        changes += matches.length;
        console.log(`   ✅ ${oldPattern} → ${newPattern} (${matches.length} occurrences)`);
      }
    });
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`   📊 Total changes: ${changes}\n`);
  });
  
  console.log('✅ Blog page colors updated successfully!');
  console.log('🌊 All amber/orange colors have been replaced with ocean blue theme colors.');
}

// Run the update
updateBlogsColors();
