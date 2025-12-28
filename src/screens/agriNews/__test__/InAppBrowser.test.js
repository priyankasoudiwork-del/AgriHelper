import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import InAppBrowser from '../FramInfo';

// Mock WebView
jest.mock('react-native-webview', () => ({
  WebView: 'WebView',
}));

const mockNavigation = {
  goBack: jest.fn(),
};

describe('InAppBrowser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(<InAppBrowser navigation={mockNavigation} />);
    expect(getByText('ವೆಬ್ ಪುಟ | Web Page')).toBeTruthy();
  });

  it('calls navigation.goBack when close button pressed', () => {
    const { getByText } = render(<InAppBrowser navigation={mockNavigation} />);
    fireEvent.press(getByText('←'));
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('displays back and forward buttons', () => {
    const { getByText } = render(<InAppBrowser navigation={mockNavigation} />);
    // Just check that the buttons exist
    expect(getByText('← ಹಿಂದೆ')).toBeTruthy();
    expect(getByText('ಮುಂದೆ →')).toBeTruthy();
  });

  it('displays reload button', () => {
    const { getByText } = render(<InAppBrowser navigation={mockNavigation} />);
    const reloadButton = getByText('↻');
    expect(reloadButton).toBeTruthy();
    fireEvent.press(reloadButton);
  });
});