import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme();
  
  const theme = {
    colors: {
      // Dark theme dengan aksen merah neon
      background: '#000000',
      surface: '#111111',
      card: '#1a1a1a',
      border: '#222222',
      
      // Warna utama
      primary: '#ff0033',
      primaryLight: '#ff3366',
      primaryDark: '#cc0029',
      secondary: '#00ffcc',
      accent: '#ff00ff',
      
      // Text colors
      text: '#ffffff',
      textSecondary: '#aaaaaa',
      textMuted: '#666666',
      
      // Status colors
      success: '#00ff00',
      warning: '#ff9900',
      error: '#ff0033',
      info: '#0066ff',
      
      // Neon effects
      neonRed: '#ff0033',
      neonPink: '#ff00ff',
      neonBlue: '#0066ff',
      neonGreen: '#00ff00',
      
      // Gradients
      gradientPrimary: ['#ff0033', '#cc0029'],
      gradientDark: ['#000000', '#111111'],
    },
    
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
    },
    
    typography: {
      h1: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
      },
      h2: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
      },
      h3: {
        fontSize: 20,
        fontWeight: '600',
        color: '#ffffff',
      },
      body: {
        fontSize: 16,
        color: '#ffffff',
      },
      caption: {
        fontSize: 14,
        color: '#aaaaaa',
      },
      small: {
        fontSize: 12,
        color: '#666666',
      },
    },
    
    shadows: {
      small: {
        shadowColor: '#ff0033',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
      },
      medium: {
        shadowColor: '#ff0033',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 6,
      },
      large: {
        shadowColor: '#ff0033',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
        elevation: 12,
      },
    },
    
    borders: {
      radius: {
        small: 8,
        medium: 16,
        large: 24,
        circle: 999,
      },
      width: {
        thin: 1,
        medium: 2,
        thick: 4,
      },
    },
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
