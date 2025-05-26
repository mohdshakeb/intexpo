import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  label: string;
}

export function Button({
  variant = 'primary',
  size = 'md',
  label,
  ...props
}: ButtonProps) {
  const variantClasses = {
    primary: 'bg-zinc-800 border-transparent',
    secondary: 'bg-zinc-500 border-transparent',
    outline: 'bg-transparent border-zinc-500',
  };

  const textVariantClasses = {
    primary: 'text-white',
    secondary: 'text-white',
    outline: 'text-zinc-700',
  };

  const sizeClasses = {
    sm: 'py-1 px-3',
    md: 'py-2 px-4',
    lg: 'py-3 px-6',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <TouchableOpacity
      className={`rounded-md border ${variantClasses[variant]} ${sizeClasses[size]} active:opacity-80`}
      {...props}>
      <Text className={`font-medium ${textVariantClasses[variant]} ${textSizeClasses[size]}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
} 