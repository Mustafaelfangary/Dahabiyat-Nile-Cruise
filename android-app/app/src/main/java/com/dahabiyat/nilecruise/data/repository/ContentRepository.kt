package com.dahabiyat.nilecruise.data.repository

import com.dahabiyat.nilecruise.data.api.DahabiyatApiService
import com.dahabiyat.nilecruise.data.models.*
import com.dahabiyat.nilecruise.utils.Resource
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import retrofit2.HttpException
import java.io.IOException
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ContentRepository @Inject constructor(
    private val apiService: DahabiyatApiService
) {
    
    suspend fun getBlogPosts(
        page: Int = 1,
        limit: Int = 20,
        category: String? = null,
        tag: String? = null,
        search: String? = null
    ): Flow<Resource<PaginatedResponse<BlogPost>>> = flow {
        try {
            emit(Resource.Loading())
            val response = apiService.getBlogPosts(page, limit, category, tag, search)
            if (response.isSuccessful) {
                response.body()?.let { paginatedResponse ->
                    emit(Resource.Success(paginatedResponse))
                } ?: emit(Resource.Error("Empty response"))
            } else {
                emit(Resource.Error("HTTP ${response.code()}: ${response.message()}"))
            }
        } catch (e: HttpException) {
            emit(Resource.Error("Network error: ${e.localizedMessage}"))
        } catch (e: IOException) {
            emit(Resource.Error("Connection error: ${e.localizedMessage}"))
        } catch (e: Exception) {
            emit(Resource.Error("Unexpected error: ${e.localizedMessage}"))
        }
    }
    
    suspend fun getBlogPostById(id: String): Flow<Resource<BlogPost>> = flow {
        try {
            emit(Resource.Loading())
            val response = apiService.getBlogPostById(id)
            if (response.isSuccessful) {
                response.body()?.let { apiResponse ->
                    if (apiResponse.success && apiResponse.data != null) {
                        emit(Resource.Success(apiResponse.data))
                    } else {
                        emit(Resource.Error(apiResponse.error ?: "Blog post not found"))
                    }
                } ?: emit(Resource.Error("Empty response"))
            } else {
                emit(Resource.Error("HTTP ${response.code()}: ${response.message()}"))
            }
        } catch (e: HttpException) {
            emit(Resource.Error("Network error: ${e.localizedMessage}"))
        } catch (e: IOException) {
            emit(Resource.Error("Connection error: ${e.localizedMessage}"))
        } catch (e: Exception) {
            emit(Resource.Error("Unexpected error: ${e.localizedMessage}"))
        }
    }
    
    suspend fun getGalleryImages(
        page: Int = 1,
        limit: Int = 20,
        category: String? = null
    ): Flow<Resource<PaginatedResponse<GalleryImage>>> = flow {
        try {
            emit(Resource.Loading())
            val response = apiService.getGalleryImages(page, limit, category)
            if (response.isSuccessful) {
                response.body()?.let { paginatedResponse ->
                    emit(Resource.Success(paginatedResponse))
                } ?: emit(Resource.Error("Empty response"))
            } else {
                emit(Resource.Error("HTTP ${response.code()}: ${response.message()}"))
            }
        } catch (e: HttpException) {
            emit(Resource.Error("Network error: ${e.localizedMessage}"))
        } catch (e: IOException) {
            emit(Resource.Error("Connection error: ${e.localizedMessage}"))
        } catch (e: Exception) {
            emit(Resource.Error("Unexpected error: ${e.localizedMessage}"))
        }
    }
    
    suspend fun getReviews(
        page: Int = 1,
        limit: Int = 20,
        dahabiyaId: String? = null,
        packageId: String? = null,
        verified: Boolean? = null
    ): Flow<Resource<PaginatedResponse<Review>>> = flow {
        try {
            emit(Resource.Loading())
            val response = apiService.getReviews(page, limit, dahabiyaId, packageId, verified)
            if (response.isSuccessful) {
                response.body()?.let { paginatedResponse ->
                    emit(Resource.Success(paginatedResponse))
                } ?: emit(Resource.Error("Empty response"))
            } else {
                emit(Resource.Error("HTTP ${response.code()}: ${response.message()}"))
            }
        } catch (e: HttpException) {
            emit(Resource.Error("Network error: ${e.localizedMessage}"))
        } catch (e: IOException) {
            emit(Resource.Error("Connection error: ${e.localizedMessage}"))
        } catch (e: Exception) {
            emit(Resource.Error("Unexpected error: ${e.localizedMessage}"))
        }
    }
    
    suspend fun submitContactForm(
        name: String,
        email: String,
        phone: String? = null,
        subject: String,
        message: String
    ): Flow<Resource<String>> = flow {
        try {
            emit(Resource.Loading())
            val request = mapOf(
                "name" to name,
                "email" to email,
                "phone" to (phone ?: ""),
                "subject" to subject,
                "message" to message
            )
            val response = apiService.submitContactForm(request)
            if (response.isSuccessful) {
                response.body()?.let { apiResponse ->
                    if (apiResponse.success) {
                        emit(Resource.Success(apiResponse.data ?: "Message sent successfully"))
                    } else {
                        emit(Resource.Error(apiResponse.error ?: "Failed to send message"))
                    }
                } ?: emit(Resource.Error("Empty response"))
            } else {
                emit(Resource.Error("HTTP ${response.code()}: ${response.message()}"))
            }
        } catch (e: HttpException) {
            emit(Resource.Error("Network error: ${e.localizedMessage}"))
        } catch (e: IOException) {
            emit(Resource.Error("Connection error: ${e.localizedMessage}"))
        } catch (e: Exception) {
            emit(Resource.Error("Unexpected error: ${e.localizedMessage}"))
        }
    }
}
