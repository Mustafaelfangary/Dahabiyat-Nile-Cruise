'use client';

import { useEffect } from 'react';

/**
 * AdminTextFixer - JavaScript solution to force black text in admin panel
 * This component runs after page load to override any remaining white text
 */
export default function AdminTextFixer() {
  useEffect(() => {
    const forceBlackText = () => {
      // Force all Material-UI input labels to be black
      const labels = document.querySelectorAll('.MuiInputLabel-root');
      labels.forEach((label) => {
        (label as HTMLElement).style.setProperty('color', '#000000', 'important');
        (label as HTMLElement).style.setProperty('-webkit-text-fill-color', '#000000', 'important');
      });

      // Force all Material-UI input text to be black
      const inputs = document.querySelectorAll('.MuiInputBase-input, .MuiOutlinedInput-input, input, textarea');
      inputs.forEach((input) => {
        (input as HTMLElement).style.setProperty('color', '#000000', 'important');
        (input as HTMLElement).style.setProperty('-webkit-text-fill-color', '#000000', 'important');
      });

      // Force all Material-UI select text to be black
      const selects = document.querySelectorAll('.MuiSelect-root, .MuiSelect-select');
      selects.forEach((select) => {
        (select as HTMLElement).style.setProperty('color', '#000000', 'important');
        (select as HTMLElement).style.setProperty('-webkit-text-fill-color', '#000000', 'important');
      });

      // Force all Material-UI menu items to be black
      const menuItems = document.querySelectorAll('.MuiMenuItem-root');
      menuItems.forEach((item) => {
        (item as HTMLElement).style.setProperty('color', '#000000', 'important');
        (item as HTMLElement).style.setProperty('-webkit-text-fill-color', '#000000', 'important');
      });

      // Force all Typography to be black
      const typography = document.querySelectorAll('.MuiTypography-root');
      typography.forEach((text) => {
        (text as HTMLElement).style.setProperty('color', '#000000', 'important');
        (text as HTMLElement).style.setProperty('-webkit-text-fill-color', '#000000', 'important');
      });

      // Force all form control labels to be black
      const formLabels = document.querySelectorAll('.MuiFormControlLabel-label');
      formLabels.forEach((label) => {
        (label as HTMLElement).style.setProperty('color', '#000000', 'important');
        (label as HTMLElement).style.setProperty('-webkit-text-fill-color', '#000000', 'important');
      });

      // Force all text elements to be black (nuclear option)
      const allTextElements = document.querySelectorAll('label, span, div, p, h1, h2, h3, h4, h5, h6');
      allTextElements.forEach((element) => {
        const computedStyle = window.getComputedStyle(element);
        const currentColor = computedStyle.color;
        
        // If text is white or very light, force it to black
        if (currentColor === 'rgb(255, 255, 255)' || 
            currentColor === 'white' || 
            currentColor === '#ffffff' || 
            currentColor === '#fff' ||
            currentColor === 'rgba(255, 255, 255, 1)') {
          (element as HTMLElement).style.setProperty('color', '#000000', 'important');
          (element as HTMLElement).style.setProperty('-webkit-text-fill-color', '#000000', 'important');
        }
      });

      // Special handling for admin layout
      const adminLayout = document.querySelector('.admin-layout');
      if (adminLayout) {
        const allElements = adminLayout.querySelectorAll('*');
        allElements.forEach((element) => {
          const computedStyle = window.getComputedStyle(element);
          const currentColor = computedStyle.color;
          
          // Force black text for white/transparent text
          if (currentColor === 'rgb(255, 255, 255)' || 
              currentColor === 'white' || 
              currentColor === '#ffffff' || 
              currentColor === '#fff' ||
              currentColor === 'rgba(255, 255, 255, 1)' ||
              currentColor === 'rgba(0, 0, 0, 0)' ||
              currentColor === 'transparent') {
            (element as HTMLElement).style.setProperty('color', '#000000', 'important');
            (element as HTMLElement).style.setProperty('-webkit-text-fill-color', '#000000', 'important');
          }
        });
      }
    };

    // Run immediately
    forceBlackText();

    // Run after a short delay to catch dynamically loaded content
    setTimeout(forceBlackText, 100);
    setTimeout(forceBlackText, 500);
    setTimeout(forceBlackText, 1000);

    // Run when DOM changes (for dynamic content)
    const observer = new MutationObserver(() => {
      forceBlackText();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    // Run on window load
    window.addEventListener('load', forceBlackText);

    // Cleanup
    return () => {
      observer.disconnect();
      window.removeEventListener('load', forceBlackText);
    };
  }, []);

  // Also add inline styles as a fallback
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* EMERGENCY CSS OVERRIDE */
      * {
        color: #000000 !important;
        -webkit-text-fill-color: #000000 !important;
      }
      
      .MuiButton-contained,
      .MuiButton-contained *,
      .MuiDialogTitle-root,
      .MuiDialogTitle-root *,
      .MuiChip-colorPrimary,
      .MuiChip-colorPrimary * {
        color: #ffffff !important;
        -webkit-text-fill-color: #ffffff !important;
      }
      
      .MuiTab-root.Mui-selected {
        color: #0080ff !important;
        -webkit-text-fill-color: #0080ff !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null; // This component doesn't render anything
}
