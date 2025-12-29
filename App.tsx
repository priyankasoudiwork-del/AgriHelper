/**
 * AgriHelper React Native App
 * With MobX State Tree Global State Management
 *
 * @format
 */

import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { StoreProvider } from './src/providers/StoreProvider';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StoreProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#0284c7"
        />
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </StoreProvider>
    </SafeAreaProvider>
  );
}

export default App;
