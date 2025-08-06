/**
 * API Service for Mobile App
 * Handles all API calls to the backend server
 */

import { APP_CONSTANTS } from '../constants/AppConstants';

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
    this.baseURL = APP_CONSTANTS.API_BASE_URL;
  }

  private async fetchWithErrorHandling<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error for ${url}:`, error);
      throw error;
    }
  }

  // Dahabiyas
  async getDahabiyas(): Promise<Dahabiya[]> {
    return this.fetchWithErrorHandling<Dahabiya[]>('/api/dashboard/dahabiyat');
  }

  async getDahabiya(id: string): Promise<Dahabiya> {
    return this.fetchWithErrorHandling<Dahabiya>(`/api/dahabiyas/${id}`);
  }

  async getFeaturedDahabiyas(): Promise<Dahabiya[]> {
    const dahabiyas = await this.getDahabiyas();
    return dahabiyas.filter(d => d.isFeatured && d.isActive);
  }

  // Packages
  async getPackages(featured = false): Promise<{ packages: Package[]; total: number; pages: number }> {
    const url = featured ? '/api/packages?featured=true' : '/api/packages';
    return this.fetchWithErrorHandling<{ packages: Package[]; total: number; pages: number }>(url);
  }

  async getPackage(id: string): Promise<Package> {
    return this.fetchWithErrorHandling<Package>(`/api/packages/${id}`);
  }

  async getFeaturedPackages(): Promise<Package[]> {
    const result = await this.getPackages(true);
    return result.packages;
  }

  // Gallery
  async getGalleryImages(): Promise<any[]> {
    return this.fetchWithErrorHandling<any[]>('/api/gallery');
  }

  // Website Content
  async getWebsiteContent(): Promise<WebsiteContent> {
    return this.fetchWithErrorHandling<WebsiteContent>('/api/website-content');
  }

  // Bookings (requires authentication)
  async getUserBookings(token: string): Promise<Booking[]> {
    return this.fetchWithErrorHandling<Booking[]>('/api/user/bookings', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async createBooking(bookingData: any, token?: string): Promise<Booking> {
    return this.fetchWithErrorHandling<Booking>('/api/bookings', {
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
    return this.fetchWithErrorHandling('/api/availability', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Utility methods
  getImageUrl(imagePath: string): string {
    if (!imagePath) return `${this.baseURL}/images/default-placeholder.svg`;
    if (imagePath.startsWith('http')) return imagePath;
    return `${this.baseURL}${imagePath}`;
  }

  getLogo(type: 'navbar' | 'footer' | 'site' = 'navbar'): string {
    // Default logo path
    const defaultLogo = `${this.baseURL}/images/logo.png`;
    return defaultLogo;
  }
}

export const apiService = new ApiService();
export default ApiService;
