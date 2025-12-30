import { RootStackParamList } from './navigation';

/**
 * Common Utility Types for AgriHelper App
 *
 * This file contains reusable type definitions that are used across
 * multiple features and components in the application.
 */

/**
 * Bilingual Text
 *
 * Represents text in both Kannada and English for bilingual UI support.
 *
 * @example
 * const greeting: BilingualText = {
 *   kn: 'ನಮಸ್ಕಾರ',
 *   en: 'Hello'
 * };
 */
export interface BilingualText {
  kn: string; // Kannada text
  en: string; // English text
}

/**
 * App Intro Slide
 *
 * Configuration for a single slide in the app introduction/onboarding.
 */
export interface IntroSlide {
  title: BilingualText;
  description: BilingualText;
  image: string; // Emoji or image source
  color: string; // Hex color code for theme
}

/**
 * Home Screen Feature Card
 *
 * Represents a feature card displayed on the home dashboard.
 */
export interface FeatureCard {
  id: string;
  icon: string; // Emoji icon
  titleKn: string; // Kannada title
  titleEn: string; // English title
  color: string; // Hex color for text
  bgColor: string; // Hex color for background
  route: keyof RootStackParamList | null; // Navigation route (null for coming soon)
}

/**
 * Select Option
 *
 * Generic option type for pickers, dropdowns, and select inputs.
 *
 * @template T - The type of the value (defaults to string)
 *
 * @example
 * const units: SelectOption<'ml' | 'liter'>[] = [
 *   { label: 'Milliliters', value: 'ml' },
 *   { label: 'Liters', value: 'liter' }
 * ];
 */
export interface SelectOption<T = string> {
  label: string; // Display text (can be bilingual like "ಕನ್ನಡ | English")
  value: T; // Actual value
}

/**
 * API Response wrapper
 *
 * Generic wrapper for API responses with success/error handling.
 *
 * @template T - The type of the data payload
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Voice Recording State
 *
 * State for voice input functionality in forms.
 */
export interface VoiceRecordingState {
  isRecording: boolean;
  field: string | null; // Which field is being recorded for
}
