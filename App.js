import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { ThemeProvider } from './src/theme';
import { WalletProvider } from './src/store/walletStore';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <WalletProvider>
          <StatusBar
            barStyle="light-content"
            backgroundColor="#000000"
            translucent={false}
          />
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </WalletProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;
