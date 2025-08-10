package com.dahabiyat.nilecruise.data.models

import android.os.Parcelable
import com.google.gson.annotations.SerializedName
import kotlinx.parcelize.Parcelize

@Parcelize
data class ApiResponse<T>(
    @SerializedName("success")
    val success: Boolean,
    
    @SerializedName("message")
    val message: String? = null,
    
    @SerializedName("data")
    val data: T? = null,
    
    @SerializedName("error")
    val error: String? = null,
    
    @SerializedName("errors")
    val errors: List<String>? = null
) : Parcelable

@Parcelize
data class PaginatedResponse<T>(
    @SerializedName("success")
    val success: Boolean,
    
    @SerializedName("message")
    val message: String? = null,
    
    @SerializedName("data")
    val data: List<T>? = null,
    
    @SerializedName("pagination")
    val pagination: PaginationInfo? = null,
    
    @SerializedName("error")
    val error: String? = null
) : Parcelable

@Parcelize
data class PaginationInfo(
    @SerializedName("currentPage")
    val currentPage: Int,
    
    @SerializedName("totalPages")
    val totalPages: Int,
    
    @SerializedName("totalItems")
    val totalItems: Int,
    
    @SerializedName("itemsPerPage")
    val itemsPerPage: Int,
    
    @SerializedName("hasNextPage")
    val hasNextPage: Boolean,
    
    @SerializedName("hasPreviousPage")
    val hasPreviousPage: Boolean
) : Parcelable

// Additional models for API responses
@Parcelize
data class GalleryImage(
    @SerializedName("id")
    val id: String,
    
    @SerializedName("url")
    val url: String,
    
    @SerializedName("title")
    val title: String? = null,
    
    @SerializedName("description")
    val description: String? = null,
    
    @SerializedName("category")
    val category: String? = null,
    
    @SerializedName("tags")
    val tags: List<String> = emptyList(),
    
    @SerializedName("dahabiyaId")
    val dahabiyaId: String? = null,
    
    @SerializedName("packageId")
    val packageId: String? = null,
    
    @SerializedName("createdAt")
    val createdAt: String
) : Parcelable

@Parcelize
data class BlogPost(
    @SerializedName("id")
    val id: String,
    
    @SerializedName("title")
    val title: String,
    
    @SerializedName("content")
    val content: String,
    
    @SerializedName("excerpt")
    val excerpt: String? = null,
    
    @SerializedName("featuredImage")
    val featuredImage: String? = null,
    
    @SerializedName("category")
    val category: String? = null,
    
    @SerializedName("tags")
    val tags: List<String> = emptyList(),
    
    @SerializedName("author")
    val author: String,
    
    @SerializedName("readTime")
    val readTime: Int? = null,
    
    @SerializedName("isFeatured")
    val isFeatured: Boolean = false,
    
    @SerializedName("isPublished")
    val isPublished: Boolean = true,
    
    @SerializedName("publishedAt")
    val publishedAt: String,
    
    @SerializedName("createdAt")
    val createdAt: String,
    
    @SerializedName("updatedAt")
    val updatedAt: String
) : Parcelable

@Parcelize
data class Review(
    @SerializedName("id")
    val id: String,
    
    @SerializedName("userId")
    val userId: String,
    
    @SerializedName("userName")
    val userName: String,
    
    @SerializedName("userAvatar")
    val userAvatar: String? = null,
    
    @SerializedName("rating")
    val rating: Int,
    
    @SerializedName("title")
    val title: String? = null,
    
    @SerializedName("comment")
    val comment: String,
    
    @SerializedName("dahabiyaId")
    val dahabiyaId: String? = null,
    
    @SerializedName("packageId")
    val packageId: String? = null,
    
    @SerializedName("bookingId")
    val bookingId: String? = null,
    
    @SerializedName("images")
    val images: List<String> = emptyList(),
    
    @SerializedName("isVerified")
    val isVerified: Boolean = false,
    
    @SerializedName("isFeatured")
    val isFeatured: Boolean = false,
    
    @SerializedName("createdAt")
    val createdAt: String
) : Parcelable

@Parcelize
data class CreateReviewRequest(
    @SerializedName("rating")
    val rating: Int,
    
    @SerializedName("title")
    val title: String? = null,
    
    @SerializedName("comment")
    val comment: String,
    
    @SerializedName("dahabiyaId")
    val dahabiyaId: String? = null,
    
    @SerializedName("packageId")
    val packageId: String? = null,
    
    @SerializedName("bookingId")
    val bookingId: String? = null
) : Parcelable

@Parcelize
data class Itinerary(
    @SerializedName("id")
    val id: String,
    
    @SerializedName("title")
    val title: String,
    
    @SerializedName("description")
    val description: String,
    
    @SerializedName("duration")
    val duration: Int,
    
    @SerializedName("route")
    val route: String,
    
    @SerializedName("highlights")
    val highlights: List<String> = emptyList(),
    
    @SerializedName("days")
    val days: List<ItineraryDay> = emptyList(),
    
    @SerializedName("images")
    val images: List<String> = emptyList(),
    
    @SerializedName("mainImage")
    val mainImage: String? = null,
    
    @SerializedName("difficulty")
    val difficulty: String = "Easy",
    
    @SerializedName("isActive")
    val isActive: Boolean = true,
    
    @SerializedName("createdAt")
    val createdAt: String,
    
    @SerializedName("updatedAt")
    val updatedAt: String
) : Parcelable

@Parcelize
data class ContactMessage(
    @SerializedName("name")
    val name: String,
    
    @SerializedName("email")
    val email: String,
    
    @SerializedName("phone")
    val phone: String? = null,
    
    @SerializedName("subject")
    val subject: String,
    
    @SerializedName("message")
    val message: String,
    
    @SerializedName("type")
    val type: String = "general"
) : Parcelable

@Parcelize
data class WebsiteContent(
    @SerializedName("id")
    val id: String,
    
    @SerializedName("key")
    val key: String,
    
    @SerializedName("title")
    val title: String,
    
    @SerializedName("content")
    val content: String,
    
    @SerializedName("contentType")
    val contentType: String,
    
    @SerializedName("page")
    val page: String,
    
    @SerializedName("section")
    val section: String,
    
    @SerializedName("isActive")
    val isActive: Boolean = true
) : Parcelable

@Parcelize
data class AppSettings(
    @SerializedName("appName")
    val appName: String,
    
    @SerializedName("appVersion")
    val appVersion: String,
    
    @SerializedName("supportEmail")
    val supportEmail: String,
    
    @SerializedName("supportPhone")
    val supportPhone: String,
    
    @SerializedName("socialMedia")
    val socialMedia: Map<String, String> = emptyMap(),
    
    @SerializedName("maintenanceMode")
    val maintenanceMode: Boolean = false,
    
    @SerializedName("forceUpdate")
    val forceUpdate: Boolean = false,
    
    @SerializedName("minAppVersion")
    val minAppVersion: String? = null
) : Parcelable

@Parcelize
data class MediaAsset(
    @SerializedName("id")
    val id: String,
    
    @SerializedName("name")
    val name: String,
    
    @SerializedName("url")
    val url: String,
    
    @SerializedName("type")
    val type: String,
    
    @SerializedName("category")
    val category: String? = null
) : Parcelable
