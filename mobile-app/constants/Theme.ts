/**
 * Comprehensive Theme Configuration
 * Implements the rule: Pale backgrounds always have dark text
 */

export const THEME_COLORS = {
  // Primary Ocean Blue Palette
  PRIMARY: '#0080ff',
  PRIMARY_DARK: '#0066cc',
  PRIMARY_LIGHT: '#3399ff',
  
  // Deep Blue Palette
  DEEP_BLUE: '#003d7a',
  NAVY_BLUE: '#001f3f',
  
  // Pale Backgrounds (always paired with dark text)
  PALE_BLUE: '#f0f8ff',
  PALE_GRAY: '#f8f9fa',
  PALE_WHITE: '#ffffff',
  VERY_PALE: '#fafbfc',
  
  // Dark Text Colors (for pale backgrounds)
  TEXT_PRIMARY: '#000000',    // Pure black
  TEXT_SECONDARY: '#333333',  // Dark gray
  TEXT_TERTIARY: '#666666',   // Medium gray
  
  // Light Text Colors (for dark backgrounds)
  TEXT_LIGHT: '#ffffff',      // White
  TEXT_LIGHT_SECONDARY: '#e0e0e0', // Light gray
  
  // Borders and Dividers
  BORDER_LIGHT: '#e0e0e0',
  BORDER_PALE: '#f0f0f0',
  
  // Status Colors
  SUCCESS: '#0080ff',         // Ocean blue instead of green
  WARNING: '#003d7a',         // Deep blue instead of orange
  ERROR: '#001f3f',           // Navy blue instead of red
  INFO: '#3399ff',            // Light blue
};

export const THEME_STYLES = {
  // Header/Navigation Styles
  HEADER: {
    backgroundColor: THEME_COLORS.PALE_BLUE,
    color: THEME_COLORS.TEXT_PRIMARY,
    borderBottomColor: THEME_COLORS.BORDER_LIGHT,
  },
  
  // Tab Bar Styles
  TAB_BAR: {
    backgroundColor: THEME_COLORS.PALE_GRAY,
    activeTintColor: THEME_COLORS.TEXT_PRIMARY,
    inactiveTintColor: THEME_COLORS.TEXT_SECONDARY,
    borderTopColor: THEME_COLORS.PRIMARY,
  },
  
  // Card Styles
  CARD: {
    backgroundColor: THEME_COLORS.PALE_GRAY,
    borderColor: THEME_COLORS.BORDER_LIGHT,
    titleColor: THEME_COLORS.TEXT_PRIMARY,
    textColor: THEME_COLORS.TEXT_SECONDARY,
  },
  
  // Button Styles
  BUTTON: {
    primary: {
      backgroundColor: THEME_COLORS.PRIMARY,
      color: THEME_COLORS.TEXT_LIGHT,
    },
    secondary: {
      backgroundColor: THEME_COLORS.PALE_BLUE,
      color: THEME_COLORS.TEXT_PRIMARY,
      borderColor: THEME_COLORS.PRIMARY,
    },
    filter: {
      backgroundColor: THEME_COLORS.VERY_PALE,
      color: THEME_COLORS.TEXT_PRIMARY,
      activeBackgroundColor: THEME_COLORS.PRIMARY,
      activeColor: THEME_COLORS.TEXT_LIGHT,
    },
  },
  
  // Screen Styles
  SCREEN: {
    backgroundColor: THEME_COLORS.PALE_GRAY,
    headerBackgroundColor: THEME_COLORS.PALE_BLUE,
    headerTextColor: THEME_COLORS.TEXT_PRIMARY,
  },
};

// Difficulty Colors (replacing orange with blue variants)
export const DIFFICULTY_COLORS = {
  EASY: THEME_COLORS.PRIMARY,      // Ocean blue
  MODERATE: THEME_COLORS.DEEP_BLUE, // Deep blue
  CHALLENGING: THEME_COLORS.NAVY_BLUE, // Navy blue
};

// Helper function to get text color based on background
export const getTextColorForBackground = (backgroundColor: string): string => {
  // If background is pale/light, use dark text
  const paleBackgrounds = [
    THEME_COLORS.PALE_BLUE,
    THEME_COLORS.PALE_GRAY,
    THEME_COLORS.PALE_WHITE,
    THEME_COLORS.VERY_PALE,
    '#ffffff',
    '#f8f9fa',
    '#f0f8ff',
    '#fafbfc',
  ];
  
  if (paleBackgrounds.includes(backgroundColor)) {
    return THEME_COLORS.TEXT_PRIMARY;
  }
  
  // If background is dark, use light text
  return THEME_COLORS.TEXT_LIGHT;
};

// Helper function to get appropriate button style
export const getButtonStyle = (type: 'primary' | 'secondary' | 'filter' = 'primary') => {
  return THEME_STYLES.BUTTON[type];
};

export default THEME_COLORS;
