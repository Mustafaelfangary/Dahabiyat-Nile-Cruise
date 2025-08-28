package com.dahabiyat.nilecruise.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.dahabiyat.nilecruise.ui.theme.DahabiyatColors

enum class DahabiyatButtonStyle {
    PRIMARY, SECONDARY, TERTIARY, OUTLINE, TEXT
}

enum class DahabiyatButtonSize {
    SMALL, MEDIUM, LARGE
}

@Composable
fun DahabiyatButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    style: DahabiyatButtonStyle = DahabiyatButtonStyle.PRIMARY,
    size: DahabiyatButtonSize = DahabiyatButtonSize.MEDIUM,
    enabled: Boolean = true,
    loading: Boolean = false,
    icon: ImageVector? = null,
    iconPosition: IconPosition = IconPosition.START
) {
    val buttonColors = when (style) {
        DahabiyatButtonStyle.PRIMARY -> ButtonDefaults.buttonColors(
            containerColor = DahabiyatColors.OceanBlue,
            contentColor = Color.White,
            disabledContainerColor = DahabiyatColors.OceanBlue.copy(alpha = 0.3f),
            disabledContentColor = Color.White.copy(alpha = 0.6f)
        )
        DahabiyatButtonStyle.SECONDARY -> ButtonDefaults.buttonColors(
            containerColor = DahabiyatColors.DeepBlue,
            contentColor = Color.White,
            disabledContainerColor = DahabiyatColors.DeepBlue.copy(alpha = 0.3f),
            disabledContentColor = Color.White.copy(alpha = 0.6f)
        )
        DahabiyatButtonStyle.TERTIARY -> ButtonDefaults.buttonColors(
            containerColor = DahabiyatColors.Gold,
            contentColor = Color.Black,
            disabledContainerColor = DahabiyatColors.Gold.copy(alpha = 0.3f),
            disabledContentColor = Color.Black.copy(alpha = 0.6f)
        )
        DahabiyatButtonStyle.OUTLINE -> ButtonDefaults.outlinedButtonColors(
            contentColor = DahabiyatColors.OceanBlue,
            disabledContentColor = DahabiyatColors.OceanBlue.copy(alpha = 0.6f)
        )
        DahabiyatButtonStyle.TEXT -> ButtonDefaults.textButtonColors(
            contentColor = DahabiyatColors.OceanBlue,
            disabledContentColor = DahabiyatColors.OceanBlue.copy(alpha = 0.6f)
        )
    }

    val buttonPadding = when (size) {
        DahabiyatButtonSize.SMALL -> PaddingValues(horizontal = 16.dp, vertical = 8.dp)
        DahabiyatButtonSize.MEDIUM -> PaddingValues(horizontal = 24.dp, vertical = 12.dp)
        DahabiyatButtonSize.LARGE -> PaddingValues(horizontal = 32.dp, vertical = 16.dp)
    }

    val textStyle = when (size) {
        DahabiyatButtonSize.SMALL -> MaterialTheme.typography.labelMedium
        DahabiyatButtonSize.MEDIUM -> MaterialTheme.typography.labelLarge
        DahabiyatButtonSize.LARGE -> MaterialTheme.typography.titleMedium
    }

    val iconSize = when (size) {
        DahabiyatButtonSize.SMALL -> 16.dp
        DahabiyatButtonSize.MEDIUM -> 18.dp
        DahabiyatButtonSize.LARGE -> 20.dp
    }

    when (style) {
        DahabiyatButtonStyle.OUTLINE -> {
            OutlinedButton(
                onClick = onClick,
                modifier = modifier,
                enabled = enabled && !loading,
                colors = buttonColors,
                contentPadding = buttonPadding,
                shape = RoundedCornerShape(8.dp),
                border = ButtonDefaults.outlinedButtonBorder.copy(
                    brush = null,
                    width = 1.dp
                )
            ) {
                ButtonContent(
                    text = text,
                    icon = icon,
                    iconPosition = iconPosition,
                    iconSize = iconSize,
                    textStyle = textStyle,
                    loading = loading
                )
            }
        }
        DahabiyatButtonStyle.TEXT -> {
            TextButton(
                onClick = onClick,
                modifier = modifier,
                enabled = enabled && !loading,
                colors = buttonColors,
                contentPadding = buttonPadding,
                shape = RoundedCornerShape(8.dp)
            ) {
                ButtonContent(
                    text = text,
                    icon = icon,
                    iconPosition = iconPosition,
                    iconSize = iconSize,
                    textStyle = textStyle,
                    loading = loading
                )
            }
        }
        else -> {
            Button(
                onClick = onClick,
                modifier = modifier,
                enabled = enabled && !loading,
                colors = buttonColors,
                contentPadding = buttonPadding,
                shape = RoundedCornerShape(8.dp),
                elevation = ButtonDefaults.buttonElevation(
                    defaultElevation = 2.dp,
                    pressedElevation = 4.dp,
                    disabledElevation = 0.dp
                )
            ) {
                ButtonContent(
                    text = text,
                    icon = icon,
                    iconPosition = iconPosition,
                    iconSize = iconSize,
                    textStyle = textStyle,
                    loading = loading
                )
            }
        }
    }
}

@Composable
private fun ButtonContent(
    text: String,
    icon: ImageVector?,
    iconPosition: IconPosition,
    iconSize: androidx.compose.ui.unit.Dp,
    textStyle: androidx.compose.ui.text.TextStyle,
    loading: Boolean
) {
    if (loading) {
        CircularProgressIndicator(
            modifier = Modifier.size(iconSize),
            strokeWidth = 2.dp
        )
    } else {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            if (icon != null && iconPosition == IconPosition.START) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    modifier = Modifier.size(iconSize)
                )
                Spacer(modifier = Modifier.width(8.dp))
            }
            
            Text(
                text = text,
                style = textStyle,
                fontWeight = FontWeight.Medium
            )
            
            if (icon != null && iconPosition == IconPosition.END) {
                Spacer(modifier = Modifier.width(8.dp))
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    modifier = Modifier.size(iconSize)
                )
            }
        }
    }
}

enum class IconPosition {
    START, END
}
