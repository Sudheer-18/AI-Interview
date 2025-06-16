import { useEffect, useCallback } from 'react';

interface UseTabVisibilityProps {
  onTabSwitch: () => void;
  isActive: boolean;
}

export const useTabVisibility = ({ onTabSwitch, isActive }: UseTabVisibilityProps) => {
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden && isActive) {
      onTabSwitch();
    }
  }, [onTabSwitch, isActive]);

  useEffect(() => {
    if (!isActive) return;

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', onTabSwitch);
    window.addEventListener('focus', (e) => {
      // Prevent focus events from other sources
      if (e.target !== window) {
        onTabSwitch();
      }
    });

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', onTabSwitch);
      window.removeEventListener('focus', onTabSwitch);
    };
  }, [handleVisibilityChange, onTabSwitch, isActive]);
};