import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ScreenProps } from '../types';

interface Slide {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  image: string;
  color: string;
}

export default function AppIntroScreen({ navigation }: ScreenProps<'AppIntro'>) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    {
      title: "ನಿಮ್ಮ ರಾಸಾಯನಿಕ ಸ್ಪ್ರೇಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
      titleEn: "Track Your Chemical Sprays",
      description: "ನೀವು ಯಾವ ರಾಸಾಯನಿಕವನ್ನು ಬಳಸಿದ್ದೀರಿ, ಎಷ್ಟು ಪ್ರಮಾಣ ಮತ್ತು ಯಾವ ದಿನಾಂಕದಲ್ಲಿ ಬಳಸಿದ್ದೀರಿ ಎಂಬುದನ್ನು ಸುಲಭವಾಗಿ ದಾಖಲಿಸಿ.",
      descriptionEn: "Easily record which chemical you used, how much quantity, and on which date.",
      image: "🌿",
      color: "#10b981"
    },
    {
      title: "ನಿಮ್ಮ ಖರ್ಚುಗಳನ್ನು ತಿಳಿಯಿರಿ",
      titleEn: "Know Your Expenses",
      description: "ದಿನ, ವಾರ ಮತ್ತು ತಿಂಗಳ ಖರ್ಚುಗಳನ್ನು ಸರಳ ಗ್ರಾಫ್‌ಗಳಲ್ಲಿ ನೋಡಿ. ನೀವು ಪ್ರತಿ ತಿಂಗಳು ಎಷ್ಟು ಖರ್ಚು ಮಾಡುತ್ತಿದ್ದೀರಿ ಎಂದು ತಿಳಿಯಿರಿ.",
      descriptionEn: "See daily, weekly and monthly expenses in simple graphs. Know how much you spend every month.",
      image: "📊",
      color: "#3b82f6"
    },
    {
      title: "ಹಣವನ್ನು ಉಳಿಸಿ",
      titleEn: "Save Money",
      description: "ಅನಗತ್ಯ ಸ್ಪ್ರೇ ಮಾಡುವುದನ್ನು ತಪ್ಪಿಸಿ. ಅತಿಯಾದ ಖರ್ಚು ಮಾಡುವುದನ್ನು ನಿಲ್ಲಿಸಿ. ನಿಮ್ಮ ಫಾರ್ಮ್ ಖರ್ಚುಗಳನ್ನು ಸುಲಭವಾಗಿ ನಿರ್ವಹಿಸಿ.",
      descriptionEn: "Avoid repeated spraying. Stop over-spending. Manage your farm expenses easily.",
      image: "💰",
      color: "#f59e0b"
    }
  ];

  const goToNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const goToPrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleStart = () => {
    navigation.navigate('Login');
  };

  const handleSkip = () => {
    navigation.navigate('Login');
  };

  const slide = slides[currentSlide];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoEmoji}>🍇</Text>
          <View>
            <Text style={styles.appTitleKannada}>ದ್ರಾಕ್ಷಿ ಫಾರ್ಮ್ ಟ್ರಾಕರ್</Text>
            <Text style={styles.appTitleEnglish}>Grape Farm Tracker</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: slide.color + '20' }]}>
          <Text style={styles.iconEmoji}>{slide.image}</Text>
        </View>

        <Text style={styles.slideNumber}>
          {currentSlide + 1} / {slides.length}
        </Text>

        <Text style={styles.titleKannada}>{slide.title}</Text>
        <Text style={styles.titleEnglish}>{slide.titleEn}</Text>

        <Text style={styles.descriptionKannada}>{slide.description}</Text>
        <Text style={styles.descriptionEnglish}>{slide.descriptionEn}</Text>

        <View style={styles.illustrationContainer}>
          <View style={styles.illustrationBox}>
            <Text style={styles.illustrationText}>
              {currentSlide === 0 && "👨‍🌾 ➜ 📱 ➜ 🌿"}
              {currentSlide === 1 && "📈 ₹ 💹"}
              {currentSlide === 2 && "✅ 💵 😊"}
            </Text>
          </View>
        </View>
      </View>

      {/* Dots */}
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentSlide === index && styles.dotActive,
              { backgroundColor: currentSlide === index ? slide.color : '#d1d5db' }
            ]}
          />
        ))}
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        {currentSlide > 0 && (
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={goToPrev}
          >
            <Text style={styles.buttonTextSecondary}>ಹಿಂದೆ | Back</Text>
          </TouchableOpacity>
        )}

        {currentSlide < slides.length - 1 ? (
          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary, { backgroundColor: slide.color }]}
            onPress={goToNext}
          >
            <Text style={styles.buttonTextPrimary}>ಮುಂದೆ | Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary, { backgroundColor: slide.color }]}
            onPress={handleStart}
          >
            <Text style={styles.buttonTextPrimary}>ಪ್ರಾರಂಭಿಸಿ | Start</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Skip */}
      {currentSlide < slides.length - 1 && (
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
        >
          <Text style={styles.skipText}>ಸ್ಕಿಪ್ | Skip</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoEmoji: {
    fontSize: 40,
  },
  appTitleKannada: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  appTitleEnglish: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconEmoji: {
    fontSize: 60,
  },
  slideNumber: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 16,
    fontWeight: '600',
  },
  titleKannada: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 36,
  },
  titleEnglish: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 20,
  },
  descriptionKannada: {
    fontSize: 18,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  descriptionEnglish: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  illustrationBox: {
    backgroundColor: '#ffffff',
    padding: 30,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  illustrationText: {
    fontSize: 48,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginVertical: 24,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotActive: {
    width: 24,
    height: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#10b981',
  },
  buttonSecondary: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  buttonTextPrimary: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonTextSecondary: {
    color: '#374151',
    fontSize: 18,
    fontWeight: '600',
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    padding: 8,
  },
  skipText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
});
