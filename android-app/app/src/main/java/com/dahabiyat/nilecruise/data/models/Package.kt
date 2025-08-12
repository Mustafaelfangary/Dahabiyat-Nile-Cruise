package com.dahabiyat.nilecruise.data.models

data class Package(
    val id: String,
    val name: String,
    val slug: String,
    val description: String,
    val shortDescription: String? = null,
    val price: Double,
    val originalPrice: Double? = null,
    val durationDays: Int,
    val durationNights: Int,
    val maxGuests: Int,
    val minGuests: Int = 1,
    val mainImageUrl: String? = null,
    val gallery: List<String> = emptyList(),
    val videoUrl: String? = null,
    val highlights: List<String> = emptyList(),
    val inclusions: List<String> = emptyList(),
    val exclusions: List<String> = emptyList(),
    val itinerary: List<ItineraryDay> = emptyList(),
    val dahabiyaId: String? = null,
    val availableDates: List<String> = emptyList(),
    val rating: Double = 0.0,
    val reviewCount: Int = 0,
    val isActive: Boolean = true,
    val isFeatured: Boolean = false,
    val category: PackageCategory = PackageCategory.STANDARD,
    val difficulty: PackageDifficulty = PackageDifficulty.EASY
)

enum class PackageCategory {
    STANDARD, PREMIUM, LUXURY, CUSTOM
}

enum class PackageDifficulty {
    EASY, MODERATE, CHALLENGING
}

data class ItineraryDay(
    val day: Int,
    val title: String,
    val description: String,
    val activities: List<String> = emptyList(),
    val meals: List<String> = emptyList(),
    val accommodation: String? = null,
    val locations: List<String> = emptyList()
)
