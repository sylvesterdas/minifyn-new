
'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import NProgress from 'nprogress';

export function PageLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.configure({ showSpinner: false });

    const handleStart = () => NProgress.start();
    const handleStop = () => NProgress.done();

    // We need to use a mutation observer because the Next.js router
    // events are not reliable enough for this purpose.
    // This ensures that we catch all navigations.
    const observer = new MutationObserver((mutations) => {
        const url = window.location.href;
        const previousUrl = mutations[0]?.oldValue;
        
        if (url !== previousUrl) {
            handleStop();
        }
    });

    // Start observing the 'href' attribute of the body tag,
    // which Next.js updates on route changes.
    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['href'],
        attributeOldValue: true,
    });
    
    // Fallback to router events
    // This is not perfect but can help in some cases.
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
        // Only start progress if the URL is actually changing
        if (args[2] !== window.location.pathname) {
            handleStart();
        }
        originalPushState.apply(history, args);
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function(...args) {
         // Only start progress if the URL is actually changing
        if (args[2] !== window.location.pathname) {
            handleStart();
        }
        originalReplaceState.apply(history, args);
    };

    window.addEventListener('popstate', handleStart);

    return () => {
        handleStop();
        observer.disconnect();
        history.pushState = originalPushState;
        history.replaceState = originalReplaceState;
        window.removeEventListener('popstate', handleStart);
    };
  }, []);

  useEffect(() => {
    // This effect is to catch route changes that the observer might miss.
    NProgress.done();
  }, [pathname, searchParams]);

  return null;
}
