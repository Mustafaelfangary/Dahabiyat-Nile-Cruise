package com.dahabiyat.nilecruise.data.models

import android.os.Parcelable
import androidx.room.Entity
import androidx.room.PrimaryKey
import com.google.gson.annotations.SerializedName
import kotlinx.parcelize.Parcelize

@Parcelize
@Entity(tableName = "users")
data class User(
    @PrimaryKey
    @SerializedName("id")
    val id: String,
    
    @SerializedName("email")
    val email: String,
    
    @SerializedName("name")
    val name: String,
    
    @SerializedName("phone")
    val phone: String? = null,
    
    @SerializedName("avatar")
    val avatar: String? = null,
    
    @SerializedName("role")
    val role: String = "USER",
    
    @SerializedName("isEmailVerified")
    val isEmailVerified: Boolean = false,
    
    @SerializedName("createdAt")
    val createdAt: String,
    
    @SerializedName("updatedAt")
    val updatedAt: String,
    
    @SerializedName("preferences")
    val preferences: UserPreferences? = null,
    
    @SerializedName("stats")
    val stats: UserStats? = null
) : Parcelable

@Parcelize
data class UserPreferences(
    @SerializedName("language")
    val language: String = "en",
    
    @SerializedName("currency")
    val currency: String = "USD",
    
    @SerializedName("notifications")
    val notifications: NotificationPreferences = NotificationPreferences(),
    
    @SerializedName("theme")
    val theme: String = "system"
) : Parcelable

@Parcelize
data class NotificationPreferences(
    @SerializedName("bookingUpdates")
    val bookingUpdates: Boolean = true,
    
    @SerializedName("promotions")
    val promotions: Boolean = true,
    
    @SerializedName("newsletter")
    val newsletter: Boolean = false,
    
    @SerializedName("pushNotifications")
    val pushNotifications: Boolean = true,
    
    @SerializedName("emailNotifications")
    val emailNotifications: Boolean = true
) : Parcelable

@Parcelize
data class UserStats(
    @SerializedName("totalBookings")
    val totalBookings: Int = 0,
    
    @SerializedName("totalSpent")
    val totalSpent: Double = 0.0,
    
    @SerializedName("rewardPoints")
    val rewardPoints: Int = 0,
    
    @SerializedName("favoriteDestination")
    val favoriteDestination: String? = null,
    
    @SerializedName("memberSince")
    val memberSince: String,
    
    @SerializedName("lastBooking")
    val lastBooking: String? = null
) : Parcelable

// Authentication related models
@Parcelize
data class AuthRequest(
    @SerializedName("email")
    val email: String,
    
    @SerializedName("password")
    val password: String
) : Parcelable

@Parcelize
data class RegisterRequest(
    @SerializedName("name")
    val name: String,
    
    @SerializedName("email")
    val email: String,
    
    @SerializedName("password")
    val password: String,
    
    @SerializedName("phone")
    val phone: String? = null
) : Parcelable

@Parcelize
data class AuthResponse(
    @SerializedName("success")
    val success: Boolean,
    
    @SerializedName("message")
    val message: String,
    
    @SerializedName("user")
    val user: User? = null,
    
    @SerializedName("token")
    val token: String? = null,
    
    @SerializedName("refreshToken")
    val refreshToken: String? = null
) : Parcelable

@Parcelize
data class ForgotPasswordRequest(
    @SerializedName("email")
    val email: String
) : Parcelable

@Parcelize
data class ResetPasswordRequest(
    @SerializedName("token")
    val token: String,
    
    @SerializedName("password")
    val password: String
) : Parcelable

@Parcelize
data class VerifyEmailRequest(
    @SerializedName("email")
    val email: String,
    
    @SerializedName("token")
    val token: String
) : Parcelable

// Profile update models
@Parcelize
data class UpdateProfileRequest(
    @SerializedName("name")
    val name: String? = null,
    
    @SerializedName("phone")
    val phone: String? = null,
    
    @SerializedName("avatar")
    val avatar: String? = null,
    
    @SerializedName("preferences")
    val preferences: UserPreferences? = null
) : Parcelable

@Parcelize
data class ChangePasswordRequest(
    @SerializedName("currentPassword")
    val currentPassword: String,

    @SerializedName("newPassword")
    val newPassword: String
) : Parcelable

@Parcelize
data class AdminVerifyRequest(
    @SerializedName("email")
    val email: String,

    @SerializedName("adminKey")
    val adminKey: String
) : Parcelable
