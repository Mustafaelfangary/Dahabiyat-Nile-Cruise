/**
 * Hieroglyphic Top Banner for Mobile App
 * Displays the beautiful hieroglyphic text at the top of every screen
 */

import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { BodyText } from './ui';
import HieroglyphicText from './HieroglyphicText';

const { width: screenWidth } = Dimensions.get('window');

interface HieroglyphicTopBannerProps {
  variant?: 'default' | 'minimal' | 'elegant';
  animated?: boolean;
  style?: any;
}

const HieroglyphicTopBanner: React.FC<HieroglyphicTopBannerProps> = ({
  variant = 'default',
  animated = true,
  style
}) => {
  const { colors } = useTheme();
  const hieroglyphicText = '𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿';

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(-50)).current;
  const glowAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (animated) {
      // Initial entrance animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Continuous glow animation
      const glowAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: false,
          }),
        ])
      );
      glowAnimation.start();

      return () => glowAnimation.stop();
    }
  }, [animated, fadeAnim, slideAnim, glowAnim]);

  const getVariantStyles = () => {
    switch (variant) {
      case 'minimal':
        return {
          backgroundColor: colors.background.secondary || '#FFF8DC',
          borderBottomColor: colors.primary || '#D4AF37',
          borderBottomWidth: 1,
          paddingVertical: 8,
        };
      case 'elegant':
        return {
          backgroundColor: colors.primary || '#D4AF37',
          borderBottomColor: colors.accent || '#FFD700',
          borderBottomWidth: 3,
          paddingVertical: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        };
      default:
        return {
          backgroundColor: colors.primary || '#D4AF37',
          borderBottomColor: colors.accent || '#FFD700',
          borderBottomWidth: 2,
          paddingVertical: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 4,
        };
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'minimal':
        return colors.text.primary || '#8B4513';
      default:
        return colors.text.inverse || '#FFFFFF';
    }
  };

  const variantStyles = getVariantStyles();
  const textColor = getTextColor();

  const animatedStyle = animated ? {
    opacity: fadeAnim,
    transform: [{ translateY: slideAnim }],
  } : {};

  return (
    <Animated.View style={[styles.container, variantStyles, animatedStyle, style]}>
      {/* Background gradient overlay for elegant variant */}
      {variant === 'elegant' && (
        <View style={styles.gradientOverlay} />
      )}

      <View style={styles.content}>
        {/* Left decorative elements */}
        <View style={styles.decorativeLeft}>
          <HieroglyphicText
            text="𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿"
            size="small"
            animated={animated}
            animationType="rotate"
            style={[styles.decorativeText, { color: textColor }]}
          />
        </View>

        {/* Main hieroglyphic text */}
        <View style={styles.mainTextContainer}>
          <HieroglyphicText
            text={hieroglyphicText}
            size="large"
            animated={animated}
            animationType="glow"
            style={[styles.mainText, { color: textColor }]}
          />
        </View>

        {/* Right decorative elements */}
        <View style={styles.decorativeRight}>
          <HieroglyphicText
            text="𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿"
            size="small"
            animated={animated}
            animationType="pulse"
            style={[styles.decorativeText, { color: textColor }]}
          />
        </View>
      </View>

      {/* Bottom decorative line for elegant variant */}
      {variant === 'elegant' && (
        <View style={styles.bottomDecoration}>
          <HieroglyphicText
            text="𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿"
            size="tiny"
            animated={animated}
            animationType="wave"
            style={[styles.bottomText, { color: textColor }]}
          />
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1000,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    width: '100%',
    maxWidth: screenWidth - 32,
  },
  decorativeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    opacity: 0.7,
  },
  decorativeRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    opacity: 0.7,
  },
  decorativeText: {
    marginHorizontal: 4,
    fontSize: 16,
  },
  mainTextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 2,
  },
  bottomDecoration: {
    position: 'absolute',
    bottom: 2,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  bottomText: {
    fontSize: 10,
    opacity: 0.6,
    letterSpacing: 1,
  },
});

export default HieroglyphicTopBanner;
