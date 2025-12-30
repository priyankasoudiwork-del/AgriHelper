/**
 * Data Models for AgriHelper App
 *
 * This file contains all data model interfaces used throughout the application.
 * These models represent the structure of data for various features like
 * spray records, weather information, and product details.
 */

/**
 * Spray Record Data Model
 *
 * Represents a chemical spray application record for farming activities.
 * Used for tracking which chemicals were applied, when, and at what cost.
 */
export interface SprayRecord {
  id: string;
  date: string; // ISO date string format (YYYY-MM-DD)
  chemicalName: string;
  chemicalNameKn?: string; // Kannada name (optional)
  disease: string;
  diseaseKn?: string; // Kannada disease name (optional)
  quantity: string;
  unit: 'ml' | 'liter' | 'gram' | 'kg';
  acres: string;
  cost: string;
  weather?: 'sunny' | 'cloudy' | 'rainy';
  sprayTime?: 'morning' | 'afternoon' | 'evening';
  sprayMethod?: 'hand_pump' | 'motor_pump' | 'tractor';
  tankMixing?: string; // Notes about mixing multiple chemicals
  notes?: string; // General notes about the spray
  hasImage: boolean;
  imageUri?: string; // Local file URI or cloud storage URL
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  userId: string;
}

/**
 * Weather Data Model
 *
 * Current weather information from OpenWeatherMap API.
 * Used for display and to provide spray recommendations.
 */
export interface WeatherData {
  location: string; // City name
  temp: number; // Temperature in Celsius
  feelsLike: number; // Feels like temperature in Celsius
  condition: string; // Weather condition in Kannada
  conditionEn: string; // Weather condition in English
  icon: string; // Weather emoji icon
  humidity: number; // Humidity percentage (0-100)
  windSpeed: number; // Wind speed in km/h
  rainChance: number; // Rain probability percentage (0-100)
  uvIndex: number; // UV index (0-11+)
  sunrise: string; // Time string (HH:MM AM/PM)
  sunset: string; // Time string (HH:MM AM/PM)
}

/**
 * Weather Forecast Day
 *
 * Represents a single day in the 7-day forecast.
 */
export interface ForecastDay {
  day: string; // Day name in Kannada (ಸೋಮವಾರ, ಮಂಗಳವಾರ, etc.)
  dayEn: string; // Day name in English (Monday, Tuesday, etc.)
  date: string; // Date string format (Jan 15, Feb 20, etc.)
  icon: string; // Weather emoji
  tempHigh: number; // High temperature in Celsius
  tempLow: number; // Low temperature in Celsius
  rain: number; // Rain probability percentage (0-100)
}

/**
 * Product Information
 *
 * Details about agricultural chemicals, fertilizers, and pesticides.
 * Used in the Product Scanner feature.
 */
export interface ProductInfo {
  productName: string; // English product name
  productNameKn: string; // Kannada product name
  type: string; // Product type in English (Fungicide, Insecticide, etc.)
  typeKn: string; // Product type in Kannada
  benefits: string[]; // List of benefits in English
  benefitsKn: string[]; // List of benefits in Kannada
  dosage: string; // Recommended dosage in English
  dosageKn: string; // Recommended dosage in Kannada
  usage: string; // Usage instructions in English
  usageKn: string; // Usage instructions in Kannada
  timing: string; // Best time to apply in English
  timingKn: string; // Best time to apply in Kannada
  sprayWeather: string; // Weather conditions for spraying in English
  sprayWeatherKn: string; // Weather conditions for spraying in Kannada
  safety: string[]; // Safety precautions in English
  safetyKn: string[]; // Safety precautions in Kannada
}

/**
 * Spray Record Form Data
 *
 * Subset of SprayRecord used for form state management.
 * Does not include generated fields like id, createdAt, userId.
 */
export interface SprayRecordFormData {
  date: string;
  chemicalName: string;
  disease: string;
  quantity: string;
  unit: SprayRecord['unit'];
  acres: string;
  cost: string;
  weather?: SprayRecord['weather'];
  sprayTime?: SprayRecord['sprayTime'];
  sprayMethod?: SprayRecord['sprayMethod'];
  tankMixing?: string;
  notes?: string;
}
