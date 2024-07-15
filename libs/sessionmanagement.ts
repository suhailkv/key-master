import { useEffect, useRef } from 'react';

const useSessionTimeout = (onTimeout: () => void, timeout: number = 15 * 60 * 1000) => {
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  const clearExistingTimeout = () => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
  };

  const resetTimer = () => {
    clearExistingTimeout();
    timeoutId.current = setTimeout(() => {
      onTimeout();
    }, timeout);
  };

  useEffect(() => {
    return () => clearExistingTimeout();
  }, []);

  return resetTimer;
};

export default useSessionTimeout;
