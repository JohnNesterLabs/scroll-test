/**
 * GSAP ScrollTrigger Frame Animation
 * A reusable module for creating smooth frame-based scroll animations
 * Compatible with React and vanilla JavaScript
 */

class FrameScrollAnimation {
  constructor(options = {}) {
    this.options = {
      // Required options
      triggerSelector: '.story-pin',
      frameContainerSelector: '#frame-container',
      framePath: 'frames-desktop-webp/frame_',
      frameExtension: '.webp',
      
      // Optional options with defaults
      totalFrames: 50,
      scrollDistancePerFrame: 20, // percentage
      enableMarkers: false,
      enableDebug: false,
      
      // Callbacks
      onFrameChange: null,
      onStart: null,
      onComplete: null,
      onUpdate: null,
      
      ...options
    };
    
    this.currentFrameIndex = 0;
    this.frames = [];
    this.scrollTrigger = null;
    this.isInitialized = false;
  }

  /**
   * Initialize the frame animation
   * @param {Object} gsap - GSAP library instance
   * @param {Object} ScrollTrigger - ScrollTrigger plugin instance
   */
  init(gsap, ScrollTrigger) {
    if (this.isInitialized) {
      console.warn('FrameScrollAnimation already initialized');
      return;
    }

    this.gsap = gsap;
    this.ScrollTrigger = ScrollTrigger;
    
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    this.createFrameElements();
    this.setupScrollTrigger();
    this.isInitialized = true;
    
    if (this.options.enableDebug) {
      console.log('FrameScrollAnimation initialized with', this.options.totalFrames, 'frames');
    }
  }

  /**
   * Create frame elements dynamically
   */
  createFrameElements() {
    const frameContainer = document.querySelector(this.options.frameContainerSelector);
    
    if (!frameContainer) {
      console.error('Frame container not found:', this.options.frameContainerSelector);
      return;
    }

    // Clear existing frames (except the first one if it exists)
    const existingFrames = frameContainer.querySelectorAll('.frame');
    if (existingFrames.length > 1) {
      existingFrames.forEach((frame, index) => {
        if (index > 0) frame.remove();
      });
    }

    // Create frame elements
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
      
      // Set first frame as visible
      if (i === 1) {
        img.style.opacity = '1';
        img.src = `${this.options.framePath}${frameNumber}${this.options.frameExtension}`;
      }
      
      frameContainer.appendChild(img);
      this.frames.push(`#frame-${i}`);
    }

    // Set initial states with GSAP
    const firstFrame = document.getElementById('frame-1');
    if (firstFrame) {
      this.gsap.set(firstFrame, { autoAlpha: 1, x: 0 });
    }

    // Hide all other frames
    for (let i = 2; i <= this.options.totalFrames; i++) {
      this.gsap.set(`#frame-${i}`, { autoAlpha: 0, x: 0 });
    }
  }

  /**
   * Setup ScrollTrigger
   */
  setupScrollTrigger() {
    const endPercent = this.options.totalFrames * this.options.scrollDistancePerFrame;
    
    this.scrollTrigger = this.ScrollTrigger.create({
      trigger: this.options.triggerSelector,
      start: "top top",
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
   * Handle scroll update
   * @param {Object} self - ScrollTrigger instance
   */
  handleScrollUpdate(self) {
    if (this.options.enableDebug) {
      console.log('ScrollTrigger progress:', self.progress);
    }

    // Calculate which frame should be shown based on progress
    const targetFrameIndex = Math.floor(self.progress * (this.options.totalFrames - 1));
    
    // Only update if frame has changed
    if (targetFrameIndex !== this.currentFrameIndex && 
        targetFrameIndex >= 0 && 
        targetFrameIndex < this.options.totalFrames) {
      
      this.switchToFrame(targetFrameIndex);
    }

    // Call user's onUpdate callback
    if (this.options.onUpdate) {
      this.options.onUpdate(self);
    }
  }

  /**
   * Switch to a specific frame
   * @param {number} frameIndex - Index of frame to show (0-based)
   */
  switchToFrame(frameIndex) {
    // Hide current frame
    if (this.frames[this.currentFrameIndex]) {
      this.gsap.set(this.frames[this.currentFrameIndex], { autoAlpha: 0 });
    }
    
    // Show new frame
    const newFrameSel = this.frames[frameIndex];
    const frameElement = document.getElementById(`frame-${frameIndex + 1}`);
    
    // Load frame image if not already loaded
    if (frameElement && !frameElement.src) {
      const frameNumber = (frameIndex + 1).toString().padStart(4, '0');
      frameElement.src = `${this.options.framePath}${frameNumber}${this.options.frameExtension}`;
    }
    
    // Show the new frame
    this.gsap.set(newFrameSel, { autoAlpha: 1 });
    
    if (this.options.enableDebug) {
      console.log(`Showing frame ${frameIndex + 1}: ${newFrameSel}`);
    }
    
    // Call user's onFrameChange callback
    if (this.options.onFrameChange) {
      this.options.onFrameChange(frameIndex + 1, newFrameSel);
    }
    
    this.currentFrameIndex = frameIndex;
  }

  /**
   * Destroy the animation and clean up
   */
  destroy() {
    if (this.scrollTrigger) {
      this.scrollTrigger.kill();
      this.scrollTrigger = null;
    }
    
    this.frames = [];
    this.currentFrameIndex = 0;
    this.isInitialized = false;
    
    if (this.options.enableDebug) {
      console.log('FrameScrollAnimation destroyed');
    }
  }

  /**
   * Refresh ScrollTrigger (useful after DOM changes)
   */
  refresh() {
    if (this.ScrollTrigger) {
      this.ScrollTrigger.refresh();
    }
  }

  /**
   * Get current frame index
   * @returns {number} Current frame index (1-based)
   */
  getCurrentFrame() {
    return this.currentFrameIndex + 1;
  }

  /**
   * Get total number of frames
   * @returns {number} Total frames
   */
  getTotalFrames() {
    return this.options.totalFrames;
  }
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  // CommonJS
  module.exports = FrameScrollAnimation;
} else if (typeof define === 'function' && define.amd) {
  // AMD
  define([], function() {
    return FrameScrollAnimation;
  });
} else {
  // Browser global
  window.FrameScrollAnimation = FrameScrollAnimation;
}

export default FrameScrollAnimation;
