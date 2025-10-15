/**
 * Customizable Frame Scroll Animation
 * Advanced control over ScrollTrigger progress and frame switching
 */

class CustomizableFrameAnimation {
  constructor(options = {}) {
    this.options = {
      // Basic settings
      triggerSelector: '.story-pin',
      frameContainerSelector: '#frame-container',
      framePath: 'frames-desktop-webp/frame_',
      frameExtension: '.webp',
      totalFrames: 50,
      
      // ScrollTrigger customization
      scrollDistancePerFrame: 20, // percentage per frame
      startOffset: 'top top',     // when animation starts
      endOffset: null,           // when animation ends (auto-calculated if null)
      
      // Frame switching control
      frameSwitchingMode: 'linear', // 'linear', 'eased', 'custom'
      customFrameFunction: null,    // custom function for frame calculation
      
      // Performance settings
      enableSmoothSwitching: true,  // smooth transitions between frames
      preloadAdjacentFrames: 2,     // preload frames before/after current
      
      // Debug settings
      enableMarkers: false,
      enableDebug: false,
      logFrameChanges: true,
      
      // Callbacks
      onFrameChange: null,
      onProgressChange: null,
      onStart: null,
      onComplete: null,
      
      ...options
    };
    
    this.currentFrameIndex = 0;
    this.frames = [];
    this.scrollTrigger = null;
    this.isInitialized = false;
  }

  /**
   * Initialize the animation
   */
  init(gsap, ScrollTrigger) {
    if (this.isInitialized) {
      console.warn('CustomizableFrameAnimation already initialized');
      return;
    }

    this.gsap = gsap;
    this.ScrollTrigger = ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);
    
    this.createFrameElements();
    this.setupScrollTrigger();
    this.isInitialized = true;
    
    if (this.options.enableDebug) {
      console.log('CustomizableFrameAnimation initialized');
    }
  }

  /**
   * Create frame elements
   */
  createFrameElements() {
    const frameContainer = document.querySelector(this.options.frameContainerSelector);
    if (!frameContainer) {
      console.error('Frame container not found');
      return;
    }

    // Clear existing frames
    const existingFrames = frameContainer.querySelectorAll('.frame');
    existingFrames.forEach(frame => frame.remove());

    // Create new frames
    this.frames = [];
    for (let i = 1; i <= this.options.totalFrames; i++) {
      const frameNumber = i.toString().padStart(4, '0');
      const img = document.createElement('img');
      img.className = 'frame';
      img.id = `frame-${i}`;
      img.alt = `Frame ${i}`;
      img.style.position = 'absolute';
      img.style.top = '0';
      img.style.left = '0';
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      img.style.opacity = '0';
      img.style.willChange = 'opacity';
      
      if (i === 1) {
        img.style.opacity = '1';
        img.src = `${this.options.framePath}${frameNumber}${this.options.frameExtension}`;
      }
      
      frameContainer.appendChild(img);
      this.frames.push(`#frame-${i}`);
    }

    // Set initial states
    const firstFrame = document.getElementById('frame-1');
    if (firstFrame) {
      this.gsap.set(firstFrame, { autoAlpha: 1, x: 0 });
    }

    for (let i = 2; i <= this.options.totalFrames; i++) {
      this.gsap.set(`#frame-${i}`, { autoAlpha: 0, x: 0 });
    }
  }

  /**
   * Setup ScrollTrigger with customizable options
   */
  setupScrollTrigger() {
    // Calculate end distance
    const endPercent = this.options.endOffset || 
      (this.options.totalFrames * this.options.scrollDistancePerFrame);
    
    this.scrollTrigger = this.ScrollTrigger.create({
      trigger: this.options.triggerSelector,
      start: this.options.startOffset,
      end: `+=${endPercent}%`,
      scrub: true,
      pin: true,
      markers: this.options.enableMarkers,
      onUpdate: (self) => {
        this.handleScrollUpdate(self);
      },
      onStart: () => {
        if (this.options.enableDebug) {
          console.log('ScrollTrigger started');
        }
        if (this.options.onStart) {
          this.options.onStart();
        }
      },
      onComplete: () => {
        if (this.options.enableDebug) {
          console.log('ScrollTrigger completed');
        }
        if (this.options.onComplete) {
          this.options.onComplete();
        }
      }
    });
  }

  /**
   * Handle scroll update with customizable frame calculation
   */
  handleScrollUpdate(self) {
    if (this.options.enableDebug) {
      console.log('ScrollTrigger progress:', self.progress);
    }

    // Call progress callback
    if (this.options.onProgressChange) {
      this.options.onProgressChange(self.progress);
    }

    // Calculate target frame based on mode
    let targetFrameIndex;
    
    switch (this.options.frameSwitchingMode) {
      case 'linear':
        targetFrameIndex = Math.floor(self.progress * (this.options.totalFrames - 1));
        break;
        
      case 'eased':
        // Use ease function for smoother transitions
        const easedProgress = this.gsap.parseEase("power2.out")(self.progress);
        targetFrameIndex = Math.floor(easedProgress * (this.options.totalFrames - 1));
        break;
        
      case 'custom':
        if (this.options.customFrameFunction) {
          targetFrameIndex = this.options.customFrameFunction(self.progress, this.options.totalFrames);
        } else {
          targetFrameIndex = Math.floor(self.progress * (this.options.totalFrames - 1));
        }
        break;
        
      default:
        targetFrameIndex = Math.floor(self.progress * (this.options.totalFrames - 1));
    }

    // Ensure frame index is within bounds
    targetFrameIndex = Math.max(0, Math.min(targetFrameIndex, this.options.totalFrames - 1));

    // Switch frame if changed
    if (targetFrameIndex !== this.currentFrameIndex) {
      this.switchToFrame(targetFrameIndex);
    }
  }

  /**
   * Switch to specific frame with smooth transition
   */
  switchToFrame(frameIndex) {
    // Hide current frame
    if (this.frames[this.currentFrameIndex]) {
      if (this.options.enableSmoothSwitching) {
        this.gsap.to(this.frames[this.currentFrameIndex], { 
          autoAlpha: 0, 
          duration: 0.1, 
          ease: "power2.out" 
        });
      } else {
        this.gsap.set(this.frames[this.currentFrameIndex], { autoAlpha: 0 });
      }
    }
    
    // Show new frame
    const newFrameSel = this.frames[frameIndex];
    const frameElement = document.getElementById(`frame-${frameIndex + 1}`);
    
    // Load frame if not loaded
    if (frameElement && !frameElement.src) {
      const frameNumber = (frameIndex + 1).toString().padStart(4, '0');
      frameElement.src = `${this.options.framePath}${frameNumber}${this.options.frameExtension}`;
    }
    
    // Preload adjacent frames
    if (this.options.preloadAdjacentFrames > 0) {
      this.preloadAdjacentFrames(frameIndex);
    }
    
    // Show new frame
    if (this.options.enableSmoothSwitching) {
      this.gsap.fromTo(newFrameSel, 
        { autoAlpha: 0 }, 
        { autoAlpha: 1, duration: 0.1, ease: "power2.out" }
      );
    } else {
      this.gsap.set(newFrameSel, { autoAlpha: 1 });
    }
    
    if (this.options.logFrameChanges) {
      console.log(`Showing frame ${frameIndex + 1}: ${newFrameSel}`);
    }
    
    // Call frame change callback
    if (this.options.onFrameChange) {
      this.options.onFrameChange(frameIndex + 1, newFrameSel);
    }
    
    this.currentFrameIndex = frameIndex;
  }

  /**
   * Preload adjacent frames for smoother performance
   */
  preloadAdjacentFrames(currentIndex) {
    const preloadCount = this.options.preloadAdjacentFrames;
    
    for (let i = -preloadCount; i <= preloadCount; i++) {
      const targetIndex = currentIndex + i;
      if (targetIndex >= 0 && targetIndex < this.options.totalFrames) {
        const frameElement = document.getElementById(`frame-${targetIndex + 1}`);
        if (frameElement && !frameElement.src) {
          const frameNumber = (targetIndex + 1).toString().padStart(4, '0');
          frameElement.src = `${this.options.framePath}${frameNumber}${this.options.frameExtension}`;
        }
      }
    }
  }

  /**
   * Update scroll distance per frame
   */
  updateScrollDistance(newDistance) {
    this.options.scrollDistancePerFrame = newDistance;
    if (this.scrollTrigger) {
      this.scrollTrigger.kill();
      this.setupScrollTrigger();
    }
  }

  /**
   * Update total frames
   */
  updateTotalFrames(newTotal) {
    this.options.totalFrames = newTotal;
    if (this.scrollTrigger) {
      this.scrollTrigger.kill();
      this.createFrameElements();
      this.setupScrollTrigger();
    }
  }

  /**
   * Set custom frame calculation function
   */
  setCustomFrameFunction(customFunction) {
    this.options.customFrameFunction = customFunction;
    this.options.frameSwitchingMode = 'custom';
  }

  /**
   * Get current progress
   */
  getCurrentProgress() {
    return this.scrollTrigger ? this.scrollTrigger.progress : 0;
  }

  /**
   * Get current frame
   */
  getCurrentFrame() {
    return this.currentFrameIndex + 1;
  }

  /**
   * Destroy animation
   */
  destroy() {
    if (this.scrollTrigger) {
      this.scrollTrigger.kill();
      this.scrollTrigger = null;
    }
    this.frames = [];
    this.currentFrameIndex = 0;
    this.isInitialized = false;
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CustomizableFrameAnimation;
} else {
  window.CustomizableFrameAnimation = CustomizableFrameAnimation;
}

export default CustomizableFrameAnimation;
