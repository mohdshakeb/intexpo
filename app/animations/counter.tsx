import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack } from 'expo-router';
import { Minus, Plus } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming
} from 'react-native-reanimated';

// Centralized animation configuration
const ANIMATION_CONFIG = {
  // Base durations (will be adjusted by animation speed)
  durations: {
    opacity: 100,
    translate: 50,
    width: 150,
  },
  // Delays
  delays: {
    digitStagger: 70, // Delay between each digit animation (ms)
  },
  // Easing functions
  easing: {
    default: Easing.bezier(0.4, 0.01, 0.11, 1.05),
    bounce: Easing.bounce,
    elastic: Easing.elastic(1),
  } as any, // Using any to bypass TypeScript errors with easing functions
  // Animation distances
  distances: {
    slideIn: 120, // How far digits slide in (px)
  },
  // Dimensions
  dimensions: {
    digitWidth: 72, // Width of each digit (px)
  },
};

// Animation queue type
interface AnimationItem {
  fromValue: number;
  toValue: number;
  speed: number;
  timestamp: number;
}

// Animation frame type for individual digit
interface DigitAnimationFrame {
  currentDigit: string;
  previousDigit: string | null;
  direction: 'up' | 'down' | null;
  isNew: boolean;
  shouldAnimate: boolean;
  uniqueId: string;
  isDisappearing?: boolean; // New property to mark disappearing digits
}

// Define types for the digit slot component props
interface DigitSlotProps {
  animationFrame: DigitAnimationFrame;
  index: number;
  animationSpeed: number;
  onAnimationComplete?: () => void;
}

// Component to animate a digit transition with immutable animation values
const DigitSlot = ({ 
  animationFrame,
  index,
  animationSpeed,
  onAnimationComplete
}: DigitSlotProps) => {
  const {
    currentDigit,
    previousDigit,
    direction,
    isNew,
    shouldAnimate,
    uniqueId,
    isDisappearing
  } = animationFrame;
  
  // Animation values for current digit
  const currentTranslateY = useSharedValue(
    shouldAnimate && direction !== null 
      ? (direction === 'up' ? ANIMATION_CONFIG.distances.slideIn : direction === 'down' ? -ANIMATION_CONFIG.distances.slideIn : 0) 
      : 0
  );
  const currentOpacity = useSharedValue(shouldAnimate && direction !== null ? 0 : 1);
  
  // Animation values for previous digit
  const prevTranslateY = useSharedValue(0);
  const prevOpacity = useSharedValue(previousDigit ? 1 : 0);
  
  // Animation for appearing/disappearing digits (width animation)
  // For disappearing digits, start at 60 and animate to 0
  // For new digits (like "1" in 9→10), start at 0 and animate to 60
  const width = useSharedValue(isNew ? 0 : isDisappearing ? ANIMATION_CONFIG.dimensions.digitWidth : ANIMATION_CONFIG.dimensions.digitWidth);

  // Calculate stagger delay based on index (right-to-left stagger)
  const getStaggerDelay = () => {
    // For disappearing digits, stagger from left to right (opposite of appearing)
    if (isDisappearing) {
      return 0; // First digit to disappear
    }
    
    // For 9→10 transition, we want the "1" to appear slightly before the "0" replaces the "9"
    if (currentDigit === "1" && !previousDigit) {
      return 0; // No delay for the new "1" digit
    }
    
    // Base delay is configurable
    return index * ANIMATION_CONFIG.delays.digitStagger;
  };

  // Animate when component mounts - using the immutable animation frame
  useEffect(() => {
    // Cancel any running animations when new animation starts
    cancelAnimation(currentTranslateY);
    cancelAnimation(currentOpacity);
    cancelAnimation(prevTranslateY);
    cancelAnimation(prevOpacity);
    cancelAnimation(width);

    if (direction !== null) {
      // Calculate stagger delay
      const staggerDelay = getStaggerDelay();
      
      // Calculate animation duration based on speed
      const durationFactor = 1 / animationSpeed;
      const opacityDuration = ANIMATION_CONFIG.durations.opacity * durationFactor;
      const translateDuration = ANIMATION_CONFIG.durations.translate * durationFactor;
      const widthDuration = ANIMATION_CONFIG.durations.width * durationFactor;

      // Define a simple animation callback that works on all platforms
      const animCompleteCallback = index === 0 && onAnimationComplete 
        ? () => {
            // Use setTimeout to ensure this runs on the JS thread
            setTimeout(() => {
              onAnimationComplete();
            }, 0);
          }
        : undefined;

      if (isNew) {
        // Special case for the "1" in 9→10 transition
        const isNewOneDigit = currentDigit === "1" && !previousDigit;
        
        // Setup initial positions for new digit
        currentOpacity.value = 0;
        currentTranslateY.value = direction === 'up' ? ANIMATION_CONFIG.distances.slideIn : direction === 'down' ? -ANIMATION_CONFIG.distances.slideIn : 0;
        
        // Animate width for new digit
        width.value = withDelay(
          staggerDelay,
          withTiming(ANIMATION_CONFIG.dimensions.digitWidth, {
            duration: widthDuration,
            easing: ANIMATION_CONFIG.easing.default
          })
        );
        
        // Animate the digit sliding in
        currentOpacity.value = withDelay(
          staggerDelay,
          withTiming(1, { 
            duration: opacityDuration,
            easing: ANIMATION_CONFIG.easing.default
          })
        );
        
        currentTranslateY.value = withDelay(
          staggerDelay,
          withTiming(0, { 
            duration: translateDuration,
            easing: ANIMATION_CONFIG.easing.default
          })
        );
        
        // Use setTimeout for callback
        if (animCompleteCallback) {
          setTimeout(animCompleteCallback, staggerDelay + translateDuration);
        }
      } else if (isDisappearing) {
        // Animate width for disappearing digit
        width.value = withTiming(0, {
          duration: widthDuration,
          easing: ANIMATION_CONFIG.easing.default
        });
        
        // Also animate opacity and slide out for smoother disappearance
        prevOpacity.value = withTiming(0, { 
          duration: opacityDuration,
          easing: ANIMATION_CONFIG.easing.default
        });
        
        // Slide the digit in the direction of removal
        prevTranslateY.value = withTiming(
          direction === 'up' ? -ANIMATION_CONFIG.distances.slideIn : ANIMATION_CONFIG.distances.slideIn, 
          {
            duration: translateDuration,
            easing: ANIMATION_CONFIG.easing.default
          }
        );
        
        // Use setTimeout for callback for disappearing digit
        if (animCompleteCallback) {
          setTimeout(animCompleteCallback, translateDuration);
        }
      } else if (previousDigit !== null && shouldAnimate) {
        // Setup initial positions
        currentOpacity.value = 0;
        currentTranslateY.value = direction === 'up' ? ANIMATION_CONFIG.distances.slideIn : direction === 'down' ? -ANIMATION_CONFIG.distances.slideIn : 0;
        prevOpacity.value = 1;
        prevTranslateY.value = 0;
        
        // Animate the current digit coming in with stagger delay
        currentOpacity.value = withDelay(
          staggerDelay,
          withTiming(1, { 
            duration: opacityDuration,
            easing: ANIMATION_CONFIG.easing.default
          })
        );
        
        currentTranslateY.value = withDelay(
          staggerDelay,
          withTiming(0, { 
            duration: translateDuration,
            easing: ANIMATION_CONFIG.easing.default
          })
        );
        
        // Animate the previous digit going out with stagger delay
        // Don't use callbacks directly in the animation
        prevTranslateY.value = withDelay(
          staggerDelay,
          withTiming(
            direction === 'up' ? -ANIMATION_CONFIG.distances.slideIn : ANIMATION_CONFIG.distances.slideIn, 
            {
              duration: translateDuration,
              easing: ANIMATION_CONFIG.easing.default
            }
          )
        );
        
        prevOpacity.value = withDelay(
          staggerDelay,
          withTiming(0, { 
            duration: opacityDuration,
            easing: ANIMATION_CONFIG.easing.default
          })
        );
        
        // Use setTimeout for callback instead of animation callback
        if (animCompleteCallback) {
          setTimeout(animCompleteCallback, staggerDelay + translateDuration);
        }
      } else if (onAnimationComplete && index === 0) {
        // If there's no animation but we need to notify completion
        setTimeout(() => {
          onAnimationComplete();
        }, translateDuration + staggerDelay);
      }
    }
  // Empty dependency array ensures this only runs once on mount
  // since we're using immutable animation frames
  }, []);

  // Create animated style for the current digit
  const currentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: currentOpacity.value,
      transform: [{ translateY: currentTranslateY.value }],
      position: 'absolute',
      zIndex: 1,
    };
  });

  // Create animated style for the previous digit
  const prevAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: prevOpacity.value,
      transform: [{ translateY: prevTranslateY.value }],
      position: 'absolute',
      zIndex: 0,
    };
  });
  
  // Create animated style for the container
  const containerStyle = useAnimatedStyle(() => {
    return {
      width: width.value,
      overflow: 'hidden',
    };
  });

  return (
    <Animated.View 
      className="h-[120px] items-center justify-center relative"
      style={containerStyle}
    >
      {previousDigit !== null && shouldAnimate && (
        <Animated.Text 
          className="text-[120px] font-medium text-zinc-800 dark:text-zinc-100 absolute"
          style={prevAnimatedStyle}
        >
          {previousDigit}
        </Animated.Text>
      )}
      <Animated.Text 
        className="text-[120px] font-medium text-zinc-800 dark:text-zinc-100 absolute"
        style={currentAnimatedStyle}
      >
        {currentDigit}
      </Animated.Text>
    </Animated.View>
  );
};

export default function CounterScreen() {
  // State to track the current count
  const [count, setCount] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(1); // Default animation speed
  const [animationId, setAnimationId] = useState(0); // Unique ID for each animation
  const [animationPreset, setAnimationPreset] = useState('default'); // Current animation preset
  
  // Animation queue for handling rapid button presses
  const animationQueue = useRef<AnimationItem[]>([]);
  const isAnimatingRef = useRef(false);
  
  // Track last press time for animation speed calculation
  const lastPressTimeRef = useRef<number>(0);
  const clickSpeedHistoryRef = useRef<number[]>([]);
  
  // Apply animation preset
  useEffect(() => {
    // Update animation config based on preset
    switch (animationPreset) {
      case 'bounce':
        ANIMATION_CONFIG.easing.default = ANIMATION_CONFIG.easing.bounce;
        ANIMATION_CONFIG.durations.translate = 600;
        break;
      case 'elastic':
        ANIMATION_CONFIG.easing.default = ANIMATION_CONFIG.easing.elastic;
        ANIMATION_CONFIG.durations.translate = 800;
        break;
      case 'slow':
        ANIMATION_CONFIG.easing.default = Easing.bezier(0.25, 0.1, 0.25, 1);
        ANIMATION_CONFIG.durations.opacity = 600;
        ANIMATION_CONFIG.durations.translate = 800;
        ANIMATION_CONFIG.durations.width = 800;
        break;
      case 'fast':
        ANIMATION_CONFIG.easing.default = Easing.bezier(0.25, 0.1, 0.25, 1);
        ANIMATION_CONFIG.durations.opacity = 150;
        ANIMATION_CONFIG.durations.translate = 200;
        ANIMATION_CONFIG.durations.width = 200;
        break;
      default:
        // Reset to default values
        ANIMATION_CONFIG.easing.default = Easing.bezier(0.25, 0.1, 0.25, 1);
        ANIMATION_CONFIG.durations.opacity = 300;
        ANIMATION_CONFIG.durations.translate = 400;
        ANIMATION_CONFIG.durations.width = 400;
        break;
    }
  }, [animationPreset]);
  
  // Calculate animation speed based on click frequency
  const calculateAnimationSpeed = () => {
    const now = Date.now();
    const timeSinceLastPress = now - lastPressTimeRef.current;
    lastPressTimeRef.current = now;
    
    // Only consider rapid clicks (less than 500ms apart)
    if (timeSinceLastPress < 500) {
      // Add to history (keep last 3 clicks)
      clickSpeedHistoryRef.current.push(timeSinceLastPress);
      if (clickSpeedHistoryRef.current.length > 3) {
        clickSpeedHistoryRef.current.shift();
      }
      
      // Calculate average click speed
      const avgClickSpeed = clickSpeedHistoryRef.current.reduce((sum, time) => sum + time, 0) / 
                            clickSpeedHistoryRef.current.length;
      
      // Map click speed to animation speed (faster clicks = faster animation)
      // 500ms -> speed 1, 100ms -> speed 2
      const newSpeed = Math.min(Math.max(1, (500 - avgClickSpeed) / 200 + 1), 2.5);
      return newSpeed;
    } else {
      // Reset history for slow clicks
      clickSpeedHistoryRef.current = [];
      return 1;
    }
  };

  // Process the next animation in the queue
  const processNextAnimation = () => {
    if (animationQueue.current.length === 0) {
      isAnimatingRef.current = false;
      return;
    }

    isAnimatingRef.current = true;
    const nextAnimation = animationQueue.current[0];
    
    // Update the display count to trigger animation
    setDisplayCount(nextAnimation.toValue);
    setAnimationSpeed(nextAnimation.speed);
    setAnimationId(prev => prev + 1); // Increment animation ID for unique keys
  };

  // Called when an animation completes
  const handleAnimationComplete = () => {
    // Remove the completed animation from the queue
    if (animationQueue.current.length > 0) {
      animationQueue.current.shift();
    }
    
    // Process the next animation if any
    if (animationQueue.current.length > 0) {
      processNextAnimation();
    } else {
      isAnimatingRef.current = false;
    }
  };
  
  // Queue an animation and process it if not already animating
  const queueAnimation = (fromValue: number, toValue: number) => {
    const speed = calculateAnimationSpeed();
    
    // Add to queue
    animationQueue.current.push({
      fromValue,
      toValue,
      speed,
      timestamp: Date.now()
    });
    
    // Start processing if not already animating
    if (!isAnimatingRef.current) {
      processNextAnimation();
    }
  };
  
  // Function to increment counter with animation
  const incrementCounter = () => {
    const newCount = count + 1;
    setCount(newCount);
    queueAnimation(count, newCount);
  };

  // Function to decrement counter with animation
  const decrementCounter = () => {
    // Only decrement if count > 0
    if (count > 0) {
      const newCount = count - 1;
      setCount(newCount);
      queueAnimation(count, newCount);
    }
  };

  // Cleanup animation queue on unmount
  useEffect(() => {
    return () => {
      animationQueue.current = [];
    };
  }, []);

  // Create animation frames for the current animation
  const createAnimationFrames = (): DigitAnimationFrame[] => {
    if (animationQueue.current.length === 0) {
      // No animation, just show current count
      const digits = displayCount.toString().split('');
      return digits.map(digit => ({
        currentDigit: digit,
        previousDigit: null,
        direction: null,
        isNew: false,
        shouldAnimate: false,
        uniqueId: `static-${digit}-${animationId}`
      }));
    }

    const currentAnimation = animationQueue.current[0];
    const fromValue = currentAnimation.fromValue;
    const toValue = currentAnimation.toValue;
    const direction = toValue > fromValue ? 'up' : 'down';
    
    const currentDigits = toValue.toString().split('');
    const previousDigits = fromValue.toString().split('');
    
    // Calculate if we're adding or removing digits
    const isAddingDigit = currentDigits.length > previousDigits.length;
    const isRemovingDigit = currentDigits.length < previousDigits.length;
    
    // Special cases for transitions between single and double digits
    const isNineToTen = fromValue === 9 && toValue === 10;
    const isTenToNine = fromValue === 10 && toValue === 9;
    
    // Handle different digit counts between previous and current
    const maxLength = Math.max(currentDigits.length, previousDigits.length);
    
    const frames: DigitAnimationFrame[] = [];
    
    // Handle special case for 9→10
    if (isNineToTen) {
      // Create frame for the "1" digit (new)
      frames.push({
        currentDigit: "1",
        previousDigit: null,
        direction: "up",
        isNew: true,
        shouldAnimate: true,
        uniqueId: `digit-1-new-${animationId}`
      });
      
      // Create frame for the "0" digit (replacing "9")
      frames.push({
        currentDigit: "0",
        previousDigit: "9",
        direction: "up",
        isNew: false,
        shouldAnimate: true,
        uniqueId: `digit-0-9-${animationId}`
      });
      
      return frames;
    }
    
    // Handle special case for 10→9
    if (isTenToNine) {
      // Create frame for the "9" digit (replacing "0")
      frames.push({
        currentDigit: "9",
        previousDigit: "0",
        direction: "down",
        isNew: false,
        shouldAnimate: true,
        uniqueId: `digit-9-0-${animationId}`
      });
      
      // Create frame for the disappearing "1" digit
      frames.push({
        currentDigit: "",
        previousDigit: "1",
        direction: "down",
        isNew: false,
        shouldAnimate: true,
        isDisappearing: true,
        uniqueId: `digit-1-disappearing-${animationId}`
      });
      
      return frames;
    }
    
    // Handle disappearing digit when going from larger to smaller number of digits
    if (isRemovingDigit) {
      const disappearingDigit = previousDigits[0];
      frames.push({
        currentDigit: '',
        previousDigit: disappearingDigit,
        direction,
        isNew: false,
        shouldAnimate: true,
        isDisappearing: true, // Mark this digit as disappearing
        uniqueId: `disappearing-${disappearingDigit}-${animationId}`
      });
    }
    
    // Create animation frames for each digit position
    for (let i = 0; i < maxLength; i++) {
      const currentIndex = currentDigits.length - 1 - i;
      const prevIndex = previousDigits.length - 1 - i;
      
      const currentDigit = currentIndex >= 0 ? currentDigits[currentIndex] : '';
      const prevDigit = prevIndex >= 0 ? previousDigits[prevIndex] : '';
      
      // Skip the first digit if we're removing a digit (handled separately)
      if (isRemovingDigit && i === maxLength - 1) {
        continue;
      }
      
      // Determine if this digit is new (for width animation)
      const isNew = isAddingDigit && i === maxLength - currentDigits.length;
      
      // Determine if this digit should animate
      let shouldAnimate = false;
      
      if (currentDigit !== prevDigit && prevDigit !== '') {
        // Different digits (normal animation)
        shouldAnimate = true;
      } else if (isNew) {
        // New digit (should slide in)
        shouldAnimate = true;
        // For new digits with no previous value, we need to set a dummy previous value
        // to trigger the animation
        frames.push({
          currentDigit: currentDigit,
          previousDigit: '', // Empty previous digit to force animation
          direction,
          isNew: true,
          shouldAnimate: true,
          uniqueId: `digit-${i}-${currentDigit}-new-${animationId}`
        });
        continue; // Skip the regular frame addition
      }
      
      frames.push({
        currentDigit: currentDigit || '0', // Use '0' as fallback
        previousDigit: prevDigit || null,
        direction,
        isNew,
        shouldAnimate,
        uniqueId: `digit-${i}-${currentDigit}-${prevDigit}-${animationId}`
      });
    }
    
    return frames.reverse();
  };
  
  // Get animation frames for the current state
  const animationFrames = createAnimationFrames();

  return (
    <View className="flex-1 bg-zinc-100 dark:bg-zinc-900">
      <Stack.Screen
        options={{
          title: 'Counter Animation',
          headerShown: true,
        }}
      />
      
      {/* Counter display */}
      <View className="flex-1 justify-center items-center flex-row">
        {animationFrames.map((frame, index) => (
          <DigitSlot
            key={frame.uniqueId}
            animationFrame={frame}
            index={index}
            animationSpeed={animationSpeed}
            onAnimationComplete={index === 0 ? handleAnimationComplete : undefined}
          />
        ))}
        {/* Fallback for empty display */}
        {animationFrames.length === 0 && (
          <DigitSlot
            key="zero"
            animationFrame={{
              currentDigit: "0",
              previousDigit: null,
              direction: null,
              isNew: false,
              shouldAnimate: false,
              uniqueId: "zero"
            }}
            index={0}
            animationSpeed={1}
          />
        )}
      </View>

      {/* Buttons */}
      <View className="flex-row justify-start p-5 gap-2 mb-12">
        <TouchableOpacity 
          className={`bg-zinc-500 py-4 px-4 rounded-full items-center justify-center ${count === 0 ? 'opacity-50' : ''}`}
          onPress={decrementCounter}
          disabled={count === 0}
        >
          <Minus size={24} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="flex-1 bg-zinc-800 dark:bg-zinc-50 py-4 px-8 rounded-full items-center justify-center"
          onPress={incrementCounter}
        >
          <Plus size={24} color={useColorScheme() === 'dark' ? '#000' : '#fff'} />
        </TouchableOpacity>
      </View>
    </View>
  );
} 