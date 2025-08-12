package com.dahabiyat.nilecruise.data.models

data class User(
    val id: String,
    val email: String,
    val firstName: String,
    val lastName: String,
    val phone: String? = null,
    val dateOfBirth: String? = null,
    val nationality: String? = null,
    val profileImage: String? = null,
    val isEmailVerified: Boolean = false,
    val isPhoneVerified: Boolean = false,
    val role: UserRole = UserRole.GUEST,
    val preferences: UserPreferences = UserPreferences(),
    val stats: UserStats = UserStats(),
    val createdAt: String,
    val updatedAt: String
)

enum class UserRole {
    GUEST, USER, ADMIN
}

data class UserPreferences(
    val language: String = "en",
    val currency: String = "USD",
    val notifications: NotificationPreferences = NotificationPreferences(),
    val privacy: PrivacyPreferences = PrivacyPreferences()
)

data class NotificationPreferences(
    val emailNotifications: Boolean = true,
    val pushNotifications: Boolean = true,
    val smsNotifications: Boolean = false,
    val marketingEmails: Boolean = true,
    val bookingUpdates: Boolean = true,
    val specialOffers: Boolean = true
)

data class PrivacyPreferences(
    val profileVisibility: String = "public",
    val shareBookingHistory: Boolean = false,
    val allowDataCollection: Boolean = true
)

data class UserStats(
    val totalBookings: Int = 0,
    val totalSpent: Double = 0.0,
    val favoriteDestinations: List<String> = emptyList(),
    val memberSince: String? = null,
    val loyaltyPoints: Int = 0
)
