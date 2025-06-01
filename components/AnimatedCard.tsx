import { useColorScheme } from '@/hooks/useColorScheme';
import { Check } from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { LayoutChangeEvent, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming
} from 'react-native-reanimated';

interface AnimatedCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isExpanded?: boolean;
  onExpandChange?: (expanded: boolean) => void;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  title, 
  description, 
  icon,
  isExpanded,
  onExpandChange
}) => {
  const [expanded, setExpanded] = useState(isExpanded || false);
  const colorScheme = useColorScheme();
  const [contentHeight, setContentHeight] = useState(0);
  const textMeasured = useRef(false);
  
  // Bottom padding in pixels (py-4 = 16px)
  const BOTTOM_PADDING = 16;
  
  // Spring animation config for bouncy effect
  const SPRING_CONFIG = {
    damping: 20,     // Lower value = more bouncy
    stiffness: 300,  // Higher value = faster
    mass: 1,       // Lower value = faster
    overshootClamping: false
  };
  
  // Animation values
  const descriptionHeight = useSharedValue(0);
  const descriptionOpacity = useSharedValue(0);
  const descriptionTranslateY = useSharedValue(-20);
  const checkmarkScale = useSharedValue(0);
  const cardColorProgress = useSharedValue(0);
  
  // Measure text content height
  const onTextLayout = useCallback((event: LayoutChangeEvent) => {
    if (!textMeasured.current) {
      const height = event.nativeEvent.layout.height;
      // Add bottom padding to ensure text isn't cropped
      setContentHeight(height + BOTTOM_PADDING);
      textMeasured.current = true;
    }
  }, []);
  
  // Animated styles
  const descriptionContainerStyle = useAnimatedStyle(() => {
    return {
      height: descriptionHeight.value,
      opacity: descriptionOpacity.value,
      transform: [{ translateY: descriptionTranslateY.value }],
      overflow: 'hidden',
    };
  });
  
  const checkmarkStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: checkmarkScale.value }],
    };
  });
  
  const cardStyle = useAnimatedStyle(() => {
    const backgroundColor = colorScheme === 'dark' 
      ? interpolateColor(
          cardColorProgress.value,
          [0, 1],
          ['#27272a', '#ffffff'] // dark:bg-zinc-800 to light background
        )
      : interpolateColor(
          cardColorProgress.value,
          [0, 1],
          ['#ffffff', '#27272a'] // bg-white to bg-zinc-800
        );
        
    return {
      backgroundColor,
    };
  });
  
  // Handle card tap
  const handlePress = () => {
    const newExpandedState = !expanded;
    setExpanded(newExpandedState);
    
    if (onExpandChange) {
      onExpandChange(newExpandedState);
    }
    
    if (newExpandedState) {
      // Expand animations - with spring for bouncy effect
      cardColorProgress.value = withTiming(1, { duration: 200 });
      descriptionHeight.value = withSpring(contentHeight || 80, SPRING_CONFIG);
      descriptionOpacity.value = withDelay(50, withTiming(1, { duration: 150 }));
      descriptionTranslateY.value = withSpring(0, SPRING_CONFIG);
      checkmarkScale.value = withDelay(100, withSpring(1, { 
        ...SPRING_CONFIG,
        stiffness: 200 // Even bouncier checkmark
      }));
    } else {
      // Collapse animations - faster with less delay
      cardColorProgress.value = withTiming(0, { duration: 150 });
      checkmarkScale.value = withTiming(0, { duration: 100 });
      descriptionOpacity.value = withTiming(0, { duration: 100 });
      descriptionTranslateY.value = withTiming(-20, { duration: 100 });
      // Height should animate last and quickly
      descriptionHeight.value = withDelay(50, withTiming(0, { 
        duration: 150, 
        easing: Easing.out(Easing.quad)
      }));
    }
  };
  
  // Listen for external expansion state changes
  useEffect(() => {
    if (isExpanded !== undefined && isExpanded !== expanded) {
      setExpanded(isExpanded);
      
      if (isExpanded) {
        // Expand animations
        cardColorProgress.value = withTiming(1, { duration: 200 });
        descriptionHeight.value = withSpring(contentHeight || 80, SPRING_CONFIG);
        descriptionOpacity.value = withDelay(50, withTiming(1, { duration: 150 }));
        descriptionTranslateY.value = withSpring(0, SPRING_CONFIG);
        checkmarkScale.value = withDelay(100, withSpring(1, { 
          ...SPRING_CONFIG,
          stiffness: 200 // Even bouncier checkmark
        }));
      } else {
        // Collapse animations
        cardColorProgress.value = withTiming(0, { duration: 150 });
        checkmarkScale.value = withTiming(0, { duration: 100 });
        descriptionOpacity.value = withTiming(0, { duration: 100 });
        descriptionTranslateY.value = withTiming(-20, { duration: 100 });
        descriptionHeight.value = withDelay(50, withTiming(0, { 
          duration: 150, 
          easing: Easing.out(Easing.quad)
        }));
      }
    }
  }, [isExpanded, contentHeight]);
  
  // Initialize animation values based on initial expanded state
  useEffect(() => {
    if (expanded) {
      cardColorProgress.value = 1;
      descriptionOpacity.value = 1;
      descriptionTranslateY.value = 0;
      descriptionHeight.value = contentHeight || 80;
      checkmarkScale.value = 1;
    }
  }, []);
  
  return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      onPress={handlePress}
      className="w-full mb-4"
    >
      <Animated.View 
        className="rounded-xl px-6 py-4 shadow-sm"
        style={cardStyle}
      >
        {/* Card Header - Always visible */}
        <View className="flex-row items-center justify-between min-h-[40px]">
          <View className="flex-row items-center gap-3">
            {icon}
            <Text className={`font-medium text-xl ${expanded ? 'text-white dark:text-zinc-800' : 'text-zinc-600 dark:text-zinc-400'}`}>
              {title}
            </Text>
          </View>
          
          <Animated.View 
            className="h-6 w-6 bg-green-500 rounded-full items-center justify-center"
            style={[checkmarkStyle, { opacity: expanded ? 1 : 0 }]}
          >
            <Check size={12} color="#ffffff" strokeWidth={2} />
          </Animated.View>
        </View>
        
        {/* Hidden text for measurement */}
        <View style={{ position: 'absolute', opacity: 0, left: -1000 }}>
          <Text 
            className="text-zinc-600 dark:text-zinc-300 mt-2 mb-1 text-lg"
            onLayout={onTextLayout}
          >
            {description}
          </Text>
        </View>
        
        {/* Card Description - Height animated */}
        <Animated.View style={descriptionContainerStyle}>
          <Text className="text-zinc-500 mt-2 mb-1 text-lg">
            {description}
          </Text>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default AnimatedCard; 