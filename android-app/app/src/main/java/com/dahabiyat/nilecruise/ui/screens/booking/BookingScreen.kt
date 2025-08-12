package com.dahabiyat.nilecruise.ui.screens.booking

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.dahabiyat.nilecruise.data.models.ContactInfo
import com.dahabiyat.nilecruise.data.models.GuestDetail

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BookingScreen(
    itemName: String,
    itemPrice: Double,
    onBackClick: () -> Unit,
    onConfirmBooking: (
        startDate: String,
        endDate: String,
        guests: Int,
        guestDetails: List<GuestDetail>,
        contactInfo: ContactInfo,
        specialRequests: String
    ) -> Unit,
    isLoading: Boolean = false,
    modifier: Modifier = Modifier
) {
    var startDate by remember { mutableStateOf("") }
    var endDate by remember { mutableStateOf("") }
    var numberOfGuests by remember { mutableStateOf(2) }
    var contactEmail by remember { mutableStateOf("") }
    var contactPhone by remember { mutableStateOf("") }
    var specialRequests by remember { mutableStateOf("") }
    
    var emailError by remember { mutableStateOf<String?>(null) }
    var phoneError by remember { mutableStateOf<String?>(null) }
    var dateError by remember { mutableStateOf<String?>(null) }

    Column(
        modifier = modifier.fillMaxSize()
    ) {
        // Top App Bar
        TopAppBar(
            title = {
                Text(
                    text = "Book Your Trip",
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
            }
        )
        
        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Booking Summary Card
            BookingSummaryCard(
                itemName = itemName,
                itemPrice = itemPrice,
                numberOfGuests = numberOfGuests
            )
            
            // Date Selection
            DateSelectionSection(
                startDate = startDate,
                endDate = endDate,
                onStartDateChange = { 
                    startDate = it
                    dateError = null
                },
                onEndDateChange = { 
                    endDate = it
                    dateError = null
                },
                dateError = dateError
            )
            
            // Guest Count
            GuestCountSection(
                numberOfGuests = numberOfGuests,
                onGuestCountChange = { numberOfGuests = it }
            )
            
            // Contact Information
            ContactInformationSection(
                email = contactEmail,
                phone = contactPhone,
                onEmailChange = { 
                    contactEmail = it
                    emailError = null
                },
                onPhoneChange = { 
                    contactPhone = it
                    phoneError = null
                },
                emailError = emailError,
                phoneError = phoneError
            )
            
            // Special Requests
            SpecialRequestsSection(
                specialRequests = specialRequests,
                onSpecialRequestsChange = { specialRequests = it }
            )
            
            Spacer(modifier = Modifier.height(80.dp)) // Account for bottom button
        }
        
        // Bottom Confirm Button
        Surface(
            modifier = Modifier.fillMaxWidth(),
            shadowElevation = 8.dp
        ) {
            Button(
                onClick = {
                    // Basic validation
                    var hasError = false
                    
                    if (contactEmail.isBlank()) {
                        emailError = "Email is required"
                        hasError = true
                    }
                    
                    if (contactPhone.isBlank()) {
                        phoneError = "Phone is required"
                        hasError = true
                    }
                    
                    if (startDate.isBlank() || endDate.isBlank()) {
                        dateError = "Please select travel dates"
                        hasError = true
                    }
                    
                    if (!hasError) {
                        // Create guest details (simplified for now)
                        val guestDetails = (1..numberOfGuests).map { 
                            GuestDetail(
                                firstName = "Guest",
                                lastName = "$it"
                            )
                        }
                        
                        val contactInfo = ContactInfo(
                            email = contactEmail,
                            phone = contactPhone
                        )
                        
                        onConfirmBooking(
                            startDate,
                            endDate,
                            numberOfGuests,
                            guestDetails,
                            contactInfo,
                            specialRequests
                        )
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                enabled = !isLoading
            ) {
                if (isLoading) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(20.dp),
                        color = MaterialTheme.colorScheme.onPrimary
                    )
                } else {
                    Text(
                        text = "Confirm Booking - $${(itemPrice * numberOfGuests).toInt()}",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }
    }
}

@Composable
private fun BookingSummaryCard(
    itemName: String,
    itemPrice: Double,
    numberOfGuests: Int,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = "Booking Summary",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold
            )
            
            Spacer(modifier = Modifier.height(12.dp))
            
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = itemName,
                    style = MaterialTheme.typography.bodyLarge,
                    modifier = Modifier.weight(1f)
                )
                Text(
                    text = "$${itemPrice.toInt()}",
                    style = MaterialTheme.typography.bodyLarge,
                    fontWeight = FontWeight.Medium
                )
            }
            
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "Guests: $numberOfGuests",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Text(
                    text = "Total: $${(itemPrice * numberOfGuests).toInt()}",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun DateSelectionSection(
    startDate: String,
    endDate: String,
    onStartDateChange: (String) -> Unit,
    onEndDateChange: (String) -> Unit,
    dateError: String?,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier.fillMaxWidth()
    ) {
        Text(
            text = "Travel Dates",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 8.dp)
        )
        
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            OutlinedTextField(
                value = startDate,
                onValueChange = onStartDateChange,
                label = { Text("Start Date") },
                placeholder = { Text("YYYY-MM-DD") },
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Default.DateRange,
                        contentDescription = "Start Date"
                    )
                },
                modifier = Modifier.weight(1f),
                singleLine = true,
                isError = dateError != null
            )
            
            OutlinedTextField(
                value = endDate,
                onValueChange = onEndDateChange,
                label = { Text("End Date") },
                placeholder = { Text("YYYY-MM-DD") },
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Default.DateRange,
                        contentDescription = "End Date"
                    )
                },
                modifier = Modifier.weight(1f),
                singleLine = true,
                isError = dateError != null
            )
        }
        
        dateError?.let {
            Text(
                text = it,
                color = MaterialTheme.colorScheme.error,
                style = MaterialTheme.typography.bodySmall,
                modifier = Modifier.padding(top = 4.dp)
            )
        }
    }
}

@Composable
private fun GuestCountSection(
    numberOfGuests: Int,
    onGuestCountChange: (Int) -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier.fillMaxWidth()
    ) {
        Text(
            text = "Number of Guests",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 8.dp)
        )
        
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            IconButton(
                onClick = { if (numberOfGuests > 1) onGuestCountChange(numberOfGuests - 1) }
            ) {
                Icon(
                    imageVector = Icons.Default.Remove,
                    contentDescription = "Decrease guests"
                )
            }
            
            Text(
                text = numberOfGuests.toString(),
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold
            )
            
            IconButton(
                onClick = { onGuestCountChange(numberOfGuests + 1) }
            ) {
                Icon(
                    imageVector = Icons.Default.Add,
                    contentDescription = "Increase guests"
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun ContactInformationSection(
    email: String,
    phone: String,
    onEmailChange: (String) -> Unit,
    onPhoneChange: (String) -> Unit,
    emailError: String?,
    phoneError: String?,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text(
            text = "Contact Information",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold
        )
        
        OutlinedTextField(
            value = email,
            onValueChange = onEmailChange,
            label = { Text("Email") },
            leadingIcon = {
                Icon(
                    imageVector = Icons.Default.Email,
                    contentDescription = "Email"
                )
            },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
            isError = emailError != null,
            supportingText = emailError?.let { { Text(it) } },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true
        )
        
        OutlinedTextField(
            value = phone,
            onValueChange = onPhoneChange,
            label = { Text("Phone") },
            leadingIcon = {
                Icon(
                    imageVector = Icons.Default.Phone,
                    contentDescription = "Phone"
                )
            },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
            isError = phoneError != null,
            supportingText = phoneError?.let { { Text(it) } },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun SpecialRequestsSection(
    specialRequests: String,
    onSpecialRequestsChange: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier.fillMaxWidth()
    ) {
        Text(
            text = "Special Requests (Optional)",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 8.dp)
        )
        
        OutlinedTextField(
            value = specialRequests,
            onValueChange = onSpecialRequestsChange,
            label = { Text("Any special requests or dietary requirements?") },
            modifier = Modifier.fillMaxWidth(),
            minLines = 3,
            maxLines = 5
        )
    }
}
