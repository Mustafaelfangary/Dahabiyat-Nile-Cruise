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
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'home' | 'dahabiyas' | 'dahabiya-detail' | 'packages' | 'package-detail' | 'profile' | 'gallery' | 'blogs' | 'itineraries' | 'about' | 'contact'>('splash');
  const [dahabiyas, setDahabiyas] = useState<Dahabiya[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedDahabiya, setSelectedDahabiya] = useState<Dahabiya | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState<any>(null);
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
        <View style={styles.dropdownContainer}>
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
            onPress={() => { setCurrentScreen('about'); setShowDropdown(false); }}
          >
            <Text style={styles.dropdownText}>ℹ️ About</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => { setCurrentScreen('contact'); setShowDropdown(false); }}
          >
            <Text style={styles.dropdownText}>📞 Contact</Text>
          </TouchableOpacity>
        </View>
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

      {user ? (
        <Card>
          <Heading2>Welcome, {user.firstName}!</Heading2>
          <BodyText>Email: {user.email}</BodyText>
          <BodyText>Member since: {new Date(user.createdAt).toLocaleDateString()}</BodyText>
          <Button title="Sign Out" onPress={() => setUser(null)} variant="secondary" />
        </Card>
      ) : (
        <Card>
          <Heading2>Sign In</Heading2>
          <BodyText style={styles.marginBottom}>Sign in to access your bookings and preferences.</BodyText>
          <Button title="Sign In" onPress={() => {
            // Mock login
            setUser({
              id: '1',
              firstName: 'Guest',
              lastName: 'User',
              email: 'guest@example.com',
              createdAt: new Date().toISOString()
            });
            Alert.alert('Success', 'Signed in successfully!');
          }} />
          <Button title="Create Account" onPress={() => {
            Alert.alert('Info', 'Account creation will be available in the next update.');
          }} variant="outline" />
        </Card>
      )}

        <Card>
          <Heading2>🎯 Quick Actions</Heading2>
          <Button title="View My Bookings" onPress={() => Alert.alert('Info', 'Bookings feature coming soon!')} />
          <Button title="Saved Favorites" onPress={() => Alert.alert('Info', 'Favorites feature coming soon!')} variant="outline" />
          <Button title="Settings" onPress={() => Alert.alert('Info', 'Settings coming soon!')} variant="outline" />
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
        <BodyText style={styles.blogTitle}>🏛️ "Discovering the Secrets of Valley of the Kings"</BodyText>
        <BodyText style={styles.blogDate}>Published: January 15, 2024</BodyText>
        <BodyText>Explore the ancient burial ground of pharaohs...</BodyText>
      </Card>

      <Card>
        <BodyText style={styles.blogTitle}>🌅 "Best Time to Cruise the Nile"</BodyText>
        <BodyText style={styles.blogDate}>Published: January 10, 2024</BodyText>
        <BodyText>Learn about the optimal seasons for your Nile adventure...</BodyText>
      </Card>

      <Card>
          <BodyText style={styles.blogTitle}>🍽️ "Traditional Egyptian Cuisine on Board"</BodyText>
          <BodyText style={styles.blogDate}>Published: January 5, 2024</BodyText>
          <BodyText>Discover the authentic flavors served on our dahabiyas...</BodyText>
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
        <Heading2>4-Day Classic Route</Heading2>
        <BodyText>Day 1: Aswan - Kom Ombo</BodyText>
        <BodyText>Day 2: Kom Ombo - Edfu</BodyText>
        <BodyText>Day 3: Edfu - Esna</BodyText>
        <BodyText>Day 4: Esna - Luxor</BodyText>
        <BodyText style={styles.priceText}>From $1,800 per person</BodyText>
      </Card>

      <Card>
        <Heading2>7-Day Extended Journey</Heading2>
        <BodyText>Day 1-2: Aswan & Philae Temple</BodyText>
        <BodyText>Day 3-4: Kom Ombo & Edfu</BodyText>
        <BodyText>Day 5-6: Esna & West Bank</BodyText>
        <BodyText>Day 7: Luxor & Valley of Kings</BodyText>
        <BodyText style={styles.priceText}>From $3,200 per person</BodyText>
      </Card>

      <Card>
          <Heading2>Custom Itineraries</Heading2>
          <BodyText>Create your own personalized journey with our travel experts.</BodyText>
          <Button title="Request Custom Itinerary" onPress={() => Alert.alert('Info', 'Custom itinerary requests will be available soon!')} />
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
        <Text style={styles.splashHieroglyphic}>𓎢𓃭𓅂𓅱𓄿𓂋𓄿</Text>
        <ActivityIndicator size="large" color={COLORS.GOLD} style={styles.splashLoader} />
      </Animated.View>
    </View>
  );

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
      case 'itineraries':
        return <ItinerariesScreen />;
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
});

export default App;
