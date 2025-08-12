package com.dahabiyat.nilecruise.ui.screens.home

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.dahabiyat.nilecruise.data.models.Dahabiya
import com.dahabiyat.nilecruise.data.models.Package
import com.dahabiyat.nilecruise.ui.components.DahabiyaCard
import com.dahabiyat.nilecruise.ui.components.PackageCard

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    onDahabiyaClick: (Dahabiya) -> Unit,
    onPackageClick: (Package) -> Unit,
    onViewAllDahabiyasClick: () -> Unit,
    onViewAllPackagesClick: () -> Unit,
    onSearchClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    // Sample data - in real app this would come from ViewModel
    val featuredDahabiyas = remember {
        listOf(
            Dahabiya(
                id = "1",
                name = "Queen Cleopatra",
                slug = "queen-cleopatra",
                description = "Luxury sailing boat with traditional Egyptian design",
                shortDescription = "Luxury sailing boat",
                pricePerDay = 250.0,
                capacity = 8,
                mainImage = "https://example.com/dahabiya1.jpg",
                isFeatured = true,
                rating = 4.8
            ),
            Dahabiya(
                id = "2",
                name = "Royal Cleopatra",
                slug = "royal-cleopatra",
                description = "Traditional Nile sailing boat with modern amenities",
                shortDescription = "Traditional sailing boat",
                pricePerDay = 300.0,
                capacity = 16,
                mainImage = "https://example.com/dahabiya2.jpg",
                isFeatured = true,
                rating = 4.9
            )
        )
    }
    
    val featuredPackages = remember {
        listOf(
            Package(
                id = "1",
                name = "Luxor to Aswan Adventure",
                slug = "luxor-aswan-adventure",
                description = "5-day luxury cruise from Luxor to Aswan",
                shortDescription = "5-day luxury cruise",
                price = 1250.0,
                durationDays = 5,
                durationNights = 4,
                maxGuests = 8,
                mainImageUrl = "https://example.com/package1.jpg",
                isFeatured = true,
                rating = 4.7
            )
        )
    }

    LazyColumn(
        modifier = modifier.fillMaxSize(),
        contentPadding = PaddingValues(bottom = 80.dp) // Account for bottom navigation
    ) {
        item {
            // Hero Section
            HeroSection(
                onSearchClick = onSearchClick,
                modifier = Modifier.fillMaxWidth()
            )
        }
        
        item {
            Spacer(modifier = Modifier.height(24.dp))
        }
        
        item {
            // Featured Dahabiyas Section
            SectionHeader(
                title = "Featured Dahabiyas",
                onViewAllClick = onViewAllDahabiyasClick,
                modifier = Modifier.padding(horizontal = 16.dp)
            )
        }
        
        item {
            Spacer(modifier = Modifier.height(16.dp))
        }
        
        item {
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                items(featuredDahabiyas) { dahabiya ->
                    DahabiyaCard(
                        dahabiya = dahabiya,
                        onCardClick = { onDahabiyaClick(dahabiya) },
                        modifier = Modifier.width(280.dp)
                    )
                }
            }
        }
        
        item {
            Spacer(modifier = Modifier.height(32.dp))
        }
        
        item {
            // Featured Packages Section
            SectionHeader(
                title = "Featured Packages",
                onViewAllClick = onViewAllPackagesClick,
                modifier = Modifier.padding(horizontal = 16.dp)
            )
        }
        
        item {
            Spacer(modifier = Modifier.height(16.dp))
        }
        
        item {
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                items(featuredPackages) { packageItem ->
                    PackageCard(
                        packageItem = packageItem,
                        onCardClick = { onPackageClick(packageItem) },
                        modifier = Modifier.width(280.dp)
                    )
                }
            }
        }
        
        item {
            Spacer(modifier = Modifier.height(32.dp))
        }
        
        item {
            // Why Choose Us Section
            WhyChooseUsSection(
                modifier = Modifier.padding(horizontal = 16.dp)
            )
        }
        
        item {
            Spacer(modifier = Modifier.height(32.dp))
        }
    }
}

@Composable
private fun HeroSection(
    onSearchClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .height(250.dp)
            .padding(16.dp),
        shape = RoundedCornerShape(16.dp)
    ) {
        Box(
            modifier = Modifier.fillMaxSize()
        ) {
            // Background gradient or image would go here
            Surface(
                modifier = Modifier.fillMaxSize(),
                color = MaterialTheme.colorScheme.primary
            ) {}
            
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(24.dp),
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "Discover the Magic of the Nile",
                    style = MaterialTheme.typography.headlineMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onPrimary,
                    textAlign = TextAlign.Center
                )
                
                Spacer(modifier = Modifier.height(8.dp))
                
                Text(
                    text = "Experience luxury aboard traditional dahabiyas",
                    style = MaterialTheme.typography.bodyLarge,
                    color = MaterialTheme.colorScheme.onPrimary.copy(alpha = 0.9f),
                    textAlign = TextAlign.Center
                )
                
                Spacer(modifier = Modifier.height(16.dp))
                
                Button(
                    onClick = onSearchClick,
                    colors = ButtonDefaults.buttonColors(
                        containerColor = MaterialTheme.colorScheme.surface,
                        contentColor = MaterialTheme.colorScheme.primary
                    )
                ) {
                    Icon(
                        imageVector = Icons.Default.Search,
                        contentDescription = "Search",
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Find Your Perfect Cruise")
                }
            }
        }
    }
}

@Composable
private fun SectionHeader(
    title: String,
    onViewAllClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = title,
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.Bold
        )
        
        TextButton(onClick = onViewAllClick) {
            Text("View All")
            Icon(
                imageVector = Icons.Default.ArrowForward,
                contentDescription = "View All",
                modifier = Modifier.size(16.dp)
            )
        }
    }
}

@Composable
private fun WhyChooseUsSection(
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier.fillMaxWidth()
    ) {
        Text(
            text = "Why Choose Dahabiyat Nile Cruise",
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 16.dp)
        )
        
        val features = listOf(
            Triple(Icons.Default.Star, "Luxury Experience", "Premium amenities and personalized service"),
            Triple(Icons.Default.History, "Authentic Culture", "Traditional sailing with modern comfort"),
            Triple(Icons.Default.Group, "Small Groups", "Intimate experience with limited guests")
        )
        
        features.forEach { (icon, title, description) ->
            FeatureItem(
                icon = icon,
                title = title,
                description = description,
                modifier = Modifier.padding(vertical = 8.dp)
            )
        }
    }
}

@Composable
private fun FeatureItem(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    title: String,
    description: String,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier.fillMaxWidth(),
        verticalAlignment = Alignment.Top
    ) {
        Icon(
            imageVector = icon,
            contentDescription = title,
            tint = MaterialTheme.colorScheme.primary,
            modifier = Modifier.size(24.dp)
        )
        
        Spacer(modifier = Modifier.width(16.dp))
        
        Column(
            modifier = Modifier.weight(1f)
        ) {
            Text(
                text = title,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Medium
            )
            
            Text(
                text = description,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}


