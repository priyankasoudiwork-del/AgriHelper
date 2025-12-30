import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import WeatherPredictionPage from '../WeatherPredictionPage';
import Geolocation from '@react-native-community/geolocation';

// Mock dependencies
jest.mock('@react-native-community/geolocation');
jest.mock('react-native/Libraries/PermissionsAndroid/PermissionsAndroid', () => ({
  request: jest.fn(),
  PERMISSIONS: {
    ACCESS_FINE_LOCATION: 'android.permission.ACCESS_FINE_LOCATION',
  },
  RESULTS: {
    GRANTED: 'granted',
  },
}));

global.fetch = jest.fn();

const mockNavigation = {
  goBack: jest.fn(),
};

const mockWeatherData = {
  name: 'Bangalore',
  sys: { country: 'IN', sunrise: 1609459200, sunset: 1609502400 },
  main: { temp: 28, feels_like: 30, humidity: 65 },
  weather: [{ id: 800, description: 'clear sky' }],
  wind: { speed: 3.5 },
  clouds: { all: 20 },
};

const mockForecastData = {
  list: [
    {
      dt: 1609459200,
      main: { temp_max: 30, temp_min: 25 },
      weather: [{ id: 800 }],
      pop: 0.1,
    },
  ],
};

describe('WeatherPredictionPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders correctly', () => {
    const { getByText } = render(<WeatherPredictionPage navigation={mockNavigation} />);

    expect(getByText(/Weather Prediction/i)).toBeTruthy();
  });

  it('displays search bar', () => {
    const { getByPlaceholderText } = render(
      <WeatherPredictionPage navigation={mockNavigation} />
    );

    expect(getByPlaceholderText(/Your Location/i)).toBeTruthy();
  });

  it('shows current location button', () => {
    const { getByText } = render(<WeatherPredictionPage navigation={mockNavigation} />);

    expect(getByText(/Use Current Location/i)).toBeTruthy();
  });

  it('fetches weather data when search is pressed', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockWeatherData,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockForecastData,
      });

    const { getByPlaceholderText } = render(
      <WeatherPredictionPage navigation={mockNavigation} />
    );

    const searchInput = getByPlaceholderText(/Your Location/i);
    fireEvent.changeText(searchInput, 'Bangalore');

    // SearchBar triggers onSearch via onSubmitEditing
    fireEvent(searchInput, 'submitEditing');

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('Bangalore')
      );
    });
  });

  it('displays weather data after successful fetch', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockWeatherData,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockForecastData,
      });

    const { getByPlaceholderText, getByText, findByText } = render(
      <WeatherPredictionPage navigation={mockNavigation} />
    );

    const searchInput = getByPlaceholderText(/Your Location/i);
    fireEvent.changeText(searchInput, 'Bangalore');

    const searchButton = getByText('🔍');
    fireEvent.press(searchButton);

    await waitFor(async () => {
      const locationText = await findByText(/Bangalore, IN/i);
      expect(locationText).toBeTruthy();
    });
  });

  it('shows loading indicator while fetching', async () => {
    (global.fetch as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => mockWeatherData,
              }),
            100
          )
        )
    );

    const { getByPlaceholderText, getByText, queryByText } = render(
      <WeatherPredictionPage navigation={mockNavigation} />
    );

    const searchInput = getByPlaceholderText(/Your Location/i);
    fireEvent.changeText(searchInput, 'Bangalore');

    const searchButton = getByText('🔍');
    fireEvent.press(searchButton);

    expect(queryByText(/Loading/i)).toBeTruthy();
  });

  it('displays error message on fetch failure', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    const { getByPlaceholderText, findByText } = render(
      <WeatherPredictionPage navigation={mockNavigation} />
    );

    const searchInput = getByPlaceholderText(/Your Location/i);
    fireEvent.changeText(searchInput, 'InvalidCity');

    // SearchBar triggers onSearch via onSubmitEditing
    fireEvent(searchInput, 'submitEditing');

    // findByText already waits, no need for waitFor
    const errorText = await findByText(/City not found/i);
    expect(errorText).toBeTruthy();
  });

  it('navigates back when back button is pressed', () => {
    const { getByText } = render(<WeatherPredictionPage navigation={mockNavigation} />);

    const backButton = getByText('←');
    fireEvent.press(backButton);

    expect(mockNavigation.goBack).toHaveBeenCalled();
  });
});
