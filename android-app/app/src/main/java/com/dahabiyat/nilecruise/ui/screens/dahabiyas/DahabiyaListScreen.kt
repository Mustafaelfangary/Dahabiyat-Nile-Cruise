package com.dahabiyat.nilecruise.ui.screens.dahabiyas

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.dahabiyat.nilecruise.data.models.Dahabiya
import com.dahabiyat.nilecruise.data.models.DahabiyaCategory
import com.dahabiyat.nilecruise.ui.components.DahabiyaCard
import com.dahabiyat.nilecruise.ui.components.LoadingScreen

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DahabiyaListScreen(
    onDahabiyaClick: (Dahabiya) -> Unit,
    onBackClick: () -> Unit,
    onFilterClick: () -> Unit,
    isLoading: Boolean = false,
    modifier: Modifier = Modifier
) {
    // Sample data - in real app this would come from ViewModel
    val dahabiyas = remember {
        listOf(
            Dahabiya(
                id = "1",
                name = "Queen Cleopatra",
                slug = "queen-cleopatra",
                description = "Luxury sailing boat with traditional Egyptian design and modern amenities",
                shortDescription = "Luxury sailing boat",
                pricePerDay = 250.0,
                capacity = 8,
                cabins = 4,
                crew = 6,
                length = 45.0,
                width = 8.5,
                yearBuilt = 2018,
                mainImage = "https://example.com/dahabiya1.jpg",
                isFeatured = true,
                rating = 4.8,
                reviewCount = 124,
                category = DahabiyaCategory.LUXURY,
                features = listOf("Air Conditioning", "Private Bathrooms", "Sun Deck", "Dining Area"),
                amenities = listOf("WiFi", "Mini Bar", "Safe", "Laundry Service")
            ),
            Dahabiya(
                id = "2",
                name = "Royal Cleopatra",
                slug = "royal-cleopatra",
                description = "Traditional Nile sailing boat with handcraft wooden boat design",
                shortDescription = "Traditional sailing boat",
                pricePerDay = 300.0,
                capacity = 16,
                cabins = 8,
                crew = 10,
                length = 52.0,
                width = 10.0,
                yearBuilt = 2020,
                mainImage = "https://example.com/dahabiya2.jpg",
                isFeatured = true,
                rating = 4.9,
                reviewCount = 89,
                category = DahabiyaCategory.PREMIUM,
                features = listOf("Air Conditioning", "Private Bathrooms", "Sun Deck", "Restaurant"),
                amenities = listOf("WiFi", "Spa", "Gym", "Library")
            ),
            Dahabiya(
                id = "3",
                name = "Princess Cleopatara",
                slug = "princess-cleopatara",
                description = "Deluxe Nile cruise experience with authentic Egyptian hospitality",
                shortDescription = "Deluxe cruise experience",
                pricePerDay = 200.0,
                capacity = 20,
                cabins = 10,
                crew = 12,
                length = 48.0,
                width = 9.0,
                yearBuilt = 2019,
                mainImage = "https://example.com/dahabiya3.jpg",
                isFeatured = false,
                rating = 4.6,
                reviewCount = 156,
                category = DahabiyaCategory.DELUXE,
                features = listOf("Air Conditioning", "Shared Bathrooms", "Sun Deck", "Dining Area"),
                amenities = listOf("WiFi", "Entertainment", "Games Room")
            ),
            Dahabiya(
                id = "4",
                name = "AZHAR I",
                slug = "azhar-i",
                description = "Boutique dahabiya offering intimate Nile cruise experience",
                shortDescription = "Boutique cruise experience",
                pricePerDay = 350.0,
                capacity = 17,
                cabins = 9,
                crew = 8,
                length = 50.0,
                width = 9.5,
                yearBuilt = 2021,
                mainImage = "https://example.com/dahabiya4.jpg",
                isFeatured = false,
                rating = 4.7,
                reviewCount = 67,
                category = DahabiyaCategory.BOUTIQUE,
                features = listOf("Air Conditioning", "Private Bathrooms", "Jacuzzi", "Fine Dining"),
                amenities = listOf("WiFi", "Concierge", "Butler Service", "Premium Bar")
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
                    text = "Dahabiyas",
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
                message = "Loading dahabiyas...",
                modifier = Modifier.weight(1f)
            )
        } else {
            // Results count
            Text(
                text = "${dahabiyas.size} dahabiyas available",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
            )
            
            // Dahabiyas list
            LazyColumn(
                modifier = Modifier.weight(1f),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                items(dahabiyas) { dahabiya ->
                    DahabiyaCard(
                        dahabiya = dahabiya,
                        onCardClick = { onDahabiyaClick(dahabiya) }
                    )
                }
            }
        }
    }
}
