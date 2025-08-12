package com.dahabiyat.nilecruise.ui.components

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.navigation.NavController
import androidx.navigation.compose.currentBackStackEntryAsState

data class BottomNavItem(
    val route: String,
    val icon: ImageVector,
    val label: String
)

@Composable
fun BottomNavigationBar(
    navController: NavController,
    items: List<BottomNavItem> = defaultBottomNavItems
) {
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    NavigationBar {
        items.forEach { item ->
            NavigationBarItem(
                icon = {
                    Icon(
                        imageVector = item.icon,
                        contentDescription = item.label
                    )
                },
                label = {
                    Text(text = item.label)
                },
                selected = currentRoute == item.route,
                onClick = {
                    if (currentRoute != item.route) {
                        navController.navigate(item.route) {
                            // Pop up to the start destination of the graph to
                            // avoid building up a large stack of destinations
                            popUpTo(navController.graph.startDestinationId) {
                                saveState = true
                            }
                            // Avoid multiple copies of the same destination when
                            // reselecting the same item
                            launchSingleTop = true
                            // Restore state when reselecting a previously selected item
                            restoreState = true
                        }
                    }
                }
            )
        }
    }
}

val defaultBottomNavItems = listOf(
    BottomNavItem(
        route = "home",
        icon = Icons.Default.Home,
        label = "Home"
    ),
    BottomNavItem(
        route = "dahabiyas",
        icon = Icons.Default.DirectionsBoat,
        label = "Dahabiyas"
    ),
    BottomNavItem(
        route = "packages",
        icon = Icons.Default.CardTravel,
        label = "Packages"
    ),
    BottomNavItem(
        route = "gallery",
        icon = Icons.Default.PhotoLibrary,
        label = "Gallery"
    ),
    BottomNavItem(
        route = "profile",
        icon = Icons.Default.Person,
        label = "Profile"
    )
)
