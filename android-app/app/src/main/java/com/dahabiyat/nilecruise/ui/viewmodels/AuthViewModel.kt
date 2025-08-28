package com.dahabiyat.nilecruise.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.dahabiyat.nilecruise.data.models.*
import com.dahabiyat.nilecruise.data.repository.AuthRepository
import com.dahabiyat.nilecruise.utils.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class AuthUiState(
    val isLoading: Boolean = false,
    val isLoggedIn: Boolean = false,
    val currentUser: User? = null,
    val error: String? = null,
    val successMessage: String? = null
)

@HiltViewModel
class AuthViewModel @Inject constructor(
    private val authRepository: AuthRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(AuthUiState())
    val uiState: StateFlow<AuthUiState> = _uiState.asStateFlow()

    fun signIn(email: String, password: String) {
        viewModelScope.launch {
            authRepository.signIn(email, password).collect { resource ->
                when (resource) {
                    is Resource.Loading -> {
                        _uiState.value = _uiState.value.copy(
                            isLoading = true,
                            error = null
                        )
                    }
                    is Resource.Success -> {
                        resource.data?.let { authResponse ->
                            authResponse.data?.let { authData ->
                                _uiState.value = _uiState.value.copy(
                                    isLoading = false,
                                    isLoggedIn = true,
                                    currentUser = authData.user,
                                    error = null,
                                    successMessage = "Welcome back!"
                                )
                                // TODO: Save token to secure storage
                            }
                        }
                    }
                    is Resource.Error -> {
                        _uiState.value = _uiState.value.copy(
                            isLoading = false,
                            error = resource.message,
                            isLoggedIn = false
                        )
                    }
                }
            }
        }
    }

    fun signUp(
        name: String,
        email: String,
        password: String,
        confirmPassword: String,
        phone: String? = null,
        nationality: String? = null
    ) {
        viewModelScope.launch {
            authRepository.signUp(
                name = name,
                email = email,
                password = password,
                confirmPassword = confirmPassword,
                phone = phone,
                nationality = nationality
            ).collect { resource ->
                when (resource) {
                    is Resource.Loading -> {
                        _uiState.value = _uiState.value.copy(
                            isLoading = true,
                            error = null
                        )
                    }
                    is Resource.Success -> {
                        resource.data?.let { authResponse ->
                            authResponse.data?.let { authData ->
                                _uiState.value = _uiState.value.copy(
                                    isLoading = false,
                                    isLoggedIn = true,
                                    currentUser = authData.user,
                                    error = null,
                                    successMessage = "Account created successfully!"
                                )
                                // TODO: Save token to secure storage
                            }
                        }
                    }
                    is Resource.Error -> {
                        _uiState.value = _uiState.value.copy(
                            isLoading = false,
                            error = resource.message,
                            isLoggedIn = false
                        )
                    }
                }
            }
        }
    }

    fun verifyEmail(email: String, token: String) {
        viewModelScope.launch {
            authRepository.verifyEmail(email, token).collect { resource ->
                when (resource) {
                    is Resource.Loading -> {
                        _uiState.value = _uiState.value.copy(
                            isLoading = true,
                            error = null
                        )
                    }
                    is Resource.Success -> {
                        _uiState.value = _uiState.value.copy(
                            isLoading = false,
                            error = null,
                            successMessage = resource.data ?: "Email verified successfully"
                        )
                    }
                    is Resource.Error -> {
                        _uiState.value = _uiState.value.copy(
                            isLoading = false,
                            error = resource.message
                        )
                    }
                }
            }
        }
    }

    fun forgotPassword(email: String) {
        viewModelScope.launch {
            authRepository.forgotPassword(email).collect { resource ->
                when (resource) {
                    is Resource.Loading -> {
                        _uiState.value = _uiState.value.copy(
                            isLoading = true,
                            error = null
                        )
                    }
                    is Resource.Success -> {
                        _uiState.value = _uiState.value.copy(
                            isLoading = false,
                            error = null,
                            successMessage = resource.data ?: "Password reset email sent"
                        )
                    }
                    is Resource.Error -> {
                        _uiState.value = _uiState.value.copy(
                            isLoading = false,
                            error = resource.message
                        )
                    }
                }
            }
        }
    }

    fun resetPassword(email: String, token: String, password: String, confirmPassword: String) {
        viewModelScope.launch {
            authRepository.resetPassword(email, token, password, confirmPassword).collect { resource ->
                when (resource) {
                    is Resource.Loading -> {
                        _uiState.value = _uiState.value.copy(
                            isLoading = true,
                            error = null
                        )
                    }
                    is Resource.Success -> {
                        _uiState.value = _uiState.value.copy(
                            isLoading = false,
                            error = null,
                            successMessage = resource.data ?: "Password reset successfully"
                        )
                    }
                    is Resource.Error -> {
                        _uiState.value = _uiState.value.copy(
                            isLoading = false,
                            error = resource.message
                        )
                    }
                }
            }
        }
    }

    fun signOut() {
        viewModelScope.launch {
            // TODO: Clear tokens from secure storage
            _uiState.value = AuthUiState() // Reset to initial state
        }
    }

    fun clearError() {
        _uiState.value = _uiState.value.copy(error = null)
    }

    fun clearSuccessMessage() {
        _uiState.value = _uiState.value.copy(successMessage = null)
    }

    // Validation helpers
    fun validateEmail(email: String): String? {
        return when {
            email.isBlank() -> "Email is required"
            !android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches() -> "Invalid email format"
            else -> null
        }
    }

    fun validatePassword(password: String): String? {
        return when {
            password.isBlank() -> "Password is required"
            password.length < 6 -> "Password must be at least 6 characters"
            else -> null
        }
    }

    fun validateName(name: String): String? {
        return when {
            name.isBlank() -> "Name is required"
            name.length < 2 -> "Name must be at least 2 characters"
            else -> null
        }
    }

    fun validatePasswordConfirmation(password: String, confirmPassword: String): String? {
        return when {
            confirmPassword.isBlank() -> "Please confirm your password"
            password != confirmPassword -> "Passwords do not match"
            else -> null
        }
    }
}
