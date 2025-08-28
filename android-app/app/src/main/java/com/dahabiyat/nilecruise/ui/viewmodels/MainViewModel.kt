package com.dahabiyat.nilecruise.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.dahabiyat.nilecruise.data.models.User
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class MainViewModel @Inject constructor(
    // TODO: Inject AuthRepository when implemented
) : ViewModel() {

    private val _isLoading = MutableStateFlow(true)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _isLoggedIn = MutableStateFlow(false)
    val isLoggedIn: StateFlow<Boolean> = _isLoggedIn.asStateFlow()

    private val _currentUser = MutableStateFlow<User?>(null)
    val currentUser: StateFlow<User?> = _currentUser.asStateFlow()

    fun initializeApp() {
        viewModelScope.launch {
            // Simulate app initialization
            delay(2000)
            
            // TODO: Check if user is logged in from SharedPreferences/DataStore
            // TODO: Load user data if logged in
            
            _isLoading.value = false
        }
    }

    fun signOut() {
        viewModelScope.launch {
            // TODO: Clear user data and tokens
            _isLoggedIn.value = false
            _currentUser.value = null
        }
    }
}
