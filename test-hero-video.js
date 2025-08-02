// Test script to check hero video content
// Run this in the browser console on the homepage

console.log('🎥 HERO VIDEO DEBUG TEST');
console.log('========================');

// Test 1: Check if content is loaded
fetch('/api/website-content?page=homepage')
  .then(response => response.json())
  .then(data => {
    console.log('📦 Raw API Response:', data);
    
    const heroVideoUrl = data.find(item => item.key === 'hero_video_url');
    const heroVideoPoster = data.find(item => item.key === 'hero_video_poster');
    
    console.log('🎥 Hero Video URL:', heroVideoUrl);
    console.log('🖼️ Hero Video Poster:', heroVideoPoster);
    
    if (!heroVideoUrl) {
      console.error('❌ hero_video_url not found in database!');
      console.log('Available keys:', data.map(item => item.key));
    }
    
    if (!heroVideoPoster) {
      console.error('❌ hero_video_poster not found in database!');
    }
  })
  .catch(error => {
    console.error('❌ Error fetching content:', error);
  });

// Test 2: Check current video element
setTimeout(() => {
  const videoElement = document.querySelector('video');
  if (videoElement) {
    console.log('🎥 Video Element Found:', {
      src: videoElement.src,
      poster: videoElement.poster,
      readyState: videoElement.readyState,
      networkState: videoElement.networkState,
      error: videoElement.error
    });
  } else {
    console.log('❌ No video element found on page');
  }
}, 2000);

// Test 3: Check if useContent hook is working
setTimeout(() => {
  console.log('🔍 Checking localStorage for content updates...');
  console.log('Content updated:', localStorage.getItem('content-updated'));
  console.log('Content version:', localStorage.getItem('content-version'));
}, 1000);
