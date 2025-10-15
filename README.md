# Frame Scroll Animation

A reusable GSAP ScrollTrigger-based frame animation system that can be used in vanilla JavaScript or React applications.

## Features

- 🎬 Smooth frame-by-frame animation on scroll
- 📱 Responsive design
- ⚡ Performance optimized with on-demand frame loading
- 🔧 Highly configurable
- ⚛️ React integration with custom hooks
- 🎯 TypeScript support ready

## Installation

### For Vanilla JavaScript

```html
<script src="https://unpkg.com/gsap/dist/gsap.min.js"></script>
<script src="https://unpkg.com/gsap/dist/ScrollTrigger.min.js"></script>
<script src="./frameScrollAnimation.js"></script>
```

### For React

```bash
npm install gsap
```

```javascript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FrameScrollAnimation from './frameScrollAnimation.js';
import { useFrameScrollAnimation } from './useFrameScrollAnimation.js';
```

## Usage

### Vanilla JavaScript

```javascript
// Initialize GSAP and ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Create animation instance
const animation = new FrameScrollAnimation({
  triggerSelector: '.story-pin',
  frameContainerSelector: '#frame-container',
  framePath: 'frames-desktop-webp/frame_',
  frameExtension: '.webp',
  totalFrames: 50,
  scrollDistancePerFrame: 20,
  enableMarkers: false,
  enableDebug: true,
  onFrameChange: (frameNumber, frameSelector) => {
    console.log(`Frame changed to: ${frameNumber}`);
  },
  onStart: () => {
    console.log('Animation started');
  },
  onComplete: () => {
    console.log('Animation completed');
  }
});

// Initialize the animation
animation.init(gsap, ScrollTrigger);

// Clean up when done
// animation.destroy();
```

### React

```jsx
import React from 'react';
import FrameScrollComponent from './FrameScrollComponent.jsx';
import './FrameScrollComponent.css';

function App() {
  const handleFrameChange = (frameNumber, frameSelector) => {
    console.log(`Frame changed to: ${frameNumber}`);
  };

  const handleStart = () => {
    console.log('Animation started');
  };

  const handleComplete = () => {
    console.log('Animation completed');
  };

  return (
    <FrameScrollComponent
      totalFrames={50}
      framePath="frames-desktop-webp/frame_"
      frameExtension=".webp"
      enableMarkers={false}
      enableDebug={true}
      onFrameChange={handleFrameChange}
      onStart={handleStart}
      onComplete={handleComplete}
    />
  );
}

export default App;
```

### React Hook

```jsx
import React, { useEffect } from 'react';
import { useFrameScrollAnimation } from './useFrameScrollAnimation.js';

function MyComponent() {
  const {
    animation,
    init,
    destroy,
    refresh,
    getCurrentFrame,
    getTotalFrames,
    isInitialized
  } = useFrameScrollAnimation({
    triggerSelector: '.my-trigger',
    frameContainerSelector: '#my-frame-container',
    framePath: 'my-frames/frame_',
    frameExtension: '.jpg',
    totalFrames: 100,
    scrollDistancePerFrame: 15,
    enableMarkers: true,
    enableDebug: true,
    onFrameChange: (frameNumber) => {
      console.log(`Current frame: ${frameNumber}`);
    }
  });

  useEffect(() => {
    // Animation is automatically initialized
    console.log('Animation initialized:', isInitialized);
  }, [isInitialized]);

  return (
    <div>
      <div className="my-trigger">
        <div id="my-frame-container">
          {/* Frames will be dynamically loaded here */}
        </div>
      </div>
    </div>
  );
}
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `triggerSelector` | string | `.story-pin` | CSS selector for the scroll trigger element |
| `frameContainerSelector` | string | `#frame-container` | CSS selector for the frame container |
| `framePath` | string | `frames-desktop-webp/frame_` | Base path for frame images |
| `frameExtension` | string | `.webp` | File extension for frame images |
| `totalFrames` | number | `50` | Total number of frames to animate |
| `scrollDistancePerFrame` | number | `20` | Scroll distance percentage per frame |
| `enableMarkers` | boolean | `false` | Show ScrollTrigger debug markers |
| `enableDebug` | boolean | `false` | Enable console logging |
| `onFrameChange` | function | `null` | Callback when frame changes |
| `onStart` | function | `null` | Callback when animation starts |
| `onComplete` | function | `null` | Callback when animation completes |
| `onUpdate` | function | `null` | Callback on scroll update |

## Methods

### FrameScrollAnimation Class

- `init(gsap, ScrollTrigger)` - Initialize the animation
- `destroy()` - Destroy the animation and clean up
- `refresh()` - Refresh ScrollTrigger (useful after DOM changes)
- `getCurrentFrame()` - Get current frame number (1-based)
- `getTotalFrames()` - Get total number of frames
- `switchToFrame(frameIndex)` - Manually switch to a specific frame

### React Hook

- `animation` - The animation instance
- `init()` - Initialize the animation
- `destroy()` - Destroy the animation
- `refresh()` - Refresh the animation
- `getCurrentFrame()` - Get current frame
- `getTotalFrames()` - Get total frames
- `isInitialized` - Whether the animation is initialized

## File Structure

```
├── frameScrollAnimation.js      # Core animation class
├── useFrameScrollAnimation.js   # React hook
├── FrameScrollComponent.jsx     # React component
├── FrameScrollComponent.css     # Component styles
└── README.md                    # This file
```

## Requirements

- GSAP 3.x
- ScrollTrigger plugin
- Modern browser with ES6+ support

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Performance Tips

1. **Optimize Images**: Use WebP format for better compression
2. **Limit Frames**: Use fewer frames for better performance
3. **Lazy Loading**: Frames are loaded on-demand by default
4. **Responsive Images**: Ensure frames are properly sized
5. **Cleanup**: Always call `destroy()` when component unmounts

## Troubleshooting

### Frames Not Loading
- Check file paths and extensions
- Verify frame files exist
- Check browser console for errors

### Animation Not Starting
- Ensure GSAP and ScrollTrigger are loaded
- Check trigger element exists in DOM
- Verify ScrollTrigger markers are visible

### Performance Issues
- Reduce total frames
- Optimize image sizes
- Use fewer frames for mobile

## License

MIT License - feel free to use in your projects!
