package com.dahabiyat.nilecruise.ui.screens.testing

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.dahabiyat.nilecruise.ui.theme.*
import com.dahabiyat.nilecruise.utils.TestResult
import com.dahabiyat.nilecruise.utils.TestSuite

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ApiTestingScreen(
    onBackClick: () -> Unit = {},
    viewModel: ApiTestingViewModel = viewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = { 
                    Text(
                        "🧪 API Testing",
                        style = MaterialTheme.typography.headlineSmall,
                        fontWeight = FontWeight.Bold
                    )
                },
                navigationIcon = {
                    IconButton(onClick = onBackClick) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = OceanBlue,
                    titleContentColor = Color.White,
                    navigationIconContentColor = Color.White
                )
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Header Card
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = PapyrusBeige)
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(
                        "🔗 Live Backend Testing",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold,
                        color = DeepBlue
                    )
                    Text(
                        "Testing connection to: https://www.dahabiyatnilecruise.com",
                        style = MaterialTheme.typography.bodyMedium,
                        color = DarkGray
                    )
                }
            }
            
            // Test Controls
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Button(
                    onClick = { viewModel.runBasicTests() },
                    modifier = Modifier.weight(1f),
                    enabled = !uiState.isLoading,
                    colors = ButtonDefaults.buttonColors(containerColor = OceanBlue)
                ) {
                    if (uiState.isLoading) {
                        CircularProgressIndicator(
                            modifier = Modifier.size(16.dp),
                            color = Color.White,
                            strokeWidth = 2.dp
                        )
                    } else {
                        Icon(Icons.Default.PlayArrow, contentDescription = null)
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Run Tests")
                }
                
                Button(
                    onClick = { viewModel.clearResults() },
                    modifier = Modifier.weight(1f),
                    enabled = !uiState.isLoading && uiState.testSuite != null,
                    colors = ButtonDefaults.buttonColors(containerColor = Gray)
                ) {
                    Icon(Icons.Default.Clear, contentDescription = null)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Clear")
                }
            }
            
            // Test Results Summary
            uiState.testSuite?.let { testSuite ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(
                        containerColor = if (testSuite.overallSuccess) Success.copy(alpha = 0.1f) else Error.copy(alpha = 0.1f)
                    )
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                "Test Results",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                "${testSuite.successCount}/${testSuite.totalCount} tests passed",
                                style = MaterialTheme.typography.bodyMedium
                            )
                        }
                        
                        Icon(
                            if (testSuite.overallSuccess) Icons.Default.CheckCircle else Icons.Default.Error,
                            contentDescription = null,
                            tint = if (testSuite.overallSuccess) Success else Error,
                            modifier = Modifier.size(32.dp)
                        )
                    }
                }
            }
            
            // Loading State
            if (uiState.isLoading) {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = Info.copy(alpha = 0.1f))
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        CircularProgressIndicator(
                            modifier = Modifier.size(24.dp),
                            color = OceanBlue,
                            strokeWidth = 3.dp
                        )
                        Text(
                            "Running API tests...",
                            style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.Medium
                        )
                    }
                }
            }
            
            // Test Results List
            uiState.testSuite?.let { testSuite ->
                LazyColumn(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(testSuite.results) { result ->
                        TestResultCard(result = result)
                    }
                }
            }
            
            // Error State
            uiState.error?.let { error ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = Error.copy(alpha = 0.1f))
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Icon(
                                Icons.Default.Error,
                                contentDescription = null,
                                tint = Error
                            )
                            Text(
                                "Error",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold,
                                color = Error
                            )
                        }
                        Text(
                            error,
                            style = MaterialTheme.typography.bodyMedium
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun TestResultCard(result: TestResult) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = if (result.success) Success.copy(alpha = 0.1f) else Error.copy(alpha = 0.1f)
        )
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Icon(
                        if (result.success) Icons.Default.CheckCircle else Icons.Default.Error,
                        contentDescription = null,
                        tint = if (result.success) Success else Error,
                        modifier = Modifier.size(20.dp)
                    )
                    Text(
                        result.endpoint,
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.Bold
                    )
                }
                
                Badge(
                    containerColor = if (result.statusCode in 200..299) Success else Error
                ) {
                    Text(
                        result.statusCode.toString(),
                        color = Color.White,
                        style = MaterialTheme.typography.labelSmall
                    )
                }
            }
            
            Text(
                result.message,
                style = MaterialTheme.typography.bodyMedium
            )
            
            // Show response data preview if available
            result.data?.let { data ->
                if (data.isNotEmpty() && data.length > 50) {
                    Text(
                        "Response: ${data.take(100)}${if (data.length > 100) "..." else ""}",
                        style = MaterialTheme.typography.bodySmall,
                        color = DarkGray
                    )
                }
            }
        }
    }
}

// ViewModel for API Testing
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import com.dahabiyat.nilecruise.utils.ApiTester

class ApiTestingViewModel : ViewModel() {
    
    private val _uiState = MutableStateFlow(ApiTestingUiState())
    val uiState: StateFlow<ApiTestingUiState> = _uiState.asStateFlow()
    
    fun runBasicTests() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(
                isLoading = true,
                error = null,
                testSuite = null
            )
            
            try {
                val testSuite = ApiTester.runComprehensiveTests()
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    testSuite = testSuite
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = "Failed to run tests: ${e.message}"
                )
            }
        }
    }
    
    fun clearResults() {
        _uiState.value = _uiState.value.copy(
            testSuite = null,
            error = null
        )
    }
}

data class ApiTestingUiState(
    val isLoading: Boolean = false,
    val testSuite: TestSuite? = null,
    val error: String? = null
)
