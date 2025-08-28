package com.dahabiyat.nilecruise.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.dahabiyat.nilecruise.data.models.*
import com.dahabiyat.nilecruise.data.repository.DahabiyaRepository
import com.dahabiyat.nilecruise.utils.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class HomeUiState(
    val isLoading: Boolean = false,
    val featuredDahabiyas: List<Dahabiya> = emptyList(),
    val featuredPackages: List<Package> = emptyList(),
    val featuredBlogs: List<BlogPost> = emptyList(),
    val testimonials: List<Review> = emptyList(),
    val error: String? = null,
    val isRefreshing: Boolean = false
)

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val dahabiyaRepository: DahabiyaRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(HomeUiState())
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()

    init {
        loadHomeData()
    }

    fun loadHomeData() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            
            try {
                // Load featured dahabiyas
                dahabiyaRepository.getFeaturedDahabiyas(5).collect { resource ->
                    when (resource) {
                        is Resource.Success -> {
                            _uiState.value = _uiState.value.copy(
                                featuredDahabiyas = resource.data ?: emptyList(),
                                isLoading = false
                            )
                        }
                        is Resource.Error -> {
                            _uiState.value = _uiState.value.copy(
                                error = resource.message,
                                isLoading = false
                            )
                        }
                        is Resource.Loading -> {
                            // Loading state already set
                        }
                    }
                }
                
                // TODO: Load other data (packages, blogs, testimonials)
                // This would be implemented when those repositories are created
                
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    error = e.localizedMessage ?: "Unknown error occurred",
                    isLoading = false
                )
            }
        }
    }

    fun refresh() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isRefreshing = true)
            loadHomeData()
            _uiState.value = _uiState.value.copy(isRefreshing = false)
        }
    }

    fun clearError() {
        _uiState.value = _uiState.value.copy(error = null)
    }
}
