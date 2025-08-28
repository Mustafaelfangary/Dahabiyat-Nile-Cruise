package com.dahabiyat.nilecruise.ui.screens.about

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.dahabiyat.nilecruise.ui.components.EgyptianHeader
import com.dahabiyat.nilecruise.ui.components.EgyptianSectionHeader
import com.dahabiyat.nilecruise.ui.theme.DahabiyatColors

@Composable
fun AboutScreen(
    onBackClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    LazyColumn(
        modifier = modifier.fillMaxSize()
    ) {
        item {
            EgyptianHeader(
                title = "About Us",
                subtitle = "Discover the story behind Dahabiyat Nile Cruise",
                onBackClick = onBackClick,
                backgroundImage = "https://example.com/about-hero.jpg"
            )
        }
        
        item {
            Spacer(modifier = Modifier.height(24.dp))
        }
        
        item {
            // Our Story Section
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
                shape = RoundedCornerShape(16.dp)
            ) {
                Column(
                    modifier = Modifier.padding(24.dp)
                ) {
                    Text(
                        text = "Our Story",
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Bold,
                        color = DahabiyatColors.DeepBlue,
                        modifier = Modifier.padding(bottom = 16.dp)
                    )
                    
                    Text(
                        text = "For over two decades, Dahabiyat Nile Cruise has been crafting unforgettable journeys along the legendary Nile River. Our passion for Egypt's rich history and culture drives us to provide authentic experiences aboard traditional dahabiyas, combining ancient elegance with modern luxury.",
                        style = MaterialTheme.typography.bodyLarge,
                        color = MaterialTheme.colorScheme.onSurface,
                        lineHeight = MaterialTheme.typography.bodyLarge.lineHeight * 1.2
                    )
                    
                    Spacer(modifier = Modifier.height(16.dp))
                    
                    Text(
                        text = "Each of our carefully restored dahabiyas tells a story of Egypt's maritime heritage, offering intimate cruises that connect you with the timeless beauty of the Nile and its ancient treasures.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        lineHeight = MaterialTheme.typography.bodyMedium.lineHeight * 1.2
                    )
                }
            }
        }
        
        item {
            Spacer(modifier = Modifier.height(24.dp))
        }
        
        item {
            EgyptianSectionHeader(
                title = "Why Choose Us",
                subtitle = "What makes us special",
                icon = Icons.Default.Star,
                modifier = Modifier.padding(horizontal = 16.dp)
            )
        }
        
        item {
            Spacer(modifier = Modifier.height(16.dp))
        }
        
        item {
            // Features Grid
            Column(
                modifier = Modifier.padding(horizontal = 16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                val features = listOf(
                    Triple(Icons.Default.Sailing, "Authentic Dahabiyas", "Traditional sailing boats with modern amenities"),
                    Triple(Icons.Default.Group, "Small Groups", "Intimate experiences with maximum 16 guests"),
                    Triple(Icons.Default.Restaurant, "Gourmet Dining", "Fresh local cuisine prepared by expert chefs"),
                    Triple(Icons.Default.Tour, "Expert Guides", "Knowledgeable Egyptologists and local guides"),
                    Triple(Icons.Default.Spa, "Luxury Comfort", "Premium accommodations and personalized service"),
                    Triple(Icons.Default.Eco, "Eco-Friendly", "Sustainable tourism practices")
                )
                
                features.chunked(2).forEach { rowFeatures ->
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        rowFeatures.forEach { (icon, title, description) ->
                            FeatureCard(
                                icon = icon,
                                title = title,
                                description = description,
                                modifier = Modifier.weight(1f)
                            )
                        }
                        // Fill remaining space if odd number of items
                        if (rowFeatures.size == 1) {
                            Spacer(modifier = Modifier.weight(1f))
                        }
                    }
                }
            }
        }
        
        item {
            Spacer(modifier = Modifier.height(24.dp))
        }
        
        item {
            EgyptianSectionHeader(
                title = "Our Mission",
                subtitle = "What drives us forward",
                icon = Icons.Default.Flag,
                modifier = Modifier.padding(horizontal = 16.dp)
            )
        }
        
        item {
            Spacer(modifier = Modifier.height(16.dp))
        }
        
        item {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                colors = CardDefaults.cardColors(
                    containerColor = DahabiyatColors.OceanBlue.copy(alpha = 0.1f)
                ),
                shape = RoundedCornerShape(16.dp)
            ) {
                Column(
                    modifier = Modifier.padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = "𓎢𓃭𓅂𓅱𓊪𓄿𓏏𓂋𓄿",
                        style = MaterialTheme.typography.headlineLarge,
                        color = DahabiyatColors.Gold,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.padding(bottom = 16.dp)
                    )
                    
                    Text(
                        text = "To preserve and share Egypt's magnificent heritage through authentic Nile experiences, creating lasting memories while supporting local communities and sustainable tourism.",
                        style = MaterialTheme.typography.bodyLarge,
                        textAlign = TextAlign.Center,
                        color = MaterialTheme.colorScheme.onSurface,
                        lineHeight = MaterialTheme.typography.bodyLarge.lineHeight * 1.3
                    )
                }
            }
        }
        
        item {
            Spacer(modifier = Modifier.height(32.dp))
        }
    }
}

@Composable
private fun FeatureCard(
    icon: ImageVector,
    title: String,
    description: String,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        shape = RoundedCornerShape(12.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(
                imageVector = icon,
                contentDescription = title,
                tint = DahabiyatColors.OceanBlue,
                modifier = Modifier.size(32.dp)
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Text(
                text = title,
                style = MaterialTheme.typography.titleSmall,
                fontWeight = FontWeight.Bold,
                textAlign = TextAlign.Center,
                color = MaterialTheme.colorScheme.onSurface
            )
            
            Spacer(modifier = Modifier.height(4.dp))
            
            Text(
                text = description,
                style = MaterialTheme.typography.bodySmall,
                textAlign = TextAlign.Center,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                lineHeight = MaterialTheme.typography.bodySmall.lineHeight * 1.2
            )
        }
    }
}
