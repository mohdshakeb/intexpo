import { View, type ViewProps } from 'react-native';
import { twMerge } from 'tailwind-merge';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  className?: string;
};

export function ThemedView({ className, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return (
    <View 
      style={{ backgroundColor }}
      className={twMerge(className)}
      {...otherProps}
    />
  );
}
