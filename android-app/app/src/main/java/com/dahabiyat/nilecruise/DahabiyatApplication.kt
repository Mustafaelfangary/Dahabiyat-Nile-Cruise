package com.dahabiyat.nilecruise

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build
import androidx.core.content.ContextCompat
import dagger.hilt.android.HiltAndroidApp
import timber.log.Timber

@HiltAndroidApp
class DahabiyatApplication : Application() {

    companion object {
        const val NOTIFICATION_CHANNEL_ID = "dahabiyat_notifications"
        const val BOOKING_CHANNEL_ID = "booking_notifications"
        const val PROMOTION_CHANNEL_ID = "promotion_notifications"
    }

    override fun onCreate() {
        super.onCreate()

        // Initialize Timber for logging
        if (BuildConfig.DEBUG) {
            Timber.plant(Timber.DebugTree())
        }

        // Create notification channels
        createNotificationChannels()

        // Initialize your existing backend connection
        initializeBackendConnection()

        Timber.d("Dahabiyat Application initialized with existing backend")
    }

    private fun initializeBackendConnection() {
        // Initialize connection to your existing PostgreSQL backend
        // This will use the same authentication system as your website
        Timber.d("Connecting to existing backend at: ${BuildConfig.BASE_URL}")
    }

    private fun createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val notificationManager = ContextCompat.getSystemService(
                this,
                NotificationManager::class.java
            ) as NotificationManager

            // General notifications channel
            val generalChannel = NotificationChannel(
                NOTIFICATION_CHANNEL_ID,
                "General Notifications",
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply {
                description = "General app notifications"
                enableLights(true)
                lightColor = ContextCompat.getColor(this@DahabiyatApplication, R.color.ocean_blue)
                enableVibration(true)
            }

            // Booking notifications channel
            val bookingChannel = NotificationChannel(
                BOOKING_CHANNEL_ID,
                "Booking Updates",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Booking confirmations and updates"
                enableLights(true)
                lightColor = ContextCompat.getColor(this@DahabiyatApplication, R.color.ocean_blue)
                enableVibration(true)
            }

            // Promotion notifications channel
            val promotionChannel = NotificationChannel(
                PROMOTION_CHANNEL_ID,
                "Promotions & Offers",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Special offers and promotions"
                enableLights(false)
                enableVibration(false)
            }

            notificationManager.createNotificationChannels(
                listOf(generalChannel, bookingChannel, promotionChannel)
            )
        }
    }
}
