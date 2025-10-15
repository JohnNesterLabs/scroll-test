# Multi-Section Scroll Component Structure

This React application implements a multi-section scroll animation with text fade effects and frame-based animations.

## Component Structure

### Main Components

1. **MultiSectionScroll.jsx** - Main container component that orchestrates the entire scroll experience
   - Manages GSAP ScrollTrigger animations for text sections
   - Contains the overall layout and structure
   - Handles section counter updates

2. **SectionCounter.jsx** - Fixed top-right counter component
   - Shows current section number (e.g., "1 / 4")
   - Updates dynamically as user scrolls through sections

3. **TextSection.jsx** - Individual text section component
   - Renders heading and two animated paragraphs
   - Uses CSS classes for GSAP animation targeting

4. **FrameScrollComponent.jsx** - Frame-based animation component (existing)
   - Handles the pinned story area with frame sequences
   - Integrated into the multi-section layout

## Features

- **Text Animations**: Each section has two paragraphs that fade in/out with smooth transitions
- **Scroll Snap**: Sections snap to viewport for smooth scrolling experience
- **Section Counter**: Fixed counter shows current section position
- **Frame Animation**: Pinned story area with 428 frame sequence
- **Responsive Design**: Mobile-friendly with adaptive layouts
- **GSAP Integration**: Smooth animations powered by GSAP ScrollTrigger

## Animation Flow

1. User scrolls to a text section
2. First paragraph fades in and holds for 1 second
3. First paragraph fades out while second paragraph fades in
4. Second paragraph remains visible
5. Section counter updates to show current position
6. User continues to next section or frame animation area

## CSS Variables

The design uses CSS custom properties for consistent theming:
- `--bg`: Background color (#000)
- `--text`: Primary text color (#EEF2FF)
- `--muted`: Secondary text color (#98A0B3)
- `--accent-a`: Primary accent (#7C5CFF)
- `--accent-b`: Secondary accent (#FF6CA3)
- `--maxw`: Maximum content width (1200px)

## Usage

The component is automatically integrated into the main App.jsx and ready to use. Simply run `npm start` to see the multi-section scroll experience.
