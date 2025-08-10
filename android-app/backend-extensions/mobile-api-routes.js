// Mobile API Extensions for your existing backend
// Add these routes to your existing Express.js server

const express = require('express');
const { prisma } = require('../lib/prisma');
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');

const router = express.Router();

// ============================================================================
// MOBILE USER MANAGEMENT
// ============================================================================

// Get user preferences for mobile app
router.get('/user/preferences', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user preferences from database or return defaults
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        preferences: true,
        language: true,
        currency: true
      }
    });

    const preferences = {
      language: user?.language || 'en',
      currency: user?.currency || 'USD',
      notifications: {
        bookingUpdates: true,
        promotions: true,
        pushNotifications: true,
        emailNotifications: true,
        ...user?.preferences?.notifications
      },
      theme: user?.preferences?.theme || 'system',
      biometricEnabled: user?.preferences?.biometricEnabled || false
    };

    res.json({
      success: true,
      data: preferences
    });
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    res.status(500).json({ error: 'Failed to fetch preferences' });
  }
});

// Update user preferences
router.put('/user/preferences', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { language, currency, notifications, theme, biometricEnabled } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        language,
        currency,
        preferences: {
          notifications,
          theme,
          biometricEnabled
        }
      }
    });

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: {
        language: updatedUser.language,
        currency: updatedUser.currency,
        notifications,
        theme,
        biometricEnabled
      }
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

// Register device for push notifications
router.post('/user/register-device', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { deviceToken, platform, appVersion, deviceInfo } = req.body;

    // Check if device already exists
    const existingDevice = await prisma.userDevice.findFirst({
      where: {
        userId,
        deviceToken
      }
    });

    if (existingDevice) {
      // Update existing device
      await prisma.userDevice.update({
        where: { id: existingDevice.id },
        data: {
          appVersion,
          deviceInfo,
          isActive: true,
          updatedAt: new Date()
        }
      });
    } else {
      // Create new device registration
      await prisma.userDevice.create({
        data: {
          userId,
          deviceToken,
          platform,
          appVersion,
          deviceInfo,
          isActive: true
        }
      });
    }

    res.json({
      success: true,
      message: 'Device registered successfully'
    });
  } catch (error) {
    console.error('Error registering device:', error);
    res.status(500).json({ error: 'Failed to register device' });
  }
});

// ============================================================================
// MOBILE APP CONFIGURATION
// ============================================================================

// Get mobile app configuration
router.get('/mobile/config', async (req, res) => {
  try {
    // Get app configuration from database or environment
    const config = {
      appVersion: process.env.MOBILE_APP_VERSION || '1.0.0',
      minAppVersion: process.env.MIN_APP_VERSION || '1.0.0',
      maintenanceMode: process.env.MAINTENANCE_MODE === 'true',
      forceUpdate: process.env.FORCE_UPDATE === 'true',
      features: {
        biometricAuth: true,
        offlineMode: true,
        pushNotifications: true,
        socialSharing: true,
        maps: true
      },
      apiEndpoints: {
        base: process.env.API_BASE_URL,
        websocket: process.env.WEBSOCKET_URL
      },
      supportInfo: {
        email: 'support@dahabiyatnilecruise.com',
        phone: '+201200958713',
        whatsapp: '+201200958713'
      }
    };

    res.json({
      success: true,
      data: config
    });
  } catch (error) {
    console.error('Error fetching app config:', error);
    res.status(500).json({ error: 'Failed to fetch app configuration' });
  }
});

// Get content for offline caching
router.get('/mobile/content', async (req, res) => {
  try {
    const [dahabiyas, packages, gallery, blogs] = await Promise.all([
      prisma.dahabiya.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          description: true,
          shortDescription: true,
          capacity: true,
          pricePerNight: true,
          mainImage: true,
          images: true,
          rating: true,
          reviewCount: true,
          amenities: true,
          isActive: true,
          isFeatured: true
        }
      }),
      prisma.package.findMany({
        where: { isActive: true },
        select: {
          id: true,
          title: true,
          description: true,
          shortDescription: true,
          duration: true,
          price: true,
          mainImage: true,
          images: true,
          highlights: true,
          category: true,
          rating: true,
          reviewCount: true,
          isActive: true,
          isFeatured: true,
          isPopular: true
        }
      }),
      prisma.galleryImage.findMany({
        where: { isActive: true },
        select: {
          id: true,
          url: true,
          title: true,
          category: true,
          tags: true
        },
        take: 50 // Limit for mobile caching
      }),
      prisma.blog.findMany({
        where: { isPublished: true },
        select: {
          id: true,
          title: true,
          excerpt: true,
          featuredImage: true,
          category: true,
          author: true,
          publishedAt: true,
          readTime: true
        },
        take: 20 // Latest 20 posts
      })
    ]);

    res.json({
      success: true,
      data: {
        dahabiyas,
        packages,
        gallery,
        blogs,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching mobile content:', error);
    res.status(500).json({ error: 'Failed to fetch mobile content' });
  }
});

// ============================================================================
// ENHANCED BOOKING ENDPOINTS
// ============================================================================

// Check package availability
router.post('/bookings/check-availability', async (req, res) => {
  try {
    const { packageId, checkIn, checkOut, guests } = req.body;

    // Check if package exists and is active
    const package = await prisma.package.findFirst({
      where: {
        id: packageId,
        isActive: true
      }
    });

    if (!package) {
      return res.status(404).json({ error: 'Package not found' });
    }

    // Check for conflicting bookings
    const conflictingBookings = await prisma.booking.count({
      where: {
        packageId,
        status: { in: ['CONFIRMED', 'PENDING'] },
        OR: [
          {
            checkIn: { lte: new Date(checkOut) },
            checkOut: { gte: new Date(checkIn) }
          }
        ]
      }
    });

    const isAvailable = conflictingBookings === 0;

    res.json({
      success: true,
      data: {
        available: isAvailable,
        packageId,
        checkIn,
        checkOut,
        guests,
        message: isAvailable ? 'Package is available' : 'Package is not available for selected dates'
      }
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({ error: 'Failed to check availability' });
  }
});

// Calculate booking price
router.post('/bookings/calculate-price', async (req, res) => {
  try {
    const { packageId, guests, duration, addOns = [] } = req.body;

    const package = await prisma.package.findUnique({
      where: { id: packageId }
    });

    if (!package) {
      return res.status(404).json({ error: 'Package not found' });
    }

    let basePrice = package.price * guests;
    let addOnPrice = 0;

    // Calculate add-on prices
    const addOnPrices = {
      guide: 50,
      meals: 30,
      transport: 25,
      insurance: 15
    };

    addOns.forEach(addOn => {
      if (addOnPrices[addOn]) {
        addOnPrice += addOnPrices[addOn] * guests;
      }
    });

    const subtotal = basePrice + addOnPrice;
    const tax = subtotal * 0.14; // 14% tax
    const total = subtotal + tax;

    res.json({
      success: true,
      data: {
        basePrice,
        addOnPrice,
        subtotal,
        tax,
        total,
        currency: package.currency || 'USD',
        breakdown: {
          packagePrice: package.price,
          guests,
          duration,
          addOns: addOns.map(addOn => ({
            name: addOn,
            price: addOnPrices[addOn] || 0
          }))
        }
      }
    });
  } catch (error) {
    console.error('Error calculating price:', error);
    res.status(500).json({ error: 'Failed to calculate price' });
  }
});

// ============================================================================
// ADMIN MOBILE MANAGEMENT
// ============================================================================

// Get mobile users (Admin only)
router.get('/admin/mobile/users', requireAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        devices: {
          some: {
            isActive: true
          }
        }
      },
      include: {
        devices: {
          where: { isActive: true }
        },
        bookings: {
          select: { id: true }
        }
      }
    });

    const mobileUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      platform: user.devices[0]?.platform || 'unknown',
      appVersion: user.devices[0]?.appVersion || 'unknown',
      isActive: user.devices.length > 0,
      lastAppLogin: user.devices[0]?.updatedAt || user.updatedAt,
      totalBookings: user.bookings.length,
      deviceCount: user.devices.length
    }));

    res.json({
      success: true,
      data: { users: mobileUsers }
    });
  } catch (error) {
    console.error('Error fetching mobile users:', error);
    res.status(500).json({ error: 'Failed to fetch mobile users' });
  }
});

// Send push notification (Admin only)
router.post('/admin/mobile/send-notification', requireAdmin, async (req, res) => {
  try {
    const { title, message, target = 'all', data = {} } = req.body;

    // Get device tokens based on target
    let whereClause = { isActive: true };
    if (target === 'android') {
      whereClause.platform = 'android';
    } else if (target === 'recent') {
      whereClause.updatedAt = {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
      };
    }

    const devices = await prisma.userDevice.findMany({
      where: whereClause,
      select: {
        deviceToken: true,
        userId: true
      }
    });

    // Here you would integrate with your push notification service
    // For example, using Firebase Cloud Messaging (FCM)
    
    // Save notification to database
    const notification = await prisma.pushNotification.create({
      data: {
        title,
        message,
        data,
        recipientCount: devices.length,
        status: 'sent'
      }
    });

    // TODO: Implement actual push notification sending
    // await sendPushNotification(devices.map(d => d.deviceToken), { title, message, data });

    res.json({
      success: true,
      message: `Notification sent to ${devices.length} devices`,
      data: { notificationId: notification.id }
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// Get mobile analytics (Admin only)
router.get('/admin/mobile/analytics', requireAdmin, async (req, res) => {
  try {
    const [totalDownloads, activeUsers, mobileBookings, avgSession] = await Promise.all([
      prisma.userDevice.count(),
      prisma.userDevice.count({
        where: {
          isActive: true,
          updatedAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        }
      }),
      prisma.booking.count({
        where: {
          createdVia: 'mobile'
        }
      }),
      // This would come from your analytics tracking
      Promise.resolve('5.2m')
    ]);

    res.json({
      success: true,
      data: {
        totalDownloads,
        activeUsers,
        mobileBookings,
        avgSession
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;
