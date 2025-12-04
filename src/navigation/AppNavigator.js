import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useWallet } from '../store/walletStore';

// Screens
import LoginScreen from '../screens/LoginScreen';
import CreateWalletScreen from '../screens/CreateWalletScreen';
import DashboardScreen from '../screens/DashboardScreen';
import SendScreen from '../screens/SendScreen';
import ReceiveScreen from '../screens/ReceiveScreen';
import TokenScreen from '../screens/TokenScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const MainDrawer = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#000000',
          width: 280,
        },
        drawerActiveBackgroundColor: '#ff003320',
        drawerActiveTintColor: '#ff0033',
        drawerInactiveTintColor: '#ffffff',
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: '#000000',
          borderBottomWidth: 1,
          borderBottomColor: '#ff0033',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: 'bold',
        },
      }}
    >
      <Drawer.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="dashboard" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Send" 
        component={SendScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="send" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Receive" 
        component={ReceiveScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="qr-code-scanner" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Tokens" 
        component={TokenScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="token" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="settings" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const AppNavigator = () => {
  const { activeWallet } = useWallet();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#000000',
          borderBottomWidth: 1,
          borderBottomColor: '#ff0033',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: 'bold',
        },
        cardStyle: {
          backgroundColor: '#000000',
        },
      }}
    >
      {!activeWallet ? (
        <>
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="CreateWallet" 
            component={CreateWalletScreen}
            options={{ title: 'Create Wallet' }}
          />
        </>
      ) : (
        <Stack.Screen 
          name="Main" 
          component={MainDrawer}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
};

// Mock Icon component
const Icon = ({ name, color, size }) => {
  return null; // Replace with actual icon component
};

export default AppNavigator;
