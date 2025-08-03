// Test API access without authentication to see what errors we get
async function testItineraryAPIAccess() {
  console.log('🧪 Testing Itinerary API Access...');
  console.log('==================================\n');

  const baseUrl = 'http://localhost:3001';
  
  // Test endpoints
  const endpoints = [
    { name: 'GET Itineraries List', url: '/api/admin/itineraries', method: 'GET' },
    { name: 'GET Specific Itinerary', url: '/api/admin/itineraries/cmdv4sq2s002ctv2gwiczofyr', method: 'GET' },
    { name: 'Public Itineraries', url: '/api/itineraries', method: 'GET' }
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`🔍 Testing: ${endpoint.name}`);
      console.log(`   URL: ${endpoint.url}`);
      
      const response = await fetch(`${baseUrl}${endpoint.url}`, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log(`   Status: ${response.status} ${response.statusText}`);
      
      if (response.status === 200) {
        try {
          const data = await response.json();
          if (Array.isArray(data)) {
            console.log(`   ✅ SUCCESS: Returned ${data.length} items`);
          } else if (data.id) {
            console.log(`   ✅ SUCCESS: Returned item with ID ${data.id}`);
          } else {
            console.log(`   ✅ SUCCESS: Returned data`);
          }
        } catch (jsonError) {
          console.log(`   ⚠️ Response not JSON, might be HTML redirect`);
        }
      } else if (response.status === 401) {
        console.log(`   🔒 AUTHENTICATION REQUIRED`);
      } else if (response.status === 403) {
        console.log(`   🚫 FORBIDDEN - Insufficient permissions`);
      } else if (response.status === 404) {
        console.log(`   ❌ NOT FOUND`);
      } else if (response.status === 500) {
        console.log(`   💥 SERVER ERROR`);
        try {
          const errorText = await response.text();
          console.log(`   Error details: ${errorText.substring(0, 200)}...`);
        } catch (e) {
          console.log(`   Could not read error details`);
        }
      } else {
        console.log(`   ❓ UNEXPECTED STATUS`);
      }
      
    } catch (error) {
      console.log(`   ❌ NETWORK ERROR: ${error.message}`);
    }
    
    console.log('');
  }

  // Test if server is running
  console.log('🌐 Testing Server Connectivity:');
  console.log('-------------------------------');
  
  try {
    const healthCheck = await fetch(`${baseUrl}/api/auth/session`);
    console.log(`✅ Server is responding (Status: ${healthCheck.status})`);
  } catch (error) {
    console.log(`❌ Server connection failed: ${error.message}`);
    console.log('💡 Make sure the development server is running with: npm run dev');
  }
}

testItineraryAPIAccess();
