import { useEffect } from 'react';

/**
 * Performance monitoring hook
 * Tracks Core Web Vitals and reports to console
 * Can be extended to send data to analytics services
 */
const usePerformanceMonitoring = () => {
  useEffect(() => {
    // Check if browser supports Performance API
    if (typeof window === 'undefined' || !('performance' in window)) {
      return;
    }

    // Measure First Contentful Paint (FCP)
    const measureFCP = () => {
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      
      if (fcpEntry) {
        console.log('✅ First Contentful Paint:', Math.round(fcpEntry.startTime), 'ms');
        
        // Send to analytics if needed
        if (window.gtag) {
          window.gtag('event', 'timing_complete', {
            name: 'first_contentful_paint',
            value: Math.round(fcpEntry.startTime),
            event_category: 'Web Vitals',
          });
        }
      }
    };

    // Measure Largest Contentful Paint (LCP)
    const measureLCP = () => {
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            
            console.log('✅ Largest Contentful Paint:', Math.round(lastEntry.startTime), 'ms');
            
            if (window.gtag) {
              window.gtag('event', 'timing_complete', {
                name: 'largest_contentful_paint',
                value: Math.round(lastEntry.startTime),
                event_category: 'Web Vitals',
              });
            }
          });
          
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          console.log('LCP measurement not supported');
        }
      }
    };

    // Measure Cumulative Layout Shift (CLS)
    const measureCLS = () => {
      if ('PerformanceObserver' in window) {
        try {
          let clsValue = 0;
          
          const clsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            }
            
            console.log('✅ Cumulative Layout Shift:', clsValue.toFixed(4));
            
            if (window.gtag) {
              window.gtag('event', 'timing_complete', {
                name: 'cumulative_layout_shift',
                value: Math.round(clsValue * 1000),
                event_category: 'Web Vitals',
              });
            }
          });
          
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
          console.log('CLS measurement not supported');
        }
      }
    };

    // Measure First Input Delay (FID)
    const measureFID = () => {
      if ('PerformanceObserver' in window) {
        try {
          const fidObserver = new PerformanceObserver((list) => {
            const firstInput = list.getEntries()[0];
            const fid = firstInput.processingStart - firstInput.startTime;
            
            console.log('✅ First Input Delay:', Math.round(fid), 'ms');
            
            if (window.gtag) {
              window.gtag('event', 'timing_complete', {
                name: 'first_input_delay',
                value: Math.round(fid),
                event_category: 'Web Vitals',
              });
            }
          });
          
          fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {
          console.log('FID measurement not supported');
        }
      }
    };

    // Measure Time to Interactive (TTI)
    const measureTTI = () => {
      if (performance.timing) {
        window.addEventListener('load', () => {
          const timing = performance.timing;
          const tti = timing.domInteractive - timing.navigationStart;
          
          console.log('✅ Time to Interactive:', Math.round(tti), 'ms');
          
          if (window.gtag) {
            window.gtag('event', 'timing_complete', {
              name: 'time_to_interactive',
              value: Math.round(tti),
              event_category: 'Web Vitals',
            });
          }
        });
      }
    };

    // Measure Total Blocking Time (TBT)
    const measureTBT = () => {
      if ('PerformanceObserver' in window) {
        try {
          let tbtValue = 0;
          
          const tbtObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.duration > 50) {
                tbtValue += entry.duration - 50;
              }
            }
            
            console.log('✅ Total Blocking Time:', Math.round(tbtValue), 'ms');
          });
          
          tbtObserver.observe({ entryTypes: ['longtask'] });
        } catch (e) {
          console.log('TBT measurement not supported');
        }
      }
    };

    // Network Information
    const logNetworkInfo = () => {
      if ('connection' in navigator) {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        if (connection) {
          console.log('📡 Network Info:', {
            effectiveType: connection.effectiveType,
            downlink: connection.downlink,
            rtt: connection.rtt,
            saveData: connection.saveData,
          });
        }
      }
    };

    // Memory Usage (if available)
    const logMemoryInfo = () => {
      if (performance.memory) {
        console.log('💾 Memory Usage:', {
          usedJSHeapSize: (performance.memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
          totalJSHeapSize: (performance.memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
          limit: (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB',
        });
      }
    };

    // Initialize all measurements
    measureFCP();
    measureLCP();
    measureCLS();
    measureFID();
    measureTTI();
    measureTBT();
    logNetworkInfo();
    logMemoryInfo();

    // Log page load time
    window.addEventListener('load', () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      console.log('⚡ Page Load Time:', Math.round(loadTime), 'ms');
    });

  }, []);
};

export default usePerformanceMonitoring;
