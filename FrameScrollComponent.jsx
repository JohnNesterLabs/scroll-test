/**
 * React Component for Frame Scroll Animation
 * Example usage of the frame scroll animation in React
 */

import React, { useRef, useEffect } from 'react';
import { useFrameScrollAnimation } from './useFrameScrollAnimation.js';
import './FrameScrollComponent.css';

const FrameScrollComponent = ({
  totalFrames = 50,
  framePath = 'frames-desktop-webp/frame_',
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
    scrollDistancePerFrame: 20,
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
      {/* Header Section */}
      <div className="wrap">
        <header>
          <h1>Frame-based animation + right pinned image</h1>
          <p>
            Scroll to animate through frames. Each scroll step advances to the next
            frame. Scroll back rewinds smoothly.
          </p>
          {enableDebug && (
            <div className="debug-info">
              <p>Total Frames: {getTotalFrames()}</p>
              <p>Current Frame: {getCurrentFrame()}</p>
              <p>Initialized: {isInitialized ? 'Yes' : 'No'}</p>
            </div>
          )}
        </header>
      </div>

      {/* Spacer */}
      <div className="spacer"></div>

      {/* Pinned Story Section */}
      <section className="story-pin" aria-label="Story area with pinned image">
        <div className="story-inner wrap">
          {/* Left: Frame Container */}
          <div className="left" aria-hidden="false">
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

          {/* Right: Pinned Image */}
          <div className="right" aria-hidden="true">
            <div className="image-wrap" id="the-image">
              <img
                src="https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=1400&q=80&auto=format&fit=crop&ixlib=rb-4.0.3&s=3c7b6d3a4f6b1c2f4a0e3ab3d4a1e2b7"
                alt="Pinned visual"
              />
            </div>
          </div>
        </div>
      </section>

      {/* After Section */}
      <section className="after wrap">
        <h2>Normal page content</h2>
        <p>
          This is content after the whole pinned sequence. When you finish the
          final frame and scroll further, the pinned block unpins and you'll reach
          this section normally.
        </p>
        <p>
          Scroll up anytime to rewind the frames and see the image re-pin and
          frames animate backwards.
        </p>
      </section>

      {/* Footer */}
      <footer>Demo — GSAP + ScrollTrigger</footer>
    </div>
  );
};

export default FrameScrollComponent;
