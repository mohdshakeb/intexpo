import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Button } from '@/components/ui/Button';

export default function FadeInOutScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const opacity = useSharedValue(1);

  const toggleVisibility = () => {
    opacity.value = withTiming(isVisible ? 0 : 1, { duration: 1000 });
    setIsVisible(!isVisible);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <View className="flex-1 bg-white dark:bg-zinc-900 p-4">
      <Stack.Screen
        options={{
          title: 'Fade In/Out Animation',
          headerShown: true,
        }}
      />
      
      <View className="py-4">
        <Text className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
          Fade In/Out Animation
        </Text>
        <Text className="text-zinc-600 dark:text-zinc-300 mb-6">
          A simple example of fading an element in and out using Reanimated's withTiming function.
        </Text>
      </View>

      <View className="items-center justify-center flex-1">
        <Animated.View 
          className="w-40 h-40 bg-zinc-500 rounded-lg items-center justify-center"
          style={animatedStyle}
        >
          <Text className="text-white font-bold">Hello Reanimated</Text>
        </Animated.View>
      </View>

      <View className="mt-8 mb-4">
        <Button
          label={isVisible ? "Fade Out" : "Fade In"}
          onPress={toggleVisibility}
        />
      </View>

      <View className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg">
        <Text className="text-sm font-medium text-zinc-900 dark:text-white mb-2">
          Learning Notes:
        </Text>
        <Text className="text-xs text-zinc-600 dark:text-zinc-300">
          • useSharedValue: Creates a value that can be shared between JS and UI threads{'\n'}
          • useAnimatedStyle: Creates a style object that can be animated{'\n'}
          • withTiming: Animates a value over time with easing
        </Text>
      </View>
    </View>
  );
} 