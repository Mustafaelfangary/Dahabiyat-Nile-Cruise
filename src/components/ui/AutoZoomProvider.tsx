"use client";

import React, { useEffect } from 'react';
import ZoomableImage from './ZoomableImage';

// Extend HTMLImageElement to include our custom cleanup function
declare global {
  interface HTMLImageElement {
    __zoomCleanup?: () => void;
  }
}

interface AutoZoomProviderProps {
  children: React.ReactNode;
  enabled?: boolean;
}

export default function AutoZoomProvider({ children, enabled = true }: AutoZoomProviderProps) {
  useEffect(() => {
    if (!enabled) return;

    // Function to replace regular images with zoomable ones
    const replaceImages = () => {
      const images = document.querySelectorAll('img:not([data-zoomable-processed])');
      
      images.forEach((img) => {
        // Skip admin panel images, gallery components with existing lightbox, and certain system images
        if (
          img.closest('.admin-panel') ||
          img.closest('[data-no-zoom]') ||
          img.closest('.lightbox-gallery') ||
          img.closest('.existing-lightbox') ||
          img.closest('.itinerary-gallery') ||
          img.getAttribute('src')?.includes('admin') ||
          img.getAttribute('alt')?.toLowerCase().includes('logo') ||
          img.getAttribute('alt')?.toLowerCase().includes('icon') ||
          img.classList.contains('no-zoom') ||
          img.hasAttribute('data-lightbox') ||
          // Skip images that are already part of existing gallery systems
          img.closest('[class*="lightbox"]') ||
          img.closest('[class*="gallery-modal"]')
        ) {
          return;
        }

        // Mark as processed
        img.setAttribute('data-zoomable-processed', 'true');

        // Add hover effects
        img.style.transition = 'transform 0.3s ease, filter 0.3s ease';
        img.style.cursor = 'pointer';

        // Add hover listeners
        const handleMouseEnter = () => {
          img.style.transform = 'scale(1.05)';
          img.style.filter = 'brightness(1.1)';
          img.style.boxShadow = '0 8px 32px rgba(0, 128, 255, 0.3)';
        };

        const handleMouseLeave = () => {
          img.style.transform = 'scale(1)';
          img.style.filter = 'brightness(1)';
          img.style.boxShadow = 'none';
        };

        const handleClick = (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
          
          // Create and show zoom modal
          showZoomModal(img.src, img.alt || 'Image');
        };

        img.addEventListener('mouseenter', handleMouseEnter);
        img.addEventListener('mouseleave', handleMouseLeave);
        img.addEventListener('click', handleClick);

        // Store cleanup function
        img.__zoomCleanup = () => {
          img.removeEventListener('mouseenter', handleMouseEnter);
          img.removeEventListener('mouseleave', handleMouseLeave);
          img.removeEventListener('click', handleClick);
        };
      });
    };

    // Function to show zoom modal
    const showZoomModal = (src: string, alt: string) => {
      // Create modal elements
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4';
      modal.style.zIndex = '9999';

      // Close button
      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = `
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      `;
      closeBtn.className = 'absolute top-4 right-4 z-[10000] bg-egyptian-gold/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-egyptian-gold/40 transition-all duration-200';
      closeBtn.setAttribute('aria-label', 'Close zoom');

      // Egyptian decorative elements
      const decorations = [
        { text: '𓇳', position: 'top-4 left-4' },
        { text: '𓊪', position: 'top-4 right-20' },
        { text: '𓈖', position: 'bottom-4 left-4' },
        { text: '𓂀', position: 'bottom-4 right-4' }
      ];

      decorations.forEach(({ text, position }) => {
        const decoration = document.createElement('div');
        decoration.textContent = text;
        decoration.className = `absolute ${position} text-egyptian-gold text-2xl animate-pulse`;
        modal.appendChild(decoration);
      });

      // Image container
      const imgContainer = document.createElement('div');
      imgContainer.className = 'relative max-w-[95vw] max-h-[95vh] w-full h-full flex items-center justify-center';

      // Zoomed image
      const zoomedImg = document.createElement('img');
      zoomedImg.src = src;
      zoomedImg.alt = alt;
      zoomedImg.className = 'max-w-full max-h-full object-contain';
      zoomedImg.style.maxWidth = '95vw';
      zoomedImg.style.maxHeight = '95vh';

      // Bottom info
      const info = document.createElement('div');
      info.innerHTML = '<span class="mr-2">𓏏</span>Click anywhere to close<span class="ml-2">𓇯</span>';
      info.className = 'absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-hieroglyph-brown/80 backdrop-blur-sm text-egyptian-gold px-6 py-2 rounded-full text-sm font-medium';

      // Assemble modal
      imgContainer.appendChild(zoomedImg);
      modal.appendChild(closeBtn);
      modal.appendChild(imgContainer);
      modal.appendChild(info);

      // Close handlers
      const closeModal = () => {
        document.body.style.overflow = 'unset';
        modal.remove();
      };

      closeBtn.addEventListener('click', closeModal);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });

      // Escape key handler
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeModal();
          document.removeEventListener('keydown', handleEscape);
        }
      };
      document.addEventListener('keydown', handleEscape);

      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      // Add to DOM
      document.body.appendChild(modal);
    };

    // Initial replacement
    replaceImages();

    // Set up mutation observer for dynamic content
    const observer = new MutationObserver((mutations) => {
      let shouldReplace = false;
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.tagName === 'IMG' || element.querySelector('img')) {
                shouldReplace = true;
              }
            }
          });
        }
      });
      
      if (shouldReplace) {
        setTimeout(replaceImages, 100); // Small delay to ensure DOM is ready
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Cleanup function
    return () => {
      observer.disconnect();
      
      // Clean up existing event listeners
      const processedImages = document.querySelectorAll('img[data-zoomable-processed]');
      processedImages.forEach((img) => {
        const imageElement = img as HTMLImageElement;
        if (imageElement.__zoomCleanup) {
          imageElement.__zoomCleanup();
        }
      });
    };
  }, [enabled]);

  return <>{children}</>;
}

// CSS styles to inject
export const autoZoomStyles = `
  .zoomable-image-hover {
    transition: transform 0.3s ease, filter 0.3s ease, box-shadow 0.3s ease;
  }
  
  .zoomable-image-hover:hover {
    transform: scale(1.05);
    filter: brightness(1.1);
    box-shadow: 0 8px 32px rgba(0, 128, 255, 0.3);
  }
`;
