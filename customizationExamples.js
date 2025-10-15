/**
 * ScrollTrigger Progress Customization Examples
 * Different ways to control frame switching behavior
 */

// Example 1: Basic Linear Frame Switching (Current Implementation)
const basicLinearAnimation = new CustomizableFrameAnimation({
  totalFrames: 50,
  scrollDistancePerFrame: 20,
  frameSwitchingMode: 'linear',
  enableDebug: true,
  onFrameChange: (frameNumber) => {
    console.log(`Linear: Frame ${frameNumber}`);
  }
});

// Example 2: Eased Frame Switching (Smoother Transitions)
const easedAnimation = new CustomizableFrameAnimation({
  totalFrames: 50,
  scrollDistancePerFrame: 15,
  frameSwitchingMode: 'eased',
  enableSmoothSwitching: true,
  enableDebug: true,
  onFrameChange: (frameNumber) => {
    console.log(`Eased: Frame ${frameNumber}`);
  }
});

// Example 3: Custom Frame Function (Non-linear Distribution)
const customAnimation = new CustomizableFrameAnimation({
  totalFrames: 50,
  scrollDistancePerFrame: 25,
  frameSwitchingMode: 'custom',
  customFrameFunction: (progress, totalFrames) => {
    // Custom function: frames change faster at the beginning, slower at the end
    const easedProgress = Math.pow(progress, 0.7); // Ease out
    return Math.floor(easedProgress * (totalFrames - 1));
  },
  enableDebug: true,
  onFrameChange: (frameNumber) => {
    console.log(`Custom: Frame ${frameNumber}`);
  }
});

// Example 4: Fast Frame Switching (More Responsive)
const fastAnimation = new CustomizableFrameAnimation({
  totalFrames: 100,
  scrollDistancePerFrame: 5, // Much faster switching
  frameSwitchingMode: 'linear',
  preloadAdjacentFrames: 3,
  enableDebug: true,
  onFrameChange: (frameNumber) => {
    console.log(`Fast: Frame ${frameNumber}`);
  }
});

// Example 5: Slow Frame Switching (More Scroll Per Frame)
const slowAnimation = new CustomizableFrameAnimation({
  totalFrames: 20,
  scrollDistancePerFrame: 50, // Much slower switching
  frameSwitchingMode: 'linear',
  enableDebug: true,
  onFrameChange: (frameNumber) => {
    console.log(`Slow: Frame ${frameNumber}`);
  }
});

// Example 6: Custom Progress Mapping
const progressMappingAnimation = new CustomizableFrameAnimation({
  totalFrames: 50,
  scrollDistancePerFrame: 20,
  frameSwitchingMode: 'custom',
  customFrameFunction: (progress, totalFrames) => {
    // Map progress to frame with custom curve
    // This creates a "slow start, fast middle, slow end" pattern
    let mappedProgress;
    
    if (progress < 0.5) {
      // Slow start: 0-0.5 progress maps to 0-0.3 frame range
      mappedProgress = progress * 0.6;
    } else {
      // Fast middle and end: 0.5-1.0 progress maps to 0.3-1.0 frame range
      mappedProgress = 0.3 + (progress - 0.5) * 1.4;
    }
    
    return Math.floor(mappedProgress * (totalFrames - 1));
  },
  enableDebug: true,
  onFrameChange: (frameNumber) => {
    console.log(`Mapped: Frame ${frameNumber}`);
  }
});

// Example 7: Real-time Progress Control
const progressControlAnimation = new CustomizableFrameAnimation({
  totalFrames: 50,
  scrollDistancePerFrame: 20,
  frameSwitchingMode: 'linear',
  enableDebug: true,
  onProgressChange: (progress) => {
    // You can react to progress changes in real-time
    console.log(`Progress: ${(progress * 100).toFixed(2)}%`);
    
    // Example: Change frame switching speed based on progress
    if (progress > 0.8) {
      // Slow down frame switching in the last 20% of scroll
      // This could be implemented by dynamically changing scrollDistancePerFrame
    }
  },
  onFrameChange: (frameNumber) => {
    console.log(`Progress Control: Frame ${frameNumber}`);
  }
});

// Example 8: Dynamic Frame Switching Based on Scroll Speed
let lastScrollTime = 0;
const dynamicAnimation = new CustomizableFrameAnimation({
  totalFrames: 50,
  scrollDistancePerFrame: 20,
  frameSwitchingMode: 'custom',
  customFrameFunction: (progress, totalFrames) => {
    const currentTime = Date.now();
    const scrollSpeed = currentTime - lastScrollTime;
    lastScrollTime = currentTime;
    
    // Adjust frame switching based on scroll speed
    let speedMultiplier = 1;
    if (scrollSpeed < 16) { // Fast scrolling (60fps+)
      speedMultiplier = 1.5;
    } else if (scrollSpeed > 50) { // Slow scrolling
      speedMultiplier = 0.7;
    }
    
    return Math.floor(progress * (totalFrames - 1) * speedMultiplier);
  },
  enableDebug: true,
  onFrameChange: (frameNumber) => {
    console.log(`Dynamic: Frame ${frameNumber}`);
  }
});

// Usage Examples:

// Initialize with different configurations
function initializeAnimations() {
  // Basic linear (like your current setup)
  basicLinearAnimation.init(gsap, ScrollTrigger);
  
  // Or use eased version for smoother transitions
  // easedAnimation.init(gsap, ScrollTrigger);
  
  // Or use custom version for special effects
  // customAnimation.init(gsap, ScrollTrigger);
}

// Real-time customization
function customizeAnimation() {
  // Change scroll distance per frame
  basicLinearAnimation.updateScrollDistance(10); // Faster frame switching
  
  // Change total frames
  basicLinearAnimation.updateTotalFrames(100); // More frames
  
  // Set custom frame function
  basicLinearAnimation.setCustomFrameFunction((progress, totalFrames) => {
    // Your custom logic here
    return Math.floor(progress * (totalFrames - 1));
  });
}

// Export examples
export {
  basicLinearAnimation,
  easedAnimation,
  customAnimation,
  fastAnimation,
  slowAnimation,
  progressMappingAnimation,
  progressControlAnimation,
  dynamicAnimation
};
