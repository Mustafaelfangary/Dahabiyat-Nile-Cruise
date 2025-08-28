package com.dahabiyat.nilecruise.di

import com.dahabiyat.nilecruise.data.api.DahabiyatApiService
import com.dahabiyat.nilecruise.data.repository.*
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object RepositoryModule {

    @Provides
    @Singleton
    fun provideAuthRepository(
        apiService: DahabiyatApiService
    ): AuthRepository {
        return AuthRepository(apiService)
    }

    @Provides
    @Singleton
    fun provideDahabiyaRepository(
        apiService: DahabiyatApiService
    ): DahabiyaRepository {
        return DahabiyaRepository(apiService)
    }

    @Provides
    @Singleton
    fun provideBookingRepository(
        apiService: DahabiyatApiService
    ): BookingRepository {
        return BookingRepository(apiService)
    }

    @Provides
    @Singleton
    fun providePackageRepository(
        apiService: DahabiyatApiService
    ): PackageRepository {
        return PackageRepository(apiService)
    }

    @Provides
    @Singleton
    fun provideContentRepository(
        apiService: DahabiyatApiService
    ): ContentRepository {
        return ContentRepository(apiService)
    }

    @Provides
    @Singleton
    fun provideUserRepository(
        apiService: DahabiyatApiService
    ): UserRepository {
        return UserRepository(apiService)
    }
}
