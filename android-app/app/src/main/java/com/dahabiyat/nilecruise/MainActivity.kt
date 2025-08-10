package com.dahabiyat.nilecruise

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.compose.rememberNavController
import com.dahabiyat.nilecruise.ui.navigation.DahabiyatNavigation
import com.dahabiyat.nilecruise.ui.theme.DahabiyatNileCruiseTheme
import com.dahabiyat.nilecruise.ui.viewmodels.MainViewModel
import dagger.hilt.android.AndroidEntryPoint
import timber.log.Timber

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    
    override fun onCreate(savedInstanceState: Bundle?) {
        // Install splash screen
        val splashScreen = installSplashScreen()
        
        super.onCreate(savedInstanceState)
        
        enableEdgeToEdge()
        
        setContent {
            DahabiyatNileCruiseTheme {
                DahabiyatApp()
            }
        }
        
        Timber.d("MainActivity created")
    }
}

@Composable
fun DahabiyatApp() {
    val navController = rememberNavController()
    val mainViewModel: MainViewModel = hiltViewModel()
    
    val isLoading by mainViewModel.isLoading.collectAsState()
    val isLoggedIn by mainViewModel.isLoggedIn.collectAsState()
    val currentUser by mainViewModel.currentUser.collectAsState()
    
    // Initialize app data
    LaunchedEffect(Unit) {
        mainViewModel.initializeApp()
    }
    
    Surface(
        modifier = Modifier.fillMaxSize(),
        color = MaterialTheme.colorScheme.background
    ) {
        DahabiyatNavigation(
            navController = navController,
            isLoading = isLoading,
            isLoggedIn = isLoggedIn,
            currentUser = currentUser
        )
    }
}
