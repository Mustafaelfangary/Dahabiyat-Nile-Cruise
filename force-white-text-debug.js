// EMERGENCY WHITE TEXT FORCE SCRIPT
// Run this in browser console to force all text to white

console.log('🚨 FORCING ALL TEXT TO WHITE - DEBUG MODE');

// Function to force white text on elements
function forceWhiteText(elements, description) {
  console.log(`🎯 Processing ${elements.length} ${description} elements`);
  
  elements.forEach((el, index) => {
    // Get current computed style
    const computedStyle = window.getComputedStyle(el);
    const currentColor = computedStyle.color;
    
    console.log(`Element ${index + 1}:`, {
      tagName: el.tagName,
      className: el.className,
      currentColor: currentColor,
      textContent: el.textContent?.substring(0, 50) + '...'
    });
    
    // Force white with multiple methods
    el.style.setProperty('color', 'white', 'important');
    el.style.setProperty('-webkit-text-fill-color', 'white', 'important');
    el.style.setProperty('text-shadow', 'none', 'important');
    
    // Add force-white-text class
    el.classList.add('force-white-text');
    
    // Check if it worked
    const newComputedStyle = window.getComputedStyle(el);
    const newColor = newComputedStyle.color;
    
    console.log(`  → New color: ${newColor} ${newColor === 'rgb(255, 255, 255)' ? '✅' : '❌'}`);
  });
}

// Target all problematic elements
console.log('🔍 Finding problematic elements...');

// Homepage dahabiya cards
const homepageCardSpans = document.querySelectorAll('.homepage-dahabiya-card span');
const homepageCardDivs = document.querySelectorAll('.homepage-dahabiya-card div');

// Hero section elements
const heroSpans = document.querySelectorAll('.dahabiya-hero-section span');
const heroHeadings = document.querySelectorAll('.dahabiya-hero-section h1, .dahabiya-hero-section h2, .dahabiya-hero-section h3, .dahabiya-hero-section h4, .dahabiya-hero-section h5, .dahabiya-hero-section h6');

// Force white text class elements
const forceWhiteElements = document.querySelectorAll('.force-white-text, .force-white-text *');

// Material-UI chip elements
const chipElements = document.querySelectorAll('.MuiChip-label, .MuiChip-root');

// All elements with text- classes
const textClassElements = document.querySelectorAll('[class*="text-"]');

// Process each group
forceWhiteText(homepageCardSpans, 'homepage card spans');
forceWhiteText(homepageCardDivs, 'homepage card divs');
forceWhiteText(heroSpans, 'hero section spans');
forceWhiteText(heroHeadings, 'hero section headings');
forceWhiteText(forceWhiteElements, 'force-white-text elements');
forceWhiteText(chipElements, 'Material-UI chip elements');
forceWhiteText(textClassElements, 'Tailwind text- class elements');

// Additional nuclear option - force ALL text elements
console.log('☢️ NUCLEAR OPTION - Forcing ALL text elements');
const allTextElements = document.querySelectorAll('span, div, h1, h2, h3, h4, h5, h6, p');
const problematicElements = Array.from(allTextElements).filter(el => {
  const computedStyle = window.getComputedStyle(el);
  const color = computedStyle.color;
  return color !== 'rgb(255, 255, 255)' && el.textContent?.trim();
});

console.log(`Found ${problematicElements.length} elements that are not white`);
forceWhiteText(problematicElements, 'non-white text elements');

// Check for CSS conflicts
console.log('🔍 Checking for CSS conflicts...');
const stylesheets = Array.from(document.styleSheets);
console.log(`Found ${stylesheets.length} stylesheets`);

stylesheets.forEach((sheet, index) => {
  try {
    const rules = Array.from(sheet.cssRules || sheet.rules || []);
    const colorRules = rules.filter(rule => 
      rule.style && (rule.style.color || rule.style.webkitTextFillColor)
    );
    
    if (colorRules.length > 0) {
      console.log(`Stylesheet ${index + 1} has ${colorRules.length} color rules:`, colorRules);
    }
  } catch (e) {
    console.log(`Cannot access stylesheet ${index + 1} (CORS):`, sheet.href);
  }
});

// Final verification
console.log('✅ VERIFICATION - Checking if text is now white...');
setTimeout(() => {
  const testElements = document.querySelectorAll('.homepage-dahabiya-card span, .dahabiya-hero-section span, .dahabiya-hero-section h1');
  let whiteCount = 0;
  let totalCount = testElements.length;
  
  testElements.forEach(el => {
    const computedStyle = window.getComputedStyle(el);
    const color = computedStyle.color;
    if (color === 'rgb(255, 255, 255)') {
      whiteCount++;
    } else {
      console.log('❌ Still not white:', {
        element: el,
        color: color,
        textContent: el.textContent?.substring(0, 30)
      });
    }
  });
  
  console.log(`📊 RESULTS: ${whiteCount}/${totalCount} elements are now white (${Math.round(whiteCount/totalCount*100)}%)`);
  
  if (whiteCount === totalCount) {
    console.log('🎉 SUCCESS! All text is now white!');
  } else {
    console.log('⚠️ Some elements are still not white. Check the logs above for details.');
  }
}, 1000);

console.log('🔄 Script completed. Check the results above.');
