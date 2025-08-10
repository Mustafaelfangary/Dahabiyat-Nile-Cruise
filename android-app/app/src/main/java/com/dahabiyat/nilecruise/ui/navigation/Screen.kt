package com.dahabiyat.nilecruise.ui.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.ui.graphics.vector.ImageVector

sealed class Screen(
    val route: String,
    val title: String,
    val icon: ImageVector? = null,
    val selectedIcon: ImageVector? = null
) {
    // Authentication Screens
    object Onboarding : Screen("onboarding", "Welcome")
    object SignIn : Screen("signin", "Sign In")
    object SignUp : Screen("signup", "Sign Up")
    object ForgotPassword : Screen("forgot_password", "Forgot Password")
    
    // Main Navigation Screens (Bottom Navigation)
    object Home : Screen(
        route = "home",
        title = "Home",
        icon = Icons.Outlined.Home,
        selectedIcon = Icons.Filled.Home
    )
    
    object Dahabiyas : Screen(
        route = "dahabiyas",
        title = "Dahabiyas",
        icon = Icons.Outlined.DirectionsBoat,
        selectedIcon = Icons.Filled.DirectionsBoat
    )
    
    object Packages : Screen(
        route = "packages",
        title = "Packages",
        icon = Icons.Outlined.CardTravel,
        selectedIcon = Icons.Filled.CardTravel
    )
    
    object Gallery : Screen(
        route = "gallery",
        title = "Gallery",
        icon = Icons.Outlined.PhotoLibrary,
        selectedIcon = Icons.Filled.PhotoLibrary
    )
    
    object Profile : Screen(
        route = "profile",
        title = "Profile",
        icon = Icons.Outlined.Person,
        selectedIcon = Icons.Filled.Person
    )
    
    // Secondary Screens
    object Itineraries : Screen("itineraries", "Itineraries")
    object About : Screen("about", "About Us")
    object Contact : Screen("contact", "Contact")
    object Blog : Screen("blog", "Blog")
    
    // Detail Screens
    object DahabiyaDetail : Screen("dahabiya_detail", "Dahabiya Details")
    object PackageDetail : Screen("package_detail", "Package Details")
    object ItineraryDetail : Screen("itinerary_detail", "Itinerary Details")
    object BlogDetail : Screen("blog_detail", "Blog Post")
    
    // Booking Screens
    object Booking : Screen("booking", "Book Now")
    object BookingConfirmation : Screen("booking_confirmation", "Booking Confirmed")
    
    // Settings and Other Screens
    object Settings : Screen("settings", "Settings")
    object Notifications : Screen("notifications", "Notifications")
    object Help : Screen("help", "Help & Support")
    object TermsOfService : Screen("terms", "Terms of Service")
    object PrivacyPolicy : Screen("privacy", "Privacy Policy")
    
    companion object {
        // Bottom Navigation Items
        val bottomNavigationItems = listOf(
            Home,
            Dahabiyas,
            Packages,
            Gallery,
            Profile
        )
        
        // Main menu items for drawer or home screen
        val mainMenuItems = listOf(
            Home,
            Dahabiyas,
            Packages,
            Itineraries,
            Gallery,
            About,
            Contact,
            Blog
        )
        
        // Authentication screens
        val authScreens = listOf(
            Onboarding,
            SignIn,
            SignUp,
            ForgotPassword
        )
        
        // Screens that require authentication
        val protectedScreens = listOf(
            Profile,
            Booking,
            BookingConfirmation,
            Notifications
        )
        
        // Screens that should hide bottom navigation
        val fullScreens = listOf(
            Onboarding,
            SignIn,
            SignUp,
            ForgotPassword,
            BookingConfirmation
        )
    }
}

// Navigation extensions
fun Screen.withArgs(vararg args: String): String {
    return buildString {
        append(route)
        args.forEach { arg ->
            append("/$arg")
        }
    }
}

// Get screen by route
fun getScreenByRoute(route: String?): Screen? {
    return when (route) {
        Screen.Home.route -> Screen.Home
        Screen.Dahabiyas.route -> Screen.Dahabiyas
        Screen.Packages.route -> Screen.Packages
        Screen.Gallery.route -> Screen.Gallery
        Screen.Profile.route -> Screen.Profile
        Screen.Itineraries.route -> Screen.Itineraries
        Screen.About.route -> Screen.About
        Screen.Contact.route -> Screen.Contact
        Screen.Blog.route -> Screen.Blog
        Screen.SignIn.route -> Screen.SignIn
        Screen.SignUp.route -> Screen.SignUp
        Screen.ForgotPassword.route -> Screen.ForgotPassword
        Screen.Onboarding.route -> Screen.Onboarding
        Screen.Booking.route -> Screen.Booking
        Screen.BookingConfirmation.route -> Screen.BookingConfirmation
        Screen.Settings.route -> Screen.Settings
        Screen.Notifications.route -> Screen.Notifications
        Screen.Help.route -> Screen.Help
        Screen.TermsOfService.route -> Screen.TermsOfService
        Screen.PrivacyPolicy.route -> Screen.PrivacyPolicy
        else -> {
            // Handle detail screens with parameters
            when {
                route?.startsWith("${Screen.DahabiyaDetail.route}/") == true -> Screen.DahabiyaDetail
                route?.startsWith("${Screen.PackageDetail.route}/") == true -> Screen.PackageDetail
                route?.startsWith("${Screen.ItineraryDetail.route}/") == true -> Screen.ItineraryDetail
                route?.startsWith("${Screen.BlogDetail.route}/") == true -> Screen.BlogDetail
                else -> null
            }
        }
    }
}
