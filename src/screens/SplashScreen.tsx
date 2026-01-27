import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  checkMultiple,
  requestMultiple,
  PERMISSIONS,
  RESULTS,
  Permission,
} from 'react-native-permissions';
import { ScreenProps } from '../types';
import { useAuth } from '../hooks/useAuth';

export default function SplashScreen({ navigation }: ScreenProps<'Splash'>) {
  const { isAuthenticated } = useAuth();
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslate = useRef(new Animated.Value(30)).current;
  const loadingWidth = useRef(new Animated.Value(0)).current;
  const hasNavigated = useRef(false);
  const authStateRef = useRef(isAuthenticated);

  // Update auth state ref when it changes
  useEffect(() => {
    authStateRef.current = isAuthenticated;
  }, [isAuthenticated]);

  const askPermissions = async () => {
    try {
      // Check if we've already asked for permissions
      const permissionsAsked = await AsyncStorage.getItem('permissionsAsked');

      const permissions: Permission[] = Platform.OS === 'android'
        ? [
            PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
            PERMISSIONS.ANDROID.CAMERA,
            PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
            PERMISSIONS.ANDROID.RECORD_AUDIO,
          ]
        : [
            PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
            PERMISSIONS.IOS.CAMERA,
            PERMISSIONS.IOS.PHOTO_LIBRARY,
            PERMISSIONS.IOS.MICROPHONE,
            PERMISSIONS.IOS.SPEECH_RECOGNITION,
          ];

      // Check current permission statuses
      const currentStatuses = await checkMultiple(permissions);

      // Filter permissions that need to be requested (not granted and not permanently denied)
      const permissionsToRequest = permissions.filter(
        permission => currentStatuses[permission] !== RESULTS.GRANTED &&
                      currentStatuses[permission] !== RESULTS.BLOCKED
      );

      // Only request if there are permissions to request and we haven't asked before
      if (permissionsToRequest.length > 0 && !permissionsAsked) {
        const statuses = await requestMultiple(permissionsToRequest);

        // Mark that we've asked for permissions
        await AsyncStorage.setItem('permissionsAsked', 'true');

        const allGranted = Object.values(statuses).every(
          status => status === RESULTS.GRANTED
        );

        if (!allGranted) {
          Alert.alert(
            'ಅನುಮತಿಗಳು ಅಗತ್ಯವಿದೆ | Permissions Required',
            'ಸ್ಥಳ, ಕ್ಯಾಮೆರಾ, ಗ್ಯಾಲರಿ ಮತ್ತು ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿಗಳು ಸಂಪೂರ್ಣ ಅಪ್ಲಿಕೇಶನ್ ಕಾರ್ಯಕ್ಕೆ ಅಗತ್ಯವಿದೆ. | Location, Camera, Gallery and Microphone permissions are required for full app functionality.'
          );
        }
      }
    } catch (error) {
      console.log('Permission error:', error);
    }
  };

  useEffect(() => {
    // Only run once on component mount
    if (hasNavigated.current) {
      return;
    }

    askPermissions();

    // Logo animations
    Animated.spring(logoScale, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();

    Animated.timing(logoRotate, {
      toValue: 1,
      duration: 800,
      easing: Easing.elastic(1.2),
      useNativeDriver: true,
    }).start();

    // Title fade in
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(titleTranslate, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }, 700);

    // Progress bar -> navigate
    setTimeout(() => {
      Animated.timing(loadingWidth, {
        toValue: 100,
        duration: 2000,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished && !hasNavigated.current) {
          hasNavigated.current = true;
          // Navigate based on authentication state
          if (isAuthenticated) {
            navigation.replace('Home');
          } else {
            navigation.replace('AppIntro');
          }
        }
      });
    }, 1200);
  }, []); // Empty dependency array - only run once on mount

  const rotate = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const loadingWidthInterpolated = loadingWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logo,
          { transform: [{ scale: logoScale }, { rotate }] },
        ]}
      >
        <Text style={styles.logoText}>🍇</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.titleContainer,
          {
            opacity: titleOpacity,
            transform: [{ translateY: titleTranslate }],
          },
        ]}
      >
        <Text style={styles.titleKannada}>ದ್ರಾಕ್ಷಿ ಫಾರ್ಮ್ ಟ್ರಾಕರ್</Text>
        <Text style={styles.titleEnglish}>Grape Farm Tracker</Text>
        <Text style={styles.subtitle}>ರಾಸಾಯನಿಕ ಸ್ಪ್ರೇ ನಿರ್ವಹಣೆ</Text>
      </Animated.View>

      <View style={styles.loadingContainer}>
        <View style={styles.loadingBar}>
          <Animated.View
            style={[
              styles.loadingProgress,
              { width: loadingWidthInterpolated },
            ]}
          />
        </View>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  logoText: {
    fontSize: 50,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  titleKannada: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  titleEnglish: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#e5e7eb',
    marginTop: 4,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 80,
    width: 220,
    alignItems: 'center',
  },
  loadingBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  loadingProgress: {
    height: '100%',
    backgroundColor: '#4ade80',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 14,
  },
});
