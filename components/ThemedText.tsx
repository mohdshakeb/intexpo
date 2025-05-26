import { Text, type TextProps } from 'react-native';
import { twMerge } from 'tailwind-merge';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
  className?: string;
};

export function ThemedText({
  className,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  
  const baseClasses = "font-sans";
  
  const typeClasses = {
    default: "text-base leading-6",
    defaultSemiBold: "text-base leading-6 font-semibold",
    title: "text-3xl font-bold leading-8",
    subtitle: "text-xl font-bold",
    link: "leading-[30px] text-base text-zinc-500 dark:text-zinc-400",
  };

  return (
    <Text
      style={{ color }}
      className={twMerge(baseClasses, typeClasses[type], className)}
      {...rest}
    />
  );
}
