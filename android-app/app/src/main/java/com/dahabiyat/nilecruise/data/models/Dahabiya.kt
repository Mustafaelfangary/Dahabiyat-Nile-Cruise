package com.dahabiyat.nilecruise.data.models

import kotlinx.serialization.Serializable

@Serializable
data class Dahabiya(
    val id: String,
    val name: String,
    val slug: String,
    val description: String,
    val shortDescription: String? = null,
    val pricePerDay: Double,
    val capacity: Int,
    val cabins: Int? = null,
    val crew: Int? = null,
    val length: Double? = null,
    val width: Double? = null,
    val yearBuilt: Int? = null,
    val mainImage: String? = null,
    val gallery: List<String> = emptyList(),
    val videoUrl: String? = null,
    val features: List<String> = emptyList(),
    val amenities: List<String> = emptyList(),
    val activities: List<String> = emptyList(),
    val diningOptions: List<String> = emptyList(),
    val routes: List<String> = emptyList(),
    val rating: Double = 0.0,
    val reviewCount: Int = 0,
    val isActive: Boolean = true,
    val isFeatured: Boolean = false,
    val category: DahabiyaCategory = DahabiyaCategory.LUXURY
)

@Serializable
enum class DahabiyaCategory {
    LUXURY, DELUXE, PREMIUM, BOUTIQUE
}

@Serializable
data class DahabiyaFeature(
    val id: String,
    val name: String,
    val description: String,
    val icon: String? = null
)

@Serializable
data class CabinType(
    val id: String,
    val name: String,
    val description: String,
    val capacity: Int,
    val amenities: List<String> = emptyList(),
    val images: List<String> = emptyList(),
    val priceModifier: Double = 1.0
)
