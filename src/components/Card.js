import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

const Card = ({ 
  children, 
  variant = 'default',
  elevation = 'medium',
  style,
  ...props 
}) => {
  const theme = useTheme();
  
  const getCardStyle = () => {
    const variantStyles = {
      default: {
        backgroundColor: theme.colors.card,
        borderColor: theme.colors.border,
      },
      surface: {
        backgroundColor: theme.colors.surface,
        borderColor: 'transparent',
      },
      accent: {
        backgroundColor: theme.colors.primary + '20', // 20% opacity
        borderColor: theme.colors.primary,
      },
      transparent: {
        backgroundColor: 'transparent',
        borderColor: theme.colors.border,
      }
    };
    
    const elevationStyles = {
      none: {},
      small: theme.shadows.small,
      medium: theme.shadows.medium,
      large: theme.shadows.large,
    };
    
    return {
      ...styles.card,
      ...variantStyles[variant],
      ...elevationStyles[elevation],
      borderWidth: variant === 'transparent' ? 1 : 0,
    };
  };
  
  return (
    <View style={[getCardStyle(), style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
  }
});

export default Card;
