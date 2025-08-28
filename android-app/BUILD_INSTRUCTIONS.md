# Android APK Build Instructions

## Prerequisites

### Required Software
- **Android Studio**: Hedgehog (2023.1.1) or later
- **Java JDK**: 17 or later
- **Android SDK**: API 34 (Android 14)
- **Minimum SDK**: API 24 (Android 7.0)

### Download Links
- Android Studio: https://developer.android.com/studio
- Java JDK 17: https://adoptium.net/temurin/releases/

## Step-by-Step Build Process

### 1. Open Project in Android Studio

1. **Launch Android Studio**
2. **Open Project**: Select "Open an existing Android Studio project"
3. **Navigate**: Browse to the `android-app` folder
4. **Select**: Choose the `android-app` directory and click "OK"
5. **Wait**: Let Android Studio sync the project (this may take a few minutes)

### 2. Configure Build Environment

1. **Check SDK**: Go to `File > Project Structure > SDK Location`
   - Ensure Android SDK path is set
   - Verify JDK location is set to JDK 17+

2. **Sync Gradle**: Click "Sync Now" if prompted, or go to `File > Sync Project with Gradle Files`

3. **Update Dependencies**: If prompted to update Gradle or dependencies, click "Update"

### 3. Build Debug APK (for testing)

#### Option A: Using Android Studio UI
1. **Build Menu**: Go to `Build > Build Bundle(s) / APK(s) > Build APK(s)`
2. **Wait**: Let the build process complete
3. **Locate APK**: Click "locate" in the notification, or find it at:
   ```
   android-app/app/build/outputs/apk/debug/app-debug.apk
   ```

#### Option B: Using Terminal in Android Studio
1. **Open Terminal**: Click "Terminal" tab at the bottom of Android Studio
2. **Run Command**:
   ```bash
   ./gradlew assembleDebug
   ```
3. **Find APK**: Located at `app/build/outputs/apk/debug/app-debug.apk`

### 4. Build Release APK (for production)

#### Generate Signing Key First
1. **Build Menu**: Go to `Build > Generate Signed Bundle / APK`
2. **Select APK**: Choose "APK" and click "Next"
3. **Create New Keystore**:
   - Click "Create new..."
   - **Key store path**: Choose location (e.g., `android-app/keystore/dahabiyat-release.jks`)
   - **Password**: Create strong password (save this!)
   - **Key alias**: `dahabiyat-key`
   - **Key password**: Create strong password (save this!)
   - **Validity**: 25 years
   - **Certificate info**:
     - First and Last Name: `Dahabiyat Nile Cruise`
     - Organizational Unit: `Mobile Development`
     - Organization: `Dahabiyat Nile Cruise`
     - City: `Cairo`
     - State: `Cairo`
     - Country: `EG`

#### Build Signed APK
1. **Select Keystore**: Choose the keystore you just created
2. **Enter Passwords**: Enter keystore and key passwords
3. **Build Variant**: Select "release"
4. **Signature Versions**: Check both V1 and V2
5. **Click Finish**: Wait for build to complete
6. **Locate APK**: Find at `app/build/outputs/apk/release/app-release.apk`

### 5. Build AAB (Android App Bundle) - Recommended for Play Store

1. **Build Menu**: Go to `Build > Generate Signed Bundle / APK`
2. **Select AAB**: Choose "Android App Bundle" and click "Next"
3. **Use Same Keystore**: Select the keystore created above
4. **Build**: Click "Finish"
5. **Locate AAB**: Find at `app/build/outputs/bundle/release/app-release.aab`

## Command Line Build (Alternative)

If you prefer command line builds:

### Debug Build
```bash
cd android-app
./gradlew assembleDebug
```

### Release Build (after setting up keystore)
```bash
cd android-app
./gradlew assembleRelease
```

### AAB Build
```bash
cd android-app
./gradlew bundleRelease
```

## Build Outputs

After successful builds, you'll find:

### Debug APK
- **Location**: `app/build/outputs/apk/debug/app-debug.apk`
- **Size**: ~15-20 MB
- **Use**: Testing and development

### Release APK
- **Location**: `app/build/outputs/apk/release/app-release.apk`
- **Size**: ~8-12 MB (optimized)
- **Use**: Direct distribution, sideloading

### Release AAB
- **Location**: `app/build/outputs/bundle/release/app-release.aab`
- **Size**: ~6-10 MB
- **Use**: Google Play Store upload (recommended)

## Testing the APK

### Install on Device
1. **Enable Developer Options**: Go to Settings > About Phone > Tap "Build Number" 7 times
2. **Enable USB Debugging**: Settings > Developer Options > USB Debugging
3. **Connect Device**: Connect via USB
4. **Install APK**:
   ```bash
   adb install app/build/outputs/apk/debug/app-debug.apk
   ```

### Test on Emulator
1. **Create AVD**: Tools > AVD Manager > Create Virtual Device
2. **Choose Device**: Select a phone (e.g., Pixel 6)
3. **System Image**: Download and select API 34 (Android 14)
4. **Start Emulator**: Click play button
5. **Install APK**: Drag and drop APK onto emulator

## Troubleshooting

### Common Issues

1. **Gradle Sync Failed**
   - Check internet connection
   - Update Android Studio
   - Invalidate caches: File > Invalidate Caches and Restart

2. **SDK Not Found**
   - Install Android SDK via SDK Manager
   - Set correct SDK path in Project Structure

3. **Build Failed**
   - Check error messages in Build tab
   - Clean project: Build > Clean Project
   - Rebuild: Build > Rebuild Project

4. **Keystore Issues**
   - Ensure passwords are correct
   - Check keystore file path
   - Recreate keystore if corrupted

### Build Optimization

For smaller APK size:
1. **Enable ProGuard**: Already enabled in release builds
2. **Enable R8**: Already enabled
3. **Remove unused resources**: Already configured

## Final Steps

1. **Test the APK** on multiple devices
2. **Verify API connectivity** to your Hostinger VPS
3. **Test all features**: login, browsing, booking
4. **Check performance** on different Android versions
5. **Prepare for Play Store** upload (if desired)

## Build Success Indicators

✅ **Successful build messages**
✅ **APK/AAB files generated**
✅ **No build errors in console**
✅ **App installs and runs on device**
✅ **API calls work with your server**

Your Android app is now ready for distribution! 🚀
