import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import WeatherPredictionPage from '../WeatherPredictionPage';

// Mock Geolocation
const mockGetCurrentPosition = jest.fn();
jest.mock('@react-native-community/geolocation', () => ({
  getCurrentPosition: mockGetCurrentPosition,
}));

// Mock PermissionsAndroid
jest.mock('react-native/Libraries/PermissionsAndroid/PermissionsAndroid', () => ({
  request: jest.fn(() => Promise.resolve('granted')),
  PERMISSIONS: {
    ACCESS_FINE_LOCATION: 'android.permission.ACCESS_FINE_LOCATION',
  },
  RESULTS: {
    GRANTED: 'granted',
  },
}));

// Mock fetch globally
global.fetch = jest.fn();

const mockNavigation = {
  goBack: jest.fn(),
};

describe('WeatherPredictionPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
    mockGetCurrentPosition.mockClear();
  });

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <WeatherPredictionPage navigation={mockNavigation} />
    );
    
    expect(getByText('ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ')).toBeTruthy();
    expect(getByText('Weather Prediction')).toBeTruthy();
    expect(getByPlaceholderText('ನಿಮ್ಮ ಸ್ಥಳ | Your Location')).toBeTruthy();
  });

  it('calls navigation.goBack when back button pressed', () => {
    const { getByText } = render(
      <WeatherPredictionPage navigation={mockNavigation} />
    );
    
    const backButton = getByText('← ಹಿಂದುಕ್ಕೆ');
    fireEvent.press(backButton);
    
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('displays search button and location input', () => {
    const { getByText, getByPlaceholderText } = render(
      <WeatherPredictionPage navigation={mockNavigation} />
    );
    
    expect(getByPlaceholderText('ನಿಮ್ಮ ಸ್ಥಳ | Your Location')).toBeTruthy();
    expect(getByText('🔍')).toBeTruthy();
  });

  it('allows user to type in location input', () => {
    const { getByPlaceholderText } = render(
      <WeatherPredictionPage navigation={mockNavigation} />
    );
    
    const input = getByPlaceholderText('ನಿಮ್ಮ ಸ್ಥಳ | Your Location');
    fireEvent.changeText(input, 'Bangalore');
    
    expect(input.props.value).toBe('Bangalore');
  });

  it('displays current location button', () => {
    const { getByText } = render(
      <WeatherPredictionPage navigation={mockNavigation} />
    );
    
    expect(getByText('📍 ಪ್ರಸ್ತುತ ಸ್ಥಳ ಬಳಸಿ | Use Current Location')).toBeTruthy();
  });

  it('shows empty state initially', () => {
    // Mock geolocation to fail immediately so we get empty state
    mockGetCurrentPosition.mockImplementation((success, error) => {
      error({ code: 1, message: 'Permission denied' });
    });

    const { getByText } = render(
      <WeatherPredictionPage navigation={mockNavigation} />
    );
    
    // Wait for the empty state to appear after geolocation fails
    waitFor(() => {
      expect(getByText('🌤️')).toBeTruthy();
    });
  });

  it('does not search when location is empty', () => {
    const { getByText } = render(
      <WeatherPredictionPage navigation={mockNavigation} />
    );
    
    const searchButton = getByText('🔍');
    fireEvent.press(searchButton);
    
    // Should not call fetch for empty location
    expect(fetch).not.toHaveBeenCalled();
  });

  it('calls fetch when searching with city name', async () => {
    // Mock successful API responses
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          name: 'Bangalore',
          sys: { country: 'IN', sunrise: 1609459200, sunset: 1609502400 },
          main: { temp: 25, feels_like: 26, humidity: 70 },
          weather: [{ id: 800, description: 'clear sky' }],
          wind: { speed: 3.5 },
          clouds: { all: 20 },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          list: [
            {
              dt: Date.now() / 1000,
              main: { temp_max: 28, temp_min: 22 },
              weather: [{ id: 800, description: 'clear sky' }],
              pop: 0.1,
            },
          ],
        }),
      });

    const { getByPlaceholderText, getByText } = render(
      <WeatherPredictionPage navigation={mockNavigation} />
    );
    
    const input = getByPlaceholderText('ನಿಮ್ಮ ಸ್ಥಳ | Your Location');
    fireEvent.changeText(input, 'Bangalore');
    
    const searchButton = getByText('🔍');
    fireEvent.press(searchButton);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('Bangalore')
      );
    });
  });

  it('displays weather data after successful search', async () => {
    // Mock successful API responses
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          name: 'Bangalore',
          sys: { country: 'IN', sunrise: 1609459200, sunset: 1609502400 },
          main: { temp: 25, feels_like: 26, humidity: 70 },
          weather: [{ id: 800, description: 'clear sky' }],
          wind: { speed: 3.5 },
          clouds: { all: 20 },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          list: [
            {
              dt: Date.now() / 1000,
              main: { temp_max: 28, temp_min: 22 },
              weather: [{ id: 800, description: 'clear sky' }],
              pop: 0.1,
            },
          ],
        }),
      });

    const { getByPlaceholderText, getByText, findByText } = render(
      <WeatherPredictionPage navigation={mockNavigation} />
    );
    
    const input = getByPlaceholderText('ನಿಮ್ಮ ಸ್ಥಳ | Your Location');
    fireEvent.changeText(input, 'Bangalore');
    
    const searchButton = getByText('🔍');
    fireEvent.press(searchButton);
    
    // Wait for weather data to be displayed
    const locationName = await findByText('Bangalore, IN');
    expect(locationName).toBeTruthy();
    
    // Check temperature is displayed
    const temp = await findByText('25°C');
    expect(temp).toBeTruthy();
  });

  it('shows error message when city not found', async () => {
    // Mock API error
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    const { getByPlaceholderText, getByText, findByText } = render(
      <WeatherPredictionPage navigation={mockNavigation} />
    );
    
    const input = getByPlaceholderText('ನಿಮ್ಮ ಸ್ಥಳ | Your Location');
    fireEvent.changeText(input, 'InvalidCity12345');
    
    const searchButton = getByText('🔍');
    fireEvent.press(searchButton);
    
    // Wait for error message
    const errorMsg = await findByText('City not found. Please try again.');
    expect(errorMsg).toBeTruthy();
  });

  it('handles current location button press', () => {
    mockGetCurrentPosition.mockImplementation((success) => {
      success({
        coords: { latitude: 12.9716, longitude: 77.5946 },
      });
    });

    const { getByText } = render(
      <WeatherPredictionPage navigation={mockNavigation} />
    );
    
    const locationBtn = getByText('📍 ಪ್ರಸ್ತುತ ಸ್ಥಳ ಬಳಸಿ | Use Current Location');
    fireEvent.press(locationBtn);
    
    // Verify geolocation was called
    expect(mockGetCurrentPosition).toHaveBeenCalled();
  });
});