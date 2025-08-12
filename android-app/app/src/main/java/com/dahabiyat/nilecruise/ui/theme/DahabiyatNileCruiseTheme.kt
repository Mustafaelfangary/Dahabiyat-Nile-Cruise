package com.dahabiyat.nilecruise.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = Color(0xFF0080FF),
    secondary = Color(0xFF003D7A),
    tertiary = Color(0xFFFFD700)
)

private val LightColorScheme = lightColorScheme(
    primary = Color(0xFF0080FF),
    secondary = Color(0xFF003D7A),
    tertiary = Color(0xFFFFD700)
)

@Composable
fun DahabiyatNileCruiseTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}
