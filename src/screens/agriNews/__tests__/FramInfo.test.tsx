import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FramInfo from '../FramInfo';

// Mock WebView
jest.mock('react-native-webview', () => {
  const mockReact = require('react');
  const { View, Text } = require('react-native');

  const MockWebView = ({ source, onNavigationStateChange, onLoadStart, onLoadEnd }: any) => {
    mockReact.useEffect(() => {
      onLoadStart && onLoadStart();
      setTimeout(() => {
        onNavigationStateChange &&
          onNavigationStateChange({
            canGoBack: true,
            canGoForward: false,
            url: source.uri,
          });
        onLoadEnd && onLoadEnd();
      }, 100);
    }, []);

    return mockReact.createElement(View, { testID: 'webview' },
      mockReact.createElement(Text, {}, `WebView: ${source.uri}`)
    );
  };

  return {
    WebView: MockWebView,
  };
});

const mockNavigation = {
  goBack: jest.fn(),
};

describe('FramInfo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(<FramInfo navigation={mockNavigation} />);

    expect(getByText(/Web Page/i)).toBeTruthy();
  });

  it('displays the correct URL', () => {
    const { getAllByText } = render(<FramInfo navigation={mockNavigation} />);

    const urlElements = getAllByText(/prajavani.net\/agriculture/i);
    expect(urlElements.length).toBeGreaterThan(0);
  });

  it('renders WebView component', () => {
    const { getByTestId } = render(<FramInfo navigation={mockNavigation} />);

    const webView = getByTestId('webview');
    expect(webView).toBeTruthy();
  });

  it('navigates back when back button is pressed', () => {
    const { getByText } = render(<FramInfo navigation={mockNavigation} />);

    const backButton = getByText('←');
    fireEvent.press(backButton);

    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('has reload button', () => {
    const { getByText } = render(<FramInfo navigation={mockNavigation} />);

    const reloadButton = getByText('↻');
    expect(reloadButton).toBeTruthy();
  });

  it('renders navigation buttons', () => {
    const { getByText } = render(<FramInfo navigation={mockNavigation} />);

    expect(getByText(/ಹಿಂದೆ/i)).toBeTruthy();
    expect(getByText(/ಮುಂದೆ/i)).toBeTruthy();
  });

  it('displays header with bilingual title', () => {
    const { getByText } = render(<FramInfo navigation={mockNavigation} />);

    expect(getByText(/ವೆಬ್ ಪುಟ/i)).toBeTruthy();
    expect(getByText(/Web Page/i)).toBeTruthy();
  });
});
