package com.dahabiyat.nilecruise.data.models

import kotlinx.serialization.Serializable

@Serializable
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

@Serializable
enum class UserRole {
    GUEST, USER, ADMIN
}

@Serializable
data class UserPreferences(
    val language: String = "en",
    val currency: String = "USD",
    val notifications: NotificationPreferences = NotificationPreferences(),
    val privacy: PrivacyPreferences = PrivacyPreferences()
)

@Serializable
data class NotificationPreferences(
    val emailNotifications: Boolean = true,
    val pushNotifications: Boolean = true,
    val smsNotifications: Boolean = false,
    val marketingEmails: Boolean = true,
    val bookingUpdates: Boolean = true,
    val specialOffers: Boolean = true
)

@Serializable
data class PrivacyPreferences(
    val profileVisibility: String = "public",
    val shareBookingHistory: Boolean = false,
    val allowDataCollection: Boolean = true
)

@Serializable
data class UserStats(
    val totalBookings: Int = 0,
    val totalSpent: Double = 0.0,
    val favoriteDestinations: List<String> = emptyList(),
    val memberSince: String? = null,
    val loyaltyPoints: Int = 0
)
