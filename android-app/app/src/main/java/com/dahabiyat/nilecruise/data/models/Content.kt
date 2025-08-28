package com.dahabiyat.nilecruise.data.models

import kotlinx.serialization.Serializable

@Serializable
data class WebsiteContent(
    val id: String,
    val key: String,
    val value: String,
    val type: String = "text",
    val page: String? = null,
    val section: String? = null,
    val language: String = "en",
    val isActive: Boolean = true,
    val createdAt: String,
    val updatedAt: String
)

@Serializable
data class AppSettings(
    val appName: String = "Dahabiyat Nile Cruise",
    val appVersion: String = "1.0.0",
    val minAppVersion: String = "1.0.0",
    val maintenanceMode: Boolean = false,
    val forceUpdate: Boolean = false,
    val features: AppFeatures = AppFeatures(),
    val supportInfo: SupportInfo = SupportInfo(),
    val socialMedia: SocialMediaLinks = SocialMediaLinks(),
    val paymentMethods: List<String> = emptyList(),
    val currencies: List<Currency> = emptyList(),
    val languages: List<Language> = emptyList()
)

@Serializable
data class AppFeatures(
    val biometricAuth: Boolean = true,
    val offlineMode: Boolean = true,
    val pushNotifications: Boolean = true,
    val socialSharing: Boolean = true,
    val maps: Boolean = true,
    val darkTheme: Boolean = true,
    val multiLanguage: Boolean = true
)

@Serializable
data class SupportInfo(
    val email: String = "support@dahabiyatnilecruise.com",
    val phone: String = "+201200958713",
    val whatsapp: String = "+201200958713",
    val address: String = "Luxor, Egypt",
    val workingHours: String = "24/7"
)

@Serializable
data class SocialMediaLinks(
    val facebook: String = "https://facebook.com/dahabiyatnilecruise",
    val instagram: String = "https://instagram.com/dahabiyatnilecruise",
    val youtube: String = "https://youtube.com/@dahabiyatnilecruise",
    val twitter: String = "https://twitter.com/dahabiyatnile"
)

@Serializable
data class Currency(
    val code: String,
    val name: String,
    val symbol: String,
    val rate: Double = 1.0
)

@Serializable
data class Language(
    val code: String,
    val name: String,
    val nativeName: String,
    val isRtl: Boolean = false
)

@Serializable
data class MediaAsset(
    val id: String,
    val url: String,
    val type: String, // image, video, document
    val title: String? = null,
    val description: String? = null,
    val category: String? = null,
    val tags: List<String> = emptyList(),
    val size: Long? = null,
    val mimeType: String? = null,
    val createdAt: String
)

@Serializable
data class ContactMessage(
    val name: String,
    val email: String,
    val phone: String? = null,
    val subject: String,
    val message: String,
    val type: String = "general", // general, booking, complaint, suggestion
    val source: String = "mobile"
)

@Serializable
data class Itinerary(
    val id: String,
    val title: String,
    val slug: String,
    val description: String,
    val shortDescription: String? = null,
    val duration: Int, // in days
    val route: String,
    val highlights: List<String> = emptyList(),
    val inclusions: List<String> = emptyList(),
    val exclusions: List<String> = emptyList(),
    val dailyProgram: List<DayProgram> = emptyList(),
    val images: List<String> = emptyList(),
    val mapUrl: String? = null,
    val difficulty: String = "easy", // easy, moderate, challenging
    val bestTime: String? = null,
    val price: Double? = null,
    val isActive: Boolean = true,
    val createdAt: String,
    val updatedAt: String
)

@Serializable
data class DayProgram(
    val day: Int,
    val title: String,
    val description: String,
    val activities: List<String> = emptyList(),
    val meals: List<String> = emptyList(),
    val accommodation: String? = null,
    val locations: List<String> = emptyList()
)

@Serializable
data class CreateReviewRequest(
    val dahabiyaId: String? = null,
    val packageId: String? = null,
    val rating: Int,
    val title: String,
    val comment: String,
    val images: List<String> = emptyList()
)
