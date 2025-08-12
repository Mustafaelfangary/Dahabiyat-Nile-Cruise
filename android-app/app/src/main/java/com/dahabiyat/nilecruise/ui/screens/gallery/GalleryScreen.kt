package com.dahabiyat.nilecruise.ui.screens.gallery

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
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
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.dahabiyat.nilecruise.data.models.GalleryImage

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun GalleryScreen(
    onImageClick: (GalleryImage) -> Unit,
    onFilterClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    // Sample data - in real app this would come from ViewModel
    val galleryImages = remember {
        listOf(
            GalleryImage(
                id = "1",
                url = "https://example.com/gallery1.jpg",
                title = "Sunset on the Nile",
                description = "Beautiful sunset view from our dahabiya deck",
                category = "Scenery"
            ),
            GalleryImage(
                id = "2",
                url = "https://example.com/gallery2.jpg",
                title = "Luxor Temple",
                description = "Ancient temple complex in Luxor",
                category = "Temples"
            ),
            GalleryImage(
                id = "3",
                url = "https://example.com/gallery3.jpg",
                title = "Dahabiya Interior",
                description = "Luxury cabin interior with traditional design",
                category = "Dahabiyas"
            ),
            GalleryImage(
                id = "4",
                url = "https://example.com/gallery4.jpg",
                title = "Valley of the Kings",
                description = "Exploring ancient pharaoh tombs",
                category = "Archaeological Sites"
            ),
            GalleryImage(
                id = "5",
                url = "https://example.com/gallery5.jpg",
                title = "Nubian Village",
                description = "Colorful houses in a traditional Nubian village",
                category = "Culture"
            ),
            GalleryImage(
                id = "6",
                url = "https://example.com/gallery6.jpg",
                title = "Felucca Sailing",
                description = "Traditional sailing boat on the Nile",
                category = "Activities"
            ),
            GalleryImage(
                id = "7",
                url = "https://example.com/gallery7.jpg",
                title = "Abu Simbel",
                description = "Magnificent temples of Ramesses II",
                category = "Temples"
            ),
            GalleryImage(
                id = "8",
                url = "https://example.com/gallery8.jpg",
                title = "Dining Experience",
                description = "Gourmet dining aboard our dahabiya",
                category = "Dining"
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
                    text = "Gallery",
                    fontWeight = FontWeight.Bold
                )
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
        
        // Gallery Grid
        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            modifier = Modifier.weight(1f),
            contentPadding = PaddingValues(16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(galleryImages) { image ->
                GalleryImageCard(
                    image = image,
                    onImageClick = { onImageClick(image) }
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun GalleryImageCard(
    image: GalleryImage,
    onImageClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        onClick = onImageClick,
        modifier = modifier.aspectRatio(1f),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
        shape = RoundedCornerShape(12.dp)
    ) {
        Box(
            modifier = Modifier.fillMaxSize()
        ) {
            AsyncImage(
                model = image.url,
                contentDescription = image.title,
                modifier = Modifier.fillMaxSize(),
                contentScale = ContentScale.Crop
            )
            
            // Gradient overlay
            Surface(
                modifier = Modifier.fillMaxSize(),
                color = androidx.compose.ui.graphics.Color.Black.copy(alpha = 0.3f)
            ) {}
            
            // Image info
            Column(
                modifier = Modifier
                    .align(Alignment.BottomStart)
                    .padding(12.dp)
            ) {
                if (image.category != null) {
                    Surface(
                        color = MaterialTheme.colorScheme.primary,
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text(
                            text = image.category,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onPrimary
                        )
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                }
                
                Text(
                    text = image.title ?: "Untitled",
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Bold,
                    color = androidx.compose.ui.graphics.Color.White
                )
            }
        }
    }
}


