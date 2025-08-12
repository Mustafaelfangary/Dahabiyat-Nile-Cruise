package com.dahabiyat.nilecruise.ui.screens.packages

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.dahabiyat.nilecruise.data.models.Package
import com.dahabiyat.nilecruise.data.models.PackageCategory
import com.dahabiyat.nilecruise.data.models.PackageDifficulty
import com.dahabiyat.nilecruise.ui.components.PackageCard
import com.dahabiyat.nilecruise.ui.components.LoadingScreen

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PackageListScreen(
    onPackageClick: (Package) -> Unit,
    onBackClick: () -> Unit,
    onFilterClick: () -> Unit,
    isLoading: Boolean = false,
    modifier: Modifier = Modifier
) {
    // Sample data - in real app this would come from ViewModel
    val packages = remember {
        listOf(
            Package(
                id = "1",
                name = "Luxor to Aswan Adventure",
                slug = "luxor-aswan-adventure",
                description = "5-day luxury cruise from Luxor to Aswan visiting the most iconic temples and monuments",
                shortDescription = "5-day luxury cruise",
                price = 1250.0,
                originalPrice = 1500.0,
                durationDays = 5,
                durationNights = 4,
                maxGuests = 8,
                minGuests = 2,
                mainImageUrl = "https://example.com/package1.jpg",
                isFeatured = true,
                rating = 4.7,
                reviewCount = 89,
                category = PackageCategory.LUXURY,
                difficulty = PackageDifficulty.EASY,
                highlights = listOf(
                    "Visit Karnak and Luxor Temples",
                    "Explore Valley of the Kings",
                    "See Philae Temple in Aswan",
                    "Traditional felucca sailing"
                )
            ),
            Package(
                id = "2",
                name = "Classic Nile Discovery",
                slug = "classic-nile-discovery",
                description = "7-day comprehensive journey covering all major sites between Cairo and Aswan",
                shortDescription = "7-day comprehensive journey",
                price = 1800.0,
                durationDays = 7,
                durationNights = 6,
                maxGuests = 16,
                minGuests = 4,
                mainImageUrl = "https://example.com/package2.jpg",
                isFeatured = true,
                rating = 4.8,
                reviewCount = 124,
                category = PackageCategory.PREMIUM,
                difficulty = PackageDifficulty.MODERATE,
                highlights = listOf(
                    "Pyramids of Giza",
                    "Egyptian Museum",
                    "Abu Simbel Temples",
                    "Nubian Village visit"
                )
            ),
            Package(
                id = "3",
                name = "Romantic Nile Getaway",
                slug = "romantic-nile-getaway",
                description = "3-day intimate cruise perfect for couples seeking a romantic escape",
                shortDescription = "3-day romantic cruise",
                price = 850.0,
                durationDays = 3,
                durationNights = 2,
                maxGuests = 4,
                minGuests = 2,
                mainImageUrl = "https://example.com/package3.jpg",
                isFeatured = false,
                rating = 4.9,
                reviewCount = 45,
                category = PackageCategory.STANDARD,
                difficulty = PackageDifficulty.EASY,
                highlights = listOf(
                    "Sunset sailing",
                    "Private dining",
                    "Couples spa treatment",
                    "Temple of Kom Ombo"
                )
            ),
            Package(
                id = "4",
                name = "Explorer's Nile Expedition",
                slug = "explorers-nile-expedition",
                description = "10-day adventure for those seeking to explore every corner of ancient Egypt",
                shortDescription = "10-day adventure expedition",
                price = 2500.0,
                durationDays = 10,
                durationNights = 9,
                maxGuests = 12,
                minGuests = 6,
                mainImageUrl = "https://example.com/package4.jpg",
                isFeatured = false,
                rating = 4.6,
                reviewCount = 67,
                category = PackageCategory.CUSTOM,
                difficulty = PackageDifficulty.CHALLENGING,
                highlights = listOf(
                    "Off-the-beaten-path sites",
                    "Archaeological workshops",
                    "Desert camping",
                    "Local community visits"
                )
            )
        )
    }

    Column(
        modifier = modifier.fillMaxSize()
    ) {
        // Top App Bar
        TopAppBar(
            title = {
                Text(
                    text = "Packages",
                    fontWeight = FontWeight.Bold
                )
            },
            navigationIcon = {
                IconButton(onClick = onBackClick) {
                    Icon(
                        imageVector = Icons.Default.ArrowBack,
                        contentDescription = "Back"
                    )
                }
            },
            actions = {
                IconButton(onClick = onFilterClick) {
                    Icon(
                        imageVector = Icons.Default.FilterList,
                        contentDescription = "Filter"
                    )
                }
            }
        )
        
        if (isLoading) {
            LoadingScreen(
                message = "Loading packages...",
                modifier = Modifier.weight(1f)
            )
        } else {
            // Results count
            Text(
                text = "${packages.size} packages available",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
            )
            
            // Packages list
            LazyColumn(
                modifier = Modifier.weight(1f),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                items(packages) { packageItem ->
                    PackageCard(
                        packageItem = packageItem,
                        onCardClick = { onPackageClick(packageItem) }
                    )
                }
            }
        }
    }
}
