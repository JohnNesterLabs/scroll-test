/**
 * React Hook for Frame Scroll Animation
 * Easy integration with React components
 */

import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FrameScrollAnimation from './frameScrollAnimation.js';

/**
 * React hook for frame scroll animation
 * @param {Object} options - Animation options
 * @returns {Object} Animation instance and controls
 */
export const useFrameScrollAnimation = (options = {}) => {
  const animationRef = useRef(null);
  const isInitialized = useRef(false);

  // Default options
  const defaultOptions = {
    triggerSelector: '.story-pin',
    frameContainerSelector: '#frame-container',
    framePath: 'frames-desktop-webp/frame_',
    frameExtension: '.webp',
    totalFrames: 50,
    scrollDistancePerFrame: 20,
    enableMarkers: false,
    enableDebug: false,
    ...options
  };

  /**
   * Initialize the animation
   */
  const init = useCallback(() => {
    if (isInitialized.current || animationRef.current) {
      return;
    }

    try {
      animationRef.current = new FrameScrollAnimation(defaultOptions);
      animationRef.current.init(gsap, ScrollTrigger);
      isInitialized.current = true;
    } catch (error) {
      console.error('Failed to initialize frame scroll animation:', error);
    }
  }, [defaultOptions]);

  /**
   * Destroy the animation
   */
  const destroy = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.destroy();
      animationRef.current = null;
      isInitialized.current = false;
    }
  }, []);

  /**
   * Refresh the animation
   */
  const refresh = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.refresh();
    }
  }, []);

  /**
   * Get current frame
   */
  const getCurrentFrame = useCallback(() => {
    return animationRef.current ? animationRef.current.getCurrentFrame() : 1;
  }, []);

  /**
   * Get total frames
   */
  const getTotalFrames = useCallback(() => {
    return animationRef.current ? animationRef.current.getTotalFrames() : 0;
  }, []);

  // Initialize on mount
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      init();
    }, 100);

    return () => {
      clearTimeout(timer);
      destroy();
    };
  }, [init, destroy]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      destroy();
    };
  }, [destroy]);

  return {
    // Animation instance
    animation: animationRef.current,
    
    // Control methods
    init,
    destroy,
    refresh,
    getCurrentFrame,
    getTotalFrames,
    
    // State
    isInitialized: isInitialized.current
  };
};

export default useFrameScrollAnimation;
