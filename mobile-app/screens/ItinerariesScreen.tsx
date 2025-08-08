/**
 * Itineraries Screen
 * Browse and explore different cruise itineraries
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface ItineraryCardProps {
  itinerary: {
    id: string;
    title: string;
    duration: string;
    route: string;
    highlights: string[];
    price: string;
    image: string;
    difficulty: 'Easy' | 'Moderate' | 'Challenging';
  };
  onPress: () => void;
}

const ItineraryCard: React.FC<ItineraryCardProps> = ({ itinerary, onPress }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#0080ff'; // Ocean blue for easy
      case 'Moderate': return '#003d7a'; // Deep blue for moderate
      case 'Challenging': return '#001f3f'; // Navy blue for challenging
      default: return '#0080ff';
    }
  };

  return (
    <TouchableOpacity style={styles.itineraryCard} onPress={onPress}>
      <Image source={{ uri: itinerary.image }} style={styles.itineraryImage} />
      
      <View style={styles.itineraryContent}>
        <View style={styles.itineraryHeader}>
          <Text style={styles.itineraryTitle}>{itinerary.title}</Text>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(itinerary.difficulty) }]}>
            <Text style={styles.difficultyText}>{itinerary.difficulty}</Text>
          </View>
        </View>
        
        <View style={styles.itineraryDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{itinerary.duration}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{itinerary.route}</Text>
          </View>
        </View>
        
        <View style={styles.highlightsContainer}>
          {itinerary.highlights.slice(0, 3).map((highlight, index) => (
            <View key={index} style={styles.highlightItem}>
              <Ionicons name="checkmark-circle" size={14} color="#0080ff" />
              <Text style={styles.highlightText}>{highlight}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.itineraryFooter}>
          <Text style={styles.priceText}>From {itinerary.price}</Text>
          <TouchableOpacity style={styles.viewButton}>
            <Text style={styles.viewButtonText}>View Details</Text>
            <Ionicons name="chevron-forward" size={16} color="#0080ff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ItinerariesScreen: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  
  const filters = ['All', 'Classic', 'Luxury', 'Adventure', 'Cultural'];
  
  const itineraries = [
    {
      id: '1',
      title: 'Classic Nile Journey',
      duration: '7 Days / 6 Nights',
      route: 'Luxor to Aswan',
      highlights: [
        'Valley of the Kings',
        'Karnak Temple',
        'Philae Temple',
        'Abu Simbel (Optional)',
      ],
      price: '$1,200',
      image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400',
      difficulty: 'Easy' as const,
    },
    {
      id: '2',
      title: 'Luxury Pharaoh Experience',
      duration: '10 Days / 9 Nights',
      route: 'Cairo to Aswan',
      highlights: [
        'Pyramids of Giza',
        'Egyptian Museum',
        'Dendera Temple',
        'Edfu Temple',
        'Private Egyptologist',
      ],
      price: '$2,800',
      image: 'https://images.unsplash.com/photo-1471919743851-c4df8b6ee133?w=400',
      difficulty: 'Moderate' as const,
    },
    {
      id: '3',
      title: 'Adventure Nile Explorer',
      duration: '12 Days / 11 Nights',
      route: 'Cairo to Abu Simbel',
      highlights: [
        'Desert Safari',
        'Nubian Villages',
        'Camel Trekking',
        'Stargazing Experience',
        'Traditional Felucca Sailing',
      ],
      price: '$3,500',
      image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400',
      difficulty: 'Challenging' as const,
    },
    {
      id: '4',
      title: 'Cultural Heritage Tour',
      duration: '8 Days / 7 Nights',
      route: 'Luxor to Kom Ombo',
      highlights: [
        'Local Artisan Workshops',
        'Traditional Music Shows',
        'Cooking Classes',
        'Market Tours',
      ],
      price: '$1,800',
      image: 'https://images.unsplash.com/photo-1471919743851-c4df8b6ee133?w=400',
      difficulty: 'Easy' as const,
    },
  ];

  const filteredItineraries = selectedFilter === 'All' 
    ? itineraries 
    : itineraries.filter(itinerary => 
        itinerary.title.toLowerCase().includes(selectedFilter.toLowerCase())
      );

  const handleItineraryPress = (itinerary: any) => {
    // Navigate to itinerary details
    console.log('Navigate to itinerary:', itinerary.id);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Itineraries</Text>
        <Text style={styles.headerSubtitle}>Discover Ancient Egypt</Text>
      </View>

      {/* Filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.activeFilterButton
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === filter && styles.activeFilterText
            ]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Itineraries List */}
      <ScrollView style={styles.itinerariesContainer}>
        <View style={styles.itinerariesGrid}>
          {filteredItineraries.map((itinerary) => (
            <ItineraryCard
              key={itinerary.id}
              itinerary={itinerary}
              onPress={() => handleItineraryPress(itinerary)}
            />
          ))}
        </View>
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Pale background
  },
  header: {
    backgroundColor: '#f0f8ff', // Pale blue background
    paddingHorizontal: 20,
    paddingVertical: 30,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000', // Dark black text
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#333333', // Dark gray text
  },
  filtersContainer: {
    backgroundColor: '#f8f9fa', // Pale background
    paddingVertical: 15,
  },
  filtersContent: {
    paddingHorizontal: 20,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e6f3ff', // Pale blue background
    marginRight: 10,
  },
  activeFilterButton: {
    backgroundColor: '#0080ff',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000', // Dark text on pale background
  },
  activeFilterText: {
    color: '#ffffff', // White text on blue background
  },
  itinerariesContainer: {
    flex: 1,
  },
  itinerariesGrid: {
    padding: 20,
  },
  itineraryCard: {
    backgroundColor: '#f8f9fa', // Pale background
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  itineraryImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  itineraryContent: {
    padding: 20,
  },
  itineraryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  itineraryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000', // Dark black text
    flex: 1,
    marginRight: 10,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  itineraryDetails: {
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  highlightsContainer: {
    marginBottom: 20,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  highlightText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  itineraryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0080ff',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f8ff',
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0080ff',
    marginRight: 5,
  },
  bottomSpacing: {
    height: 30,
  },
});

export default ItinerariesScreen;
