/**
 * Gallery Screen
 * Photo gallery of dahabiyat and destinations
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
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const imageWidth = (width - 60) / 2;

interface GalleryItemProps {
  image: {
    id: string;
    url: string;
    title: string;
    category: string;
  };
  onPress: () => void;
}

const GalleryItem: React.FC<GalleryItemProps> = ({ image, onPress }) => (
  <TouchableOpacity style={styles.galleryItem} onPress={onPress}>
    <Image source={{ uri: image.url }} style={styles.galleryImage} />
    <View style={styles.imageOverlay}>
      <Text style={styles.imageTitle}>{image.title}</Text>
    </View>
  </TouchableOpacity>
);

const GalleryScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const categories = ['All', 'Dahabiyat', 'Destinations', 'Temples', 'Cuisine', 'Activities'];

  const galleryImages = [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400',
      title: 'Luxury Dahabiya',
      category: 'Dahabiyat',
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1471919743851-c4df8b6ee133?w=400',
      title: 'Karnak Temple',
      category: 'Temples',
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400',
      title: 'Nile Sunset',
      category: 'Destinations',
    },
    {
      id: '4',
      url: 'https://images.unsplash.com/photo-1471919743851-c4df8b6ee133?w=400',
      title: 'Traditional Cuisine',
      category: 'Cuisine',
    },
    {
      id: '5',
      url: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400',
      title: 'Felucca Sailing',
      category: 'Activities',
    },
    {
      id: '6',
      url: 'https://images.unsplash.com/photo-1471919743851-c4df8b6ee133?w=400',
      title: 'Abu Simbel',
      category: 'Temples',
    },
    {
      id: '7',
      url: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400',
      title: 'Dahabiya Interior',
      category: 'Dahabiyat',
    },
    {
      id: '8',
      url: 'https://images.unsplash.com/photo-1471919743851-c4df8b6ee133?w=400',
      title: 'Valley of Kings',
      category: 'Destinations',
    },
  ];

  const filteredImages = selectedCategory === 'All' 
    ? galleryImages 
    : galleryImages.filter(image => image.category === selectedCategory);

  const handleImagePress = (image: any) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gallery</Text>
        <Text style={styles.headerSubtitle}>Explore the Beauty of the Nile</Text>
      </View>

      {/* Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.activeCategoryButton
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.activeCategoryText
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Gallery Grid */}
      <ScrollView style={styles.galleryContainer}>
        <View style={styles.galleryGrid}>
          {filteredImages.map((image) => (
            <GalleryItem
              key={image.id}
              image={image}
              onPress={() => handleImagePress(image)}
            />
          ))}
        </View>
        
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Image Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalOverlay} onPress={closeModal}>
            <View style={styles.modalContent}>
              {selectedImage && (
                <>
                  <Image source={{ uri: selectedImage.url }} style={styles.modalImage} />
                  <View style={styles.modalInfo}>
                    <Text style={styles.modalTitle}>{selectedImage.title}</Text>
                    <Text style={styles.modalCategory}>{selectedImage.category}</Text>
                  </View>
                </>
              )}
              
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Ionicons name="close" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#0080ff',
    paddingHorizontal: 20,
    paddingVertical: 30,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#e6f3ff',
  },
  categoriesContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 15,
  },
  categoriesContent: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  activeCategoryButton: {
    backgroundColor: '#0080ff',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeCategoryText: {
    color: '#ffffff',
  },
  galleryContainer: {
    flex: 1,
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 20,
  },
  galleryItem: {
    width: imageWidth,
    height: imageWidth,
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  imageTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width - 40,
    maxHeight: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    overflow: 'hidden',
  },
  modalImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  modalInfo: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  modalCategory: {
    fontSize: 16,
    color: '#0080ff',
    fontWeight: '500',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSpacing: {
    height: 30,
  },
});

export default GalleryScreen;
