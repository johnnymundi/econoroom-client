import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'outline' | 'danger';
}

export function Button({ title, loading, variant = 'primary', style, disabled, ...props }: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.base, styles[variant], disabled || loading ? styles.disabled : null, style]}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : '#6200EE'} />
      ) : (
        <Text style={[styles.text, variant === 'outline' ? styles.textOutline : null]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  primary: {
    backgroundColor: '#6200EE',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#6200EE',
  },
  danger: {
    backgroundColor: '#B00020',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  textOutline: {
    color: '#6200EE',
  },
});
