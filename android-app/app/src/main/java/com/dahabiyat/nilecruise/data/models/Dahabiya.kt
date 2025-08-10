package com.dahabiyat.nilecruise.data.models

import android.os.Parcelable
import androidx.room.Entity
import androidx.room.PrimaryKey
import com.google.gson.annotations.SerializedName
import kotlinx.parcelize.Parcelize

@Parcelize
@Entity(tableName = "dahabiyas")
data class Dahabiya(
    @PrimaryKey
    @SerializedName("id")
    val id: String,
    
    @SerializedName("name")
    val name: String,
    
    @SerializedName("description")
    val description: String,
    
    @SerializedName("shortDescription")
    val shortDescription: String? = null,
    
    @SerializedName("capacity")
    val capacity: Int,
    
    @SerializedName("cabins")
    val cabins: Int,
    
    @SerializedName("crew")
    val crew: Int,
    
    @SerializedName("length")
    val length: Double? = null,
    
    @SerializedName("width")
    val width: Double? = null,
    
    @SerializedName("yearBuilt")
    val yearBuilt: Int? = null,
    
    @SerializedName("pricePerNight")
    val pricePerNight: Double,
    
    @SerializedName("currency")
    val currency: String = "USD",
    
    @SerializedName("rating")
    val rating: Double = 0.0,
    
    @SerializedName("reviewCount")
    val reviewCount: Int = 0,
    
    @SerializedName("images")
    val images: List<String> = emptyList(),
    
    @SerializedName("mainImage")
    val mainImage: String? = null,
    
    @SerializedName("amenities")
    val amenities: List<String> = emptyList(),
    
    @SerializedName("features")
    val features: List<DahabiyaFeature> = emptyList(),
    
    @SerializedName("cabinTypes")
    val cabinTypes: List<CabinType> = emptyList(),
    
    @SerializedName("isActive")
    val isActive: Boolean = true,
    
    @SerializedName("isFeatured")
    val isFeatured: Boolean = false,
    
    @SerializedName("location")
    val location: String? = null,
    
    @SerializedName("tags")
    val tags: List<String> = emptyList(),
    
    @SerializedName("createdAt")
    val createdAt: String,
    
    @SerializedName("updatedAt")
    val updatedAt: String
) : Parcelable

@Parcelize
data class DahabiyaFeature(
    @SerializedName("name")
    val name: String,
    
    @SerializedName("description")
    val description: String? = null,
    
    @SerializedName("icon")
    val icon: String? = null,
    
    @SerializedName("category")
    val category: String? = null
) : Parcelable

@Parcelize
data class CabinType(
    @SerializedName("id")
    val id: String,
    
    @SerializedName("name")
    val name: String,
    
    @SerializedName("description")
    val description: String,
    
    @SerializedName("size")
    val size: Double? = null,
    
    @SerializedName("capacity")
    val capacity: Int,
    
    @SerializedName("bedType")
    val bedType: String,
    
    @SerializedName("amenities")
    val amenities: List<String> = emptyList(),
    
    @SerializedName("images")
    val images: List<String> = emptyList(),
    
    @SerializedName("priceModifier")
    val priceModifier: Double = 1.0, // Multiplier for base price
    
    @SerializedName("available")
    val available: Int = 0
) : Parcelable

// Package model
@Parcelize
@Entity(tableName = "packages")
data class Package(
    @PrimaryKey
    @SerializedName("id")
    val id: String,
    
    @SerializedName("title")
    val title: String,
    
    @SerializedName("description")
    val description: String,
    
    @SerializedName("shortDescription")
    val shortDescription: String? = null,
    
    @SerializedName("duration")
    val duration: Int, // in days
    
    @SerializedName("nights")
    val nights: Int,
    
    @SerializedName("price")
    val price: Double,
    
    @SerializedName("originalPrice")
    val originalPrice: Double? = null,
    
    @SerializedName("currency")
    val currency: String = "USD",
    
    @SerializedName("priceIncludes")
    val priceIncludes: List<String> = emptyList(),
    
    @SerializedName("priceExcludes")
    val priceExcludes: List<String> = emptyList(),
    
    @SerializedName("images")
    val images: List<String> = emptyList(),
    
    @SerializedName("mainImage")
    val mainImage: String? = null,
    
    @SerializedName("highlights")
    val highlights: List<String> = emptyList(),
    
    @SerializedName("itinerary")
    val itinerary: List<ItineraryDay> = emptyList(),
    
    @SerializedName("dahabiyaId")
    val dahabiyaId: String? = null,
    
    @SerializedName("dahabiya")
    val dahabiya: Dahabiya? = null,
    
    @SerializedName("category")
    val category: String,
    
    @SerializedName("difficulty")
    val difficulty: String = "Easy",
    
    @SerializedName("groupSize")
    val groupSize: Int? = null,
    
    @SerializedName("minAge")
    val minAge: Int? = null,
    
    @SerializedName("rating")
    val rating: Double = 0.0,
    
    @SerializedName("reviewCount")
    val reviewCount: Int = 0,
    
    @SerializedName("isActive")
    val isActive: Boolean = true,
    
    @SerializedName("isFeatured")
    val isFeatured: Boolean = false,
    
    @SerializedName("isPopular")
    val isPopular: Boolean = false,
    
    @SerializedName("tags")
    val tags: List<String> = emptyList(),
    
    @SerializedName("availableDates")
    val availableDates: List<String> = emptyList(),
    
    @SerializedName("createdAt")
    val createdAt: String,
    
    @SerializedName("updatedAt")
    val updatedAt: String
) : Parcelable

@Parcelize
data class ItineraryDay(
    @SerializedName("day")
    val day: Int,
    
    @SerializedName("title")
    val title: String,
    
    @SerializedName("description")
    val description: String,
    
    @SerializedName("activities")
    val activities: List<String> = emptyList(),
    
    @SerializedName("meals")
    val meals: List<String> = emptyList(),
    
    @SerializedName("accommodation")
    val accommodation: String? = null,
    
    @SerializedName("location")
    val location: String? = null,
    
    @SerializedName("images")
    val images: List<String> = emptyList()
) : Parcelable
