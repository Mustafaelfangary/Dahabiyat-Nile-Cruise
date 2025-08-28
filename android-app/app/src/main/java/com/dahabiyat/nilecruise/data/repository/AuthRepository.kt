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
class AuthRepository @Inject constructor(
    private val apiService: DahabiyatApiService
) {
    
    suspend fun signIn(email: String, password: String): Flow<Resource<AuthResponse>> = flow {
        try {
            emit(Resource.Loading())
            val response = apiService.signIn(AuthRequest(email, password))
            if (response.isSuccessful) {
                response.body()?.let { authResponse ->
                    if (authResponse.success) {
                        emit(Resource.Success(authResponse))
                    } else {
                        emit(Resource.Error(authResponse.error ?: "Login failed"))
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
    
    suspend fun signUp(
        name: String,
        email: String,
        password: String,
        confirmPassword: String,
        phone: String? = null,
        nationality: String? = null
    ): Flow<Resource<AuthResponse>> = flow {
        try {
            emit(Resource.Loading())
            val response = apiService.signUp(
                RegisterRequest(
                    name = name,
                    email = email,
                    password = password,
                    confirmPassword = confirmPassword,
                    phone = phone,
                    nationality = nationality
                )
            )
            if (response.isSuccessful) {
                response.body()?.let { authResponse ->
                    if (authResponse.success) {
                        emit(Resource.Success(authResponse))
                    } else {
                        emit(Resource.Error(authResponse.error ?: "Registration failed"))
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
    
    suspend fun verifyEmail(email: String, token: String): Flow<Resource<String>> = flow {
        try {
            emit(Resource.Loading())
            val response = apiService.verifyEmail(VerifyEmailRequest(email, token))
            if (response.isSuccessful) {
                response.body()?.let { apiResponse ->
                    if (apiResponse.success) {
                        emit(Resource.Success(apiResponse.data ?: "Email verified successfully"))
                    } else {
                        emit(Resource.Error(apiResponse.error ?: "Email verification failed"))
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
    
    suspend fun forgotPassword(email: String): Flow<Resource<String>> = flow {
        try {
            emit(Resource.Loading())
            val response = apiService.forgotPassword(ForgotPasswordRequest(email))
            if (response.isSuccessful) {
                response.body()?.let { apiResponse ->
                    if (apiResponse.success) {
                        emit(Resource.Success(apiResponse.data ?: "Password reset email sent"))
                    } else {
                        emit(Resource.Error(apiResponse.error ?: "Failed to send reset email"))
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
    
    suspend fun resetPassword(
        email: String,
        token: String,
        password: String,
        confirmPassword: String
    ): Flow<Resource<String>> = flow {
        try {
            emit(Resource.Loading())
            val response = apiService.resetPassword(
                ResetPasswordRequest(email, token, password, confirmPassword)
            )
            if (response.isSuccessful) {
                response.body()?.let { apiResponse ->
                    if (apiResponse.success) {
                        emit(Resource.Success(apiResponse.data ?: "Password reset successfully"))
                    } else {
                        emit(Resource.Error(apiResponse.error ?: "Password reset failed"))
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
    
    suspend fun verifyAdminEmail(email: String, verifyKey: String): Flow<Resource<String>> = flow {
        try {
            emit(Resource.Loading())
            val response = apiService.verifyAdminEmail(AdminVerifyRequest(email, verifyKey))
            if (response.isSuccessful) {
                response.body()?.let { apiResponse ->
                    if (apiResponse.success) {
                        emit(Resource.Success(apiResponse.data ?: "Admin verification successful"))
                    } else {
                        emit(Resource.Error(apiResponse.error ?: "Admin verification failed"))
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
