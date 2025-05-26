# Reanimated Learning App - Requirements Document

## Project Overview

A React Native application built with Expo that serves as a comprehensive collection of interactive animations and gestures created using React Native Reanimated. The app is designed as a learning playground and demonstration platform for various Reanimated techniques and patterns.

## Phase 1 Requirements

### 1. Home Screen

#### Layout & Design
- Clean, modern interface with a scrollable list of interaction cards
- Header with app title "Reanimated Playground" and optional theme toggle
- Search/filter functionality (optional for Phase 1)

#### Card Component Structure
Each card should contain:
- **Title**: Name of the interaction (e.g., "Dynamic Circular Slider")
- **Description**: Brief explanation of what the interaction demonstrates
- **Badges**: Technology tags (e.g., "Gesture", "Transform", "Layout Animation")
- **Preview Image/Icon**: Visual representation or icon of the interaction

#### Card Interactions
- Tap to navigate to dedicated interaction screen
- Subtle press feedback
- Loading states for navigation

### 2. Individual Interaction Screens

#### Screen Structure
- **Header**: Back button, interaction title, and optional info/code toggle
- **Demo Area**: Full interactive demonstration of the animation/gesture
- **Controls Panel** (if applicable): Sliders, buttons, or inputs to modify animation parameters
- **Code Snippet Section** (expandable): Show the relevant Reanimated code
- **Learning Notes**: Key concepts and explanations

#### Navigation
- Stack navigation from home to individual screens
- Smooth transitions between screens
- Back gesture support

## Planned Interactions Collection

### Beginner Level
1. **Fade In/Out Animation**
2. **Scale Animation**
3. **Rotation Animation**
4. **Color Interpolation**
5. **Basic Spring Animation**

### Intermediate Level
1. **Dynamic Circular Slider**
2. **Drag and Drop**
3. **Swipe to Delete**
4. **Pull to Refresh**
5. **Parallax Scrolling**
6. **Card Flip Animation**

### Advanced Level
1. **Custom Gesture Recognizer**
2. **Shared Element Transitions**
3. **Complex Path Animations**
4. **Physics-based Animations**
5. **Multi-touch Gestures**
6. **Performance Optimized Lists**

### Styling Guidelines (NativeWind)
- Consistent color scheme with dark/light mode support
- Responsive design for different screen sizes
- Smooth transitions and micro-interactions
- Accessibility support with proper contrast ratios

## Development Phases

### Phase 1 (Current)
- [ ] Set up project structure and navigation
- [ ] Create home screen with card list
- [ ] Add NativeWind styling system

## Additional Considerations

### Why NativeWind?
- **Rapid Development**: Familiar Tailwind syntax speeds up styling
- **Consistency**: Unified design system across components
- **Responsive Design**: Easy breakpoint management
- **Dark Mode**: Built-in support for theme switching
- **Performance**: Compile-time CSS generation

### Documentation Requirements
- Code comments explaining animation concepts
- README with setup instructions
- Component documentation with props and usage examples
- Learning notes within each interaction explaining the concepts

## Success Metrics
- Smooth 60fps animations across all interactions
- Fast navigation and screen transitions
- Educational value through clear examples and explanations
- Clean, maintainable code structure
- Positive learning experience for Reanimated concepts