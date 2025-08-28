package com.dahabiyat.nilecruise.data.models

import kotlinx.serialization.Serializable

@Serializable
data class Booking(
    val id: String,
    val userId: String,
    val dahabiyaId: String? = null,
    val packageId: String? = null,
    val startDate: String,
    val endDate: String,
    val guests: Int,
    val totalPrice: Double,
    val currency: String = "USD",
    val status: BookingStatus = BookingStatus.PENDING,
    val paymentStatus: PaymentStatus = PaymentStatus.PENDING,
    val guestDetails: List<GuestDetail> = emptyList(),
    val specialRequests: String? = null,
    val contactInfo: ContactInfo,
    val createdAt: String,
    val updatedAt: String
)

@Serializable
enum class BookingStatus {
    PENDING, CONFIRMED, CANCELLED, COMPLETED, IN_PROGRESS
}

@Serializable
enum class PaymentStatus {
    PENDING, PAID, PARTIALLY_PAID, REFUNDED, FAILED
}

@Serializable
data class GuestDetail(
    val firstName: String,
    val lastName: String,
    val dateOfBirth: String? = null,
    val nationality: String? = null,
    val passportNumber: String? = null,
    val dietaryRequirements: String? = null
)

@Serializable
data class ContactInfo(
    val email: String,
    val phone: String,
    val address: String? = null,
    val emergencyContact: EmergencyContact? = null
)

@Serializable
data class EmergencyContact(
    val name: String,
    val phone: String,
    val relationship: String
)

@Serializable
data class CreateBookingRequest(
    val dahabiyaId: String? = null,
    val packageId: String? = null,
    val startDate: String,
    val endDate: String,
    val guests: Int,
    val guestDetails: List<GuestDetail> = emptyList(),
    val specialRequests: String? = null,
    val contactInfo: ContactInfo,
    val paymentMethod: String? = null,
    val promoCode: String? = null
)
