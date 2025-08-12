package com.dahabiyat.nilecruise.ui.navigation

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import com.dahabiyat.nilecruise.data.models.*
import com.dahabiyat.nilecruise.ui.components.BottomNavigationBar
import com.dahabiyat.nilecruise.ui.components.LoadingScreen
import com.dahabiyat.nilecruise.ui.screens.home.HomeScreen
import com.dahabiyat.nilecruise.ui.screens.dahabiyas.DahabiyaListScreen
import com.dahabiyat.nilecruise.ui.screens.dahabiyas.DahabiyaDetailScreen
import com.dahabiyat.nilecruise.ui.screens.packages.PackageListScreen
import com.dahabiyat.nilecruise.ui.screens.packages.PackageDetailScreen
import com.dahabiyat.nilecruise.ui.screens.gallery.GalleryScreen
import com.dahabiyat.nilecruise.ui.screens.profile.ProfileScreen
import com.dahabiyat.nilecruise.ui.screens.auth.LoginScreen
import com.dahabiyat.nilecruise.ui.screens.auth.RegisterScreen
import com.dahabiyat.nilecruise.ui.screens.auth.OnboardingScreen
import com.dahabiyat.nilecruise.ui.screens.booking.BookingScreen
import com.dahabiyat.nilecruise.ui.screens.booking.BookingConfirmationScreen
import com.dahabiyat.nilecruise.ui.screens.contact.ContactScreen

@Composable
fun DahabiyatNavigation(
    navController: NavHostController,
    isLoading: Boolean,
    isLoggedIn: Boolean,
    currentUser: User? = null
) {
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    // Routes that should show bottom navigation
    val bottomNavRoutes = listOf("home", "dahabiyas", "packages", "gallery", "profile")
    val showBottomNav = currentRoute in bottomNavRoutes

    if (isLoading) {
        LoadingScreen(message = "Loading...")
    } else {
        Scaffold(
            bottomBar = {
                if (showBottomNav) {
                    BottomNavigationBar(navController = navController)
                }
            }
        ) { paddingValues ->
            NavHost(
                navController = navController,
                startDestination = if (isLoggedIn) "home" else "onboarding",
                modifier = Modifier.padding(paddingValues)
            ) {
                // Onboarding
                composable("onboarding") {
                    OnboardingScreen(
                        onGetStartedClick = {
                            navController.navigate("home") {
                                popUpTo("onboarding") { inclusive = true }
                            }
                        }
                    )
                }

                // Authentication
                composable("login") {
                    LoginScreen(
                        onLoginClick = { email, password ->
                            // TODO: Handle login
                            navController.navigate("home") {
                                popUpTo("login") { inclusive = true }
                            }
                        },
                        onRegisterClick = {
                            navController.navigate("register")
                        },
                        onForgotPasswordClick = {
                            // TODO: Navigate to forgot password
                        }
                    )
                }

                composable("register") {
                    RegisterScreen(
                        onRegisterClick = { firstName, lastName, email, password ->
                            // TODO: Handle registration
                            navController.navigate("home") {
                                popUpTo("register") { inclusive = true }
                            }
                        },
                        onLoginClick = {
                            navController.popBackStack()
                        }
                    )
                }

                // Main screens
                composable("home") {
                    HomeScreen(
                        onDahabiyaClick = { dahabiya ->
                            navController.navigate("dahabiya_detail/${dahabiya.id}")
                        },
                        onPackageClick = { packageItem ->
                            navController.navigate("package_detail/${packageItem.id}")
                        },
                        onViewAllDahabiyasClick = {
                            navController.navigate("dahabiyas")
                        },
                        onViewAllPackagesClick = {
                            navController.navigate("packages")
                        },
                        onSearchClick = {
                            navController.navigate("dahabiyas")
                        }
                    )
                }

                composable("dahabiyas") {
                    DahabiyaListScreen(
                        onDahabiyaClick = { dahabiya ->
                            navController.navigate("dahabiya_detail/${dahabiya.id}")
                        },
                        onBackClick = {
                            navController.popBackStack()
                        },
                        onFilterClick = {
                            // TODO: Show filter dialog
                        }
                    )
                }

                composable("dahabiya_detail/{dahabiyaId}") { backStackEntry ->
                    val dahabiyaId = backStackEntry.arguments?.getString("dahabiyaId") ?: ""
                    // TODO: Get dahabiya by ID from ViewModel
                    val sampleDahabiya = Dahabiya(
                        id = dahabiyaId,
                        name = "Queen Cleopatra",
                        slug = "queen-cleopatra",
                        description = "Luxury sailing boat with traditional Egyptian design",
                        pricePerDay = 250.0,
                        capacity = 8
                    )

                    DahabiyaDetailScreen(
                        dahabiya = sampleDahabiya,
                        onBackClick = {
                            navController.popBackStack()
                        },
                        onBookNowClick = {
                            navController.navigate("booking/dahabiya/${dahabiyaId}")
                        },
                        onShareClick = {
                            // TODO: Handle share
                        },
                        onFavoriteClick = {
                            // TODO: Handle favorite
                        }
                    )
                }

                composable("packages") {
                    PackageListScreen(
                        onPackageClick = { packageItem ->
                            navController.navigate("package_detail/${packageItem.id}")
                        },
                        onBackClick = {
                            navController.popBackStack()
                        },
                        onFilterClick = {
                            // TODO: Show filter dialog
                        }
                    )
                }

                composable("package_detail/{packageId}") { backStackEntry ->
                    val packageId = backStackEntry.arguments?.getString("packageId") ?: ""
                    // TODO: Get package by ID from ViewModel
                    val samplePackage = Package(
                        id = packageId,
                        name = "Luxor to Aswan Adventure",
                        slug = "luxor-aswan-adventure",
                        description = "5-day luxury cruise from Luxor to Aswan",
                        price = 1250.0,
                        durationDays = 5,
                        durationNights = 4,
                        maxGuests = 8
                    )

                    PackageDetailScreen(
                        packageItem = samplePackage,
                        onBackClick = {
                            navController.popBackStack()
                        },
                        onBookNowClick = {
                            navController.navigate("booking/package/${packageId}")
                        },
                        onShareClick = {
                            // TODO: Handle share
                        },
                        onFavoriteClick = {
                            // TODO: Handle favorite
                        }
                    )
                }

                composable("gallery") {
                    GalleryScreen(
                        onImageClick = { image ->
                            // TODO: Show image detail
                        },
                        onFilterClick = {
                            // TODO: Show filter dialog
                        }
                    )
                }

                composable("profile") {
                    ProfileScreen(
                        user = currentUser,
                        onEditProfileClick = {
                            // TODO: Navigate to edit profile
                        },
                        onBookingsClick = {
                            // TODO: Navigate to bookings
                        },
                        onFavoritesClick = {
                            // TODO: Navigate to favorites
                        },
                        onSettingsClick = {
                            // TODO: Navigate to settings
                        },
                        onHelpClick = {
                            navController.navigate("contact")
                        },
                        onLogoutClick = {
                            // TODO: Handle logout
                            navController.navigate("onboarding") {
                                popUpTo(0) { inclusive = true }
                            }
                        },
                        onLoginClick = {
                            navController.navigate("login")
                        }
                    )
                }

                // Booking flow
                composable("booking/{type}/{itemId}") { backStackEntry ->
                    val type = backStackEntry.arguments?.getString("type") ?: ""
                    val itemId = backStackEntry.arguments?.getString("itemId") ?: ""

                    val (itemName, itemPrice) = when (type) {
                        "dahabiya" -> "Queen Cleopatra" to 250.0
                        "package" -> "Luxor to Aswan Adventure" to 1250.0
                        else -> "Unknown Item" to 0.0
                    }

                    BookingScreen(
                        itemName = itemName,
                        itemPrice = itemPrice,
                        onBackClick = {
                            navController.popBackStack()
                        },
                        onConfirmBooking = { startDate, endDate, guests, guestDetails, contactInfo, specialRequests ->
                            // TODO: Create booking
                            val bookingId = "booking_${System.currentTimeMillis()}"
                            navController.navigate("booking_confirmation/${bookingId}") {
                                popUpTo("home")
                            }
                        }
                    )
                }

                composable("booking_confirmation/{bookingId}") { backStackEntry ->
                    val bookingId = backStackEntry.arguments?.getString("bookingId") ?: ""
                    // TODO: Get booking by ID from ViewModel
                    val sampleBooking = Booking(
                        id = bookingId,
                        userId = currentUser?.id ?: "",
                        startDate = "2024-03-15",
                        endDate = "2024-03-20",
                        guests = 2,
                        totalPrice = 1250.0,
                        contactInfo = ContactInfo(
                            email = "user@example.com",
                            phone = "+1234567890"
                        ),
                        createdAt = "2024-01-01",
                        updatedAt = "2024-01-01"
                    )

                    BookingConfirmationScreen(
                        booking = sampleBooking,
                        onBackToHomeClick = {
                            navController.navigate("home") {
                                popUpTo("home") { inclusive = true }
                            }
                        },
                        onViewBookingClick = {
                            // TODO: Navigate to booking details
                        }
                    )
                }

                // Contact
                composable("contact") {
                    ContactScreen(
                        onBackClick = {
                            navController.popBackStack()
                        },
                        onSendMessageClick = { name, email, subject, message ->
                            // TODO: Send message
                        },
                        onCallClick = { phoneNumber ->
                            // TODO: Open phone dialer
                        },
                        onEmailClick = { email ->
                            // TODO: Open email client
                        }
                    )
                }
            }
        }
    }
}
