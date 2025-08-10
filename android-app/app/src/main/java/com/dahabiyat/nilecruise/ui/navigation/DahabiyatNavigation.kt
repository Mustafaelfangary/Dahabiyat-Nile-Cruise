package com.dahabiyat.nilecruise.ui.navigation

import androidx.compose.animation.AnimatedContentTransitionScope
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import com.dahabiyat.nilecruise.data.models.User
import com.dahabiyat.nilecruise.ui.components.BottomNavigationBar
import com.dahabiyat.nilecruise.ui.components.LoadingScreen
import com.dahabiyat.nilecruise.ui.screens.auth.SignInScreen
import com.dahabiyat.nilecruise.ui.screens.auth.SignUpScreen
import com.dahabiyat.nilecruise.ui.screens.auth.ForgotPasswordScreen
import com.dahabiyat.nilecruise.ui.screens.home.HomeScreen
import com.dahabiyat.nilecruise.ui.screens.dahabiyas.DahabiyasScreen
import com.dahabiyat.nilecruise.ui.screens.dahabiyas.DahabiyaDetailScreen
import com.dahabiyat.nilecruise.ui.screens.packages.PackagesScreen
import com.dahabiyat.nilecruise.ui.screens.packages.PackageDetailScreen
import com.dahabiyat.nilecruise.ui.screens.itineraries.ItinerariesScreen
import com.dahabiyat.nilecruise.ui.screens.itineraries.ItineraryDetailScreen
import com.dahabiyat.nilecruise.ui.screens.gallery.GalleryScreen
import com.dahabiyat.nilecruise.ui.screens.about.AboutScreen
import com.dahabiyat.nilecruise.ui.screens.contact.ContactScreen
import com.dahabiyat.nilecruise.ui.screens.blog.BlogScreen
import com.dahabiyat.nilecruise.ui.screens.blog.BlogDetailScreen
import com.dahabiyat.nilecruise.ui.screens.profile.ProfileScreen
import com.dahabiyat.nilecruise.ui.screens.booking.BookingScreen
import com.dahabiyat.nilecruise.ui.screens.booking.BookingConfirmationScreen
import com.dahabiyat.nilecruise.ui.screens.onboarding.OnboardingScreen
import com.dahabiyat.nilecruise.utils.Constants

@Composable
fun DahabiyatNavigation(
    navController: NavHostController,
    isLoading: Boolean,
    isLoggedIn: Boolean,
    currentUser: User?
) {
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route
    
    // Show loading screen while initializing
    if (isLoading) {
        LoadingScreen()
        return
    }
    
    // Determine if bottom navigation should be shown
    val showBottomNav = when (currentRoute) {
        Screen.SignIn.route,
        Screen.SignUp.route,
        Screen.ForgotPassword.route,
        Screen.Onboarding.route,
        Screen.BookingConfirmation.route -> false
        else -> true
    }
    
    Scaffold(
        bottomBar = {
            if (showBottomNav) {
                BottomNavigationBar(
                    navController = navController,
                    currentRoute = currentRoute
                )
            }
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(if (showBottomNav) paddingValues else paddingValues.copy(bottom = paddingValues.calculateBottomPadding()))
        ) {
            NavHost(
                navController = navController,
                startDestination = if (isLoggedIn) Screen.Home.route else Screen.Onboarding.route,
                enterTransition = {
                    slideIntoContainer(
                        towards = AnimatedContentTransitionScope.SlideDirection.Left,
                        animationSpec = tween(300)
                    ) + fadeIn(animationSpec = tween(300))
                },
                exitTransition = {
                    slideOutOfContainer(
                        towards = AnimatedContentTransitionScope.SlideDirection.Left,
                        animationSpec = tween(300)
                    ) + fadeOut(animationSpec = tween(300))
                },
                popEnterTransition = {
                    slideIntoContainer(
                        towards = AnimatedContentTransitionScope.SlideDirection.Right,
                        animationSpec = tween(300)
                    ) + fadeIn(animationSpec = tween(300))
                },
                popExitTransition = {
                    slideOutOfContainer(
                        towards = AnimatedContentTransitionScope.SlideDirection.Right,
                        animationSpec = tween(300)
                    ) + fadeOut(animationSpec = tween(300))
                }
            ) {
                // Onboarding
                composable(Screen.Onboarding.route) {
                    OnboardingScreen(navController = navController)
                }
                
                // Authentication
                composable(Screen.SignIn.route) {
                    SignInScreen(navController = navController)
                }
                
                composable(Screen.SignUp.route) {
                    SignUpScreen(navController = navController)
                }
                
                composable(Screen.ForgotPassword.route) {
                    ForgotPasswordScreen(navController = navController)
                }
                
                // Main Screens
                composable(Screen.Home.route) {
                    HomeScreen(navController = navController)
                }
                
                composable(Screen.Dahabiyas.route) {
                    DahabiyasScreen(navController = navController)
                }
                
                composable("${Screen.DahabiyaDetail.route}/{dahabiyaId}") { backStackEntry ->
                    val dahabiyaId = backStackEntry.arguments?.getString("dahabiyaId") ?: ""
                    DahabiyaDetailScreen(
                        navController = navController,
                        dahabiyaId = dahabiyaId
                    )
                }
                
                composable(Screen.Packages.route) {
                    PackagesScreen(navController = navController)
                }
                
                composable("${Screen.PackageDetail.route}/{packageId}") { backStackEntry ->
                    val packageId = backStackEntry.arguments?.getString("packageId") ?: ""
                    PackageDetailScreen(
                        navController = navController,
                        packageId = packageId
                    )
                }
                
                composable(Screen.Itineraries.route) {
                    ItinerariesScreen(navController = navController)
                }
                
                composable("${Screen.ItineraryDetail.route}/{itineraryId}") { backStackEntry ->
                    val itineraryId = backStackEntry.arguments?.getString("itineraryId") ?: ""
                    ItineraryDetailScreen(
                        navController = navController,
                        itineraryId = itineraryId
                    )
                }
                
                composable(Screen.Gallery.route) {
                    GalleryScreen(navController = navController)
                }
                
                composable(Screen.About.route) {
                    AboutScreen(navController = navController)
                }
                
                composable(Screen.Contact.route) {
                    ContactScreen(navController = navController)
                }
                
                composable(Screen.Blog.route) {
                    BlogScreen(navController = navController)
                }
                
                composable("${Screen.BlogDetail.route}/{blogId}") { backStackEntry ->
                    val blogId = backStackEntry.arguments?.getString("blogId") ?: ""
                    BlogDetailScreen(
                        navController = navController,
                        blogId = blogId
                    )
                }
                
                composable(Screen.Profile.route) {
                    ProfileScreen(navController = navController)
                }
                
                composable("${Screen.Booking.route}/{packageId}") { backStackEntry ->
                    val packageId = backStackEntry.arguments?.getString("packageId") ?: ""
                    BookingScreen(
                        navController = navController,
                        packageId = packageId
                    )
                }
                
                composable("${Screen.BookingConfirmation.route}/{bookingId}") { backStackEntry ->
                    val bookingId = backStackEntry.arguments?.getString("bookingId") ?: ""
                    BookingConfirmationScreen(
                        navController = navController,
                        bookingId = bookingId
                    )
                }
            }
        }
    }
}
