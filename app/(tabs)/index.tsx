import { Moon, Sun } from 'lucide-react-native';
import { TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import ScreenshotCarousel from '@/components/ScreenshotCarousel';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { colorScheme } from 'nativewind';


export default function HomeScreen() {
  const currentColorScheme = useColorScheme();
  
  const toggleColorScheme = () => {
    colorScheme.set(currentColorScheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemedView className="flex-1 pt-8">
      <ScrollView className="pb-6">
        <View className="flex-row justify-between items-start mt-6 mb-20 pl-4 pr-4">
          <View className="flex-1">
            <ThemedText className="font-regular text-sm uppercase tracking-wider mb-1 text-zinc-500">
              REANIMATED
            </ThemedText>
            <ThemedText type="title" className="text-4xl leading-10">
              An Interaction Playground
            </ThemedText>
          </View>
          
          <TouchableOpacity 
            className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800"
            style={{ elevation: 4 }}
            onPress={toggleColorScheme}
            accessibilityLabel="Toggle dark mode"
            accessibilityRole="button"
          >
            {currentColorScheme === 'dark' ? (
              <Sun size={24} color="#fff" />
            ) : (
              <Moon size={24} color="#000" />
            )}
          </TouchableOpacity>
        </View>
        
        <ScreenshotCarousel />
      
      </ScrollView>
    </ThemedView>
  );
}
