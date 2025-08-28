package com.dahabiyat.nilecruise.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.translate
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import kotlin.math.cos
import kotlin.math.sin

@Composable
fun CleopatraLogo(
    modifier: Modifier = Modifier,
    size: Dp = 120.dp
) {
    Canvas(
        modifier = modifier.size(size)
    ) {
        val center = this.size.width / 2f
        val radius = center * 0.9f
        
        // Draw outer yellow circle
        drawCircle(
            color = Color(0xFFFFEB3B),
            radius = radius,
            center = androidx.compose.ui.geometry.Offset(center, center)
        )
        
        // Draw inner white circle
        drawCircle(
            color = Color.White,
            radius = radius * 0.8f,
            center = androidx.compose.ui.geometry.Offset(center, center)
        )
        
        // Draw pharaoh head profile
        translate(center, center) {
            drawPharaohHead(this, radius * 0.4f)
        }
        
        // Draw ankh symbols
        translate(center * 0.4f, center) {
            drawAnkh(this, radius * 0.15f)
        }
        
        translate(center * 1.6f, center) {
            drawAnkh(this, radius * 0.15f)
        }
    }
}

private fun drawPharaohHead(drawScope: DrawScope, size: Float) {
    with(drawScope) {
        // Head outline
        val headPath = Path().apply {
            moveTo(-size * 0.6f, -size * 0.4f)
            quadraticBezierTo(-size * 0.6f, -size * 0.8f, -size * 0.3f, -size * 0.8f)
            quadraticBezierTo(0f, -size * 0.8f, size * 0.3f, -size * 0.6f)
            quadraticBezierTo(size * 0.5f, -size * 0.4f, size * 0.5f, -size * 0.1f)
            quadraticBezierTo(size * 0.5f, size * 0.2f, size * 0.3f, size * 0.4f)
            quadraticBezierTo(0f, size * 0.5f, -size * 0.3f, size * 0.4f)
            quadraticBezierTo(-size * 0.6f, size * 0.2f, -size * 0.6f, -size * 0.4f)
            close()
        }
        drawPath(headPath, Color.Black)
        
        // Face
        val facePath = Path().apply {
            moveTo(-size * 0.5f, -size * 0.3f)
            quadraticBezierTo(-size * 0.5f, -size * 0.7f, -size * 0.25f, -size * 0.7f)
            quadraticBezierTo(0.05f * size, -size * 0.7f, size * 0.3f, -size * 0.5f)
            quadraticBezierTo(size * 0.4f, -size * 0.3f, size * 0.4f, -size * 0.1f)
            quadraticBezierTo(size * 0.4f, size * 0.1f, size * 0.25f, size * 0.3f)
            quadraticBezierTo(0f, size * 0.4f, -size * 0.25f, size * 0.3f)
            quadraticBezierTo(-size * 0.5f, size * 0.1f, -size * 0.5f, -size * 0.3f)
            close()
        }
        drawPath(facePath, Color.White)
        
        // Eye
        drawCircle(
            color = Color.Black,
            radius = size * 0.08f,
            center = androidx.compose.ui.geometry.Offset(size * 0.08f, -size * 0.2f)
        )
        
        // Headdress stripes
        drawRect(
            color = Color(0xFFFFEB3B),
            topLeft = androidx.compose.ui.geometry.Offset(-size * 0.3f, -size * 0.7f),
            size = androidx.compose.ui.geometry.Size(size * 0.08f, size * 1.1f)
        )
        drawRect(
            color = Color(0xFFFFEB3B),
            topLeft = androidx.compose.ui.geometry.Offset(-size * 0.15f, -size * 0.7f),
            size = androidx.compose.ui.geometry.Size(size * 0.08f, size * 1.1f)
        )
        drawRect(
            color = Color(0xFFFFEB3B),
            topLeft = androidx.compose.ui.geometry.Offset(0f, -size * 0.7f),
            size = androidx.compose.ui.geometry.Size(size * 0.08f, size * 1.1f)
        )
        
        // Central ornament
        drawCircle(
            color = Color(0xFFFFEB3B),
            radius = size * 0.12f,
            center = androidx.compose.ui.geometry.Offset(size * 0.35f, 0f)
        )
        drawCircle(
            color = Color.White,
            radius = size * 0.06f,
            center = androidx.compose.ui.geometry.Offset(size * 0.35f, 0f)
        )
    }
}

private fun drawAnkh(drawScope: DrawScope, size: Float) {
    with(drawScope) {
        // Ankh circle (top)
        drawCircle(
            color = Color(0xFFFFEB3B),
            radius = size * 0.4f,
            center = androidx.compose.ui.geometry.Offset(0f, -size * 0.6f)
        )
        
        // Ankh vertical line
        drawRect(
            color = Color(0xFFFFEB3B),
            topLeft = androidx.compose.ui.geometry.Offset(-size * 0.1f, -size * 0.2f),
            size = androidx.compose.ui.geometry.Size(size * 0.2f, size * 1.2f)
        )
        
        // Ankh horizontal line
        drawRect(
            color = Color(0xFFFFEB3B),
            topLeft = androidx.compose.ui.geometry.Offset(-size * 0.5f, -size * 0.1f),
            size = androidx.compose.ui.geometry.Size(size, size * 0.2f)
        )
    }
}
