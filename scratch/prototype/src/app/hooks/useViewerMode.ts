import { useState, useEffect } from 'react';

/**
 * Returns true on mobile and tablet viewports (< 1024px).
 * On these devices the app is in "viewer mode": read-only, no create/edit actions.
 */
export function useViewerMode() {
  const [isViewer, setIsViewer] = useState(
    () => typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    setIsViewer(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsViewer(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return isViewer;
}
