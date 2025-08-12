const fs = require('fs');
const path = require('path');
const https = require('https');

// Download the logo from the website
const logoUrl = 'https://dahabiyatnilecruise.com/images/logo.png';
const logoPath = path.join(__dirname, 'logo.png');

console.log('🎨 Generating app icons from website logo...');

// Download logo
const file = fs.createWriteStream(logoPath);
https.get(logoUrl, (response) => {
  response.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('✅ Logo downloaded successfully');
    generateIcons();
  });
}).on('error', (err) => {
  console.error('❌ Error downloading logo:', err);
});

function generateIcons() {
  console.log('📱 Generating Android app icons...');
  
  // Android icon sizes
  const androidSizes = [
    { size: 48, folder: 'mipmap-mdpi' },
    { size: 72, folder: 'mipmap-hdpi' },
    { size: 96, folder: 'mipmap-xhdpi' },
    { size: 144, folder: 'mipmap-xxhdpi' },
    { size: 192, folder: 'mipmap-xxxhdpi' }
  ];

  // Create a simple icon generation using Node.js (basic approach)
  // For production, you'd want to use a proper image processing library like Sharp
  
  console.log('📋 Icon generation instructions:');
  console.log('1. Use the downloaded logo.png file');
  console.log('2. Resize it to the following sizes and place in respective folders:');
  
  androidSizes.forEach(({ size, folder }) => {
    console.log(`   - ${size}x${size}px → android/app/src/main/res/${folder}/ic_launcher.png`);
    console.log(`   - ${size}x${size}px → android/app/src/main/res/${folder}/ic_launcher_round.png`);
  });
  
  console.log('\n🔧 For now, I\'ll copy the logo to replace the default icons...');
  
  // Copy logo to replace default icons (basic approach)
  androidSizes.forEach(({ folder }) => {
    const folderPath = path.join(__dirname, 'android', 'app', 'src', 'main', 'res', folder);
    
    if (fs.existsSync(folderPath)) {
      const iconPath = path.join(folderPath, 'ic_launcher.png');
      const roundIconPath = path.join(folderPath, 'ic_launcher_round.png');
      
      try {
        fs.copyFileSync(logoPath, iconPath);
        fs.copyFileSync(logoPath, roundIconPath);
        console.log(`✅ Updated icons in ${folder}`);
      } catch (err) {
        console.log(`⚠️  Could not update ${folder}: ${err.message}`);
      }
    }
  });
  
  console.log('\n🎉 App icon update completed!');
  console.log('📝 Note: For best results, manually resize the logo to exact dimensions using image editing software.');
}
