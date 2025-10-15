/**
 * Smooth Frame Animation - Eliminates Blink/Glitch Issues
 * Advanced frame switching with preloading and smooth transitions
 */

class SmoothFrameAnimation {
  constructor(options = {}) {
    this.options = {
      // Basic settings
      triggerSelector: '.story-pin',
      frameContainerSelector: '#frame-container',
      framePath: 'frames-desktop-webp/frame_',
      frameExtension: '.webp',
      totalFrames: 50,
      scrollDistancePerFrame: 20,
      
      // Anti-glitch settings
      preloadFrames: 3,           // Preload frames before/after current
      enableSmoothTransitions: true, // Smooth opacity transitions
      transitionDuration: 0.05,    // Very fast transition
      enableImagePreloading: true,  // Preload images before showing
      
      // Performance settings
      enableFrameBuffering: true,   // Buffer frames for smooth playback
      maxConcurrentLoads: 5,        // Limit concurrent image loads
      
      // Debug settings
      enableMarkers: false,
      enableDebug: false,
      
      // Callbacks
      onFrameChange: null,
      onStart: null,
      onComplete: null,
      
      ...options
    };
    
    this.currentFrameIndex = 0;
    this.frames = [];
    this.scrollTrigger = null;
    this.isInitialized = false;
    this.loadedFrames = new Set();
    this.loadingFrames = new Set();
    this.frameBuffer = new Map();
  }

  /**
   * Initialize the animation
   */
  init(gsap, ScrollTrigger) {
    if (this.isInitialized) {
      console.warn('SmoothFrameAnimation already initialized');
      return;
    }

    this.gsap = gsap;
    this.ScrollTrigger = ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);
    
    this.createFrameElements();
    this.preloadInitialFrames();
    this.setupScrollTrigger();
    this.isInitialized = true;
    
    if (this.options.enableDebug) {
      console.log('SmoothFrameAnimation initialized');
    }
  }

  /**
   * Create frame elements with optimized setup
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

    // Create new frames with optimized styling
    this.frames = [];
    for (let i = 1; i <= this.options.totalFrames; i++) {
      const frameNumber = i.toString().padStart(4, '0');
      const img = document.createElement('img');
      img.className = 'frame';
      img.id = `frame-${i}`;
      img.alt = `Frame ${i}`;
      
      // Optimized styling to prevent glitches
      img.style.position = 'absolute';
      img.style.top = '0';
      img.style.left = '0';
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      img.style.opacity = '0';
      img.style.willChange = 'opacity';
      img.style.imageRendering = 'auto'; // Better image quality
      img.style.backfaceVisibility = 'hidden'; // Prevent flicker
      img.style.transform = 'translateZ(0)'; // Hardware acceleration
      
      frameContainer.appendChild(img);
      this.frames.push(`#frame-${i}`);
    }

    // Set initial states
    const firstFrame = document.getElementById('frame-1');
    if (firstFrame) {
      this.gsap.set(firstFrame, { autoAlpha: 1, x: 0 });
      this.loadedFrames.add(0);
    }

    for (let i = 2; i <= this.options.totalFrames; i++) {
      this.gsap.set(`#frame-${i}`, { autoAlpha: 0, x: 0 });
    }
  }

  /**
   * Preload initial frames to prevent first-frame glitches
   */
  async preloadInitialFrames() {
    const framesToPreload = Math.min(this.options.preloadFrames, this.options.totalFrames);
    
    for (let i = 0; i < framesToPreload; i++) {
      await this.loadFrameImage(i);
    }
  }

  /**
   * Load frame image with promise-based loading
   */
  loadFrameImage(frameIndex) {
    return new Promise((resolve, reject) => {
      if (this.loadedFrames.has(frameIndex)) {
        resolve();
        return;
      }

      if (this.loadingFrames.has(frameIndex)) {
        // Wait for existing load to complete
        const checkLoaded = () => {
          if (this.loadedFrames.has(frameIndex)) {
            resolve();
          } else {
            setTimeout(checkLoaded, 10);
          }
        };
        checkLoaded();
        return;
      }

      this.loadingFrames.add(frameIndex);
      const frameNumber = (frameIndex + 1).toString().padStart(4, '0');
      const frameElement = document.getElementById(`frame-${frameIndex + 1}`);
      
      if (!frameElement) {
        this.loadingFrames.delete(frameIndex);
        reject(new Error(`Frame element not found: ${frameIndex + 1}`));
        return;
      }

      const img = new Image();
      img.onload = () => {
        frameElement.src = img.src;
        this.loadedFrames.add(frameIndex);
        this.loadingFrames.delete(frameIndex);
        resolve();
      };
      
      img.onerror = () => {
        this.loadingFrames.delete(frameIndex);
        reject(new Error(`Failed to load frame: ${frameNumber}`));
      };
      
      img.src = `${this.options.framePath}${frameNumber}${this.options.frameExtension}`;
    });
  }

  /**
   * Setup ScrollTrigger with optimized settings
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
   * Handle scroll update with anti-glitch measures
   */
  async handleScrollUpdate(self) {
    if (this.options.enableDebug) {
      console.log('ScrollTrigger progress:', self.progress);
    }

    // Calculate target frame
    const targetFrameIndex = Math.floor(self.progress * (this.options.totalFrames - 1));
    
    // Only update if frame has changed
    if (targetFrameIndex !== this.currentFrameIndex && 
        targetFrameIndex >= 0 && 
        targetFrameIndex < this.options.totalFrames) {
      
      await this.switchToFrameSmooth(targetFrameIndex);
    }
  }

  /**
   * Switch to frame with smooth transition and preloading
   */
  async switchToFrameSmooth(frameIndex) {
    // Preload adjacent frames for smooth playback
    if (this.options.enableFrameBuffering) {
      this.preloadAdjacentFrames(frameIndex);
    }

    // Ensure target frame is loaded before switching
    if (!this.loadedFrames.has(frameIndex)) {
      try {
        await this.loadFrameImage(frameIndex);
      } catch (error) {
        if (this.options.enableDebug) {
          console.warn(`Failed to load frame ${frameIndex + 1}:`, error);
        }
        return;
      }
    }

    // Hide current frame
    if (this.frames[this.currentFrameIndex]) {
      if (this.options.enableSmoothTransitions) {
        this.gsap.to(this.frames[this.currentFrameIndex], { 
          autoAlpha: 0, 
          duration: this.options.transitionDuration,
          ease: "power2.out"
        });
      } else {
        this.gsap.set(this.frames[this.currentFrameIndex], { autoAlpha: 0 });
      }
    }
    
    // Show new frame
    const newFrameSel = this.frames[frameIndex];
    
    if (this.options.enableSmoothTransitions) {
      this.gsap.fromTo(newFrameSel, 
        { autoAlpha: 0 }, 
        { 
          autoAlpha: 1, 
          duration: this.options.transitionDuration,
          ease: "power2.out"
        }
      );
    } else {
      this.gsap.set(newFrameSel, { autoAlpha: 1 });
    }
    
    if (this.options.enableDebug) {
      console.log(`Showing frame ${frameIndex + 1}: ${newFrameSel}`);
    }
    
    // Call frame change callback
    if (this.options.onFrameChange) {
      this.options.onFrameChange(frameIndex + 1, newFrameSel);
    }
    
    this.currentFrameIndex = frameIndex;
  }

  /**
   * Preload adjacent frames for smooth playback
   */
  preloadAdjacentFrames(currentIndex) {
    const preloadCount = this.options.preloadFrames;
    const loadPromises = [];
    
    for (let i = -preloadCount; i <= preloadCount; i++) {
      const targetIndex = currentIndex + i;
      if (targetIndex >= 0 && 
          targetIndex < this.options.totalFrames && 
          !this.loadedFrames.has(targetIndex) &&
          !this.loadingFrames.has(targetIndex)) {
        
        loadPromises.push(this.loadFrameImage(targetIndex));
      }
    }
    
    // Limit concurrent loads
    if (loadPromises.length > this.options.maxConcurrentLoads) {
      loadPromises.slice(0, this.options.maxConcurrentLoads).forEach(promise => {
        promise.catch(error => {
          if (this.options.enableDebug) {
            console.warn('Preload failed:', error);
          }
        });
      });
    }
  }

  /**
   * Get current frame
   */
  getCurrentFrame() {
    return this.currentFrameIndex + 1;
  }

  /**
   * Get loaded frames count
   */
  getLoadedFramesCount() {
    return this.loadedFrames.size;
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
    this.loadedFrames.clear();
    this.loadingFrames.clear();
    this.frameBuffer.clear();
    this.isInitialized = false;
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SmoothFrameAnimation;
} else {
  window.SmoothFrameAnimation = SmoothFrameAnimation;
}

export default SmoothFrameAnimation;
