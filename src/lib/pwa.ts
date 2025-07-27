"use client";

// PWA installation and management utilities
export class PWAManager {
  private static instance: PWAManager;
  private deferredPrompt: any = null;
  private isInstalled = false;
  private isStandalone = false;

  static getInstance(): PWAManager {
    if (!PWAManager.instance) {
      PWAManager.instance = new PWAManager();
    }
    return PWAManager.instance;
  }

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  private init() {
    // Check if app is running in standalone mode
    this.isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                       (window.navigator as any).standalone ||
                       document.referrer.includes('android-app://');

    // Check if app is already installed
    this.isInstalled = this.isStandalone;

    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallBanner();
    });

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.hideInstallBanner();
      this.trackEvent('pwa_installed');
    });

    // Register service worker
    this.registerServiceWorker();
  }

  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
        
        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                this.showUpdateBanner();
              }
            });
          }
        });
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  async installApp(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    try {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        this.trackEvent('pwa_install_accepted');
        return true;
      } else {
        this.trackEvent('pwa_install_dismissed');
        return false;
      }
    } catch (error) {
      console.error('Error installing app:', error);
      return false;
    } finally {
      this.deferredPrompt = null;
    }
  }

  canInstall(): boolean {
    return !!this.deferredPrompt && !this.isInstalled;
  }

  isAppInstalled(): boolean {
    return this.isInstalled;
  }

  isRunningStandalone(): boolean {
    return this.isStandalone;
  }

  private showInstallBanner() {
    // Create install banner
    const banner = document.createElement('div');
    banner.id = 'pwa-install-banner';
    banner.className = 'pwa-install-banner';
    banner.innerHTML = `
      <div class="pwa-banner-content">
        <div class="pwa-banner-icon">📱</div>
        <div class="pwa-banner-text">
          <h3>Install Cleopatra Dahabiyat</h3>
          <p>Get the full app experience with offline access</p>
        </div>
        <div class="pwa-banner-actions">
          <button id="pwa-install-btn" class="pwa-install-btn">Install</button>
          <button id="pwa-dismiss-btn" class="pwa-dismiss-btn">×</button>
        </div>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .pwa-install-banner {
        position: fixed;
        bottom: 20px;
        left: 20px;
        right: 20px;
        background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%);
        color: #1a1a2e;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideUp 0.3s ease-out;
      }
      
      .pwa-banner-content {
        display: flex;
        align-items: center;
        padding: 16px;
        gap: 12px;
      }
      
      .pwa-banner-icon {
        font-size: 32px;
      }
      
      .pwa-banner-text h3 {
        margin: 0 0 4px 0;
        font-size: 16px;
        font-weight: bold;
      }
      
      .pwa-banner-text p {
        margin: 0;
        font-size: 14px;
        opacity: 0.8;
      }
      
      .pwa-banner-actions {
        margin-left: auto;
        display: flex;
        gap: 8px;
      }
      
      .pwa-install-btn {
        background: #1a1a2e;
        color: #d4af37;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        font-weight: bold;
        cursor: pointer;
      }
      
      .pwa-dismiss-btn {
        background: transparent;
        border: none;
        color: #1a1a2e;
        font-size: 20px;
        cursor: pointer;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      @keyframes slideUp {
        from { transform: translateY(100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      
      @media (max-width: 768px) {
        .pwa-install-banner {
          left: 10px;
          right: 10px;
          bottom: 10px;
        }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(banner);

    // Add event listeners
    document.getElementById('pwa-install-btn')?.addEventListener('click', () => {
      this.installApp();
    });

    document.getElementById('pwa-dismiss-btn')?.addEventListener('click', () => {
      this.hideInstallBanner();
      this.trackEvent('pwa_install_banner_dismissed');
    });

    this.trackEvent('pwa_install_banner_shown');
  }

  private hideInstallBanner() {
    const banner = document.getElementById('pwa-install-banner');
    if (banner) {
      banner.remove();
    }
  }

  private showUpdateBanner() {
    // Create update banner
    const banner = document.createElement('div');
    banner.id = 'pwa-update-banner';
    banner.className = 'pwa-update-banner';
    banner.innerHTML = `
      <div class="pwa-banner-content">
        <div class="pwa-banner-icon">🔄</div>
        <div class="pwa-banner-text">
          <h3>Update Available</h3>
          <p>A new version is ready to install</p>
        </div>
        <div class="pwa-banner-actions">
          <button id="pwa-update-btn" class="pwa-install-btn">Update</button>
          <button id="pwa-update-dismiss-btn" class="pwa-dismiss-btn">×</button>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    // Add event listeners
    document.getElementById('pwa-update-btn')?.addEventListener('click', () => {
      this.updateApp();
    });

    document.getElementById('pwa-update-dismiss-btn')?.addEventListener('click', () => {
      banner.remove();
    });
  }

  private async updateApp() {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration?.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    }
  }

  private trackEvent(eventName: string, data?: any) {
    // Track PWA events for analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, {
        event_category: 'PWA',
        ...data
      });
    }
  }

  // Offline detection
  getNetworkStatus(): { online: boolean; effectiveType?: string } {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    return {
      online: navigator.onLine,
      effectiveType: connection?.effectiveType
    };
  }

  // App shortcuts
  addShortcut(name: string, url: string, icon?: string) {
    if ('shortcuts' in navigator) {
      // This is a proposed API, not yet widely supported
      console.log('Adding shortcut:', name, url);
    }
  }

  // Share API
  async share(data: { title: string; text: string; url: string }): Promise<boolean> {
    if (navigator.share) {
      try {
        await navigator.share(data);
        this.trackEvent('pwa_share_success');
        return true;
      } catch (error) {
        console.error('Error sharing:', error);
        this.trackEvent('pwa_share_error');
        return false;
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(data.url);
        this.trackEvent('pwa_share_fallback');
        return true;
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        return false;
      }
    }
  }

  // Badge API (for notifications)
  setBadge(count: number) {
    if ('setAppBadge' in navigator) {
      (navigator as any).setAppBadge(count);
    }
  }

  clearBadge() {
    if ('clearAppBadge' in navigator) {
      (navigator as any).clearAppBadge();
    }
  }

  // Wake Lock API (prevent screen from sleeping)
  async requestWakeLock(): Promise<any> {
    if ('wakeLock' in navigator) {
      try {
        const wakeLock = await (navigator as any).wakeLock.request('screen');
        return wakeLock;
      } catch (error) {
        console.error('Wake lock request failed:', error);
        return null;
      }
    }
    return null;
  }
}

// Offline storage utilities
export class OfflineStorage {
  private dbName = 'CleopatraDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('dahabiyas')) {
          db.createObjectStore('dahabiyas', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('packages')) {
          db.createObjectStore('packages', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('content')) {
          db.createObjectStore('content', { keyPath: 'key' });
        }
      };
    });
  }

  async store(storeName: string, data: any): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async get(storeName: string, key: string): Promise<any> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async getAll(storeName: string): Promise<any[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }
}

// Initialize PWA manager
export const pwaManager = typeof window !== 'undefined' ? PWAManager.getInstance() : null;
export const offlineStorage = new OfflineStorage();
