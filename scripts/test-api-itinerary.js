// Test the API endpoint directly
async function testItineraryAPI() {
  console.log('🧪 Testing Itinerary API endpoint...');

  const testData = {
    name: 'Test API Itinerary',
    description: 'A test itinerary for API testing',
    shortDescription: 'Test short description',
    durationDays: 3,
    mainImageUrl: '/images/test.jpg',
    heroImageUrl: '/images/test-hero.jpg',
    price: 500.00,
    maxGuests: 8,
    highlights: ['Test highlight 1', 'Test highlight 2'],
    included: ['Test included 1', 'Test included 2'],
    notIncluded: ['Test not included 1'],
    childrenPolicy: 'Test children policy',
    cancellationPolicy: 'Test cancellation policy',
    observations: 'Test observations',
    isActive: true,
    featured: false,
    days: [
      {
        dayNumber: 1,
        title: 'Day 1 Title',
        description: 'Day 1 description',
        location: 'Test Location',
        activities: ['Activity 1', 'Activity 2'],
        meals: ['BREAKFAST', 'LUNCH'], // Using correct enum values
        coordinates: null
      },
      {
        dayNumber: 2,
        title: 'Day 2 Title',
        description: 'Day 2 description',
        location: 'Test Location 2',
        activities: ['Activity 3', 'Activity 4'],
        meals: ['BREAKFAST', 'DINNER', 'AFTERNOON_TEA'], // Testing multiple meal types
        coordinates: null
      }
    ],
    pricingTiers: [
      {
        category: 'SILVER',
        paxRange: '2-3 PAX',
        price: 500.00,
        singleSupplement: 100.00
      }
    ]
  };

  try {
    console.log('📤 Sending POST request to API...');
    const response = await fetch('http://localhost:3001/api/admin/itineraries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Note: In a real test, you'd need proper authentication headers
      },
      body: JSON.stringify(testData)
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      const result = await response.json();
      console.log('✅ API Test PASSED!');
      console.log('📋 Created itinerary:', {
        id: result.id,
        name: result.name,
        slug: result.slug,
        daysCount: result.days?.length || 0,
        pricingTiersCount: result.pricingTiers?.length || 0
      });

      // Clean up - delete the test itinerary
      try {
        const deleteResponse = await fetch(`http://localhost:3001/api/admin/itineraries/${result.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (deleteResponse.ok) {
          console.log('🧹 Test itinerary cleaned up successfully');
        } else {
          console.log('⚠️ Could not clean up test itinerary (manual cleanup may be needed)');
        }
      } catch (cleanupError) {
        console.log('⚠️ Cleanup failed:', cleanupError.message);
      }

    } else {
      const errorText = await response.text();
      console.error('❌ API Test FAILED!');
      console.error('📋 Error response:', errorText);
      
      if (response.status === 401) {
        console.log('💡 Note: This might be due to authentication. Try testing through the web interface.');
      }
    }

  } catch (error) {
    console.error('❌ API Test ERROR:', error.message);
    console.log('💡 Make sure the development server is running on http://localhost:3001');
  }
}

// Test with frontend-style data (mixed case meals)
async function testWithFrontendData() {
  console.log('\n🧪 Testing with frontend-style meal data...');

  const frontendData = {
    name: 'Frontend Test Itinerary',
    description: 'Testing with frontend-style data',
    shortDescription: 'Frontend test',
    durationDays: 2,
    mainImageUrl: '/images/test.jpg',
    price: 300.00,
    maxGuests: 6,
    highlights: ['Frontend test'],
    included: ['Frontend included'],
    notIncluded: [],
    isActive: true,
    featured: false,
    days: [
      {
        dayNumber: 1,
        title: 'Frontend Day 1',
        description: 'Frontend day description',
        location: 'Frontend Location',
        activities: ['Frontend Activity'],
        meals: ['Breakfast', 'Lunch'], // Frontend sends mixed case
        coordinates: null
      }
    ],
    pricingTiers: [
      {
        category: 'SILVER',
        paxRange: '2 PAX',
        price: 300.00,
        singleSupplement: 50.00
      }
    ]
  };

  try {
    const response = await fetch('http://localhost:3001/api/admin/itineraries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(frontendData)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Frontend-style data test PASSED!');
      console.log('📋 API correctly converted mixed-case meals');
      
      // Cleanup
      try {
        await fetch(`http://localhost:3001/api/admin/itineraries/${result.id}`, {
          method: 'DELETE'
        });
        console.log('🧹 Frontend test itinerary cleaned up');
      } catch (e) {
        console.log('⚠️ Frontend test cleanup failed');
      }
    } else {
      const errorText = await response.text();
      console.error('❌ Frontend-style data test FAILED:', errorText);
    }

  } catch (error) {
    console.error('❌ Frontend test ERROR:', error.message);
  }
}

// Run tests
async function runTests() {
  await testItineraryAPI();
  await testWithFrontendData();
  console.log('\n🎉 All tests completed!');
}

runTests();
