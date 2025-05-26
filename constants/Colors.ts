/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

// Using zinc palette
const tintColorLight = '#71717a'; // zinc-500
const tintColorDark = '#d4d4d8'; // zinc-300

export const Colors = {
  light: {
    text: '#27272a', // zinc-800
    background: '#fafafa', // zinc-50
    tint: tintColorLight,
    icon: '#52525b', // zinc-600
    tabIconDefault: '#71717a', // zinc-500
    tabIconSelected: '#18181b', // zinc-900
  },
  dark: {
    text: '#e4e4e7', // zinc-200
    background: '#18181b', // zinc-900
    tint: tintColorDark,
    icon: '#a1a1aa', // zinc-400
    tabIconDefault: '#a1a1aa', // zinc-400
    tabIconSelected: '#ffffff', // white
  },
};
