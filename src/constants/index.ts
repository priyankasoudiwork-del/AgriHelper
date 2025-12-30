/**
 * App-wide Constants
 *
 * This file contains all constant values used throughout the AgriHelper application,
 * including options for forms, color palette, and configuration values.
 */

import { SelectOption, SprayRecord } from '../types';

/**
 * Disease/Problem Options for Spray Records
 *
 * Bilingual options for common grape farm diseases and pest issues.
 */
export const DISEASE_OPTIONS: SelectOption[] = [
  { label: 'ಆಯ್ಕೆ ಮಾಡಿ | Select', value: '' },
  { label: 'ಪುಡಿ ಕಾಯಿಲೆ | Powdery Mildew', value: 'powdery_mildew' },
  { label: 'ಡೌನಿ ಮಿಲ್ಡ್ಯೂ | Downy Mildew', value: 'downy_mildew' },
  { label: 'ಆಂಥ್ರಾಕ್ನೋಸ್ | Anthracnose', value: 'anthracnose' },
  { label: 'ಕಪ್ಪು ಕೊಳೆತ | Black Rot', value: 'black_rot' },
  { label: 'ಎಲೆ ಮಚ್ಚೆ | Leaf Spot', value: 'leaf_spot' },
  { label: 'ಕೀಟ ನಿಯಂತ್ರಣ | Pest Control', value: 'pest_control' },
  { label: 'ಬೇರು ಕೊಳೆತ | Root Rot', value: 'root_rot' },
  { label: 'ತ್ರಿಪ್ಸ್ | Thrips', value: 'thrips' },
  { label: 'ಮೀಲಿ ಬಗ್ | Mealy Bug', value: 'mealy_bug' },
  { label: 'ಇತರೆ | Other', value: 'other' },
];

/**
 * Unit Options for Quantity Measurement
 *
 * Supported units for chemical quantity input.
 */
export const UNIT_OPTIONS: SelectOption<SprayRecord['unit']>[] = [
  { label: 'ml', value: 'ml' },
  { label: 'ಲೀಟರ್ | Liter', value: 'liter' },
  { label: 'ಗ್ರಾಂ | Gram', value: 'gram' },
  { label: 'kg', value: 'kg' },
];

/**
 * Weather Condition Options
 *
 * Weather conditions at time of spraying.
 */
export const WEATHER_OPTIONS: SelectOption<SprayRecord['weather']>[] = [
  { label: '☀️ ಬಿಸಿಲು | Sunny', value: 'sunny' },
  { label: '☁️ ಮೋಡ | Cloudy', value: 'cloudy' },
  { label: '🌧️ ಮಳೆ | Rainy', value: 'rainy' },
];

/**
 * Spray Time Options
 *
 * Time of day when spraying was performed.
 */
export const TIME_OPTIONS: SelectOption<SprayRecord['sprayTime']>[] = [
  { label: '🌅 ಬೆಳಿಗ್ಗೆ | Morning', value: 'morning' },
  { label: '☀️ ಮಧ್ಯಾಹ್ನ | Afternoon', value: 'afternoon' },
  { label: '🌆 ಸಂಜೆ | Evening', value: 'evening' },
];

/**
 * Spray Method Options
 *
 * Method/equipment used for spraying.
 */
export const SPRAY_METHOD_OPTIONS: SelectOption<SprayRecord['sprayMethod']>[] = [
  { label: '💪 ಕೈ ಪಂಪ್ | Hand Pump', value: 'hand_pump' },
  { label: '⚙️ ಮೋಟಾರ್ | Motor Pump', value: 'motor_pump' },
  { label: '🚜 ಟ್ರಾಕ್ಟರ್ | Tractor', value: 'tractor' },
];

/**
 * App Color Palette
 *
 * Centralized color constants for consistent theming throughout the app.
 */
export const COLORS = {
  // Primary Colors
  primary: '#0284c7', // Blue - Main brand color
  secondary: '#16a34a', // Green - Success, agriculture theme
  accent: '#8b5cf6', // Purple - Highlights

  // Status Colors
  danger: '#ef4444', // Red - Errors, warnings
  warning: '#f59e0b', // Amber - Cautions
  success: '#10b981', // Green - Success states
  info: '#3b82f6', // Blue - Informational

  // Gray Scale
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Feature-specific Colors
  weather: '#0284c7', // Blue
  scanner: '#059669', // Green
  farming: '#d97706', // Orange
  records: '#7c3aed', // Purple
  expense: '#dc2626', // Red
  knowledge: '#0891b2', // Cyan
} as const;

/**
 * Weather API Configuration
 *
 * Configuration for OpenWeatherMap API integration.
 */
export const WEATHER_CONFIG = {
  API_KEY: '6aff63fa2d7876c6e45ab4c3952ac7de',
  BASE_URL: 'https://api.openweathermap.org/data/2.5',
  UNITS: 'metric' as const,
} as const;

/**
 * Agri News URL
 *
 * Default URL for agricultural news and information.
 */
export const AGRI_NEWS_URL = 'https://www.prajavani.net/agriculture';

/**
 * Date/Time Format Constants
 */
export const DATE_FORMATS = {
  DISPLAY: 'DD MMM YYYY', // 15 Jan 2024
  ISO: 'YYYY-MM-DD', // 2024-01-15
  TIME: 'hh:mm A', // 10:30 AM
} as const;
