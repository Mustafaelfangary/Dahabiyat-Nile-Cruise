# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Dahabiyat Nile Cruise - Production ProGuard Rules

# React Native specific rules
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }

# Keep React Native bridge methods
-keepclassmembers class * {
    @com.facebook.react.uimanager.annotations.ReactProp <methods>;
}
-keepclassmembers class * {
    @com.facebook.react.uimanager.annotations.ReactPropGroup <methods>;
}

# Keep React Native module classes
-keep class * extends com.facebook.react.bridge.ReactContextBaseJavaModule { *; }
-keep class * extends com.facebook.react.bridge.BaseJavaModule { *; }

# Keep React Native view managers
-keep class * extends com.facebook.react.uimanager.ViewManager { *; }
-keep class * extends com.facebook.react.uimanager.BaseViewManager { *; }

# Keep React Native package classes
-keep class * implements com.facebook.react.ReactPackage { *; }

# Keep application class
-keep class com.dahabiyatnilecruise.MainApplication { *; }
-keep class com.dahabiyatnilecruise.MainActivity { *; }

# Keep all classes in the main package
-keep class com.dahabiyat.nilecruise.** { *; }

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep enums
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# Remove logging in release builds
-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static int v(...);
    public static int i(...);
    public static int w(...);
    public static int d(...);
    public static int e(...);
}

# Keep line numbers for debugging stack traces
-keepattributes SourceFile,LineNumberTable

# Rename source file attribute
-renamesourcefileattribute SourceFile

# Don't warn about missing classes
-dontwarn java.lang.invoke.**
-dontwarn javax.**
-dontwarn kotlin.**
-dontwarn kotlinx.**

# AsyncStorage
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# NetInfo
-keep class com.reactnativecommunity.netinfo.** { *; }

# Vector icons
-keep class com.oblador.vectoricons.** { *; }

# Keep annotation classes
-keepattributes *Annotation*

# Keep generic signatures
-keepattributes Signature
