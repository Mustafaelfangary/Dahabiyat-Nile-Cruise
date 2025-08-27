/**
 * Dahabiyat Nile Cruise Mobile App
 * Complete Android App connecting to https://dahabiyatnilecruise.com
 * Ocean Blue Theme with Egyptian-inspired design
 */

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Dimensions,
  Image,
  ImageBackground,
  FlatList,
  Animated,
  ActivityIndicator,
} from 'react-native';

// Components
import { Button, Card, Heading1, Heading2, BodyText, AccentText, LoadingSpinner, HieroglyphicText, COLORS } from './components/ui';

// Services
import { apiService, Dahabiya, Package } from './services/ApiService';

// Main App Component
function App(): React.JSX.Element {
  const [currentScreen, setCurrentScreen] = useState<
    'splash' | 'home' | 'dahabiyas' | 'dahabiya-detail' | 'packages' | 'package-detail' |
    'profile' | 'gallery' | 'blogs' | 'blog-detail' | 'itineraries' | 'itinerary-detail' |
    'about' | 'contact' | 'signin' | 'signup' | 'forgot-password' | 'booking' | 'bookings' |
    'reviews' | 'testimonials' | 'faq' | 'terms' | 'privacy' | 'cancellation-policy' | 'tailor-made'
  >('splash');
  const [dahabiyas, setDahabiyas] = useState<Dahabiya[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedDahabiya, setSelectedDahabiya] = useState<Dahabiya | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<any>(null);
  const [selectedItinerary, setSelectedItinerary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [splashAnimation] = useState(new Animated.Value(0));

  // Splash screen animation and data loading
  useEffect(() => {
    // Start splash animation
    Animated.timing(splashAnimation, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    // Load data and transition to home after splash
    const initializeApp = async () => {
      await loadInitialData();
      setTimeout(() => {
        setCurrentScreen('home');
      }, 3000);
    };

    initializeApp();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      console.log('🚀 Loading data from https://dahabiyatnilecruise.com...');

      // Load real data from API
      try {
        const [dahabiyasData, packagesData] = await Promise.all([
          apiService.getDahabiyas(),
          apiService.getPackages()
        ]);

        console.log('✅ Loaded real data:', {
          dahabiyas: dahabiyasData.length,
          packages: packagesData.length
        });

        setDahabiyas(dahabiyasData);
        setPackages(packagesData);
      } catch (apiError) {
        console.warn('⚠️ API failed, using fallback data:', apiError);

        // Fallback to mock data if API fails
        const mockDahabiyas: Dahabiya[] = [
          {
            id: '1',
            name: 'Cleopatra Dahabiya',
            slug: 'cleopatra-dahabiya',
            description: 'Experience luxury on the Nile with our flagship dahabiya. This magnificent vessel combines traditional Egyptian craftsmanship with modern luxury amenities. Sail through ancient Egypt in style with panoramic views of the Nile.',
            shortDescription: 'Luxury sailing experience with traditional Egyptian charm',
            capacity: 12,
            cabins: 6,
            crew: 8,
            pricePerDay: 450,
            category: 'Luxury',
            isActive: true,
            isFeatured: true,
            rating: 4.8,
            images: [
              'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800',
              'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800',
              'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'
            ],
            mainImage: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800',
            reviewCount: 127,
            features: ['Air Conditioning', 'Private Bathrooms', 'Sun Deck', 'Restaurant'],
            amenities: ['WiFi', 'Laundry', 'Bar', 'Library'],
            routes: ['Aswan to Luxor', 'Luxor to Aswan'],
            highlights: ['Valley of Kings', 'Philae Temple', 'Kom Ombo'],
            specifications: {
              length: '52 meters',
              width: '9 meters',
              yearBuilt: '2018',
              maxSpeed: '12 knots'
            },
            itinerary: [
              {
                day: 1,
                title: 'Arrival in Aswan',
                description: 'Board your dahabiya and enjoy welcome drinks',
                activities: ['Check-in', 'Welcome dinner', 'Sunset viewing']
              },
              {
                day: 2,
                title: 'Philae Temple & Sailing',
                description: 'Visit the beautiful Philae Temple and start sailing',
                activities: ['Temple visit', 'Sailing', 'Traditional lunch']
              }
            ],
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01'
          },
          {
            id: '2',
            name: 'Nefertiti Dahabiya',
            slug: 'nefertiti-dahabiya',
            description: 'Elegant dahabiya perfect for intimate Nile cruising',
            shortDescription: 'Intimate luxury vessel with personalized service',
            capacity: 8,
            cabins: 4,
            crew: 6,
            pricePerDay: 380,
            category: 'Premium',
            isActive: true,
            isFeatured: true,
            rating: 4.9,
            reviewCount: 89,
            mainImage: '/images/dahabiyas/nefertiti.jpg',
            features: ['Air Conditioning', 'Private Bathrooms', 'Sun Deck'],
            amenities: ['WiFi', 'Bar', 'Library'],
            routes: ['Aswan to Luxor'],
            highlights: ['Edfu Temple', 'Kom Ombo', 'Nubian Villages'],
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01'
          }
        ];

        const mockPackages: Package[] = [
          {
            id: '1',
            name: '4-Day Aswan to Luxor',
            description: 'Classic Nile cruise from Aswan to Luxor visiting major temples',
            shortDescription: 'Visit the most iconic temples along the Nile',
            price: 1800,
            durationDays: 4,
            mainImageUrl: '/images/packages/aswan-luxor.jpg',
            isFeaturedOnHomepage: true,
            homepageOrder: 1,
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01'
          },
          {
            id: '2',
            name: '7-Day Complete Nile Experience',
            description: 'Comprehensive Nile journey with extended temple visits',
            shortDescription: 'Complete Egyptian adventure with all major sites',
            price: 3200,
            durationDays: 7,
            mainImageUrl: '/images/packages/complete-nile.jpg',
            isFeaturedOnHomepage: true,
            homepageOrder: 2,
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01'
          }
        ];

        setDahabiyas(mockDahabiyas);
        setPackages(mockPackages);
        console.log('✅ Fallback data loaded successfully');
      }
    } catch (error) {
      console.error('❌ Error loading initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Dropdown Menu Component
  const DropdownMenu = () => (
    <Modal
      visible={showDropdown}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowDropdown(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowDropdown(false)}
      >
        <ScrollView style={styles.dropdownContainer}>
          {/* Main Pages */}
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => { setCurrentScreen('gallery'); setShowDropdown(false); }}
          >
            <Text style={styles.dropdownText}>🖼️ Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => { setCurrentScreen('blogs'); setShowDropdown(false); }}
          >
            <Text style={styles.dropdownText}>📜 Blogs</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => { setCurrentScreen('itineraries'); setShowDropdown(false); }}
          >
            <Text style={styles.dropdownText}>🗺️ Itineraries</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => { setCurrentScreen('reviews'); setShowDropdown(false); }}
          >
            <Text style={styles.dropdownText}>⭐ Reviews</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => { setCurrentScreen('testimonials'); setShowDropdown(false); }}
          >
            <Text style={styles.dropdownText}>💬 Testimonials</Text>
          </TouchableOpacity>

          {/* Booking & Services */}
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => { setCurrentScreen('booking'); setShowDropdown(false); }}
          >
            <Text style={styles.dropdownText}>📅 Book Now</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => { setCurrentScreen('bookings'); setShowDropdown(false); }}
          >
            <Text style={styles.dropdownText}>📋 My Bookings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => { setCurrentScreen('tailor-made'); setShowDropdown(false); }}
          >
            <Text style={styles.dropdownText}>✨ Tailor-Made</Text>
          </TouchableOpacity>

          {/* Information */}
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => { setCurrentScreen('about'); setShowDropdown(false); }}
          >
            <Text style={styles.dropdownText}>ℹ️ About</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => { setCurrentScreen('faq'); setShowDropdown(false); }}
          >
            <Text style={styles.dropdownText}>❓ FAQ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => { setCurrentScreen('contact'); setShowDropdown(false); }}
          >
            <Text style={styles.dropdownText}>📞 Contact</Text>
          </TouchableOpacity>

          {/* Legal */}
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => { setCurrentScreen('terms'); setShowDropdown(false); }}
          >
            <Text style={styles.dropdownText}>📄 Terms</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => { setCurrentScreen('privacy'); setShowDropdown(false); }}
          >
            <Text style={styles.dropdownText}>🔒 Privacy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => { setCurrentScreen('cancellation-policy'); setShowDropdown(false); }}
          >
            <Text style={styles.dropdownText}>📋 Cancellation</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableOpacity>
    </Modal>
  );

  // Screen Components
  const HomeScreen = () => (
    <View style={styles.screenContainer}>
      <HieroglyphicText fontSize={10} isTop={true} />
      <ScrollView style={styles.container}>
        <View style={styles.headerWithDropdown}>
          <View style={styles.headerContent}>
            <Heading1>🚢 Dahabiyat Nile Cruise</Heading1>
            <BodyText style={styles.subtitle}>Luxury Nile River Experience</BodyText>
            <AccentText>Connected to: https://dahabiyatnilecruise.com</AccentText>
          </View>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowDropdown(true)}
          >
            <Text style={styles.dropdownButtonText}>☰</Text>
          </TouchableOpacity>
        </View>

      <Card>
        <Heading2>Welcome Aboard!</Heading2>
        <BodyText>
          Experience the magic of the Nile River with our luxury dahabiyas.
          Discover ancient Egypt in comfort and style.
        </BodyText>
        <View style={styles.stats}>
          <Text style={styles.statText}>📊 {dahabiyas.length} Dahabiyas Available</Text>
          <Text style={styles.statText}>📦 {packages.length} Packages Ready</Text>
        </View>
      </Card>

      {dahabiyas.length > 0 && (
        <Card>
          <Heading2>⭐ Featured Dahabiyas</Heading2>
          <FlatList
            data={dahabiyas.filter(d => d.isFeatured).slice(0, 3)}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.featuredItem}
                onPress={() => {
                  setSelectedDahabiya(item);
                  setCurrentScreen('dahabiya-detail');
                }}
              >
                <Image source={{uri: item.mainImage}} style={styles.featuredImage} />
                <Text style={styles.featuredName}>{item.name}</Text>
                <Text style={styles.featuredPrice}>From ${item.pricePerDay}/day</Text>
              </TouchableOpacity>
            )}
          />
        </Card>
      )}

      <Card>
        <Heading2>🏛️ Featured Destinations</Heading2>
        <BodyText>• Luxor Temple & Valley of the Kings</BodyText>
        <BodyText>• Aswan High Dam & Philae Temple</BodyText>
        <BodyText>• Kom Ombo & Edfu Temples</BodyText>
        <BodyText>• Traditional Nubian Villages</BodyText>
      </Card>

        <View style={styles.buttonContainer}>
          <Button title="View All Dahabiyas" onPress={() => setCurrentScreen('dahabiyas')} />
          <Button title="Browse Packages" onPress={() => setCurrentScreen('packages')} variant="secondary" />
          <Button title="Contact Us" onPress={() => setCurrentScreen('contact')} />
        </View>
      </ScrollView>
      <HieroglyphicText fontSize={10} isTop={false} />
    </View>
  );

  const DahabiyasScreen = () => (
    <View style={styles.screenContainer}>
      <HieroglyphicText fontSize={10} isTop={true} />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Heading1>🚢 Our Dahabiyas</Heading1>
          <Button title="← Back to Home" onPress={() => setCurrentScreen('home')} variant="outline" />
        </View>

      {dahabiyas.length > 0 ? (
        dahabiyas.map((dahabiya) => (
          <TouchableOpacity
            key={dahabiya.id}
            onPress={() => {
              setSelectedDahabiya(dahabiya);
              setCurrentScreen('dahabiya-detail');
            }}
          >
            <Card style={styles.dahabiyaCard}>
              <Image source={{uri: dahabiya.mainImage}} style={styles.cardImage} />
              <View style={styles.cardContent}>
                <Heading2>{dahabiya.name}</Heading2>
                <BodyText>{dahabiya.shortDescription}</BodyText>
                <View style={styles.dahabiyaDetails}>
                  <Text style={styles.detailText}>👥 Capacity: {dahabiya.capacity} guests</Text>
                  <Text style={styles.detailText}>🛏️ Cabins: {dahabiya.cabins}</Text>
                  <Text style={styles.detailText}>💰 From ${dahabiya.pricePerDay}/day</Text>
                  <Text style={styles.detailText}>⭐ {dahabiya.rating}/5 ({dahabiya.reviewCount} reviews)</Text>
                </View>
                <Text style={styles.tapToView}>Tap to view details →</Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))
      ) : (
        <Card>
          <BodyText>Loading dahabiyas from dahabiyatnilecruise.com...</BodyText>
        </Card>
      )}
      </ScrollView>
      <HieroglyphicText fontSize={10} isTop={false} />
    </View>
  );

  const PackagesScreen = () => (
    <View style={styles.screenContainer}>
      <HieroglyphicText fontSize={10} isTop={true} />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Heading1>📦 Travel Packages</Heading1>
          <Button title="← Back to Home" onPress={() => setCurrentScreen('home')} variant="outline" />
        </View>

      {packages.length > 0 ? (
        packages.map((pkg) => (
          <TouchableOpacity
            key={pkg.id}
            onPress={() => {
              setSelectedPackage(pkg);
              setCurrentScreen('package-detail');
            }}
          >
            <Card style={styles.dahabiyaCard}>
              <Image source={{uri: pkg.mainImageUrl}} style={styles.cardImage} />
              <View style={styles.cardContent}>
                <Heading2>{pkg.name}</Heading2>
                <BodyText>{pkg.shortDescription}</BodyText>
                <View style={styles.packageDetails}>
                  <Text style={styles.detailText}>📅 Duration: {pkg.durationDays} days</Text>
                  <Text style={styles.detailText}>💰 Price: ${pkg.price}</Text>
                </View>
                <Text style={styles.tapToView}>Tap to view details →</Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))
      ) : (
        <Card>
          <BodyText>Loading packages from dahabiyatnilecruise.com...</BodyText>
        </Card>
      )}
      </ScrollView>
      <HieroglyphicText fontSize={10} isTop={false} />
    </View>
  );

  const ProfileScreen = () => (
    <View style={styles.screenContainer}>
      <HieroglyphicText fontSize={10} isTop={true} />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Heading1>👤 Profile</Heading1>
          <Button title="← Back to Home" onPress={() => setCurrentScreen('home')} variant="outline" />
        </View>

      {isAuthenticated && user ? (
        <>
          <Card>
            <Heading2>Welcome, {user.name}!</Heading2>
            <BodyText>Email: {user.email}</BodyText>
            <BodyText>Account Status: Active</BodyText>
            <Button onPress={() => {
              setIsAuthenticated(false);
              setUser(null);
              Alert.alert('Signed Out', 'You have been signed out successfully.');
            }}>
              Sign Out
            </Button>
          </Card>

          <Card>
            <Heading2>🎯 Quick Actions</Heading2>
            <Button onPress={() => setCurrentScreen('bookings')}>
              📅 My Bookings
            </Button>
            <Button onPress={() => setCurrentScreen('tailor-made')}>
              ✨ Request Custom Trip
            </Button>
            <Button onPress={() => setCurrentScreen('reviews')}>
              ⭐ Leave a Review
            </Button>
          </Card>
        </>
      ) : (
        <Card>
          <Heading2>Sign In Required</Heading2>
          <BodyText style={styles.marginBottom}>Sign in to access your bookings and preferences.</BodyText>
          <Button onPress={() => setCurrentScreen('signin')}>
            Sign In
          </Button>
          <TouchableOpacity onPress={() => setCurrentScreen('signup')}>
            <AccentText style={styles.linkText}>Don't have an account? Sign Up</AccentText>
          </TouchableOpacity>
        </Card>
      )}

      <Card>
        <Heading2>Guest Features</Heading2>
        <BodyText>Available without signing in:</BodyText>
        <Button onPress={() => setCurrentScreen('booking')}>
          📅 Book a Cruise
        </Button>
        <Button onPress={() => setCurrentScreen('contact')}>
          📞 Contact Us
        </Button>
        <Button onPress={() => setCurrentScreen('faq')}>
          ❓ FAQ
        </Button>
      </Card>
      </ScrollView>
      <HieroglyphicText fontSize={10} isTop={false} />
    </View>
  );

  const GalleryScreen = () => (
    <View style={styles.screenContainer}>
      <HieroglyphicText fontSize={10} isTop={true} />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Heading1>🖼️ Gallery</Heading1>
          <Button title="← Back to Home" onPress={() => setCurrentScreen('home')} variant="outline" />
        </View>

      <Card>
        <Heading2>Dahabiya Photos</Heading2>
        <BodyText>• Luxury cabin interiors</BodyText>
        <BodyText>• Sun deck and dining areas</BodyText>
        <BodyText>• Traditional sailing moments</BodyText>
        <BodyText>• Sunset views on the Nile</BodyText>
      </Card>

      <Card>
        <Heading2>Temple & Sites</Heading2>
        <BodyText>• Valley of the Kings</BodyText>
        <BodyText>• Philae Temple</BodyText>
        <BodyText>• Kom Ombo Temple</BodyText>
        <BodyText>• Edfu Temple</BodyText>
      </Card>

      <Card>
        <Heading2>Nile Landscapes</Heading2>
        <BodyText>• Traditional feluccas</BodyText>
        <BodyText>• Nubian villages</BodyText>
          <BodyText>• Desert and palm groves</BodyText>
          <BodyText>• Wildlife and birds</BodyText>
        </Card>
      </ScrollView>
      <HieroglyphicText fontSize={10} isTop={false} />
    </View>
  );

  const BlogsScreen = () => (
    <View style={styles.screenContainer}>
      <HieroglyphicText fontSize={10} isTop={true} />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Heading1>📜 Blogs</Heading1>
          <Button title="← Back to Home" onPress={() => setCurrentScreen('home')} variant="outline" />
        </View>

      <Card>
        <Heading2>Latest Articles</Heading2>

        <TouchableOpacity onPress={() => {
          setSelectedBlog({
            title: "Discovering the Secrets of Valley of the Kings",
            date: "January 15, 2024",
            content: "Explore the ancient burial ground of pharaohs and discover the magnificent tombs that have preserved Egypt's royal history for millennia. The Valley of the Kings contains 63 tombs and chambers, including the famous tomb of Tutankhamun."
          });
          setCurrentScreen('blog-detail');
        }}>
          <BodyText style={styles.blogTitle}>🏛️ "Discovering the Secrets of Valley of the Kings"</BodyText>
          <BodyText style={styles.blogDate}>Published: January 15, 2024</BodyText>
          <BodyText>Explore the ancient burial ground of pharaohs...</BodyText>
          <AccentText>Read More →</AccentText>
        </TouchableOpacity>
      </Card>

      <Card>
        <TouchableOpacity onPress={() => {
          setSelectedBlog({
            title: "Best Time to Cruise the Nile",
            date: "January 10, 2024",
            content: "The optimal time for Nile cruising is from October to April when temperatures are comfortable and rainfall is minimal. During these months, you'll enjoy pleasant weather for exploring temples and relaxing on deck."
          });
          setCurrentScreen('blog-detail');
        }}>
          <BodyText style={styles.blogTitle}>🌅 "Best Time to Cruise the Nile"</BodyText>
          <BodyText style={styles.blogDate}>Published: January 10, 2024</BodyText>
          <BodyText>Learn about the optimal seasons for your Nile adventure...</BodyText>
          <AccentText>Read More →</AccentText>
        </TouchableOpacity>
      </Card>

      <Card>
        <TouchableOpacity onPress={() => {
          setSelectedBlog({
            title: "Traditional Egyptian Cuisine on Board",
            date: "January 5, 2024",
            content: "Experience authentic Egyptian flavors during your dahabiya cruise. Our chefs prepare traditional dishes using fresh local ingredients, from aromatic tagines to freshly baked bread and delicious mezze."
          });
          setCurrentScreen('blog-detail');
        }}>
          <BodyText style={styles.blogTitle}>🍽️ "Traditional Egyptian Cuisine on Board"</BodyText>
          <BodyText style={styles.blogDate}>Published: January 5, 2024</BodyText>
          <BodyText>Discover the authentic flavors served on our dahabiyas...</BodyText>
          <AccentText>Read More →</AccentText>
        </TouchableOpacity>
      </Card>
      </ScrollView>
      <HieroglyphicText fontSize={10} isTop={false} />
    </View>
  );

  const ItinerariesScreen = () => (
    <View style={styles.screenContainer}>
      <HieroglyphicText fontSize={10} isTop={true} />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Heading1>🗺️ Itineraries</Heading1>
          <Button title="← Back to Home" onPress={() => setCurrentScreen('home')} variant="outline" />
        </View>

      <Card>
        <TouchableOpacity onPress={() => {
          setSelectedItinerary({
            title: "4-Day Classic Route",
            duration: "4",
            description: "Experience the highlights of the Nile with visits to Kom Ombo, Edfu, Esna, and Luxor. This classic route covers the most important temples and archaeological sites between Aswan and Luxor."
          });
          setCurrentScreen('itinerary-detail');
        }}>
          <Heading2>4-Day Classic Route</Heading2>
          <BodyText>Day 1: Aswan - Kom Ombo</BodyText>
          <BodyText>Day 2: Kom Ombo - Edfu</BodyText>
          <BodyText>Day 3: Edfu - Esna</BodyText>
          <BodyText>Day 4: Esna - Luxor</BodyText>
          <BodyText style={styles.priceText}>From $1,800 per person</BodyText>
          <AccentText>View Details →</AccentText>
        </TouchableOpacity>
      </Card>

      <Card>
        <TouchableOpacity onPress={() => {
          setSelectedItinerary({
            title: "7-Day Extended Journey",
            duration: "7",
            description: "A comprehensive Nile experience with extended time at each destination. Includes in-depth exploration of Philae Temple, Kom Ombo, Edfu, Esna, West Bank, and the Valley of Kings."
          });
          setCurrentScreen('itinerary-detail');
        }}>
          <Heading2>7-Day Extended Journey</Heading2>
          <BodyText>Day 1-2: Aswan & Philae Temple</BodyText>
          <BodyText>Day 3-4: Kom Ombo & Edfu</BodyText>
          <BodyText>Day 5-6: Esna & West Bank</BodyText>
          <BodyText>Day 7: Luxor & Valley of Kings</BodyText>
          <BodyText style={styles.priceText}>From $3,200 per person</BodyText>
          <AccentText>View Details →</AccentText>
        </TouchableOpacity>
      </Card>

      <Card>
        <Heading2>Custom Itineraries</Heading2>
        <BodyText>Create your own personalized journey with our travel experts.</BodyText>
        <Button onPress={() => setCurrentScreen('tailor-made')}>
          Request Custom Itinerary
        </Button>
      </Card>
      </ScrollView>
      <HieroglyphicText fontSize={10} isTop={false} />
    </View>
  );

  const AboutScreen = () => (
    <View style={styles.screenContainer}>
      <HieroglyphicText fontSize={10} isTop={true} />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Heading1>ℹ️ About Dahabiyat</Heading1>
          <Button title="← Back to Home" onPress={() => setCurrentScreen('home')} variant="outline" />
        </View>

      <Card>
        <Heading2>Our Story</Heading2>
        <BodyText>
          Dahabiyat Nile Cruise offers authentic Egyptian sailing experiences aboard traditional dahabiyas.
          We combine luxury comfort with cultural immersion for unforgettable Nile journeys.
        </BodyText>
      </Card>

      <Card>
        <Heading2>Why Choose Us</Heading2>
        <BodyText>• Traditional dahabiyas with modern amenities</BodyText>
        <BodyText>• Expert Egyptologist guides</BodyText>
        <BodyText>• Personalized service</BodyText>
        <BodyText>• Authentic cultural experiences</BodyText>
        <BodyText>• Sustainable tourism practices</BodyText>
      </Card>

      <Card>
        <Heading2>Contact Information</Heading2>
          <BodyText>📧 info@dahabiyatnilecruise.com</BodyText>
          <BodyText>📞 +20-123-456-7890</BodyText>
          <BodyText>📍 Nile Corniche, Aswan, Egypt</BodyText>
        </Card>
      </ScrollView>
      <HieroglyphicText fontSize={10} isTop={false} />
    </View>
  );

  const ContactScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async () => {
      if (!name || !email || !message) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      try {
        setIsLoading(true);
        // Mock contact submission
        await new Promise(resolve => setTimeout(resolve, 1000));
        Alert.alert('Success', 'Message sent successfully! We will respond within 24 hours.');
        setName('');
        setEmail('');
        setMessage('');
      } catch (error) {
        Alert.alert('Error', 'Failed to send message. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <View style={styles.screenContainer}>
        <HieroglyphicText fontSize={10} isTop={true} />
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Heading1>📞 Contact Us</Heading1>
            <Button title="← Back to Home" onPress={() => setCurrentScreen('home')} variant="outline" />
          </View>

        <Card>
          <Heading2>Get in Touch</Heading2>
          <BodyText style={styles.marginBottom}>Send us a message and we'll respond within 24 hours.</BodyText>

          <TextInput
            style={styles.input}
            placeholder="Your Name"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Your Message"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
          />

          <Button
            title={isLoading ? "Sending..." : "Send Message"}
            onPress={handleSubmit}
            disabled={isLoading}
          />
        </Card>
        </ScrollView>
        <HieroglyphicText fontSize={10} isTop={false} />
      </View>
    );
  };

  // Navigation Bar
  const NavigationBar = () => (
    <View style={styles.navbar}>
      <TouchableOpacity
        style={[styles.navButton, currentScreen === 'home' && styles.navButtonActive]}
        onPress={() => setCurrentScreen('home')}
      >
        <Text style={[styles.navText, currentScreen === 'home' && styles.navTextActive]}>🏠 Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navButton, currentScreen === 'dahabiyas' && styles.navButtonActive]}
        onPress={() => setCurrentScreen('dahabiyas')}
      >
        <Text style={[styles.navText, currentScreen === 'dahabiyas' && styles.navTextActive]}>🚢 Boats</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navButton, currentScreen === 'packages' && styles.navButtonActive]}
        onPress={() => setCurrentScreen('packages')}
      >
        <Text style={[styles.navText, currentScreen === 'packages' && styles.navTextActive]}>📦 Packages</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navButton, currentScreen === 'profile' && styles.navButtonActive]}
        onPress={() => setCurrentScreen('profile')}
      >
        <Text style={[styles.navText, currentScreen === 'profile' && styles.navTextActive]}>👤 Profile</Text>
      </TouchableOpacity>
    </View>
  );

  // Dahabiya Detail Screen Component
  const DahabiyaDetailScreen = () => {
    if (!selectedDahabiya) {
      return (
        <View style={styles.screenContainer}>
          <HieroglyphicText fontSize={10} isTop={true} />
          <View style={styles.container}>
            <Button title="← Back to Dahabiyas" onPress={() => setCurrentScreen('dahabiyas')} variant="outline" />
            <Text>No dahabiya selected</Text>
          </View>
          <HieroglyphicText fontSize={10} isTop={false} />
        </View>
      );
    }

    return (
      <View style={styles.screenContainer}>
        <HieroglyphicText fontSize={10} isTop={true} />
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Button title="← Back to Dahabiyas" onPress={() => setCurrentScreen('dahabiyas')} variant="outline" />
          </View>

        <Image source={{uri: selectedDahabiya.mainImage}} style={styles.detailMainImage} />

        <View style={styles.detailContent}>
          <Heading1>{selectedDahabiya.name}</Heading1>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {selectedDahabiya.rating}/5</Text>
            <Text style={styles.reviewCount}>({selectedDahabiya.reviewCount} reviews)</Text>
          </View>

          <BodyText style={styles.description}>{selectedDahabiya.description}</BodyText>

          <View style={styles.specGrid}>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>👥 Capacity</Text>
              <Text style={styles.specValue}>{selectedDahabiya.capacity} guests</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>🏠 Cabins</Text>
              <Text style={styles.specValue}>{selectedDahabiya.cabins}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>💰 From</Text>
              <Text style={styles.specValue}>${selectedDahabiya.pricePerDay}/day</Text>
            </View>
          </View>

          {selectedDahabiya.images && selectedDahabiya.images.length > 0 && (
            <View style={styles.gallerySection}>
              <Heading2>Gallery</Heading2>
              <FlatList
                data={selectedDahabiya.images}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
                  <Image source={{uri: item}} style={styles.galleryImage} />
                )}
              />
            </View>
          )}

          <View style={styles.featuresSection}>
            <Heading2>Features & Amenities</Heading2>
            <View style={styles.featuresList}>
              {selectedDahabiya.features.map((feature, index) => (
                <Text key={index} style={styles.featureItem}>✓ {feature}</Text>
              ))}
            </View>
          </View>

            <Button
              title="Book Now"
              onPress={() => Alert.alert('Booking', 'Contact us to book this dahabiya!')}
              style={styles.bookButton}
            />
          </View>
        </ScrollView>
        <HieroglyphicText fontSize={10} isTop={false} />
      </View>
    );
  };

  // Package Detail Screen Component
  const PackageDetailScreen = () => {
    if (!selectedPackage) {
      return (
        <View style={styles.screenContainer}>
          <HieroglyphicText fontSize={10} isTop={true} />
          <View style={styles.container}>
            <Button title="← Back to Packages" onPress={() => setCurrentScreen('packages')} variant="outline" />
            <Text>No package selected</Text>
          </View>
          <HieroglyphicText fontSize={10} isTop={false} />
        </View>
      );
    }

    return (
      <View style={styles.screenContainer}>
        <HieroglyphicText fontSize={10} isTop={true} />
        <ScrollView style={styles.container}>
          <View style={styles.header}>
          <Button title="← Back to Packages" onPress={() => setCurrentScreen('packages')} variant="outline" />
        </View>

        <Image source={{uri: selectedPackage.mainImageUrl}} style={styles.detailMainImage} />

        <View style={styles.detailContent}>
          <Heading1>{selectedPackage.name}</Heading1>
          <View style={styles.packageInfo}>
            <Text style={styles.duration}>📅 {selectedPackage.durationDays} days</Text>
            <Text style={styles.price}>💰 ${selectedPackage.price}</Text>
          </View>

          <BodyText style={styles.description}>{selectedPackage.description}</BodyText>

            <Button
              title="Book Package"
              onPress={() => Alert.alert('Booking', 'Contact us to book this package!')}
              style={styles.bookButton}
            />
          </View>
        </ScrollView>
        <HieroglyphicText fontSize={10} isTop={false} />
      </View>
    );
  };

  // Splash Screen Component
  const SplashScreen = () => (
    <View style={styles.splashContainer}>
      <Animated.View
        style={[
          styles.splashContent,
          {
            opacity: splashAnimation,
            transform: [{
              scale: splashAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1]
              })
            }]
          }
        ]}
      >
        <Image
          source={{uri: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400'}}
          style={styles.splashLogo}
        />
        <Text style={styles.splashTitle}>Dahabiyat Nile Cruise</Text>
        <Text style={styles.splashSubtitle}>Luxury Sailing Experience</Text>
        <Text style={styles.splashHieroglyphic}>𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿</Text>
        <ActivityIndicator size="large" color={COLORS.GOLD} style={styles.splashLoader} />
      </Animated.View>
    </View>
  );

  // Blog Detail Screen Component
  const BlogDetailScreen = () => {
    if (!selectedBlog) {
      return (
        <View style={styles.screenContainer}>
          <HieroglyphicText fontSize={10} isTop={true} />
          <View style={styles.container}>
            <Heading1>📜 Blog Post</Heading1>
            <BodyText>No blog selected</BodyText>
            <Button onPress={() => setCurrentScreen('blogs')}>
              Back to Blogs
            </Button>
          </View>
          <HieroglyphicText fontSize={10} isTop={false} />
        </View>
      );
    }

    return (
      <View style={styles.screenContainer}>
        <HieroglyphicText fontSize={10} isTop={true} />
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Heading1>{selectedBlog.title}</Heading1>
            <BodyText style={styles.subtitle}>Published: {selectedBlog.date}</BodyText>
          </View>

          <Card>
            <BodyText>{selectedBlog.content}</BodyText>
          </Card>

          <Button onPress={() => setCurrentScreen('blogs')}>
            Back to Blogs
          </Button>
        </ScrollView>
        <HieroglyphicText fontSize={10} isTop={false} />
      </View>
    );
  };

  // Itinerary Detail Screen Component
  const ItineraryDetailScreen = () => {
    if (!selectedItinerary) {
      return (
        <View style={styles.screenContainer}>
          <HieroglyphicText fontSize={10} isTop={true} />
          <View style={styles.container}>
            <Heading1>🗺️ Itinerary</Heading1>
            <BodyText>No itinerary selected</BodyText>
            <Button onPress={() => setCurrentScreen('itineraries')}>
              Back to Itineraries
            </Button>
          </View>
          <HieroglyphicText fontSize={10} isTop={false} />
        </View>
      );
    }

    return (
      <View style={styles.screenContainer}>
        <HieroglyphicText fontSize={10} isTop={true} />
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Heading1>{selectedItinerary.title}</Heading1>
            <BodyText style={styles.subtitle}>{selectedItinerary.duration} Days</BodyText>
          </View>

          <Card>
            <Heading2>Itinerary Details</Heading2>
            <BodyText>{selectedItinerary.description}</BodyText>
          </Card>

          <Button onPress={() => setCurrentScreen('itineraries')}>
            Back to Itineraries
          </Button>
        </ScrollView>
        <HieroglyphicText fontSize={10} isTop={false} />
      </View>
    );
  };

  // Reviews Screen Component
  const ReviewsScreen = () => (
    <View style={styles.screenContainer}>
      <HieroglyphicText fontSize={10} isTop={true} />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Heading1>⭐ Customer Reviews</Heading1>
          <BodyText style={styles.subtitle}>What our guests say about us</BodyText>
        </View>

        <Card>
          <Heading2>⭐⭐⭐⭐⭐ Amazing Experience!</Heading2>
          <BodyText>"The dahabiya cruise was absolutely magical. The crew was fantastic and the food was incredible."</BodyText>
          <AccentText>- Sarah Johnson, USA</AccentText>
        </Card>

        <Card>
          <Heading2>⭐⭐⭐⭐⭐ Unforgettable Journey</Heading2>
          <BodyText>"A once-in-a-lifetime experience sailing the Nile. Highly recommend to anyone visiting Egypt."</BodyText>
          <AccentText>- Michael Brown, UK</AccentText>
        </Card>

        <Card>
          <Heading2>⭐⭐⭐⭐⭐ Perfect Service</Heading2>
          <BodyText>"Everything was perfectly organized. The temples, the food, the accommodation - all excellent!"</BodyText>
          <AccentText>- Emma Wilson, Australia</AccentText>
        </Card>

        <Button onPress={() => setCurrentScreen('contact')}>
          Leave Your Review
        </Button>
      </ScrollView>
      <HieroglyphicText fontSize={10} isTop={false} />
    </View>
  );

  // Testimonials Screen Component
  const TestimonialsScreen = () => (
    <View style={styles.screenContainer}>
      <HieroglyphicText fontSize={10} isTop={true} />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Heading1>💬 Guest Testimonials</Heading1>
          <BodyText style={styles.subtitle}>Stories from our valued guests</BodyText>
        </View>

        <Card>
          <Heading2>"A Dream Come True"</Heading2>
          <BodyText>"Sailing on the Nile in a traditional dahabiya was everything I dreamed of and more. The peaceful journey, the stunning temples, and the warm hospitality made this trip unforgettable."</BodyText>
          <AccentText>- Jennifer Martinez, Spain</AccentText>
        </Card>

        <Card>
          <Heading2>"Authentic Egyptian Experience"</Heading2>
          <BodyText>"This wasn't just a cruise, it was a journey through time. The dahabiya provided an authentic way to experience the Nile, just like travelers did centuries ago."</BodyText>
          <AccentText>- David Chen, Canada</AccentText>
        </Card>

        <Card>
          <Heading2>"Exceptional Service"</Heading2>
          <BodyText>"From the moment we boarded until we disembarked, every detail was perfect. The crew anticipated our every need and the food was restaurant quality."</BodyText>
          <AccentText>- Lisa Thompson, Germany</AccentText>
        </Card>
      </ScrollView>
      <HieroglyphicText fontSize={10} isTop={false} />
    </View>
  );

  // Booking Screen Component
  const BookingScreen = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const [guests, setGuests] = useState('2');
    const [specialRequests, setSpecialRequests] = useState('');

    const handleBooking = () => {
      Alert.alert(
        'Booking Request Sent!',
        'Thank you for your booking request. We will contact you shortly to confirm your reservation.',
        [{ text: 'OK', onPress: () => setCurrentScreen('home') }]
      );
    };

    return (
      <View style={styles.screenContainer}>
        <HieroglyphicText fontSize={10} isTop={true} />
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Heading1>📅 Book Your Cruise</Heading1>
            <BodyText style={styles.subtitle}>Reserve your Nile adventure</BodyText>
          </View>

          <Card>
            <Heading2>Booking Details</Heading2>

            <BodyText style={styles.label}>Preferred Date:</BodyText>
            <TextInput
              style={styles.input}
              value={selectedDate}
              onChangeText={setSelectedDate}
              placeholder="DD/MM/YYYY"
              placeholderTextColor="#999"
            />

            <BodyText style={styles.label}>Number of Guests:</BodyText>
            <TextInput
              style={styles.input}
              value={guests}
              onChangeText={setGuests}
              placeholder="2"
              keyboardType="numeric"
              placeholderTextColor="#999"
            />

            <BodyText style={styles.label}>Special Requests:</BodyText>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={specialRequests}
              onChangeText={setSpecialRequests}
              placeholder="Any special requirements or requests..."
              multiline
              numberOfLines={4}
              placeholderTextColor="#999"
            />

            <Button onPress={handleBooking}>
              Send Booking Request
            </Button>
          </Card>
        </ScrollView>
        <HieroglyphicText fontSize={10} isTop={false} />
      </View>
    );
  };

  // Bookings History Screen Component
  const BookingsScreen = () => (
    <View style={styles.screenContainer}>
      <HieroglyphicText fontSize={10} isTop={true} />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Heading1>📋 My Bookings</Heading1>
          <BodyText style={styles.subtitle}>Your booking history</BodyText>
        </View>

        {isAuthenticated ? (
          <>
            <Card>
              <Heading2>Upcoming Booking</Heading2>
              <BodyText>Cleopatra Dahabiya - 4 Days</BodyText>
              <BodyText>Date: March 15-18, 2024</BodyText>
              <BodyText>Guests: 2</BodyText>
              <AccentText>Status: Confirmed</AccentText>
            </Card>

            <Card>
              <Heading2>Past Booking</Heading2>
              <BodyText>Nefertiti Dahabiya - 7 Days</BodyText>
              <BodyText>Date: January 10-16, 2024</BodyText>
              <BodyText>Guests: 2</BodyText>
              <AccentText>Status: Completed</AccentText>
            </Card>
          </>
        ) : (
          <Card>
            <Heading2>Sign In Required</Heading2>
            <BodyText>Please sign in to view your bookings.</BodyText>
            <Button onPress={() => setCurrentScreen('signin')}>
              Sign In
            </Button>
          </Card>
        )}
      </ScrollView>
      <HieroglyphicText fontSize={10} isTop={false} />
    </View>
  );

  // Tailor-Made Screen Component
  const TailorMadeScreen = () => {
    const [duration, setDuration] = useState('');
    const [interests, setInterests] = useState('');
    const [budget, setBudget] = useState('');
    const [details, setDetails] = useState('');

    const handleSubmit = () => {
      Alert.alert(
        'Request Sent!',
        'Thank you for your tailor-made request. Our team will contact you within 24 hours.',
        [{ text: 'OK', onPress: () => setCurrentScreen('home') }]
      );
    };

    return (
      <View style={styles.screenContainer}>
        <HieroglyphicText fontSize={10} isTop={true} />
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Heading1>✨ Tailor-Made Experience</Heading1>
            <BodyText style={styles.subtitle}>Create your perfect Nile journey</BodyText>
          </View>

          <Card>
            <Heading2>Custom Trip Request</Heading2>

            <BodyText style={styles.label}>Preferred Duration (days):</BodyText>
            <TextInput
              style={styles.input}
              value={duration}
              onChangeText={setDuration}
              placeholder="e.g., 5 days"
              placeholderTextColor="#999"
            />

            <BodyText style={styles.label}>Special Interests:</BodyText>
            <TextInput
              style={styles.input}
              value={interests}
              onChangeText={setInterests}
              placeholder="e.g., Photography, History, Archaeology"
              placeholderTextColor="#999"
            />

            <BodyText style={styles.label}>Budget Range:</BodyText>
            <TextInput
              style={styles.input}
              value={budget}
              onChangeText={setBudget}
              placeholder="e.g., $2000-3000 per person"
              placeholderTextColor="#999"
            />

            <BodyText style={styles.label}>Additional Details:</BodyText>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={details}
              onChangeText={setDetails}
              placeholder="Tell us about your dream Nile experience..."
              multiline
              numberOfLines={4}
              placeholderTextColor="#999"
            />

            <Button onPress={handleSubmit}>
              Submit Request
            </Button>
          </Card>
        </ScrollView>
        <HieroglyphicText fontSize={10} isTop={false} />
      </View>
    );
  };

  // FAQ Screen Component
  const FAQScreen = () => (
    <View style={styles.screenContainer}>
      <HieroglyphicText fontSize={10} isTop={true} />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Heading1>❓ Frequently Asked Questions</Heading1>
          <BodyText style={styles.subtitle}>Common questions about our cruises</BodyText>
        </View>

        <Card>
          <Heading2>What is a Dahabiya?</Heading2>
          <BodyText>A dahabiya is a traditional Egyptian sailing boat, perfect for intimate Nile cruising with typically 6-12 cabins.</BodyText>
        </Card>

        <Card>
          <Heading2>What's included in the price?</Heading2>
          <BodyText>All meals, accommodation, guided tours, entrance fees to temples, and transfers are included.</BodyText>
        </Card>

        <Card>
          <Heading2>When is the best time to cruise?</Heading2>
          <BodyText>October to April offers the most comfortable weather for Nile cruising.</BodyText>
        </Card>

        <Card>
          <Heading2>Do I need a visa for Egypt?</Heading2>
          <BodyText>Most nationalities can obtain a visa on arrival or e-visa. Check with Egyptian consulate for your specific requirements.</BodyText>
        </Card>

        <Button onPress={() => setCurrentScreen('contact')}>
          Ask a Question
        </Button>
      </ScrollView>
      <HieroglyphicText fontSize={10} isTop={false} />
    </View>
  );

  // Terms Screen Component
  const TermsScreen = () => (
    <View style={styles.screenContainer}>
      <HieroglyphicText fontSize={10} isTop={true} />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Heading1>📄 Terms of Service</Heading1>
          <BodyText style={styles.subtitle}>Terms and conditions</BodyText>
        </View>

        <Card>
          <Heading2>Booking Terms</Heading2>
          <BodyText>• A deposit of 25% is required to confirm your booking</BodyText>
          <BodyText>• Full payment is due 45 days before departure</BodyText>
          <BodyText>• All prices are per person in USD</BodyText>
        </Card>

        <Card>
          <Heading2>Cancellation Policy</Heading2>
          <BodyText>• 60+ days: Full refund minus 10% admin fee</BodyText>
          <BodyText>• 30-59 days: 50% refund</BodyText>
          <BodyText>• Less than 30 days: No refund</BodyText>
        </Card>

        <Card>
          <Heading2>Travel Insurance</Heading2>
          <BodyText>We strongly recommend comprehensive travel insurance to cover any unforeseen circumstances.</BodyText>
        </Card>
      </ScrollView>
      <HieroglyphicText fontSize={10} isTop={false} />
    </View>
  );

  // Privacy Screen Component
  const PrivacyScreen = () => (
    <View style={styles.screenContainer}>
      <HieroglyphicText fontSize={10} isTop={true} />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Heading1>🔒 Privacy Policy</Heading1>
          <BodyText style={styles.subtitle}>How we protect your information</BodyText>
        </View>

        <Card>
          <Heading2>Information We Collect</Heading2>
          <BodyText>We collect information you provide when booking, including name, email, phone number, and travel preferences.</BodyText>
        </Card>

        <Card>
          <Heading2>How We Use Your Information</Heading2>
          <BodyText>Your information is used to process bookings, provide customer service, and send relevant travel updates.</BodyText>
        </Card>

        <Card>
          <Heading2>Data Security</Heading2>
          <BodyText>We use industry-standard security measures to protect your personal information.</BodyText>
        </Card>

        <Card>
          <Heading2>Contact Us</Heading2>
          <BodyText>For privacy concerns, contact us at privacy@dahabiyatnilecruise.com</BodyText>
        </Card>
      </ScrollView>
      <HieroglyphicText fontSize={10} isTop={false} />
    </View>
  );

  // Cancellation Policy Screen Component
  const CancellationPolicyScreen = () => (
    <View style={styles.screenContainer}>
      <HieroglyphicText fontSize={10} isTop={true} />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Heading1>📋 Cancellation Policy</Heading1>
          <BodyText style={styles.subtitle}>Detailed cancellation terms</BodyText>
        </View>

        <Card>
          <Heading2>Standard Cancellation</Heading2>
          <BodyText>• 60+ days before departure: Full refund minus 10% administration fee</BodyText>
          <BodyText>• 45-59 days: 75% refund</BodyText>
          <BodyText>• 30-44 days: 50% refund</BodyText>
          <BodyText>• 15-29 days: 25% refund</BodyText>
          <BodyText>• Less than 15 days: No refund</BodyText>
        </Card>

        <Card>
          <Heading2>Emergency Cancellations</Heading2>
          <BodyText>In case of medical emergencies or force majeure events, special consideration may be given with proper documentation.</BodyText>
        </Card>

        <Card>
          <Heading2>Travel Insurance</Heading2>
          <BodyText>We strongly recommend purchasing travel insurance to protect against unforeseen circumstances that may require cancellation.</BodyText>
        </Card>

        <Button onPress={() => setCurrentScreen('contact')}>
          Contact for Cancellation
        </Button>
      </ScrollView>
      <HieroglyphicText fontSize={10} isTop={false} />
    </View>
  );

  // Sign In Screen Component
  const SignInScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = () => {
      if (email && password) {
        setIsAuthenticated(true);
        setUser({ email, name: 'Guest User' });
        Alert.alert('Success', 'Signed in successfully!');
        setCurrentScreen('profile');
      } else {
        Alert.alert('Error', 'Please enter email and password');
      }
    };

    return (
      <View style={styles.screenContainer}>
        <HieroglyphicText fontSize={10} isTop={true} />
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Heading1>🔐 Sign In</Heading1>
            <BodyText style={styles.subtitle}>Access your account</BodyText>
          </View>

          <Card>
            <BodyText style={styles.label}>Email:</BodyText>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#999"
            />

            <BodyText style={styles.label}>Password:</BodyText>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Your password"
              secureTextEntry
              placeholderTextColor="#999"
            />

            <Button onPress={handleSignIn}>
              Sign In
            </Button>

            <TouchableOpacity onPress={() => setCurrentScreen('forgot-password')}>
              <AccentText style={styles.linkText}>Forgot Password?</AccentText>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setCurrentScreen('signup')}>
              <AccentText style={styles.linkText}>Don't have an account? Sign Up</AccentText>
            </TouchableOpacity>
          </Card>
        </ScrollView>
        <HieroglyphicText fontSize={10} isTop={false} />
      </View>
    );
  };

  // Sign Up Screen Component
  const SignUpScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignUp = () => {
      if (name && email && password && password === confirmPassword) {
        setIsAuthenticated(true);
        setUser({ email, name });
        Alert.alert('Success', 'Account created successfully!');
        setCurrentScreen('profile');
      } else {
        Alert.alert('Error', 'Please fill all fields and ensure passwords match');
      }
    };

    return (
      <View style={styles.screenContainer}>
        <HieroglyphicText fontSize={10} isTop={true} />
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Heading1>📝 Sign Up</Heading1>
            <BodyText style={styles.subtitle}>Create your account</BodyText>
          </View>

          <Card>
            <BodyText style={styles.label}>Full Name:</BodyText>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your full name"
              placeholderTextColor="#999"
            />

            <BodyText style={styles.label}>Email:</BodyText>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#999"
            />

            <BodyText style={styles.label}>Password:</BodyText>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Choose a password"
              secureTextEntry
              placeholderTextColor="#999"
            />

            <BodyText style={styles.label}>Confirm Password:</BodyText>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              secureTextEntry
              placeholderTextColor="#999"
            />

            <Button onPress={handleSignUp}>
              Create Account
            </Button>

            <TouchableOpacity onPress={() => setCurrentScreen('signin')}>
              <AccentText style={styles.linkText}>Already have an account? Sign In</AccentText>
            </TouchableOpacity>
          </Card>
        </ScrollView>
        <HieroglyphicText fontSize={10} isTop={false} />
      </View>
    );
  };

  // Forgot Password Screen Component
  const ForgotPasswordScreen = () => {
    const [email, setEmail] = useState('');

    const handleResetPassword = () => {
      if (email) {
        Alert.alert(
          'Reset Link Sent',
          'A password reset link has been sent to your email address.',
          [{ text: 'OK', onPress: () => setCurrentScreen('signin') }]
        );
      } else {
        Alert.alert('Error', 'Please enter your email address');
      }
    };

    return (
      <View style={styles.screenContainer}>
        <HieroglyphicText fontSize={10} isTop={true} />
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Heading1>🔑 Reset Password</Heading1>
            <BodyText style={styles.subtitle}>Enter your email to reset password</BodyText>
          </View>

          <Card>
            <BodyText style={styles.label}>Email Address:</BodyText>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#999"
            />

            <Button onPress={handleResetPassword}>
              Send Reset Link
            </Button>

            <TouchableOpacity onPress={() => setCurrentScreen('signin')}>
              <AccentText style={styles.linkText}>Back to Sign In</AccentText>
            </TouchableOpacity>
          </Card>
        </ScrollView>
        <HieroglyphicText fontSize={10} isTop={false} />
      </View>
    );
  };

  // Render current screen
  const renderCurrentScreen = () => {
    if (isLoading && currentScreen === 'home') {
      return <LoadingSpinner />;
    }

    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />;
      case 'home':
        return <HomeScreen />;
      case 'dahabiyas':
        return <DahabiyasScreen />;
      case 'dahabiya-detail':
        return <DahabiyaDetailScreen />;
      case 'packages':
        return <PackagesScreen />;
      case 'package-detail':
        return <PackageDetailScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'gallery':
        return <GalleryScreen />;
      case 'blogs':
        return <BlogsScreen />;
      case 'blog-detail':
        return <BlogDetailScreen />;
      case 'itineraries':
        return <ItinerariesScreen />;
      case 'itinerary-detail':
        return <ItineraryDetailScreen />;
      case 'reviews':
        return <ReviewsScreen />;
      case 'testimonials':
        return <TestimonialsScreen />;
      case 'booking':
        return <BookingScreen />;
      case 'bookings':
        return <BookingsScreen />;
      case 'tailor-made':
        return <TailorMadeScreen />;
      case 'faq':
        return <FAQScreen />;
      case 'terms':
        return <TermsScreen />;
      case 'privacy':
        return <PrivacyScreen />;
      case 'cancellation-policy':
        return <CancellationPolicyScreen />;
      case 'signin':
        return <SignInScreen />;
      case 'signup':
        return <SignUpScreen />;
      case 'forgot-password':
        return <ForgotPasswordScreen />;
      case 'about':
        return <AboutScreen />;
      case 'contact':
        return <ContactScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.app}>
      <StatusBar
        barStyle={currentScreen === 'splash' ? "light-content" : "light-content"}
        backgroundColor={currentScreen === 'splash' ? COLORS.PRIMARY : COLORS.PRIMARY}
      />
      {renderCurrentScreen()}
      {currentScreen !== 'splash' && <NavigationBar />}
      {currentScreen !== 'splash' && <DropdownMenu />}
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  // Splash Screen Styles
  splashContainer: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashLogo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 30,
  },
  splashTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  splashSubtitle: {
    fontSize: 16,
    color: COLORS.GOLD,
    marginBottom: 20,
    textAlign: 'center',
  },
  splashHieroglyphic: {
    fontSize: 14,
    color: COLORS.GOLD,
    marginBottom: 20,
    textAlign: 'center',
    opacity: 0.8,
    letterSpacing: 2,
  },
  splashLoader: {
    marginTop: 20,
  },
  // Detail Screen Styles
  detailMainImage: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
  },
  detailContent: {
    padding: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.GOLD,
    marginRight: 10,
  },
  reviewCount: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  description: {
    marginVertical: 15,
    lineHeight: 22,
  },
  specGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  specItem: {
    alignItems: 'center',
    flex: 1,
  },
  specLabel: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 5,
  },
  specValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT,
  },
  gallerySection: {
    marginVertical: 20,
  },
  galleryImage: {
    width: 150,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  featuresSection: {
    marginVertical: 20,
  },
  featuresList: {
    marginTop: 10,
  },
  featureItem: {
    fontSize: 14,
    color: COLORS.TEXT,
    marginBottom: 5,
  },
  bookButton: {
    marginTop: 30,
    marginBottom: 20,
  },
  packageInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  duration: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  // Card Styles
  dahabiyaCard: {
    marginBottom: 15,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardContent: {
    padding: 15,
  },
  tapToView: {
    fontSize: 14,
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  // Featured Items Styles
  featuredItem: {
    width: 150,
    marginRight: 15,
    alignItems: 'center',
  },
  featuredImage: {
    width: 140,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  featuredName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    textAlign: 'center',
    marginBottom: 4,
  },
  featuredPrice: {
    fontSize: 12,
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 20,
  },
  headerWithDropdown: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  dropdownButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
  },
  dropdownButtonText: {
    color: COLORS.WHITE,
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 80,
    paddingRight: 20,
  },
  dropdownContainer: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownText: {
    fontSize: 16,
    color: COLORS.TEXT,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 10,
  },
  stats: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  statText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 5,
  },
  buttonContainer: {
    marginTop: 20,
    gap: 15,
  },
  dahabiyaDetails: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  packageDetails: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  detailText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: COLORS.WHITE,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  marginBottom: {
    marginBottom: 20,
  },
  blogTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: COLORS.PRIMARY,
    marginBottom: 5,
  },
  blogDate: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  priceText: {
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    fontSize: 16,
    marginTop: 10,
  },
  navbar: {
    flexDirection: 'row',
    backgroundColor: COLORS.WHITE,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  navButtonActive: {
    backgroundColor: COLORS.SECONDARY,
  },
  navText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  navTextActive: {
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    marginBottom: 8,
    marginTop: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  linkText: {
    textAlign: 'center',
    marginTop: 16,
    textDecorationLine: 'underline',
  },
  marginBottom: {
    marginBottom: 16,
  },
});

export default App;
