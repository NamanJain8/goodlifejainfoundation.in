import React, { useState, useEffect } from 'react';
import Icon from './Icon';

interface AppInstallBannerProps {
  className?: string;
}

const AppInstallBanner: React.FC<AppInstallBannerProps> = ({ className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>('other');

  // App store URLs from the search results
  const APP_STORE_URLS = {
    ios: 'https://apps.apple.com/us/app/keyman/id933676545',
    android: 'https://play.google.com/store/apps/details?id=com.tavultesoft.kmapro&hl=en_IN'
  };

  // Check if banner was previously dismissed
  const BANNER_DISMISSED_KEY = 'keyman-app-banner-dismissed';

  // Detect mobile platform
  const detectPlatform = (): 'ios' | 'android' | 'other' => {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (/iphone|ipad|ipod/.test(userAgent)) {
      return 'ios';
    } else if (/android/.test(userAgent)) {
      return 'android';
    }
    
    return 'other';
  };

  // Check if user is on mobile device
  const isMobileDevice = (): boolean => {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i;
    const hasTouchScreen = typeof navigator.maxTouchPoints === 'number' && navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;
    
    return mobileRegex.test(userAgent) || (hasTouchScreen && isSmallScreen);
  };

  // Check if app is likely already installed (basic heuristics)
  const isAppLikelyInstalled = (): boolean => {
    // Check if running in standalone mode (PWA/home screen app)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return true;
    }
    
    // Check if running in app webview (basic detection)
    if (navigator.userAgent.includes('wv') || navigator.userAgent.includes('Version/')) {
      return true;
    }
    
    return false;
  };

  useEffect(() => {
    // Clear localStorage on page refresh to reset banner dismissal
    localStorage.clear();
    
    const detectedPlatform = detectPlatform();
    setPlatform(detectedPlatform);

    // Only show banner if:
    // 1. User is on mobile
    // 2. Platform is iOS or Android
    // 3. Banner hasn't been dismissed
    // 4. App is not likely already installed
    const wasDismissed = localStorage.getItem(BANNER_DISMISSED_KEY) === 'true';
    const shouldShow = isMobileDevice() && 
                      (detectedPlatform === 'ios' || detectedPlatform === 'android') && 
                      !wasDismissed &&
                      !isAppLikelyInstalled();

    if (shouldShow) {
      // Show banner after a small delay to avoid interrupting page load
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(BANNER_DISMISSED_KEY, 'true');
  };

  const handleInstallClick = () => {
    // Track analytics if needed
    console.log(`User clicked to install Keyman app for ${platform}`);
    
    // Open app store in new tab
    window.open(APP_STORE_URLS[platform as keyof typeof APP_STORE_URLS], '_blank');
    
    // Dismiss banner after click
    handleDismiss();
  };

  if (!isVisible || platform === 'other') {
    return null;
  }

  const platformData = {
    ios: {
      name: 'iOS',
      storeName: 'App Store',
      description: 'Write in Indic Languages with Keyman'
    },
    android: {
      name: 'Android',
      storeName: 'Google Play',
      description: 'Write in Indic Languages with Keyman'
    }
  };

  const data = platformData[platform];

  return (
    <div className={`app-install-banner ${className}`}>
      <div className="banner-content">
        <div className="banner-icon">
          <div className="app-icon">
            {/* Keyman logo placeholder - you can replace with actual logo */}
            <span className="keyman-icon">⌨️</span>
          </div>
        </div>
        
        <div className="banner-text">
          <div className="app-name">
            <strong>Keyman</strong>
            <span className="app-subtitle">Type in 1700+ languages</span>
          </div>
          <p className="app-description">{data.description}</p>
        </div>
        
        <div className="banner-actions">
          <button 
            className="install-button"
            onClick={handleInstallClick}
            aria-label={`Install Keyman from ${data.storeName}`}
          >
            <div className="install-text">
              <small>GET</small>
              <strong>{data.storeName}</strong>
            </div>
          </button>
          
          <button 
            className="dismiss-button"
            onClick={handleDismiss}
            aria-label="Dismiss banner"
          >
            <Icon name="X" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppInstallBanner;
