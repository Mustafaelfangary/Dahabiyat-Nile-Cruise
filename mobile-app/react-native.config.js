/**
 * React Native Configuration
 * Fixed configuration for proper Metro bundling
 */

module.exports = {
  dependencies: {
    // Properly configure Expo modules for React Native CLI
    'expo': {
      platforms: {
        android: {
          sourceDir: '../node_modules/expo/android/src/main/java',
          packageImportPath: 'expo.modules',
        },
      },
    },
  },
};
