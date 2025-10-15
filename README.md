# Pin-Based Scroll Animation - React Application

A React application that converts the original HTML-based pin scroll animation into a proper React structure with GSAP ScrollTrigger integration.

## Features

- **Frame-based Animation**: Smooth scroll-triggered frame animation with 428 frames
- **Pinned Content**: Right-side pinned image that stays in place during scroll
- **GSAP Integration**: Uses GSAP ScrollTrigger for smooth animations
- **Responsive Design**: Mobile-friendly layout
- **React Hooks**: Custom hook for easy integration
- **Performance Optimized**: Lazy loading of frames for better performance

## Project Structure

```
scroll-test/
├── public/
│   └── index.html          # React app template
├── src/
│   ├── components/
│   │   ├── FrameScrollComponent.jsx    # Main component
│   │   └── FrameScrollComponent.css    # Component styles
│   ├── hooks/
│   │   └── useFrameScrollAnimation.js  # Custom React hook
│   ├── App.jsx             # Main App component
│   ├── App.css             # App styles
│   ├── index.js            # React entry point
│   └── index.css           # Base styles
├── frames-desktop-webp/    # Frame images (428 files)
├── package.json            # Dependencies
└── README.md              # This file
```

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

## Usage

The main component `FrameScrollComponent` can be used with the following props:

```jsx
import FrameScrollComponent from './components/FrameScrollComponent';

<FrameScrollComponent 
  totalFrames={428}
  framePath="frames-desktop-webp/frame_"
  frameExtension=".webp"
  enableMarkers={true}
  enableDebug={true}
  onFrameChange={(frameNumber) => {
    console.log(`Frame changed to: ${frameNumber}`);
  }}
  onStart={() => {
    console.log('Animation started');
  }}
  onComplete={() => {
    console.log('Animation completed');
  }}
/>
```

### Props

- `totalFrames` (number): Total number of frames (default: 50)
- `framePath` (string): Path to frame images (default: 'frames-desktop-webp/frame_')
- `frameExtension` (string): Frame file extension (default: '.webp')
- `enableMarkers` (boolean): Show ScrollTrigger markers (default: false)
- `enableDebug` (boolean): Show debug information (default: false)
- `onFrameChange` (function): Callback when frame changes
- `onStart` (function): Callback when animation starts
- `onComplete` (function): Callback when animation completes

## Custom Hook

You can also use the `useFrameScrollAnimation` hook directly:

```jsx
import { useFrameScrollAnimation } from './hooks/useFrameScrollAnimation';

const MyComponent = () => {
  const {
    animation,
    init,
    destroy,
    refresh,
    getCurrentFrame,
    getTotalFrames,
    isInitialized
  } = useFrameScrollAnimation({
    totalFrames: 428,
    enableMarkers: true,
    onFrameChange: (frameNumber) => {
      console.log(`Current frame: ${frameNumber}`);
    }
  });

  return <div>Your component content</div>;
};
```

## Build for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

## Key Features Converted from HTML

1. **Exact Layout**: Maintains the original HTML structure and styling
2. **Frame Animation**: All 428 frames are supported with smooth transitions
3. **ScrollTrigger**: GSAP ScrollTrigger integration with proper React lifecycle
4. **Performance**: Lazy loading and preloading of adjacent frames
5. **Responsive**: Mobile-friendly responsive design
6. **Debug Mode**: Optional markers and debug information

## Dependencies

- React 18.2.0
- React DOM 18.2.0
- GSAP 3.12.2
- React Scripts 5.0.1

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- The original HTML file has been completely converted to React components
- All functionality is preserved including the frame animation and pinned content
- The component is fully customizable through props
- Performance optimizations include lazy loading of frames
- The app maintains the exact same visual appearance and behavior as the original HTML