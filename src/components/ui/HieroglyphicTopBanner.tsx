'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface HieroglyphicTopBannerProps {
  className?: string;
  variant?: 'default' | 'minimal' | 'elegant';
  animated?: boolean;
}

const HieroglyphicTopBanner: React.FC<HieroglyphicTopBannerProps> = ({
  className = '',
  variant = 'default',
  animated = true
}) => {
  const hieroglyphicText = '𓎢𓃭𓅂𓅱𓄿𓂋𓄿';

  const bannerVariants = {
    default: {
      background: 'linear-gradient(135deg, #0080ff 0%, #0066cc 25%, #003d7a 50%, #001f3f 75%, #0080ff 100%)',
      textColor: 'text-white',
      shadow: 'shadow-lg',
      padding: 'py-3 px-4',
      border: 'border-b-2 border-blue-600/30'
    },
    minimal: {
      background: 'linear-gradient(135deg, #0080ff 0%, #0066cc 50%, #0080ff 100%)',
      textColor: 'text-black',
      shadow: 'shadow-md',
      padding: 'py-1 px-4',
      border: 'border-b border-blue-300/50'
    },
    elegant: {
      background: 'linear-gradient(135deg, #003d7a 0%, #001f3f 25%, #0080ff 50%, #001f3f 75%, #003d7a 100%)',
      textColor: 'text-white',
      shadow: 'shadow-xl',
      padding: 'py-4 px-6',
      border: 'border-b-4 border-blue-400/50'
    }
  };

  const currentVariant = bannerVariants[variant];

  const containerAnimation = {
    initial: { y: -100, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.8
      }
    }
  };

  const textAnimation = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        delay: 0.3,
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const glowAnimation = {
    animate: {
      textShadow: [
        '0 0 5px rgba(51, 153, 255, 0.5)',
        '0 0 15px rgba(51, 153, 255, 0.8)',
        '0 0 25px rgba(51, 153, 255, 0.6)',
        '0 0 15px rgba(51, 153, 255, 0.8)',
        '0 0 5px rgba(51, 153, 255, 0.5)'
      ],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const Component = animated ? motion.div : 'div';
  const TextComponent = animated ? motion.div : 'div';

  return (
    <Component
      className={`
        fixed top-0 left-0 right-0 z-[70] fixed-top-mobile
        ${currentVariant.background}
        ${currentVariant.shadow}
        ${currentVariant.padding}
        ${currentVariant.border}
        backdrop-blur-sm
        ${className}
      `}
      style={variant === 'default' ? {
        background: currentVariant.background,
        paddingTop: 'max(env(safe-area-inset-top), 0.75rem)'
      } : variant === 'minimal' ? {
        background: currentVariant.background,
        paddingTop: 'max(env(safe-area-inset-top), 0.25rem)'
      } : {
        paddingTop: 'max(env(safe-area-inset-top), 0.75rem)'
      }}
      {...(animated ? containerAnimation : {})}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-center">
          {/* Left decorative elements */}
          <div className="hidden md:flex items-center space-x-2 mr-6">
            <motion.span
              className={`text-lg ${currentVariant.textColor} opacity-70`}
              animate={animated ? {
                rotate: [0, 10, -10, 0],
                transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              } : {}}
            >
              𓎢𓃭𓅂𓅱𓄿𓂋𓄿
            </motion.span>
          </div>

          {/* Main hieroglyphic text */}
          <TextComponent
            className={`
              ${variant === 'minimal' ? 'text-sm' : 'text-2xl md:text-3xl lg:text-4xl'} font-bold
              ${currentVariant.textColor}
              tracking-wider
              text-center
              select-none
            `}
            {...(animated ? textAnimation : {})}
            {...(animated ? glowAnimation : {})}
          >
            {hieroglyphicText}
          </TextComponent>

          {/* Right decorative elements */}
          <div className="hidden md:flex items-center space-x-2 ml-6">
            <motion.span
              className={`text-lg ${currentVariant.textColor} opacity-70`}
              animate={animated ? {
                scale: [1, 1.1, 1],
                transition: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }
              } : {}}
            >
              𓎢𓃭𓅂𓅱𓄿𓂋𓄿
            </motion.span>
          </div>
        </div>

        {/* Mobile decorative elements */}
        <div className="md:hidden flex items-center justify-center mt-2 space-x-4">
          <motion.span 
            className={`text-sm ${currentVariant.textColor} opacity-60`}
            animate={animated ? {
              y: [0, -2, 0],
              transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            } : {}}
          >
            𓎢
          </motion.span>
          <motion.span
            className={`text-sm ${currentVariant.textColor} opacity-60`}
            animate={animated ? {
              y: [0, 2, 0],
              transition: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
            } : {}}
          >
            𓃭
          </motion.span>
          <motion.span
            className={`text-sm ${currentVariant.textColor} opacity-60`}
            animate={animated ? {
              y: [0, -2, 0],
              transition: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }
            } : {}}
          >
            𓅂
          </motion.span>
        </div>
      </div>

      {/* Subtle pattern overlay for elegant variant */}
      {variant === 'elegant' && (
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFD700' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}
        />
      )}
    </Component>
  );
};

export default HieroglyphicTopBanner;
