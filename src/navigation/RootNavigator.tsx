// navigation/RootNavigator.tsx
// Complete navigation root with TypeScript

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Text, StyleSheet } from 'react-native';

// Import all screens
import SplashScreen from '../screens/SplashScreen';
import AppIntroScreen from '../screens/AppIntoScreen';
import LoginScreen from '../screens/login/LoginSceen';
import HomeScreen from '../screens/HomeScreen';
import WeatherPredictionScreen from '../screens/weather/WeatherPredictionPage';
import ProductScannerScreen from '../screens/ai_chat/ProductScannerScreen';
import SprayRecordsListScreen from '../screens/recordFarm/SprayRecordsListSceen';
import AddSprayRecordScreen from '../screens/recordFarm/AddSprayRecordScreen';
import FarmInfo from '../screens/agriNews/FramInfo'



// Create single stack navigator
const RootStack = createNativeStackNavigator();

// ============================================
// ROOT STACK NAVIGATOR (Simple & Clean)
// All screens in one stack - navigate anywhere!
// ============================================
export default function RootNavigator() {
  return (
    <RootStack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
    
      }}
    >
      {/* AUTH FLOW */}
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

      {/* MAIN SCREEN */}
      <RootStack.Screen 
        name="Home" 
        component={HomeScreen}
      />

      {/* FEATURE SCREENS */}
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
    </RootStack.Navigator>
  );
}