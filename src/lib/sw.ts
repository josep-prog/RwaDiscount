// Service Worker registration and management

export interface ServiceWorkerRegistrationResult {
  success: boolean;
  registration?: ServiceWorkerRegistration;
  error?: Error;
}

export const registerServiceWorker = async (): Promise<ServiceWorkerRegistrationResult> => {
  if (!('serviceWorker' in navigator)) {
    console.log('[SW] Service Worker not supported');
    return { success: false, error: new Error('Service Worker not supported') };
  }

  try {
    console.log('[SW] Registering Service Worker...');
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    console.log('[SW] Registration successful:', registration);

    // Handle updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        console.log('[SW] New Service Worker installing...');
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('[SW] New Service Worker installed, show update available');
            // Show update notification to user
            showUpdateAvailableNotification();
          }
        });
      }
    });

    return { success: true, registration };
  } catch (error) {
    console.error('[SW] Registration failed:', error);
    return { success: false, error: error as Error };
  }
};

export const unregisterServiceWorker = async (): Promise<boolean> => {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.unregister();
      console.log('[SW] Service Worker unregistered');
      return true;
    }
    return false;
  } catch (error) {
    console.error('[SW] Unregistration failed:', error);
    return false;
  }
};

// Check if app is running as PWA
export const isPWA = (): boolean => {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone ||
    document.referrer.includes('android-app://')
  );
};

// Check if PWA install prompt is available
export const canInstallPWA = (): boolean => {
  return 'beforeinstallprompt' in window;
};

// Show update available notification
const showUpdateAvailableNotification = () => {
  // You can implement a more sophisticated update notification here
  // For now, we'll show a simple console message
  console.log('[SW] App update available! Refresh to get the latest version.');
  
  // Optional: Show a toast notification or modal
  if (window.confirm('A new version of RwaDiscount is available! Would you like to refresh to get the latest features?')) {
    window.location.reload();
  }
};

// Install prompt handling
let deferredPrompt: any = null;

export const setupInstallPrompt = () => {
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('[PWA] Install prompt available');
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Show your custom install button/banner
    showInstallBanner();
  });

  window.addEventListener('appinstalled', () => {
    console.log('[PWA] App installed successfully');
    // Hide install banner if shown
    hideInstallBanner();
    // Clear the deferredPrompt
    deferredPrompt = null;
  });
};

export const promptInstall = async (): Promise<boolean> => {
  if (!deferredPrompt) {
    console.log('[PWA] Install prompt not available');
    return false;
  }

  try {
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const choiceResult = await deferredPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      console.log('[PWA] User accepted the install prompt');
      return true;
    } else {
      console.log('[PWA] User dismissed the install prompt');
      return false;
    }
  } catch (error) {
    console.error('[PWA] Error showing install prompt:', error);
    return false;
  } finally {
    // Clear the deferredPrompt
    deferredPrompt = null;
    hideInstallBanner();
  }
};

// These functions can be customized based on your UI framework
const showInstallBanner = () => {
  // Create and show your custom install banner/button
  console.log('[PWA] Show install banner');
  
  // Example: Create a simple banner
  const banner = document.createElement('div');
  banner.id = 'pwa-install-banner';
  banner.innerHTML = `
    <div style="
      position: fixed;
      bottom: 20px;
      left: 20px;
      right: 20px;
      background: #2563eb;
      color: white;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    ">
      <div>
        <div style="font-weight: bold; margin-bottom: 4px;">Install RwaDiscount</div>
        <div style="font-size: 14px; opacity: 0.9;">Add to your home screen for quick access</div>
      </div>
      <div>
        <button onclick="window.dismissInstallBanner()" style="
          background: transparent;
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          padding: 8px 12px;
          border-radius: 4px;
          margin-right: 8px;
          cursor: pointer;
        ">Later</button>
        <button onclick="window.triggerInstall()" style="
          background: white;
          border: none;
          color: #2563eb;
          padding: 8px 16px;
          border-radius: 4px;
          font-weight: bold;
          cursor: pointer;
        ">Install</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(banner);
  
  // Add global functions for banner interactions
  (window as any).dismissInstallBanner = hideInstallBanner;
  (window as any).triggerInstall = promptInstall;
};

const hideInstallBanner = () => {
  const banner = document.getElementById('pwa-install-banner');
  if (banner) {
    banner.remove();
  }
};

// Network status detection
export const setupNetworkStatusDetection = () => {
  const updateOnlineStatus = () => {
    const isOnline = navigator.onLine;
    console.log('[Network]', isOnline ? 'Online' : 'Offline');
    
    // You can dispatch custom events or update app state here
    window.dispatchEvent(new CustomEvent('network-status-change', {
      detail: { isOnline }
    }));
  };

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  
  // Initial check
  updateOnlineStatus();
};
