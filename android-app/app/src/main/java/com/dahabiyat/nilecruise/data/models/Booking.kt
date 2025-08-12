package com.dahabiyat.nilecruise.data.models

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

enum class BookingStatus {
    PENDING, CONFIRMED, CANCELLED, COMPLETED, IN_PROGRESS
}

enum class PaymentStatus {
    PENDING, PAID, PARTIALLY_PAID, REFUNDED, FAILED
}

data class GuestDetail(
    val firstName: String,
    val lastName: String,
    val dateOfBirth: String? = null,
    val nationality: String? = null,
    val passportNumber: String? = null,
    val dietaryRequirements: String? = null
)

data class ContactInfo(
    val email: String,
    val phone: String,
    val address: String? = null,
    val emergencyContact: EmergencyContact? = null
)

data class EmergencyContact(
    val name: String,
    val phone: String,
    val relationship: String
)
