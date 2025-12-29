// navigation/RootNavigator.tsx
// Root navigator with authentication-based routing

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useAuth } from '../hooks/useAuth';

// Import all screens
import SplashScreen from '../screens/SplashScreen';
import AppIntroScreen from '../screens/AppIntoScreen';
import LoginScreen from '../screens/login/LoginSceen';
import HomeScreen from '../screens/HomeScreen';
import WeatherPredictionScreen from '../screens/weather/WeatherPredictionPage';
import ProductScannerScreen from '../screens/ai_chat/ProductScannerScreen';
import SprayRecordsListScreen from '../screens/recordFarm/SprayRecordsListSceen';
import AddSprayRecordScreen from '../screens/recordFarm/AddSprayRecordScreen';
import FarmInfo from '../screens/agriNews/FramInfo';

// Create single stack navigator
const RootStack = createNativeStackNavigator();

/**
 * ROOT NAVIGATOR with Authentication Flow
 * Automatically routes users based on authentication state
 */
const RootNavigator = observer(() => {
  const { isLoading, isAuthenticated } = useAuth();

  // Show loading screen while checking auth state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0284c7" />
      </View>
    );
  }

  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {!isAuthenticated ? (
        // AUTH FLOW - User not logged in
        <>
          <RootStack.Screen
            name="Splash"
            component={SplashScreen}
            options={{ animation: 'fade' }}
          />
          <RootStack.Screen
            name="AppIntro"
            component={AppIntroScreen}
          />
          <RootStack.Screen
            name="Login"
            component={LoginScreen}
          />
        </>
      ) : (
        // AUTHENTICATED FLOW - User is logged in
        <>
          <RootStack.Screen
            name="Home"
            component={HomeScreen}
          />
          <RootStack.Screen
            name="Weather"
            component={WeatherPredictionScreen}
          />
          <RootStack.Screen
            name="AiScanner"
            component={ProductScannerScreen}
          />
          <RootStack.Screen
            name="SprayRecordsList"
            component={SprayRecordsListScreen}
          />
          <RootStack.Screen
            name="AddSprayRecord"
            component={AddSprayRecordScreen}
          />
          <RootStack.Screen
            name="FarmInfo"
            component={FarmInfo}
          />
        </>
      )}
    </RootStack.Navigator>
  );
});

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0284c7',
  },
});

export default RootNavigator;