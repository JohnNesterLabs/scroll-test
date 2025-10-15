/**
 * React Component for Frame Scroll Animation
 * Example usage of the frame scroll animation in React
 */

import React, { useRef, useEffect } from 'react';
import { useFrameScrollAnimation } from '../hooks/useFrameScrollAnimation';
import './FrameScrollComponent.css';

const FrameScrollComponent = ({
    totalFrames = 50,
    framePath = '/frames-desktop-webp/frame_',
    frameExtension = '.webp',
    enableMarkers = false,
    enableDebug = false,
    onFrameChange = null,
    onStart = null,
    onComplete = null,
    className = '',
    ...props
}) => {
    const containerRef = useRef(null);

    // Initialize the frame scroll animation
    const {
        animation,
        init,
        destroy,
        refresh,
        getCurrentFrame,
        getTotalFrames,
        isInitialized
    } = useFrameScrollAnimation({
        triggerSelector: '.story-pin',
        frameContainerSelector: '#frame-container',
        framePath,
        frameExtension,
        totalFrames,
        scrollDistancePerFrame: 5, // Updated to match original HTML (5% per frame)
        enableMarkers,
        enableDebug,
        onFrameChange,
        onStart,
        onComplete
    });

    // Handle frame changes
    const handleFrameChange = (frameNumber, frameSelector) => {
        console.log(`Frame changed to: ${frameNumber}`);
        if (onFrameChange) {
            onFrameChange(frameNumber, frameSelector);
        }
    };

    // Handle animation start
    const handleStart = () => {
        console.log('Animation started');
        if (onStart) {
            onStart();
        }
    };

    // Handle animation complete
    const handleComplete = () => {
        console.log('Animation completed');
        if (onComplete) {
            onComplete();
        }
    };

    return (
        <div className={`frame-scroll-wrapper ${className}`} {...props}>
            {/* Frame Container - Direct full viewport */}
            <div className="frame-container" id="frame-container">
                {/* First frame as fallback */}
                <img
                    src={`${framePath}0001${frameExtension}`}
                    className="frame"
                    id="frame-1"
                    alt="Frame 1"
                    style={{ opacity: 1 }}
                />
                {/* Additional frames will be dynamically loaded */}
            </div>
        </div>
    );
};

export default FrameScrollComponent;
