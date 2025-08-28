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
class PackageRepository @Inject constructor(
    private val apiService: DahabiyatApiService
) {
    
    suspend fun getPackages(
        page: Int = 1,
        limit: Int = 20,
        featured: Boolean? = null,
        minPrice: Double? = null,
        maxPrice: Double? = null,
        duration: Int? = null,
        category: String? = null,
        search: String? = null
    ): Flow<Resource<PaginatedResponse<Package>>> = flow {
        try {
            emit(Resource.Loading())
            val response = apiService.getPackages(
                page = page,
                limit = limit,
                featured = featured,
                minPrice = minPrice,
                maxPrice = maxPrice,
                duration = duration,
                category = category,
                search = search
            )
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
    
    suspend fun getPackageById(id: String): Flow<Resource<Package>> = flow {
        try {
            emit(Resource.Loading())
            val response = apiService.getPackageById(id)
            if (response.isSuccessful) {
                response.body()?.let { apiResponse ->
                    if (apiResponse.success && apiResponse.data != null) {
                        emit(Resource.Success(apiResponse.data))
                    } else {
                        emit(Resource.Error(apiResponse.error ?: "Package not found"))
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
    
    suspend fun getFeaturedPackages(limit: Int = 5): Flow<Resource<List<Package>>> = flow {
        try {
            emit(Resource.Loading())
            val response = apiService.getFeaturedPackages(limit)
            if (response.isSuccessful) {
                response.body()?.let { apiResponse ->
                    if (apiResponse.success && apiResponse.data != null) {
                        emit(Resource.Success(apiResponse.data))
                    } else {
                        emit(Resource.Error(apiResponse.error ?: "No featured packages found"))
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
    
    suspend fun getPackageReviews(
        packageId: String,
        page: Int = 1,
        limit: Int = 10
    ): Flow<Resource<PaginatedResponse<Review>>> = flow {
        try {
            emit(Resource.Loading())
            val response = apiService.getPackageReviews(packageId, page, limit)
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
}
