/**
 * UI Components for Dahabiyat Mobile App
 * Ocean Blue Theme with Egyptian-inspired design
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';

// Colors
const COLORS = {
  PRIMARY: '#0080ff',
  SECONDARY: '#f0f8ff',
  BACKGROUND: '#f8f9fa',
  TEXT: '#000000',
  TEXT_SECONDARY: '#333333',
  WHITE: '#ffffff',
  GOLD: '#FFD700',
};

// Button Component
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
}) => {
  const buttonStyle = [
    styles.button,
    variant === 'primary' && styles.buttonPrimary,
    variant === 'secondary' && styles.buttonSecondary,
    variant === 'outline' && styles.buttonOutline,
    disabled && styles.buttonDisabled,
    style,
  ];

  const textStyle = [
    styles.buttonText,
    variant === 'primary' && styles.buttonTextPrimary,
    variant === 'secondary' && styles.buttonTextSecondary,
    variant === 'outline' && styles.buttonTextOutline,
    disabled && styles.buttonTextDisabled,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

// Card Component
interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

// Typography Components
interface TextProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export const Heading1: React.FC<TextProps> = ({ children, style }) => {
  return <Text style={[styles.heading1, style]}>{children}</Text>;
};

export const Heading2: React.FC<TextProps> = ({ children, style }) => {
  return <Text style={[styles.heading2, style]}>{children}</Text>;
};

export const BodyText: React.FC<TextProps> = ({ children, style }) => {
  return <Text style={[styles.bodyText, style]}>{children}</Text>;
};

export const AccentText: React.FC<TextProps> = ({ children, style }) => {
  return <Text style={[styles.accentText, style]}>{children}</Text>;
};

// Loading Spinner
interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = COLORS.PRIMARY,
}) => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size={size} color={color} />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
};

// Hieroglyphic Text Component
interface HieroglyphicTextProps {
  fontSize?: number;
  color?: string;
  isTop?: boolean;
  style?: ViewStyle;
}

export const HieroglyphicText: React.FC<HieroglyphicTextProps> = ({
  fontSize = 12,
  color,
  isTop = true,
  style,
}) => {
  return (
    <View style={[
      styles.hieroglyphicContainer,
      isTop ? styles.hieroglyphicTop : styles.hieroglyphicBottom,
      style
    ]}>
      <Text style={[
        styles.hieroglyphicText,
        {
          fontSize,
          color: color || COLORS.TEXT_SECONDARY + '99', // Add transparency
        }
      ]}>
        𓎢𓃭𓅂𓅱𓄿𓂋𓄿
      </Text>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  // Button Styles
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonPrimary: {
    backgroundColor: COLORS.PRIMARY,
  },
  buttonSecondary: {
    backgroundColor: COLORS.SECONDARY,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTextPrimary: {
    color: COLORS.WHITE,
  },
  buttonTextSecondary: {
    color: COLORS.PRIMARY,
  },
  buttonTextOutline: {
    color: COLORS.PRIMARY,
  },
  buttonTextDisabled: {
    color: '#999999',
  },

  // Card Styles
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  // Typography Styles
  heading1: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#003d7a',
    marginBottom: 10,
  },
  heading2: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#003d7a',
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 24,
  },
  accentText: {
    fontSize: 14,
    color: COLORS.GOLD,
    fontWeight: 'bold',
  },

  // Loading Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
  },

  // Hieroglyphic Text Styles
  hieroglyphicContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  hieroglyphicTop: {
    paddingTop: 8,
    paddingBottom: 4,
  },
  hieroglyphicBottom: {
    paddingTop: 12,
    paddingBottom: 8,
  },
  hieroglyphicText: {
    fontWeight: '300',
    letterSpacing: 2,
    textAlign: 'center',
    opacity: 0.6,
  },
});

export { COLORS };
