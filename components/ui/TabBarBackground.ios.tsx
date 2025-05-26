import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function BlurTabBarBackground() {
  const colorScheme = useColorScheme();
  
  return (
    <>
      {/* Base color layer */}
      <View 
        style={[
          StyleSheet.absoluteFill, 
          { 
            backgroundColor: colorScheme === 'dark' 
              ? 'rgba(24, 24, 27, 0.8)' // zinc-900 with opacity
              : 'rgba(250, 250, 250, 0.8)' // zinc-50 with opacity
          }
        ]} 
      />
      
      {/* Blur effect on top */}
    <BlurView
        tint={colorScheme === 'dark' ? 'dark' : 'light'}
        intensity={30}
      style={StyleSheet.absoluteFill}
    />
    </>
  );
}

export function useBottomTabOverflow() {
  return useBottomTabBarHeight();
}
