import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack } from 'expo-router';
import { ArrowLeft, Box, Cone, Cylinder, Pyramid } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import AnimatedCard from '../../components/AnimatedCard';

export default function AnimatedCardScreen() {
  const [expandedCardIndex, setExpandedCardIndex] = useState(1); // Second card expanded by default
  const colorScheme = useColorScheme();

  const handleCardExpand = (index: number, isExpanded: boolean) => {
    if (isExpanded) {
      setExpandedCardIndex(index);
    } else if (expandedCardIndex === index) {
      setExpandedCardIndex(-1);
    }
  };

  return (
    <View className="flex-1 bg-white dark:bg-zinc-900">
      <Stack.Screen options={{ 
        title: 'Animated Card',
        headerShown: true,
      }} />
      
      <ScrollView 
        className="flex-1 px-8"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flex: 1, justifyContent: 'center', paddingBottom: 20 }}
      >
        <View className="flex-col justify-center py-4 items-center">
          <Text className="text-3xl font-bold text-zinc-900 dark:text-white mb-2 text-center">
            Choose your shape
          </Text>
          <Text className="text-zinc-500 dark:text-zinc-300 mb-6 text-center">
            This shape will be used to create a 3D model.
          </Text>
        </View>

        <View className="items-center justify-center">
          <AnimatedCard 
            title="Cube"
            description="A shape with 6 faces, 12 edges, and 8 vertices."
            icon={<Box size={24} color="#6366f1" />}
            isExpanded={expandedCardIndex === 0}
            onExpandChange={(isExpanded) => handleCardExpand(0, isExpanded)}
          />
          
          <AnimatedCard 
            title="Cone"
            description="Make a cone by connecting a circle to a point."
            icon={<Cone size={24} color="#ec4899" />}
            isExpanded={expandedCardIndex === 1}
            onExpandChange={(isExpanded) => handleCardExpand(1, isExpanded)}
          />
          
          <AnimatedCard 
            title="Cylinder"
            description="A shape with 2 circular faces and a curved surface."
            icon={<Cylinder size={24} color="#14b8a6" />}
            isExpanded={expandedCardIndex === 2}
            onExpandChange={(isExpanded) => handleCardExpand(2, isExpanded)}
          />
          
          <AnimatedCard 
            title="Pyramid"
            description="The most interesting shape with a square base and 4 triangular faces."
            icon={<Pyramid size={24} color="#f59e0b" />}
            isExpanded={expandedCardIndex === 3}
            onExpandChange={(isExpanded) => handleCardExpand(3, isExpanded)}
          />
        </View>
      </ScrollView>
      
      {/* Navigation Buttons */}
      <View className="flex-row p-5 gap-2 mb-8">
        <TouchableOpacity 
          className="bg-zinc-500 py-4 px-4 rounded-full items-center justify-center"
          onPress={() => {}}
        >
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="flex-1 bg-zinc-800 dark:bg-zinc-50 py-4 px-8 rounded-full items-center justify-center"
          onPress={() => {}}
        >
          <Text className={`font-medium ${colorScheme === 'dark' ? 'text-zinc-800' : 'text-white'}`}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 