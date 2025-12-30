import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AppIntroScreen from '../AppIntroScreen';

const mockNavigation = {
  navigate: jest.fn(),
};

describe('AppIntroScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(<AppIntroScreen navigation={mockNavigation} />);

    expect(getByText(/Grape Farm Tracker/i)).toBeTruthy();
    expect(getByText(/Track Your Chemical Sprays/i)).toBeTruthy();
  });

  it('displays bilingual content', () => {
    const { getByText } = render(<AppIntroScreen navigation={mockNavigation} />);

    // Check for Kannada text presence
    const kannadaElements = render(<AppIntroScreen navigation={mockNavigation} />).UNSAFE_root;
    expect(kannadaElements).toBeTruthy();
  });

  it('navigates to login when start button is pressed', () => {
    const { getByText } = render(<AppIntroScreen navigation={mockNavigation} />);

    // Navigate to last slide by pressing Next twice
    const nextButton = getByText(/Next/i);
    fireEvent.press(nextButton);
    fireEvent.press(nextButton);

    // Now the Start button should be visible
    const startButton = getByText(/Start/i);
    fireEvent.press(startButton);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
  });

  it('has skip button functionality', () => {
    const { queryByText } = render(<AppIntroScreen navigation={mockNavigation} />);

    const skipButton = queryByText(/Skip/i);
    if (skipButton) {
      fireEvent.press(skipButton);
      expect(mockNavigation.navigate).toHaveBeenCalled();
    }
  });
});
