import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Animated,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ScreenProps } from '../types';

const { width, height } = Dimensions.get('window');

interface Slide {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  image: string;
  gradientColors: string[];
}

const slides: Slide[] = [
  {
    id: '1',
    title: 'ನಿಮ್ಮ ರಾಸಾಯನಿಕ ಸ್ಪ್ರೇಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ',
    titleEn: 'Track Your Chemical Sprays',
    description:
      'ನೀವು ಯಾವ ರಾಸಾಯನಿಕವನ್ನು ಬಳಸಿದ್ದೀರಿ, ಎಷ್ಟು ಪ್ರಮಾಣ ಮತ್ತು ಯಾವ ದಿನಾಂಕದಲ್ಲಿ ಬಳಸಿದ್ದೀರಿ ಎಂಬುದನ್ನು ಸುಲಭವಾಗಿ ದಾಖಲಿಸಿ.',
    descriptionEn:
      'Easily record which chemical you used, how much quantity, and on which date.',
    image: '🌿',
    gradientColors: ['#059669', '#10b981', '#34d399'],
  },
  {
    id: '2',
    title: 'ನಿಮ್ಮ ಖರ್ಚುಗಳನ್ನು ತಿಳಿಯಿರಿ',
    titleEn: 'Know Your Expenses',
    description:
      'ದಿನ, ವಾರ ಮತ್ತು ತಿಂಗಳ ಖರ್ಚುಗಳನ್ನು ಸರಳ ಗ್ರಾಫ್‌ಗಳಲ್ಲಿ ನೋಡಿ. ನೀವು ಪ್ರತಿ ತಿಂಗಳು ಎಷ್ಟು ಖರ್ಚು ಮಾಡುತ್ತಿದ್ದೀರಿ ಎಂದು ತಿಳಿಯಿರಿ.',
    descriptionEn:
      'See daily, weekly and monthly expenses in simple graphs.',
    image: '📊',
    gradientColors: ['#1d4ed8', '#3b82f6', '#60a5fa'],
  },
  {
    id: '3',
    title: 'ಹಣವನ್ನು ಉಳಿಸಿ',
    titleEn: 'Save Money',
    description:
      'ಅನಗತ್ಯ ಸ್ಪ್ರೇ ಮಾಡುವುದನ್ನು ತಪ್ಪಿಸಿ. ಅತಿಯಾದ ಖರ್ಚು ಮಾಡುವುದನ್ನು ನಿಲ್ಲಿಸಿ.',
    descriptionEn:
      'Avoid repeated spraying. Stop over-spending. Manage your farm easily.',
    image: '💰',
    gradientColors: ['#d97706', '#f59e0b', '#fbbf24'],
  },
];

export default function AppIntroScreen({ navigation }: ScreenProps<'AppIntro'>) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Animation values for content
  const iconBounce = useRef(new Animated.Value(0)).current;

  // Start icon bounce animation on mount and slide change
  useEffect(() => {
    startIconAnimation();
  }, [currentSlide]);

  const startIconAnimation = () => {
    iconBounce.setValue(0);
    Animated.sequence([
      Animated.spring(iconBounce, {
        toValue: -15,
        tension: 100,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(iconBounce, {
        toValue: 0,
        tension: 100,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    if (index !== currentSlide) {
      setCurrentSlide(index);
    }
  };

  const goToSlide = (index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setCurrentSlide(index);
  };

  const goToNext = () => {
    if (currentSlide < slides.length - 1) {
      goToSlide(currentSlide + 1);
    }
  };

  const handleStart = () => {
    navigation.navigate('Login');
  };

  const handleSkip = () => {
    navigation.navigate('Login');
  };

  const renderSlide = ({ item, index }: { item: Slide; index: number }) => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.4, 1, 0.4],
      extrapolate: 'clamp',
    });

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.slide}>
        <LinearGradient
          colors={item.gradientColors}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Skip button */}
          {currentSlide < slides.length - 1 && (
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          )}

          <Animated.View
            style={[
              styles.slideContent,
              { opacity, transform: [{ scale }] },
            ]}
          >
            {/* Icon with bounce animation */}
            <Animated.View
              style={[
                styles.iconContainer,
                {
                  transform: [
                    { translateY: index === currentSlide ? iconBounce : 0 },
                  ],
                },
              ]}
            >
              <View style={styles.iconCircle}>
                <Text style={styles.iconEmoji}>{item.image}</Text>
              </View>
            </Animated.View>

            {/* Titles */}
            <View style={styles.textContainer}>
              <Text style={styles.titleKannada}>{item.title}</Text>
              <Text style={styles.titleEnglish}>{item.titleEn}</Text>
            </View>

            {/* Description */}
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionKannada}>{item.description}</Text>
              <Text style={styles.descriptionEnglish}>{item.descriptionEn}</Text>
            </View>
          </Animated.View>

          {/* Bottom controls - integrated into slide */}
          <View style={styles.bottomControls}>
            {renderDots()}

            <View style={styles.buttonContainer}>
              {currentSlide < slides.length - 1 ? (
                <TouchableOpacity
                  style={styles.nextButton}
                  onPress={goToNext}
                  activeOpacity={0.8}
                >
                  <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.startButton}
                  onPress={handleStart}
                  activeOpacity={0.8}
                >
                  <Text style={styles.startButtonText}>Get Started</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  };

  // Animated dots
  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: 'clamp',
          });

          const dotOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: 'clamp',
          });

          return (
            <TouchableOpacity
              key={index}
              onPress={() => goToSlide(index)}
              activeOpacity={0.8}
            >
              <Animated.View
                style={[
                  styles.dot,
                  {
                    width: dotWidth,
                    opacity: dotOpacity,
                  },
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        bounces={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width: width,
    height: height,
  },
  gradientBackground: {
    flex: 1,
    paddingTop: 60,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
  },
  skipText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '500',
  },
  slideContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingBottom: 120,
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  iconEmoji: {
    fontSize: 48,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  titleKannada: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 28,
  },
  titleEnglish: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  descriptionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 8,
  },
  descriptionKannada: {
    fontSize: 13,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 6,
  },
  descriptionEnglish: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 18,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 16,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 24,
  },
  nextButtonText: {
    color: '#374151',
    fontSize: 15,
    fontWeight: '600',
  },
  startButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 24,
  },
  startButtonText: {
    color: '#374151',
    fontSize: 15,
    fontWeight: '600',
  },
});
