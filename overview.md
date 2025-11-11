# Camera Application Overview

This is a modern, responsive camera application built with SvelteKit and Tailwind CSS. The app provides real-time video processing capabilities with live color palette filters and image scaling effects. On mobile devices, it adopts a full-screen interface with blurred top and bottom bars reminiscent of iOS and Android camera apps, while on desktop it presents as a rounded rectangular window centered on the screen. The application architecture follows a component-based structure where `CameraView.svelte` serves as the main orchestrator, managing camera state, video stream processing, and coordinating between child components. The UI is divided into modular components: `TopBar` handles the settings toggle and stop button, `BottomBar` contains the capture button, `SettingsPanel` provides controls for color palettes and scaling, and `CameraPreview` manages the video display and canvas rendering. The color processing logic lives in `colorUtils.js`, which includes predefined color palettes (grayscale, retro, Game Boy, cyberpunk, and pastel) and a nearest-color algorithm that maps each pixel to its closest palette color using Euclidean distance in RGB space. The app uses HTML5 Canvas API for real-time video processing at 60fps, applying effects frame-by-frame and allowing users to capture the processed output directly to their downloads folder.

---

## File Structure

```
src/
├── routes/
│   ├── +layout.svelte          # Root layout with global CSS import
│   └── +page.svelte            # Main page rendering CameraView
├── lib/
│   ├── components/
│   │   ├── CameraView.svelte   # Main orchestrator component
│   │   ├── TopBar.svelte       # Top navigation bar
│   │   ├── BottomBar.svelte    # Bottom capture button
│   │   ├── SettingsPanel.svelte # Settings overlay
│   │   └── CameraPreview.svelte # Camera feed display
│   └── utils/
│       └── colorUtils.ts       # Color palette utilities
└── app.css                     # Global styles with Tailwind
```

---

## Components Overview

Each component is designed to be self-contained and reusable:

- **CameraView**: Core logic for camera access, video processing, and state management
- **TopBar**: Navigation with palette toggle and camera stop controls
- **BottomBar**: Capture button for saving processed images
- **SettingsPanel**: Floating panel for adjusting filters and scale
- **CameraPreview**: Video stream rendering with start/stop interface
- **colorUtils**: Pure functions for color palette processing