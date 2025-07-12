import React from 'react';

// Утилита для динамической загрузки карт Google
export const loadGoogleMapsScript = (apiKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window.google !== 'undefined') {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps'));
    
    document.head.appendChild(script);
  });
};

// Утилита для ленивой загрузки больших компонентов
export const createLazyComponent = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) => {
  return React.lazy(() => 
    importFunc().catch(err => {
      console.error('Failed to load component:', err);
      const FallbackComponent = fallback || (() => React.createElement('div', null, 'Error loading component'));
      return { default: FallbackComponent as T };
    })
  );
};
