import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

const Button = ({ 
  title, 
  onPress, 
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon: Icon,
  style,
  textStyle,
  ...props 
}) => {
  const theme = useTheme();
  
  const getButtonStyle = () => {
    const baseStyle = {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    };
    
    const variantStyles = {
      primary: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
      },
      secondary: {
        backgroundColor: 'transparent',
        borderColor: theme.colors.primary,
        borderWidth: 2,
      },
      outline: {
        backgroundColor: 'transparent',
        borderColor: theme.colors.border,
        borderWidth: 1,
      },
      danger: {
        backgroundColor: theme.colors.error,
        borderColor: theme.colors.error,
      },
      success: {
        backgroundColor: theme.colors.success,
        borderColor: theme.colors.success,
      }
    };
    
    const sizeStyles = {
      small: {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.borders.radius.small,
      },
      medium: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        borderRadius: theme.borders.radius.medium,
      },
      large: {
        paddingVertical: theme.spacing.lg,
        paddingHorizontal: theme.spacing.xl,
        borderRadius: theme.borders.radius.medium,
      }
    };
    
    return {
      ...baseStyle,
      ...variantStyles[variant],
      ...sizeStyles[size],
      opacity: disabled ? 0.5 : 1,
    };
  };
  
  const getTextStyle = () => {
    const variantTextStyles = {
      primary: { color: '#ffffff' },
      secondary: { color: theme.colors.primary },
      outline: { color: theme.colors.text },
      danger: { color: '#ffffff' },
      success: { color: '#ffffff' }
    };
    
    const sizeTextStyles = {
      small: { fontSize: 14 },
      medium: { fontSize: 16 },
      large: { fontSize: 18 }
    };
    
    return {
      ...theme.typography.body,
      fontWeight: '600',
      ...variantTextStyles[variant],
      ...sizeTextStyles[size],
    };
  };
  
  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getTextStyle().color} />
      ) : (
        <>
          {Icon && <Icon style={styles.icon} />}
          <Text style={[getTextStyle(), textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  }
});

export default Button;
