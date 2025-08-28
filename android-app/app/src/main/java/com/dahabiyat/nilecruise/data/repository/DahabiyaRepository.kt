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
class DahabiyaRepository @Inject constructor(
    private val apiService: DahabiyatApiService
) {
    
    suspend fun getDahabiyas(
        page: Int = 1,
        limit: Int = 20,
        featured: Boolean? = null,
        minPrice: Double? = null,
        maxPrice: Double? = null,
        capacity: Int? = null,
        search: String? = null
    ): Flow<Resource<PaginatedResponse<Dahabiya>>> = flow {
        try {
            emit(Resource.Loading())
            val response = apiService.getDahabiyas(
                page = page,
                limit = limit,
                featured = featured,
                minPrice = minPrice,
                maxPrice = maxPrice,
                capacity = capacity,
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
    
    suspend fun getDahabiyaById(id: String): Flow<Resource<Dahabiya>> = flow {
        try {
            emit(Resource.Loading())
            val response = apiService.getDahabiyaById(id)
            if (response.isSuccessful) {
                response.body()?.let { apiResponse ->
                    if (apiResponse.success && apiResponse.data != null) {
                        emit(Resource.Success(apiResponse.data))
                    } else {
                        emit(Resource.Error(apiResponse.error ?: "Dahabiya not found"))
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
    
    suspend fun getFeaturedDahabiyas(limit: Int = 5): Flow<Resource<List<Dahabiya>>> = flow {
        try {
            emit(Resource.Loading())
            val response = apiService.getFeaturedDahabiyas(limit)
            if (response.isSuccessful) {
                response.body()?.let { apiResponse ->
                    if (apiResponse.success && apiResponse.data != null) {
                        emit(Resource.Success(apiResponse.data))
                    } else {
                        emit(Resource.Error(apiResponse.error ?: "No featured dahabiyas found"))
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
