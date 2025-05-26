import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface Badge {
  label: string;
  color?: string;
}

interface CardProps {
  title: string;
  description: string;
  badges: Badge[];
  previewImage?: any;
  route: string;
}

export function Card({ title, description, badges, previewImage, route }: CardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(route);
  };

  return (
    <TouchableOpacity
      className="bg-white dark:bg-zinc-800 rounded-xl overflow-hidden shadow-md mb-4 active:opacity-90"
      onPress={handlePress}>
      <View className="p-4">
        <Text className="text-lg font-bold text-zinc-900 dark:text-white">{title}</Text>
        <Text className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">{description}</Text>
        
        <View className="flex-row flex-wrap mt-3 gap-2">
          {badges.map((badge, index) => (
            <View
              key={index}
              className={`px-2 py-1 rounded-full ${
                badge.color || 'bg-zinc-200 dark:bg-zinc-700'
              }`}>
              <Text className="text-xs font-medium text-zinc-800 dark:text-zinc-100">
                {badge.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {previewImage && (
        <View className="h-40 w-full bg-zinc-100 dark:bg-zinc-700">
          <Image
            source={previewImage}
            className="h-full w-full"
            contentFit="cover"
          />
        </View>
      )}
    </TouchableOpacity>
  );
} 