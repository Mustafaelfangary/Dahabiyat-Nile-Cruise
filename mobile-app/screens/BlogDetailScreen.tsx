import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Share,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  mainImageUrl?: string;
  heroImageUrl?: string;
  author: string;
  tags: string[];
  category?: string;
  isPublished: boolean;
  featured: boolean;
  publishedAt?: string;
  readTime?: number;
  createdAt: string;
  updatedAt: string;
}

const BlogDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { blog } = route.params as { blog: Blog };
  const [isFavorite, setIsFavorite] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this blog post: ${blog.title}`,
        title: blog.title,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    Alert.alert(
      isFavorite ? 'Removed from Favorites' : 'Added to Favorites',
      isFavorite ? 'Blog removed from your favorites' : 'Blog saved to your favorites'
    );
  };

  // Simple HTML content renderer (basic implementation)
  const renderContent = (htmlContent: string) => {
    // Remove HTML tags for basic display (in a real app, you'd use a proper HTML renderer)
    const cleanContent = htmlContent
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"');
    
    return cleanContent;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={24} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleFavorite}>
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={24} 
              color={isFavorite ? "#ff6b6b" : "white"} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Hero Image */}
      <View style={styles.heroContainer}>
        <Image
          source={{ uri: blog.heroImageUrl || blog.mainImageUrl || 'https://via.placeholder.com/400x300' }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        
        {/* Gradient Overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.heroOverlay}
        />
        
        {/* Hero Content */}
        <View style={styles.heroContent}>
          {blog.featured && (
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredText}>⭐ Featured</Text>
            </View>
          )}
          
          <Text style={styles.heroTitle}>{blog.title}</Text>
          
          <View style={styles.heroMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="person" size={16} color="#87ceeb" />
              <Text style={styles.metaText}>{blog.author}</Text>
            </View>
            
            <View style={styles.metaItem}>
              <Ionicons name="calendar" size={16} color="#87ceeb" />
              <Text style={styles.metaText}>
                {formatDate(blog.publishedAt || blog.createdAt)}
              </Text>
            </View>
            
            {blog.readTime && (
              <View style={styles.metaItem}>
                <Ionicons name="time" size={16} color="#87ceeb" />
                <Text style={styles.metaText}>{blog.readTime} min read</Text>
              </View>
            )}
          </View>
          
          {/* Tags */}
          {blog.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {blog.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        {blog.excerpt && (
          <View style={styles.excerptContainer}>
            <Text style={styles.excerpt}>{blog.excerpt}</Text>
          </View>
        )}
        
        <View style={styles.contentBody}>
          <Text style={styles.contentText}>
            {renderContent(blog.content)}
          </Text>
        </View>
        
        {/* Category */}
        {blog.category && (
          <View style={styles.categoryContainer}>
            <View style={styles.categoryBadge}>
              <Ionicons name="folder-outline" size={16} color="#0080ff" />
              <Text style={styles.categoryText}>{blog.category}</Text>
            </View>
          </View>
        )}
        
        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={20} color="white" />
            <Text style={styles.buttonText}>Share Blog</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.secondaryButton, isFavorite && styles.favoriteButton]} 
            onPress={handleFavorite}
          >
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={20} 
              color={isFavorite ? "white" : "#0080ff"} 
            />
            <Text style={[styles.secondaryButtonText, isFavorite && styles.favoriteButtonText]}>
              {isFavorite ? 'Favorited' : 'Add to Favorites'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContainer: {
    position: 'relative',
    height: 400,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  featuredBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#0080ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  featuredText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    lineHeight: 36,
  },
  heroMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    color: '#87ceeb',
    fontSize: 14,
    marginLeft: 6,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: 'rgba(0,128,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    color: '#87ceeb',
    fontSize: 12,
    fontWeight: '600',
  },
  contentContainer: {
    padding: 20,
  },
  excerptContainer: {
    backgroundColor: '#dbeafe',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#0080ff',
  },
  excerpt: {
    fontSize: 16,
    color: '#0066cc',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  contentBody: {
    marginBottom: 24,
  },
  contentText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 28,
    textAlign: 'justify',
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryText: {
    color: '#0080ff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0080ff',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#0080ff',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  favoriteButton: {
    backgroundColor: '#ff6b6b',
    borderColor: '#ff6b6b',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#0080ff',
    fontSize: 16,
    fontWeight: '600',
  },
  favoriteButtonText: {
    color: 'white',
  },
});

export default BlogDetailScreen;
