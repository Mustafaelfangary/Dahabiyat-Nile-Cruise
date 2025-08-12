/**
 * API Service for Dahabiyat Mobile App
 * Connects to https://dahabiyatnilecruise.com
 */

import { API_URL, API_ENDPOINTS } from '../config/environment';

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
  images?: string[];
  features: string[];
  amenities: string[];
  routes: string[];
  highlights: string[];
  specifications?: {
    length?: string;
    width?: string;
    yearBuilt?: string;
    maxSpeed?: string;
  };
  itinerary?: {
    day: number;
    title: string;
    description: string;
    activities: string[];
  }[];
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
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_URL;
    console.log(`🌐 API Service initialized with base URL: ${this.baseURL}`);
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

  // Authentication
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    return this.fetchWithErrorHandling(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<{ token: string; user: User }> {
    return this.fetchWithErrorHandling(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Dahabiyas
  async getDahabiyas(): Promise<Dahabiya[]> {
    return this.fetchWithErrorHandling<Dahabiya[]>(API_ENDPOINTS.DAHABIYAS);
  }

  async getDahabiya(id: string): Promise<Dahabiya> {
    return this.fetchWithErrorHandling<Dahabiya>(API_ENDPOINTS.DAHABIYA_DETAIL(id));
  }

  // Packages
  async getPackages(): Promise<Package[]> {
    return this.fetchWithErrorHandling<Package[]>(API_ENDPOINTS.PACKAGES);
  }

  async getPackage(id: string): Promise<Package> {
    return this.fetchWithErrorHandling<Package>(API_ENDPOINTS.PACKAGE_DETAIL(id));
  }

  // Bookings
  async createBooking(bookingData: any): Promise<any> {
    return this.fetchWithErrorHandling(API_ENDPOINTS.BOOKINGS, {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  // Gallery
  async getGallery(): Promise<any[]> {
    return this.fetchWithErrorHandling<any[]>(API_ENDPOINTS.GALLERY);
  }

  // Website Content
  async getWebsiteContent(): Promise<any> {
    return this.fetchWithErrorHandling<any>(API_ENDPOINTS.WEBSITE_CONTENT);
  }

  // Contact
  async submitContact(contactData: {
    name: string;
    email: string;
    phone?: string;
    message: string;
  }): Promise<{ success: boolean; message: string }> {
    return this.fetchWithErrorHandling('/api/contact', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  }
}

export const apiService = new ApiService();
export default apiService;
