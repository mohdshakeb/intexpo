import { useColorScheme } from '@/hooks/useColorScheme';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import React, { useRef } from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

// Get screen dimensions
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Define sizes relative to screen width
const ITEM_WIDTH = SCREEN_WIDTH * 0.70; // 70% of screen width
const ITEM_SPACING = 16; // Space between items
const ITEM_TOTAL_WIDTH = ITEM_WIDTH + ITEM_SPACING; // Total width including spacing

// Type definition for carousel items
type CarouselItem = {
  id: string;
  title: string;
  image: any; // Image source
  route: string; // Route to navigate to
};

// Sample data with different images
const CAROUSEL_DATA: CarouselItem[] = [
  { 
    id: '1', 
    title: 'Fade In/Out Animation',
    image: require('../assets/images/carousel/image1.jpeg'),
    route: '/animations/fade-in-out',
  },
  { 
    id: '2', 
    title: 'Image Carousel',
    image: require('../assets/images/carousel/image2.jpeg'),
    route: '/animations/circular-slider',
  },
  { 
    id: '3', 
    title: 'Counter Animation',
    image: require('../assets/images/carousel/image3.jpeg'),
    route: '/animations/counter',
  },
];

export default function ScreenshotCarousel() {
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useSharedValue(0);
  const colorScheme = useColorScheme();
  
  // Animated scroll handler
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  // Get the active index for display purposes
  const activeIndex = useDerivedValue(() => {
    const position = scrollX.value / ITEM_TOTAL_WIDTH;
    const index = Math.round(position);
    return Math.max(0, Math.min(CAROUSEL_DATA.length - 1, index));
  });

  // Pre-create animated styles for all items
  const itemAnimatedStyles = CAROUSEL_DATA.map((_, index) => {
    // Define input range for animations
    const inputRange = [
      (index - 1) * ITEM_TOTAL_WIDTH,
      index * ITEM_TOTAL_WIDTH,
      (index + 1) * ITEM_TOTAL_WIDTH,
    ];
    
    return useAnimatedStyle(() => {
      // Y position animation - move neighboring items down
      const translateY = interpolate(
        scrollX.value,
        inputRange,
        [40, 0, 40], // Move neighbors down by 40 units
        Extrapolate.CLAMP
      );

      // Opacity animation
      const opacity = interpolate(
        scrollX.value,
        inputRange,
        [0.7, 1, 0.7],
        Extrapolate.CLAMP
      );
      
      return {
        transform: [{ translateY }],
        opacity,
      };
    });
  });

  // Create animated styles for title and arrow
  const titleAnimatedStyles = CAROUSEL_DATA.map((_, index) => {
    const inputRange = [
      (index - 1) * ITEM_TOTAL_WIDTH,
      index * ITEM_TOTAL_WIDTH,
      (index + 1) * ITEM_TOTAL_WIDTH,
    ];
    
    return useAnimatedStyle(() => {
      // Only show title when this item is close to active
      const opacity = interpolate(
        scrollX.value,
        inputRange,
        [0, 1, 0],
        Extrapolate.CLAMP
      );
      
      return {
        opacity,
        zIndex: 10,
      };
    });
  });

  // Navigate to animation screen
  const handleNavigation = (route: string) => {
    router.push(route as any);
  };

  return (
    <View className="mb-10">
      {/* Carousel */}
      <View className="h-[550px]">
        <Animated.FlatList
          ref={flatListRef}
          data={CAROUSEL_DATA}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          contentContainerStyle={{
            paddingHorizontal: (SCREEN_WIDTH - ITEM_WIDTH) / 2, // Center first and last items
          }}
          snapToInterval={ITEM_TOTAL_WIDTH}
          decelerationRate={0.95}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          renderItem={({ item, index }) => (
            <View className="px-2" style={{ width: ITEM_TOTAL_WIDTH }}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => handleNavigation(item.route)}
                className="relative"
              >
                <Animated.View
                  style={[itemAnimatedStyles[index]]}
                  className="overflow-hidden rounded-3xl bg-zinc-100 dark:bg-zinc-800 shadow-lg"
                >
                  <View className="w-full h-[500]">
                    <Image
                      source={item.image}
                      style={{ width: '100%', height: '100%' }}
                      contentFit="cover"
                      cachePolicy="memory-disk"
                    />
                  </View>
                </Animated.View>
              </TouchableOpacity>
              
              {/* Title and arrow - only visible when centered */}
              <Animated.View 
                style={titleAnimatedStyles[index]}
                className="flex-row items-center justify-between px-4 py-3 mt-3 rounded-xl"
              >
                <Text className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {item.title}
                </Text>
                <ArrowRight size={20} color={colorScheme === 'dark' ? '#fff' : '#000'} />
              </Animated.View>
            </View>
          )}
        />
      </View>
    </View>
  );
} 