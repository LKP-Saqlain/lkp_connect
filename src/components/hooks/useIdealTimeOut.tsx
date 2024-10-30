import { useEffect, useRef, useState } from "react";

export const useIdleTimeout = (
  onSessionExpired: () => void,
  timeout: number = 15 * 60 * 1000
) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(onSessionExpired, timeout); // Set the timeout
  };

  const setupActivityListeners = () => {
    window.addEventListener("mousemove", resetTimeout);
    window.addEventListener("keypress", resetTimeout);
    window.addEventListener("scroll", resetTimeout);
    window.addEventListener("click", resetTimeout);
  };

  const removeActivityListeners = () => {
    window.removeEventListener("mousemove", resetTimeout);
    window.removeEventListener("keypress", resetTimeout);
    window.removeEventListener("scroll", resetTimeout);
    window.removeEventListener("click", resetTimeout);
  };

  useEffect(() => {
    resetTimeout(); // Start the timer when the component mounts
    setupActivityListeners(); // Set up event listeners for user activity

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      removeActivityListeners(); // Clean up event listeners on unmount
    };
  }, []);
};
