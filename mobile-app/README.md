# Dahabiyat Nile Cruise Mobile App

## 🌊 Ocean Blue Theme - Version 2.0

A redesigned React Native mobile app for Dahabiyat Nile Cruise with a new navigation structure and Ocean Blue theme.

## 📱 New Navigation Structure

### Bottom Navigation (3 Tabs Only)
- **Settings** - App settings and preferences
- **Profile** - User profile with loyalty program
- **Main Menu** - Opens right slide drawer with all navigation options

### Right Slide Menu Contains:
- 🏠 Home
- 🚢 Dahabiyat Fleet
- 🎁 Journey Packages
- 🗺️ Itineraries
- 🖼️ Gallery
- ⭐ Reviews
- 📍 Map & Locations
- ℹ️ About Us
- 📧 Contact Us
- 📅 Book Journey
- 🕒 My Bookings

## 🎨 Ocean Blue Theme

### Color Palette
- **Primary**: Ocean Blue (`#0080ff`)
- **Secondary**: Blue variants (`#0066cc`, `#3399ff`)
- **Background**: Light blue (`#f0f8ff`)
- **Text**: Dark blue and white variants

## 🚀 Features

### ✨ Core Features
- **Same Content as Website** - All screens mirror the web version
- **Loyalty Program** - Full loyalty program with tiers and points
- **Profile Management** - Complete user profile with booking history
- **Wishlist** - Save favorite dahabiyat and packages
- **Settings** - Comprehensive app settings
- **Right Slide Menu** - Easy access to all features

### 📱 Screens Included
1. **HomeScreen** - Main landing page
2. **DahabiyatScreen** - Fleet showcase
3. **PackagesScreen** - Journey packages
4. **ItinerariesScreen** - Detailed itineraries
5. **GalleryScreen** - Photo gallery
6. **AboutScreen** - Company information
7. **ContactScreen** - Contact information
8. **SettingsScreen** - App settings
9. **ProfileScreen** - User profile
10. **LoyaltyProgramScreen** - Loyalty program details
11. **BookingHistoryScreen** - User's booking history
12. **WishlistScreen** - Saved items

## 🛠️ Technical Stack

### Dependencies
- **React Native** - Mobile framework
- **Expo** - Development platform
- **React Navigation** - Navigation library
  - Bottom Tabs Navigator
  - Drawer Navigator
  - Stack Navigator
- **Expo Vector Icons** - Icon library
- **Expo Linear Gradient** - Gradient effects
- **TypeScript** - Type safety

### Navigation Structure
```
AppStackNavigator (Stack)
├── MainTabs (Tab Navigator)
│   ├── Settings
│   ├── Profile
│   └── MainMenu (Drawer Navigator)
│       ├── Home
│       ├── Dahabiyat
│       ├── Packages
│       ├── Itineraries
│       ├── Gallery
│       ├── About
│       └── Contact
└── Additional Screens (Stack)
    ├── LoyaltyProgram
    ├── BookingHistory
    ├── Wishlist
    └── ContactDeveloper
```

## 🎯 Key Improvements

### Navigation
- ✅ Simplified to 3 bottom tabs only
- ✅ Right slide menu for main navigation
- ✅ Consistent Ocean Blue theme throughout
- ✅ Intuitive user experience

### Content
- ✅ Same content as website
- ✅ Complete loyalty program implementation
- ✅ Comprehensive profile management
- ✅ Wishlist functionality
- ✅ Detailed booking history

### Design
- ✅ Ocean Blue color scheme
- ✅ Modern UI components
- ✅ Consistent styling
- ✅ Professional appearance

## 📦 Installation

```bash
# Navigate to mobile app directory
cd mobile-app

# Install dependencies
npm install

# Start the development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## 🔧 Development

### File Structure
```
mobile-app/
├── components/
│   ├── RightDrawerContent.tsx
│   └── HieroglyphicTopBanner.tsx
├── navigation/
│   ├── AppStackNavigator.tsx
│   └── TabNavigator.tsx
├── screens/
│   ├── HomeScreen.tsx
│   ├── ProfileScreen.tsx
│   ├── SettingsScreen.tsx
│   ├── LoyaltyProgramScreen.tsx
│   └── ... (all other screens)
├── constants/
│   └── AppConstants.ts
├── config/
│   └── content.json
├── App.tsx
└── package.json
```

## 🌟 Future Enhancements

- [ ] API integration with backend
- [ ] Push notifications
- [ ] Offline support
- [ ] Payment integration
- [ ] Real-time booking updates
- [ ] Multi-language support
- [ ] Dark mode toggle

## 📱 Screenshots

*Screenshots will be added once the app is running*

## 🤝 Contributing

This mobile app is designed to work seamlessly with the main Dahabiyat Nile Cruise website and admin panel.

## 📄 License

MIT License - See main project license for details.
