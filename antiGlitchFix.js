/**
 * Anti-Glitch Fix for Current Implementation
 * Quick solution to eliminate frame switching blinks
 */

// Replace your current onUpdate function with this:
function createAntiGlitchOnUpdate(totalFrames, frames, currentFrameIndex, gsap, options = {}) {
  const {
    framePath = 'frames-desktop-webp/frame_',
    frameExtension = '.webp',
    enableDebug = false,
    onFrameChange = null
  } = options;

  // Preload frames to prevent loading delays
  const preloadedFrames = new Set();
  const loadingFrames = new Set();

  // Preload function
  const preloadFrame = (frameIndex) => {
    if (preloadedFrames.has(frameIndex) || loadingFrames.has(frameIndex)) {
      return Promise.resolve();
    }

    loadingFrames.add(frameIndex);
    const frameNumber = (frameIndex + 1).toString().padStart(4, '0');
    const frameElement = document.getElementById(`frame-${frameIndex + 1}`);
    
    if (!frameElement) {
      loadingFrames.delete(frameIndex);
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        frameElement.src = img.src;
        preloadedFrames.add(frameIndex);
        loadingFrames.delete(frameIndex);
        resolve();
      };
      img.onerror = () => {
        loadingFrames.delete(frameIndex);
        resolve();
      };
      img.src = `${framePath}${frameNumber}${frameExtension}`;
    });
  };

  // Preload initial frames
  for (let i = 0; i < Math.min(5, totalFrames); i++) {
    preloadFrame(i);
  }

  return (self) => {
    if (enableDebug) {
      console.log('ScrollTrigger progress:', self.progress);
    }

    // Calculate which frame should be shown based on progress
    const targetFrameIndex = Math.floor(self.progress * (totalFrames - 1));
    
    // Only update if frame has changed
    if (targetFrameIndex !== currentFrameIndex && 
        targetFrameIndex >= 0 && 
        targetFrameIndex < totalFrames) {
      
      // Preload adjacent frames
      for (let i = -2; i <= 2; i++) {
        const adjacentIndex = targetFrameIndex + i;
        if (adjacentIndex >= 0 && adjacentIndex < totalFrames) {
          preloadFrame(adjacentIndex);
        }
      }

      // Hide current frame with smooth transition
      if (frames[currentFrameIndex]) {
        gsap.set(frames[currentFrameIndex], { 
          autoAlpha: 0,
          duration: 0.02, // Very fast transition
          ease: "power2.out"
        });
      }
      
      // Show new frame
      const newFrameSel = frames[targetFrameIndex];
      const frameElement = document.getElementById(`frame-${targetFrameIndex + 1}`);
      
      // Ensure frame is loaded before showing
      if (frameElement && !frameElement.src) {
        const frameNumber = (targetFrameIndex + 1).toString().padStart(4, '0');
        frameElement.src = `${framePath}${frameNumber}${frameExtension}`;
      }
      
      // Show the new frame with smooth transition
      gsap.set(newFrameSel, { 
        autoAlpha: 1,
        duration: 0.02, // Very fast transition
        ease: "power2.out"
      });
      
      if (enableDebug) {
        console.log(`Showing frame ${targetFrameIndex + 1}: ${newFrameSel}`);
      }
      
      if (onFrameChange) {
        onFrameChange(targetFrameIndex + 1, newFrameSel);
      }
      
      currentFrameIndex = targetFrameIndex;
    }
  };
}

// Usage in your current code:
// Replace your onUpdate function with:
/*
onUpdate: createAntiGlitchOnUpdate(totalFrames, frames, currentFrameIndex, gsap, {
  framePath: 'frames-desktop-webp/frame_',
  frameExtension: '.webp',
  enableDebug: true,
  onFrameChange: (frameNumber, frameSelector) => {
    console.log(`Frame changed to: ${frameNumber}`);
  }
})
*/
