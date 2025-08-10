package com.dahabiyat.nilecruise.utils

import android.util.Log
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.util.concurrent.TimeUnit

/**
 * API Testing utility to verify connectivity with your live backend
 * Use this to test endpoints before implementing full features
 */
object ApiTester {
    
    private const val TAG = "ApiTester"
    private const val BASE_URL = Constants.BASE_URL
    
    private val client = OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .addInterceptor { chain ->
            val request = chain.request()
            Log.d(TAG, "🌐 API Request: ${request.method} ${request.url}")
            val response = chain.proceed(request)
            Log.d(TAG, "📡 API Response: ${response.code} ${response.message}")
            response
        }
        .build()
    
    /**
     * Test basic connectivity to your backend
     */
    suspend fun testConnectivity(): TestResult {
        return withContext(Dispatchers.IO) {
            try {
                val request = Request.Builder()
                    .url("${BASE_URL}dahabiyas")
                    .get()
                    .build()
                
                val response = client.newCall(request).execute()
                val body = response.body?.string()
                
                TestResult(
                    success = response.isSuccessful,
                    statusCode = response.code,
                    message = if (response.isSuccessful) "✅ Connected to backend successfully!" else "❌ Connection failed",
                    data = body,
                    endpoint = "GET /dahabiyas"
                )
            } catch (e: Exception) {
                Log.e(TAG, "❌ Connectivity test failed", e)
                TestResult(
                    success = false,
                    statusCode = -1,
                    message = "❌ Network error: ${e.message}",
                    data = null,
                    endpoint = "GET /dahabiyas"
                )
            }
        }
    }
    
    /**
     * Test authentication endpoints
     */
    suspend fun testAuthentication(email: String, password: String): TestResult {
        return withContext(Dispatchers.IO) {
            try {
                val json = JSONObject().apply {
                    put("email", email)
                    put("password", password)
                }
                
                val requestBody = json.toString().toRequestBody("application/json".toMediaType())
                val request = Request.Builder()
                    .url("${BASE_URL}auth/signin")
                    .post(requestBody)
                    .build()
                
                val response = client.newCall(request).execute()
                val body = response.body?.string()
                
                TestResult(
                    success = response.isSuccessful,
                    statusCode = response.code,
                    message = if (response.isSuccessful) "✅ Authentication successful!" else "❌ Authentication failed",
                    data = body,
                    endpoint = "POST /auth/signin"
                )
            } catch (e: Exception) {
                Log.e(TAG, "❌ Authentication test failed", e)
                TestResult(
                    success = false,
                    statusCode = -1,
                    message = "❌ Auth error: ${e.message}",
                    data = null,
                    endpoint = "POST /auth/signin"
                )
            }
        }
    }
    
    /**
     * Test content endpoints
     */
    suspend fun testContentEndpoints(): List<TestResult> {
        val endpoints = listOf(
            "dahabiyas" to "Dahabiyas",
            "packages" to "Packages", 
            "gallery" to "Gallery",
            "blogs" to "Blogs",
            "website-content?page=homepage" to "Website Content"
        )
        
        return endpoints.map { (endpoint, name) ->
            testEndpoint(endpoint, name)
        }
    }
    
    /**
     * Test admin verification
     */
    suspend fun testAdminVerification(email: String): TestResult {
        return withContext(Dispatchers.IO) {
            try {
                val json = JSONObject().apply {
                    put("email", email)
                    put("adminKey", Constants.ADMIN_VERIFY_KEY)
                }
                
                val requestBody = json.toString().toRequestBody("application/json".toMediaType())
                val request = Request.Builder()
                    .url("${BASE_URL}auth/verify-admin")
                    .post(requestBody)
                    .build()
                
                val response = client.newCall(request).execute()
                val body = response.body?.string()
                
                TestResult(
                    success = response.isSuccessful,
                    statusCode = response.code,
                    message = if (response.isSuccessful) "✅ Admin verification successful!" else "❌ Admin verification failed",
                    data = body,
                    endpoint = "POST /auth/verify-admin"
                )
            } catch (e: Exception) {
                Log.e(TAG, "❌ Admin verification test failed", e)
                TestResult(
                    success = false,
                    statusCode = -1,
                    message = "❌ Admin verification error: ${e.message}",
                    data = null,
                    endpoint = "POST /auth/verify-admin"
                )
            }
        }
    }
    
    /**
     * Test user registration
     */
    suspend fun testUserRegistration(name: String, email: String, password: String): TestResult {
        return withContext(Dispatchers.IO) {
            try {
                val json = JSONObject().apply {
                    put("name", name)
                    put("email", email)
                    put("password", password)
                }
                
                val requestBody = json.toString().toRequestBody("application/json".toMediaType())
                val request = Request.Builder()
                    .url("${BASE_URL}auth/signup")
                    .post(requestBody)
                    .build()
                
                val response = client.newCall(request).execute()
                val body = response.body?.string()
                
                TestResult(
                    success = response.isSuccessful,
                    statusCode = response.code,
                    message = if (response.isSuccessful) "✅ User registration successful!" else "❌ Registration failed",
                    data = body,
                    endpoint = "POST /auth/signup"
                )
            } catch (e: Exception) {
                Log.e(TAG, "❌ Registration test failed", e)
                TestResult(
                    success = false,
                    statusCode = -1,
                    message = "❌ Registration error: ${e.message}",
                    data = null,
                    endpoint = "POST /auth/signup"
                )
            }
        }
    }
    
    /**
     * Run comprehensive API tests
     */
    suspend fun runComprehensiveTests(): TestSuite {
        Log.d(TAG, "🧪 Starting comprehensive API tests...")
        
        val results = mutableListOf<TestResult>()
        
        // Test 1: Basic connectivity
        Log.d(TAG, "🔍 Testing basic connectivity...")
        results.add(testConnectivity())
        
        // Test 2: Content endpoints
        Log.d(TAG, "🔍 Testing content endpoints...")
        results.addAll(testContentEndpoints())
        
        // Test 3: Admin verification (if enabled)
        if (Constants.ENABLE_TESTING_MODE) {
            Log.d(TAG, "🔍 Testing admin verification...")
            results.add(testAdminVerification("admin@dahabiyatnilecruise.com"))
        }
        
        val successCount = results.count { it.success }
        val totalCount = results.size
        
        Log.d(TAG, "📊 Test Results: $successCount/$totalCount passed")
        
        return TestSuite(
            results = results,
            successCount = successCount,
            totalCount = totalCount,
            overallSuccess = successCount == totalCount
        )
    }
    
    private suspend fun testEndpoint(endpoint: String, name: String): TestResult {
        return withContext(Dispatchers.IO) {
            try {
                val request = Request.Builder()
                    .url("$BASE_URL$endpoint")
                    .get()
                    .build()
                
                val response = client.newCall(request).execute()
                val body = response.body?.string()
                
                TestResult(
                    success = response.isSuccessful,
                    statusCode = response.code,
                    message = if (response.isSuccessful) "✅ $name loaded successfully!" else "❌ $name failed to load",
                    data = body,
                    endpoint = "GET /$endpoint"
                )
            } catch (e: Exception) {
                Log.e(TAG, "❌ $name test failed", e)
                TestResult(
                    success = false,
                    statusCode = -1,
                    message = "❌ $name error: ${e.message}",
                    data = null,
                    endpoint = "GET /$endpoint"
                )
            }
        }
    }
}

/**
 * Test result data class
 */
data class TestResult(
    val success: Boolean,
    val statusCode: Int,
    val message: String,
    val data: String?,
    val endpoint: String
)

/**
 * Test suite results
 */
data class TestSuite(
    val results: List<TestResult>,
    val successCount: Int,
    val totalCount: Int,
    val overallSuccess: Boolean
) {
    val successRate: Float = if (totalCount > 0) successCount.toFloat() / totalCount else 0f
}
