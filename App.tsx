/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View,Text } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Test1 from './src/screens/SplashScreen'
import AppProvider from './src/ContextApi'
import { useTestContext } from './src/ContextApi';
import Register from './src/RegisterPage'
import Test2 from './src/screens/AppIntoScreen'
import Login from './src/screens/login/LoginSceen'
import  AddSprayRecordScreen from './src/screens/recordFarm/AddSprayRecordScreen'
import SprayRecordsApp from './src/screens/recordFarm/SprayRecordsListSceen'
import WeatherPredictionPage from './src/screens/weather/WeatherPredictionPage'
import ProductScannerScreen from './src/screens/ai_chat/ProductScannerScreen';
import HomeScreen from './src/screens/HomeScreen'
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import TestAi from './src/screens/ai_chat/TestAi'
import FarmNews from './src/screens/agriNews/FramInfo'

function TestContextComponent() {
  useTestContext();
  return null;
}

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>

   
           <StatusBar 
        barStyle="light-content" 
        backgroundColor="#0284c7" 
      />
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <Register/>
      {/* <NewAppScreen
        templateFileName="App.tsx"
        safeAreaInsets={safeAreaInsets}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
