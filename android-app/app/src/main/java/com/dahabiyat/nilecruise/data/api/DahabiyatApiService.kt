package com.dahabiyat.nilecruise.data.api

import com.dahabiyat.nilecruise.data.models.*
import com.dahabiyat.nilecruise.utils.Constants
import retrofit2.Response
import retrofit2.http.*

/**
 * API Service that connects to your existing Dahabiyat backend
 * Uses the same PostgreSQL database and authentication system as your website
 */
interface DahabiyatApiService {

    // Authentication Endpoints (Same as your website)
    @POST(Constants.Endpoints.AUTH_LOGIN)
    suspend fun signIn(@Body request: AuthRequest): Response<AuthResponse>

    @POST(Constants.Endpoints.AUTH_REGISTER)
    suspend fun signUp(@Body request: RegisterRequest): Response<AuthResponse>

    @POST(Constants.Endpoints.AUTH_VERIFY_EMAIL)
    suspend fun verifyEmail(@Body request: VerifyEmailRequest): Response<ApiResponse<String>>

    @POST(Constants.Endpoints.AUTH_FORGOT_PASSWORD)
    suspend fun forgotPassword(@Body request: ForgotPasswordRequest): Response<ApiResponse<String>>

    @POST(Constants.Endpoints.AUTH_RESET_PASSWORD)
    suspend fun resetPassword(@Body request: ResetPasswordRequest): Response<ApiResponse<String>>

    // Admin verification endpoint (for testing)
    @POST("auth/verify-admin")
    suspend fun verifyAdminEmail(@Body request: AdminVerifyRequest): Response<ApiResponse<String>>
    
    // User Profile Endpoints
    @GET(Constants.Endpoints.USER_PROFILE)
    suspend fun getUserProfile(): Response<ApiResponse<User>>
    
    @PUT(Constants.Endpoints.USER_PROFILE)
    suspend fun updateProfile(@Body request: UpdateProfileRequest): Response<ApiResponse<User>>
    
    @POST("${Constants.Endpoints.USER_PROFILE}/change-password")
    suspend fun changePassword(@Body request: ChangePasswordRequest): Response<ApiResponse<String>>
    
    @GET(Constants.Endpoints.USER_STATS)
    suspend fun getUserStats(): Response<ApiResponse<UserStats>>
    
    @GET(Constants.Endpoints.USER_PREFERENCES)
    suspend fun getUserPreferences(): Response<ApiResponse<UserPreferences>>
    
    @PUT(Constants.Endpoints.USER_PREFERENCES)
    suspend fun updateUserPreferences(@Body preferences: UserPreferences): Response<ApiResponse<UserPreferences>>
    
    // Dahabiyas Endpoints
    @GET(Constants.Endpoints.DAHABIYAS)
    suspend fun getDahabiyas(
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 20,
        @Query("featured") featured: Boolean? = null,
        @Query("minPrice") minPrice: Double? = null,
        @Query("maxPrice") maxPrice: Double? = null,
        @Query("capacity") capacity: Int? = null,
        @Query("search") search: String? = null
    ): Response<PaginatedResponse<Dahabiya>>
    
    @GET("${Constants.Endpoints.DAHABIYAS}/{id}")
    suspend fun getDahabiyaById(@Path("id") id: String): Response<ApiResponse<Dahabiya>>
    
    @GET("${Constants.Endpoints.DAHABIYAS}/featured")
    suspend fun getFeaturedDahabiyas(@Query("limit") limit: Int = 5): Response<ApiResponse<List<Dahabiya>>>
    
    // Packages Endpoints
    @GET(Constants.Endpoints.PACKAGES)
    suspend fun getPackages(
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 20,
        @Query("category") category: String? = null,
        @Query("featured") featured: Boolean? = null,
        @Query("popular") popular: Boolean? = null,
        @Query("minPrice") minPrice: Double? = null,
        @Query("maxPrice") maxPrice: Double? = null,
        @Query("duration") duration: Int? = null,
        @Query("search") search: String? = null
    ): Response<PaginatedResponse<Package>>
    
    @GET("${Constants.Endpoints.PACKAGES}/{id}")
    suspend fun getPackageById(@Path("id") id: String): Response<ApiResponse<Package>>
    
    @GET("${Constants.Endpoints.PACKAGES}/featured")
    suspend fun getFeaturedPackages(@Query("limit") limit: Int = 5): Response<ApiResponse<List<Package>>>
    
    @GET("${Constants.Endpoints.PACKAGES}/popular")
    suspend fun getPopularPackages(@Query("limit") limit: Int = 5): Response<ApiResponse<List<Package>>>
    
    @GET("${Constants.Endpoints.PACKAGES}/categories")
    suspend fun getPackageCategories(): Response<ApiResponse<List<String>>>
    
    // Itineraries Endpoints
    @GET(Constants.Endpoints.ITINERARIES)
    suspend fun getItineraries(
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 20,
        @Query("duration") duration: Int? = null,
        @Query("search") search: String? = null
    ): Response<PaginatedResponse<Itinerary>>
    
    @GET("${Constants.Endpoints.ITINERARIES}/{id}")
    suspend fun getItineraryById(@Path("id") id: String): Response<ApiResponse<Itinerary>>
    
    // Gallery Endpoints
    @GET(Constants.Endpoints.GALLERY)
    suspend fun getGalleryImages(
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 20,
        @Query("category") category: String? = null,
        @Query("dahabiyaId") dahabiyaId: String? = null
    ): Response<PaginatedResponse<GalleryImage>>
    
    @GET("${Constants.Endpoints.GALLERY}/categories")
    suspend fun getGalleryCategories(): Response<ApiResponse<List<String>>>
    
    // Blog Endpoints
    @GET(Constants.Endpoints.BLOGS)
    suspend fun getBlogs(
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 20,
        @Query("category") category: String? = null,
        @Query("featured") featured: Boolean? = null,
        @Query("search") search: String? = null
    ): Response<PaginatedResponse<BlogPost>>
    
    @GET("${Constants.Endpoints.BLOGS}/{id}")
    suspend fun getBlogById(@Path("id") id: String): Response<ApiResponse<BlogPost>>
    
    @GET("${Constants.Endpoints.BLOGS}/featured")
    suspend fun getFeaturedBlogs(@Query("limit") limit: Int = 3): Response<ApiResponse<List<BlogPost>>>
    
    // Reviews Endpoints
    @GET(Constants.Endpoints.REVIEWS)
    suspend fun getReviews(
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 20,
        @Query("dahabiyaId") dahabiyaId: String? = null,
        @Query("packageId") packageId: String? = null,
        @Query("rating") rating: Int? = null
    ): Response<PaginatedResponse<Review>>
    
    @POST(Constants.Endpoints.REVIEWS)
    suspend fun createReview(@Body review: CreateReviewRequest): Response<ApiResponse<Review>>
    
    @GET("${Constants.Endpoints.REVIEWS}/featured")
    suspend fun getFeaturedReviews(@Query("limit") limit: Int = 5): Response<ApiResponse<List<Review>>>
    
    // Bookings Endpoints
    @GET(Constants.Endpoints.BOOKINGS)
    suspend fun getUserBookings(
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 20,
        @Query("status") status: String? = null
    ): Response<PaginatedResponse<Booking>>
    
    @POST(Constants.Endpoints.BOOKINGS)
    suspend fun createBooking(@Body booking: CreateBookingRequest): Response<ApiResponse<Booking>>
    
    @GET("${Constants.Endpoints.BOOKINGS}/{id}")
    suspend fun getBookingById(@Path("id") id: String): Response<ApiResponse<Booking>>
    
    @PUT("${Constants.Endpoints.BOOKINGS}/{id}/cancel")
    suspend fun cancelBooking(@Path("id") id: String): Response<ApiResponse<Booking>>
    
    // Contact Endpoints
    @POST(Constants.Endpoints.CONTACT)
    suspend fun sendContactMessage(@Body message: ContactMessage): Response<ApiResponse<String>>
    
    // Website Content Endpoints
    @GET(Constants.Endpoints.WEBSITE_CONTENT)
    suspend fun getWebsiteContent(
        @Query("page") page: String? = null,
        @Query("section") section: String? = null
    ): Response<ApiResponse<List<WebsiteContent>>>
    
    @GET(Constants.Endpoints.SETTINGS)
    suspend fun getAppSettings(): Response<ApiResponse<AppSettings>>
    
    @GET(Constants.Endpoints.MEDIA_ASSETS)
    suspend fun getMediaAssets(): Response<ApiResponse<List<MediaAsset>>>
}
