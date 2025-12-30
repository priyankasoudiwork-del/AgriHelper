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
import {
  requestMultiple,
  PERMISSIONS,
  RESULTS,
  Permission,
} from 'react-native-permissions';
import { ScreenProps } from '../types';

export default function SplashScreen({ navigation }: ScreenProps<'Splash'>) {
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslate = useRef(new Animated.Value(30)).current;
  const loadingWidth = useRef(new Animated.Value(0)).current;

  const askPermissions = async () => {
    try {
      const permissions: Permission[] = Platform.OS === 'android'
        ? [
            PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
            PERMISSIONS.ANDROID.CAMERA,
            PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
          ]
        : [
            PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
            PERMISSIONS.IOS.CAMERA,
            PERMISSIONS.IOS.PHOTO_LIBRARY,
          ];

      const statuses = await requestMultiple(permissions);

      const allGranted = Object.values(statuses).every(
        status => status === RESULTS.GRANTED
      );

      if (!allGranted) {
        Alert.alert(
          'Permissions Required',
          'Location, Camera and Gallery permissions are required for full app functionality.'
        );
      }
    } catch (error) {
      console.log('Permission error:', error);
    }
  };

  useEffect(() => {
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
        if (finished) {
          navigation.replace('AppIntro');
        }
      });
    }, 1200);
  }, []);

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
