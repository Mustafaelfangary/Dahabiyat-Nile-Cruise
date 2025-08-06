import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { ApiService } from '../services/ApiService';

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

const BlogsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [featuredBlogs, setFeaturedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Travel Tips', 'Culture & History', 'Dahabiya Life', 'Ancient Egypt', 'Nile River'];

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await ApiService.getBlogs();
      const publishedBlogs = response.filter((blog: Blog) => blog.isPublished);
      const featured = publishedBlogs.filter((blog: Blog) => blog.featured);
      
      setBlogs(publishedBlogs);
      setFeaturedBlogs(featured);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBlogs();
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || blog.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const navigateToBlogDetail = (blog: Blog) => {
    navigation.navigate('BlogDetail', { blog });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderBlogCard = (blog: Blog, featured = false) => (
    <TouchableOpacity
      key={blog.id}
      style={[styles.blogCard, featured && styles.featuredCard]}
      onPress={() => navigateToBlogDetail(blog)}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: blog.mainImageUrl || 'https://via.placeholder.com/300x200' }}
          style={styles.blogImage}
          resizeMode="cover"
        />
        {featured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>⭐ Featured</Text>
          </View>
        )}
      </View>
      
      <View style={styles.blogContent}>
        <Text style={styles.blogTitle} numberOfLines={2}>
          {blog.title}
        </Text>
        
        <Text style={styles.blogExcerpt} numberOfLines={3}>
          {blog.excerpt || blog.content.substring(0, 150) + '...'}
        </Text>
        
        <View style={styles.blogMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="person-outline" size={14} color="#0080ff" />
            <Text style={styles.metaText}>{blog.author}</Text>
          </View>
          
          {blog.readTime && (
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={14} color="#0080ff" />
              <Text style={styles.metaText}>{blog.readTime} min</Text>
            </View>
          )}
        </View>
        
        {blog.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {blog.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0080ff" />
        <Text style={styles.loadingText}>Loading Ancient Wisdom...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Hero Section */}
      <LinearGradient
        colors={['#0080ff', '#003d7a', '#001f3f']}
        style={styles.heroSection}
      >
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>𓆎𓅓𓏏𓊖 Ancient Blogs</Text>
          <Text style={styles.heroSubtitle}>
            Discover the secrets of the pharaohs and timeless stories of ancient Egypt
          </Text>
        </View>
      </LinearGradient>

      {/* Search Section */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#0080ff" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search ancient wisdom..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor="#999"
          />
        </View>
        
        {/* Category Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.selectedCategory
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === category && styles.selectedCategoryText
              ]}>
                {category === 'all' ? 'All' : category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Featured Blogs */}
      {featuredBlogs.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⭐ Featured Blogs ⭐</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredBlogs.slice(0, 3).map(blog => (
              <View key={blog.id} style={styles.featuredCardContainer}>
                {renderBlogCard(blog, true)}
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* All Blogs */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📜 All Blogs 📜</Text>
        {filteredBlogs.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No Blogs Found</Text>
            <Text style={styles.emptyStateText}>
              {searchTerm ? 'Try adjusting your search terms.' : 'Ancient stories are being written. Please check back soon.'}
            </Text>
          </View>
        ) : (
          <View style={styles.blogsGrid}>
            {filteredBlogs.map(blog => renderBlogCard(blog))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#0080ff',
    fontWeight: '600',
  },
  heroSection: {
    padding: 32,
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#87ceeb',
    textAlign: 'center',
    lineHeight: 24,
  },
  searchSection: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#1e293b',
  },
  categoryContainer: {
    flexDirection: 'row',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#0080ff',
  },
  selectedCategory: {
    backgroundColor: '#0080ff',
  },
  categoryText: {
    fontSize: 14,
    color: '#0080ff',
    fontWeight: '600',
  },
  selectedCategoryText: {
    color: 'white',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0066cc',
    textAlign: 'center',
    marginBottom: 16,
  },
  featuredCardContainer: {
    width: width * 0.8,
    marginRight: 16,
  },
  blogsGrid: {
    gap: 16,
  },
  blogCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featuredCard: {
    borderWidth: 2,
    borderColor: '#0080ff',
  },
  imageContainer: {
    position: 'relative',
  },
  blogImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#0080ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featuredText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  blogContent: {
    padding: 16,
  },
  blogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0066cc',
    marginBottom: 8,
    lineHeight: 24,
  },
  blogExcerpt: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 12,
  },
  blogMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#0080ff',
    marginLeft: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 10,
    color: '#0066cc',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0066cc',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
});

export default BlogsScreen;
