/**
 * React Hook for Frame Scroll Animation
 * Easy integration with React components
 */

import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
        framePath: '/frames-desktop-webp/frame_',
        frameExtension: '.webp',
        totalFrames: 50,
        scrollDistancePerFrame: 5,
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
            // Register ScrollTrigger plugin
            gsap.registerPlugin(ScrollTrigger);

            const totalFrames = defaultOptions.totalFrames;
            const frameContainer = document.getElementById('frame-container');

            if (!frameContainer) {
                console.error('Frame container not found');
                return;
            }

            // Create additional frame elements (frame-1 already exists in HTML)
            const frames = ['#frame-1']; // Start with the pre-loaded frame
            for (let i = 2; i <= totalFrames; i++) {
                const frameNumber = i.toString().padStart(4, '0');
                const img = document.createElement('img');
                img.className = 'frame';
                img.id = `frame-${i}`;
                img.alt = `Frame ${i}`;
                img.style.position = 'absolute';
                img.style.top = '0';
                img.style.left = '0';
                frameContainer.appendChild(img);
                frames.push(`#frame-${i}`);
            }

            // Ensure first frame is visible and all others are hidden
            const firstFrame = document.getElementById('frame-1');
            gsap.set(firstFrame, { autoAlpha: 1, x: 0 });

            // Pre-set all other frames as hidden (no x offset for smooth transitions)
            for (let i = 2; i <= totalFrames; i++) {
                gsap.set(`#frame-${i}`, { autoAlpha: 0, x: 0 });
            }

            // Test: Make sure first frame is actually visible
            console.log('First frame opacity:', firstFrame.style.opacity);
            console.log('First frame display:', firstFrame.style.display);
            console.log('First frame visibility:', firstFrame.style.visibility);

            // Debug: log to console
            console.log('Frame container:', frameContainer);
            console.log('First frame:', firstFrame);
            console.log('First frame src:', firstFrame.src);

            // Calculate scroll distance for smooth video-like playback
            const endPercent = totalFrames * defaultOptions.scrollDistancePerFrame;

            // Store current frame index
            let currentFrameIndex = 0;

            // Create ScrollTrigger with onUpdate callback
            const scrollTrigger = ScrollTrigger.create({
                trigger: defaultOptions.triggerSelector,
                start: "top top",
                end: "+=" + endPercent + "%",
                scrub: true,
                pin: true,
                markers: defaultOptions.enableMarkers,
                onUpdate: (self) => {
                    console.log('ScrollTrigger progress:', self.progress);

                    // Calculate which frame should be shown based on progress
                    const targetFrameIndex = Math.floor(self.progress * (totalFrames - 1));

                    // Only update if frame has changed
                    if (targetFrameIndex !== currentFrameIndex && targetFrameIndex >= 0 && targetFrameIndex < totalFrames) {
                        // Preload adjacent frames to prevent loading delays
                        for (let i = -2; i <= 2; i++) {
                            const adjacentIndex = targetFrameIndex + i;
                            if (adjacentIndex >= 0 && adjacentIndex < totalFrames) {
                                const adjacentElement = document.getElementById(`frame-${adjacentIndex + 1}`);
                                if (adjacentElement && !adjacentElement.src) {
                                    const frameNumber = (adjacentIndex + 1).toString().padStart(4, '0');
                                    adjacentElement.src = `${defaultOptions.framePath}${frameNumber}${defaultOptions.frameExtension}`;
                                }
                            }
                        }

                        // Hide current frame with smooth transition
                        if (frames[currentFrameIndex]) {
                            gsap.to(frames[currentFrameIndex], {
                                autoAlpha: 0,
                                duration: 0.02, // Very fast transition to prevent blink
                                ease: "power2.out"
                            });
                        }

                        // Show new frame
                        const newFrameSel = frames[targetFrameIndex];
                        const frameElement = document.getElementById(`frame-${targetFrameIndex + 1}`);

                        // Load frame image if not already loaded
                        if (frameElement && !frameElement.src) {
                            const frameNumber = (targetFrameIndex + 1).toString().padStart(4, '0');
                            frameElement.src = `${defaultOptions.framePath}${frameNumber}${defaultOptions.frameExtension}`;
                        }

                        // Show the new frame with smooth transition
                        gsap.fromTo(newFrameSel,
                            { autoAlpha: 0 },
                            {
                                autoAlpha: 1,
                                duration: 0.02, // Very fast transition to prevent blink
                                ease: "power2.out"
                            }
                        );

                        console.log(`Showing frame ${targetFrameIndex + 1}: ${newFrameSel}`);

                        currentFrameIndex = targetFrameIndex;

                        // Call onFrameChange callback if provided
                        if (defaultOptions.onFrameChange) {
                            defaultOptions.onFrameChange(targetFrameIndex + 1, newFrameSel);
                        }
                    }
                },
                onStart: () => {
                    console.log('ScrollTrigger started');
                    if (defaultOptions.onStart) {
                        defaultOptions.onStart();
                    }
                },
                onComplete: () => {
                    console.log('ScrollTrigger completed');
                    if (defaultOptions.onComplete) {
                        defaultOptions.onComplete();
                    }
                }
            });

            // Store the ScrollTrigger instance
            animationRef.current = {
                scrollTrigger,
                getCurrentFrame: () => currentFrameIndex + 1,
                getTotalFrames: () => totalFrames,
                destroy: () => {
                    if (scrollTrigger) {
                        scrollTrigger.kill();
                    }
                },
                refresh: () => {
                    ScrollTrigger.refresh();
                }
            };

            isInitialized.current = true;

            // refresh to ensure positions are correct
            ScrollTrigger.refresh();
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
