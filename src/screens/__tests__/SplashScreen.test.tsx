import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import SplashScreen from '../SplashScreen';
import { requestMultiple, RESULTS } from 'react-native-permissions';

// Mock dependencies
jest.mock('react-native-permissions');
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    replace: jest.fn(),
  }),
}));

const mockNavigation = {
  replace: jest.fn(),
};

describe('SplashScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders correctly', () => {
    const { getByText } = render(<SplashScreen navigation={mockNavigation} />);

    expect(getByText('ದ್ರಾಕ್ಷಿ ಫಾರ್ಮ್ ಟ್ರಾಕರ್')).toBeTruthy();
    expect(getByText('Grape Farm Tracker')).toBeTruthy();
    expect(getByText('ರಾಸಾಯನಿಕ ಸ್ಪ್ರೇ ನಿರ್ವಹಣೆ')).toBeTruthy();
  });

  it('displays loading text', () => {
    const { getByText } = render(<SplashScreen navigation={mockNavigation} />);

    expect(getByText('Loading...')).toBeTruthy();
  });

  it('requests permissions on mount', async () => {
    (requestMultiple as jest.Mock).mockResolvedValue({
      'android.permission.ACCESS_FINE_LOCATION': RESULTS.GRANTED,
      'android.permission.CAMERA': RESULTS.GRANTED,
      'android.permission.READ_MEDIA_IMAGES': RESULTS.GRANTED,
    });

    render(<SplashScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(requestMultiple).toHaveBeenCalled();
    });
  });

  it('navigates to AppIntro after loading', async () => {
    (requestMultiple as jest.Mock).mockResolvedValue({});

    render(<SplashScreen navigation={mockNavigation} />);

    // Fast-forward timers to trigger navigation
    jest.advanceTimersByTime(3500);

    await waitFor(() => {
      expect(mockNavigation.replace).toHaveBeenCalledWith('AppIntro');
    });
  });

  it('displays logo emoji', () => {
    const { getByText } = render(<SplashScreen navigation={mockNavigation} />);

    expect(getByText('🍇')).toBeTruthy();
  });
});
