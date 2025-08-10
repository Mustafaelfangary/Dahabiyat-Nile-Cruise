package com.dahabiyat.nilecruise.utils

object Constants {
    
    // API Configuration - Connected to your live backend
    const val BASE_URL = "https://www.dahabiyatnilecruise.com/api/"
    const val WEBSITE_URL = "https://www.dahabiyatnilecruise.com"

    // Testing Configuration
    const val ENABLE_TESTING_MODE = true
    const val TEST_USER_EMAIL = "test@dahabiyatnilecruise.com"
    const val ADMIN_VERIFY_KEY = "admin-verify-2024"
    
    // API Endpoints
    object Endpoints {
        const val AUTH_LOGIN = "auth/signin"
        const val AUTH_REGISTER = "auth/signup"
        const val AUTH_VERIFY_EMAIL = "auth/verify-email"
        const val AUTH_FORGOT_PASSWORD = "auth/forgot-password"
        const val AUTH_RESET_PASSWORD = "auth/reset-password"
        
        const val DAHABIYAS = "dahabiyas"
        const val PACKAGES = "packages"
        const val ITINERARIES = "itineraries"
        const val GALLERY = "gallery"
        const val BLOGS = "blogs"
        const val REVIEWS = "reviews"
        const val BOOKINGS = "bookings"
        const val CONTACT = "contact"
        
        const val USER_PROFILE = "profile"
        const val USER_STATS = "user/stats"
        const val USER_PREFERENCES = "user/preferences"
        
        const val WEBSITE_CONTENT = "website-content"
        const val SETTINGS = "settings"
        const val MEDIA_ASSETS = "media-assets"
    }
    
    // Shared Preferences Keys
    object PrefsKeys {
        const val USER_TOKEN = "user_token"
        const val USER_ID = "user_id"
        const val USER_EMAIL = "user_email"
        const val USER_NAME = "user_name"
        const val USER_ROLE = "user_role"
        const val IS_LOGGED_IN = "is_logged_in"
        const val IS_FIRST_LAUNCH = "is_first_launch"
        const val SELECTED_LANGUAGE = "selected_language"
        const val THEME_MODE = "theme_mode"
        const val BIOMETRIC_ENABLED = "biometric_enabled"
        const val NOTIFICATIONS_ENABLED = "notifications_enabled"
    }
    
    // Database
    object Database {
        const val NAME = "dahabiyat_database"
        const val VERSION = 1
    }
    
    // Network
    object Network {
        const val TIMEOUT_CONNECT = 30L
        const val TIMEOUT_READ = 30L
        const val TIMEOUT_WRITE = 30L
        const val CACHE_SIZE = 10 * 1024 * 1024L // 10MB
    }
    
    // Pagination
    object Pagination {
        const val PAGE_SIZE = 20
        const val PREFETCH_DISTANCE = 5
    }
    
    // Image Loading
    object Images {
        const val PLACEHOLDER_DAHABIYA = "placeholder_dahabiya.jpg"
        const val PLACEHOLDER_PACKAGE = "placeholder_package.jpg"
        const val PLACEHOLDER_GALLERY = "placeholder_gallery.jpg"
        const val PLACEHOLDER_AVATAR = "placeholder_avatar.jpg"
    }
    
    // Animation Durations
    object Animation {
        const val DURATION_SHORT = 200L
        const val DURATION_MEDIUM = 300L
        const val DURATION_LONG = 500L
        const val DURATION_EXTRA_LONG = 1000L
    }
    
    // Date Formats
    object DateFormats {
        const val API_DATE_FORMAT = "yyyy-MM-dd"
        const val API_DATETIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
        const val DISPLAY_DATE_FORMAT = "MMM dd, yyyy"
        const val DISPLAY_DATETIME_FORMAT = "MMM dd, yyyy 'at' HH:mm"
    }
    
    // Booking Status
    object BookingStatus {
        const val PENDING = "PENDING"
        const val CONFIRMED = "CONFIRMED"
        const val CANCELLED = "CANCELLED"
        const val COMPLETED = "COMPLETED"
    }
    
    // User Roles
    object UserRoles {
        const val USER = "USER"
        const val ADMIN = "ADMIN"
        const val MANAGER = "MANAGER"
        const val GUIDE = "GUIDE"
    }
    
    // Content Types
    object ContentTypes {
        const val TEXT = "text"
        const val IMAGE = "image"
        const val VIDEO = "video"
        const val RICH_TEXT = "rich_text"
    }
    
    // Social Media
    object SocialMedia {
        const val FACEBOOK_URL = "https://facebook.com/dahabiyatnilecruise"
        const val INSTAGRAM_URL = "https://instagram.com/dahabiyatnilecruise"
        const val YOUTUBE_URL = "https://youtube.com/@dahabiyatnilecruise"
        const val TWITTER_URL = "https://twitter.com/dahabiyatnile"
    }
    
    // Contact Information
    object Contact {
        const val PHONE_NUMBER = "+201200958713"
        const val EMAIL = "info@dahabiyatnilecruise.com"
        const val WHATSAPP_NUMBER = "+201200958713"
        const val ADDRESS = "Luxor, Egypt"
    }
    
    // Map Configuration
    object Maps {
        const val DEFAULT_ZOOM = 10f
        const val LUXOR_LAT = 25.6872
        const val LUXOR_LNG = 32.6396
        const val ASWAN_LAT = 24.0889
        const val ASWAN_LNG = 32.8998
    }
    
    // Error Messages
    object ErrorMessages {
        const val NETWORK_ERROR = "Network connection error. Please check your internet connection."
        const val SERVER_ERROR = "Server error. Please try again later."
        const val UNKNOWN_ERROR = "An unexpected error occurred. Please try again."
        const val VALIDATION_ERROR = "Please check your input and try again."
        const val AUTH_ERROR = "Authentication failed. Please sign in again."
    }
}
