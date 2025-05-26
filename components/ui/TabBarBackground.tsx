// This is a background component for the tab bar on Android and web
import React from 'react';
import { View } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabBarBackground() {
  const colorScheme = useColorScheme();
  
  return (
    <View 
      style={{ 
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '100%',
        backgroundColor: colorScheme === 'dark' ? '#18181b' : '#fafafa', // zinc-900 for dark, zinc-50 for light
      }} 
    />
  );
}

export function useBottomTabOverflow() {
  return 0;
}
