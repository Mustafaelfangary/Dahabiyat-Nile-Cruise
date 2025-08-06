/**
 * API Service for Mobile App
 * Handles all API calls to the backend server
 */

import { API_URL, API_ENDPOINTS, APP_CONFIG, DEBUG_MODE } from '../config/environment';

export interface Dahabiya {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  capacity: number;
  cabins: number;
  crew: number;
  pricePerDay: number;
  category: string;
  isActive: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  mainImage: string;
  gallery?: string[];
  features: string[];
  amenities: string[];
  routes: string[];
  highlights: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Package {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  durationDays: number;
  mainImageUrl: string;
  isFeaturedOnHomepage: boolean;
  homepageOrder: number;
  itineraryDays: ItineraryDay[];
  createdAt: string;
  updatedAt: string;
}

export interface Blog {
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
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ItineraryDay {
  id: string;
  dayNumber: number;
  title: string;
  description: string;
  activities: string[];
  meals: string[];
  accommodation: string;
  images: { url: string; caption?: string }[];
}

export interface Booking {
  id: string;
  dahabiyaId?: string;
  packageId?: string;
  startDate: string;
  endDate: string;
  guests: number;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests?: string;
  dahabiya?: Dahabiya;
  package?: Package;
  createdAt: string;
  updatedAt: string;
}

export interface WebsiteContent {
  navbar_logo?: string;
  footer_logo?: string;
  site_logo?: string;
  hero_title?: string;
  hero_subtitle?: string;
  hero_description?: string;
  company_name?: string;
  company_description?: string;
  contact_phone?: string;
  contact_email?: string;
  contact_address?: string;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_URL;
    if (DEBUG_MODE) {
      console.log(`🔧 ApiService initialized with baseURL: ${this.baseURL}`);
    }
  }

  private async fetchWithErrorHandling<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const fullUrl = `${this.baseURL}${url}`;
      console.log(`🌐 API Request: ${fullUrl}`);

      const response = await fetch(fullUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'DahabiyatMobileApp/3.0.0',
          ...options?.headers,
        },
        ...options,
      });

      console.log(`📊 API Response: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API Error Response: ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log(`✅ API Success for ${url}`);
      return data;
    } catch (error) {
      console.error(`❌ API Error for ${url}:`, error);
      throw error;
    }
  }

  // Dahabiyas
  async getDahabiyas(): Promise<Dahabiya[]> {
    return this.fetchWithErrorHandling<Dahabiya[]>(API_ENDPOINTS.DAHABIYAS);
  }

  async getDahabiya(id: string): Promise<Dahabiya> {
    return this.fetchWithErrorHandling<Dahabiya>(API_ENDPOINTS.DAHABIYA_DETAIL(id));
  }

  async getFeaturedDahabiyas(): Promise<Dahabiya[]> {
    const dahabiyas = await this.getDahabiyas();
    return dahabiyas.filter(d => d.isFeatured && d.isActive);
  }

  // Packages
  async getPackages(featured = false): Promise<{ packages: Package[]; total: number; pages: number }> {
    const url = featured ? `${API_ENDPOINTS.PACKAGES}?featured=true` : API_ENDPOINTS.PACKAGES;
    return this.fetchWithErrorHandling<{ packages: Package[]; total: number; pages: number }>(url);
  }

  async getPackage(id: string): Promise<Package> {
    return this.fetchWithErrorHandling<Package>(API_ENDPOINTS.PACKAGE_DETAIL(id));
  }

  async getFeaturedPackages(): Promise<Package[]> {
    const result = await this.getPackages(true);
    return result.packages;
  }

  // Gallery
  async getGalleryImages(): Promise<any[]> {
    return this.fetchWithErrorHandling<any[]>(API_ENDPOINTS.GALLERY);
  }

  // Website Content
  async getWebsiteContent(): Promise<WebsiteContent> {
    return this.fetchWithErrorHandling<WebsiteContent>(API_ENDPOINTS.WEBSITE_CONTENT);
  }

  // Bookings (requires authentication)
  async getUserBookings(token: string): Promise<Booking[]> {
    return this.fetchWithErrorHandling<Booking[]>(API_ENDPOINTS.USER_BOOKINGS, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async createBooking(bookingData: any, token?: string): Promise<Booking> {
    return this.fetchWithErrorHandling<Booking>(API_ENDPOINTS.BOOKINGS, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(bookingData),
    });
  }

  // Availability
  async checkAvailability(data: {
    dahabiyaId: string;
    startDate: string;
    endDate: string;
    guests: number;
  }): Promise<{
    isAvailable: boolean;
    totalPrice: number;
    availableCabins: any[];
    message: string;
  }> {
    return this.fetchWithErrorHandling(API_ENDPOINTS.AVAILABILITY, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Blogs
  async getBlogs(): Promise<Blog[]> {
    return this.fetchWithErrorHandling<Blog[]>('/api/blogs');
  }

  async getBlogBySlug(slug: string): Promise<Blog> {
    return this.fetchWithErrorHandling<Blog>(`/api/blogs/${slug}`);
  }

  async getFeaturedBlogs(): Promise<Blog[]> {
    const blogs = await this.getBlogs();
    return blogs.filter(blog => blog.featured);
  }

  // Utility methods
  getImageUrl(imagePath: string): string {
    if (!imagePath) return `${this.baseURL}${API_ENDPOINTS.IMAGES}/default-placeholder.svg`;
    if (imagePath.startsWith('http')) return imagePath;
    return `${this.baseURL}${imagePath}`;
  }

  getLogo(type: 'navbar' | 'footer' | 'site' = 'navbar'): string {
    // Production logo path
    const logoPath = `${this.baseURL}${API_ENDPOINTS.LOGO}`;
    if (DEBUG_MODE) {
      console.log(`🎨 Logo URL: ${logoPath}`);
    }
    return logoPath;
  }
}

export const apiService = new ApiService();
export default ApiService;
