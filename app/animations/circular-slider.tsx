import { Image } from 'expo-image';
import { Stack } from 'expo-router';
import React, { useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

// Get screen dimensions
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Define sizes relative to screen width
const ITEM_SIZE = SCREEN_WIDTH * 0.24; // 24% of screen width
const ITEM_SPACING = 12; // Space between items
const ITEM_WIDTH = ITEM_SIZE + ITEM_SPACING; // Total width including spacing

// Animation configuration - centralized for easy adjustment
const ANIMATION_CONFIG = {
  // Durations in milliseconds
  durations: {
    backgroundFade: 500,    // Background image fade duration
    itemTransition: 300,    // Item transition animation duration
  },
  // Easing functions
  easing: {
    default: Easing.bezier(0.35, -0.09, 0.69, 1.28),  // Standard easing
    backgroundFade: Easing.out(Easing.quad),      // Smooth fade out for background
  },
  // Animation values
  values: {
    itemScale: {
      min: 0.8,    // Minimum scale for non-centered items
      max: 1,      // Maximum scale for centered item
    },
    itemOpacity: {
      min: 0.6,    // Minimum opacity for non-centered items
      max: 1,      // Maximum opacity for centered item
    },
    maxVerticalOffset: ITEM_SIZE * 0.3,  // Maximum vertical offset for non-centered items
    centerThreshold: 8,  // Distance threshold to consider an item "centered" (for border)
  },
};

// Sample data with different images
const DATA = [
  { 
    id: '1', 
    image: require('../../assets/images/carousel/image1.jpeg'),
  },
  { 
    id: '2', 
    image: require('../../assets/images/carousel/image2.jpeg'),
  },
  { 
    id: '3', 
    image: require('../../assets/images/carousel/image3.jpeg'),
  },
  { 
    id: '4', 
    image: require('../../assets/images/carousel/image4.jpeg'),
  },
  { 
    id: '5', 
    image: require('../../assets/images/carousel/image5.jpeg'),
  },
  { 
    id: '6', 
    image: require('../../assets/images/carousel/image6.jpeg'),
  },
  { 
    id: '7', 
    image: require('../../assets/images/carousel/image7.jpeg'),
  },
];

export default function CircularSliderScreen() {
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useSharedValue(0);
  
  // Animated scroll handler
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  // Get the active index for display purposes
  const activeIndex = useDerivedValue(() => {
    const position = scrollX.value / ITEM_WIDTH;
    const index = Math.round(position);
    return Math.max(0, Math.min(DATA.length - 1, index));
  });

  // Pre-create animated styles for all items
  const itemAnimatedStyles = DATA.map((_, index) => {
    // Define input range for animations
    const inputRange = [
      (index - 1) * ITEM_WIDTH,
      index * ITEM_WIDTH,
      (index + 1) * ITEM_WIDTH,
    ];
    
    return useAnimatedStyle(() => {
      // Scale animation
      const scale = interpolate(
        scrollX.value,
        inputRange,
        [
          ANIMATION_CONFIG.values.itemScale.min,
          ANIMATION_CONFIG.values.itemScale.max,
          ANIMATION_CONFIG.values.itemScale.min
        ],
        Extrapolate.CLAMP
      );

      // Calculate distance from center for vertical position
      const distanceFromCenter = Math.abs(scrollX.value - index * ITEM_WIDTH);
      
      // Convert distance to a vertical offset - the further from center, the lower the item
      // Using a quadratic function for more natural curve
      const verticalOffset = (distanceFromCenter / ITEM_WIDTH) ** 2 * ANIMATION_CONFIG.values.maxVerticalOffset;
      
      // Opacity animation
      const opacity = interpolate(
        scrollX.value,
        inputRange,
        [
          ANIMATION_CONFIG.values.itemOpacity.min,
          ANIMATION_CONFIG.values.itemOpacity.max,
          ANIMATION_CONFIG.values.itemOpacity.min
        ],
        Extrapolate.CLAMP
      );
      
      // Border animation - using a much tighter range for precise center detection
      // This ensures border only appears when item is perfectly centered
      const distance = Math.abs(scrollX.value - index * ITEM_WIDTH);
      const isActive = distance < ANIMATION_CONFIG.values.centerThreshold;
      
      return {
        transform: [
          { scale },
          { translateY: verticalOffset }
        ],
        opacity,
        borderWidth: isActive ? 3 : 0,
        borderColor: 'white',
      };
    });
  });

  // Create animated styles for background images
  const backgroundImageStyles = DATA.map((_, index) => {
    return useAnimatedStyle(() => {
      // Fade in when this item is active, fade out otherwise
      const opacity = withTiming(
        activeIndex.value === index ? 1 : 0,
        { 
          duration: ANIMATION_CONFIG.durations.backgroundFade,
          easing: ANIMATION_CONFIG.easing.backgroundFade
        }
      );
      
      return {
        opacity,
        display: activeIndex.value === index ? 'flex' : 'none', // Optimization: hide when not active
      };
    });
  });

  return (
    <View style={styles.container}>
      {/* Background images - stacked with the active one visible */}
      {DATA.map((item, index) => (
        <Animated.View 
          key={`bg-${item.id}`}
          style={[styles.backgroundImageContainer, backgroundImageStyles[index]]}
        >
          <Image
            source={item.image}
            style={styles.backgroundImage}
            contentFit="cover"
          />
          {/* Overlay to darken the background image */}
          <View style={styles.overlay} />
        </Animated.View>
      ))}

      <Stack.Screen
        options={{
          title: 'Image Carousel',
          headerShown: true,
          headerStyle: { backgroundColor: 'transparent' },
          headerTransparent: true,
          headerTintColor: '#fff',
        }}
      />

      {/* Main content area */}
      <View style={styles.content} />

      {/* Carousel at the bottom */}
      <View style={styles.carouselContainer}>
        <Animated.FlatList
          ref={flatListRef}
          data={DATA}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: (SCREEN_WIDTH - ITEM_SIZE) / 2, // Center first and last items
          }}
          snapToInterval={ITEM_WIDTH}
          decelerationRate={0.95}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          renderItem={({ item, index }) => (
            <View
              style={{
                width: ITEM_WIDTH,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Animated.View
                style={[
                  styles.carouselItem,
                  itemAnimatedStyles[index],
                ]}
              >
                <Image
                  source={item.image}
                  style={styles.carouselItemImage}
                  contentFit="cover"
                />
              </Animated.View>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImageContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Semi-transparent overlay to darken the image
  },
  content: {
    flex: 1,
  },
  carouselContainer: {
    height: ITEM_SIZE * 2,
    marginBottom: 16,
  },
  carouselItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: ITEM_SIZE / 2,
    overflow: 'hidden',
  },
  carouselItemImage: {
    width: '100%',
    height: '100%',
  },
}); 