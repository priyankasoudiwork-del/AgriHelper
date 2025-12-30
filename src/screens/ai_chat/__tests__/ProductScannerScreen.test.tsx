import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ProductScannerScreen from '../ProductScannerScreen';

const mockNavigation = {
  goBack: jest.fn(),
};

describe('ProductScannerScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(<ProductScannerScreen navigation={mockNavigation} />);

    expect(getByText(/Chemical Information/i)).toBeTruthy();
  });

  it('displays search input', () => {
    const { getByPlaceholderText } = render(
      <ProductScannerScreen navigation={mockNavigation} />
    );

    const searchInput = getByPlaceholderText(/NPK, Aliette, Urea/i);
    expect(searchInput).toBeTruthy();
  });

  it('allows entering text in search input', () => {
    const { getByPlaceholderText } = render(
      <ProductScannerScreen navigation={mockNavigation} />
    );

    const searchInput = getByPlaceholderText(/NPK, Aliette, Urea/i);
    fireEvent.changeText(searchInput, 'NPK');

    expect(searchInput.props.value).toBe('NPK');
  });

  it('displays product information when searched', async () => {
    const { getByPlaceholderText, getByText, getAllByText } = render(
      <ProductScannerScreen navigation={mockNavigation} />
    );

    const searchInput = getByPlaceholderText(/NPK, Aliette, Urea/i);
    fireEvent.changeText(searchInput, 'npk');

    const searchButton = getByText('ಹುಡುಕಿ');
    fireEvent.press(searchButton);

    await waitFor(() => {
      const npkElements = getAllByText(/NPK 19:19:19/i);
      expect(npkElements.length).toBeGreaterThan(0);
    });
  });

  it('shows product benefits in Kannada and English', async () => {
    const { getByPlaceholderText, getByText } = render(
      <ProductScannerScreen navigation={mockNavigation} />
    );

    const searchInput = getByPlaceholderText(/NPK, Aliette, Urea/i);
    fireEvent.changeText(searchInput, 'npk');

    const searchButton = getByText('ಹುಡುಕಿ');
    fireEvent.press(searchButton);

    await waitFor(() => {
      expect(getByText(/Balanced Fertilizer/i)).toBeTruthy();
      expect(getByText(/ಸಮತೋಲಿತ ರಸಗೊಬ್ಬರ/i)).toBeTruthy();
    });
  });

  it('displays dosage information', async () => {
    const { getByPlaceholderText, getByText } = render(
      <ProductScannerScreen navigation={mockNavigation} />
    );

    const searchInput = getByPlaceholderText(/NPK, Aliette, Urea/i);
    fireEvent.changeText(searchInput, 'npk');

    const searchButton = getByText('ಹುಡುಕಿ');
    fireEvent.press(searchButton);

    await waitFor(() => {
      expect(getByText(/2-3 grams per liter/i)).toBeTruthy();
    });
  });

  it('displays safety information', async () => {
    const { getByPlaceholderText, getByText } = render(
      <ProductScannerScreen navigation={mockNavigation} />
    );

    const searchInput = getByPlaceholderText(/NPK, Aliette, Urea/i);
    fireEvent.changeText(searchInput, 'npk');

    const searchButton = getByText('ಹುಡುಕಿ');
    fireEvent.press(searchButton);

    await waitFor(() => {
      expect(getByText(/Wear gloves and mask/i)).toBeTruthy();
    });
  });

  it('shows not found message for unknown products', async () => {
    const { getByPlaceholderText, getByText } = render(
      <ProductScannerScreen navigation={mockNavigation} />
    );

    const searchInput = getByPlaceholderText(/NPK, Aliette, Urea/i);
    fireEvent.changeText(searchInput, 'unknown-chemical');

    const searchButton = getByText('ಹುಡುಕಿ');
    fireEvent.press(searchButton);

    await waitFor(() => {
      expect(getByText(/not found/i)).toBeTruthy();
    });
  });

  it('searches for Aliette product', async () => {
    const { getByPlaceholderText, getByText } = render(
      <ProductScannerScreen navigation={mockNavigation} />
    );

    const searchInput = getByPlaceholderText(/NPK, Aliette, Urea/i);
    fireEvent.changeText(searchInput, 'aliette');

    const searchButton = getByText('ಹುಡುಕಿ');
    fireEvent.press(searchButton);

    await waitFor(() => {
      expect(getByText(/Aliette/i)).toBeTruthy();
      expect(getByText(/Fungicide/i)).toBeTruthy();
    });
  });

  it('displays timing information', async () => {
    const { getByPlaceholderText, getByText } = render(
      <ProductScannerScreen navigation={mockNavigation} />
    );

    const searchInput = getByPlaceholderText(/NPK, Aliette, Urea/i);
    fireEvent.changeText(searchInput, 'npk');

    const searchButton = getByText('ಹುಡುಕಿ');
    fireEvent.press(searchButton);

    await waitFor(() => {
      expect(getByText(/6-9 AM/i)).toBeTruthy();
    });
  });

  it('navigates back when back button is pressed', () => {
    const { getByText } = render(<ProductScannerScreen navigation={mockNavigation} />);

    const backButton = getByText(/ಹಿಂದಕ್ಕೆ/i);
    fireEvent.press(backButton);

    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('is case-insensitive in search', async () => {
    const { getByPlaceholderText, getByText, getAllByText } = render(
      <ProductScannerScreen navigation={mockNavigation} />
    );

    const searchInput = getByPlaceholderText(/NPK, Aliette, Urea/i);
    fireEvent.changeText(searchInput, 'NPK'); // uppercase

    const searchButton = getByText('ಹುಡುಕಿ');
    fireEvent.press(searchButton);

    await waitFor(() => {
      const npkElements = getAllByText(/NPK 19:19:19/i);
      expect(npkElements.length).toBeGreaterThan(0);
    });
  });

  it('displays spray weather information', async () => {
    const { getByPlaceholderText, getByText } = render(
      <ProductScannerScreen navigation={mockNavigation} />
    );

    const searchInput = getByPlaceholderText(/NPK, Aliette, Urea/i);
    fireEvent.changeText(searchInput, 'npk');

    const searchButton = getByText('ಹುಡುಕಿ');
    fireEvent.press(searchButton);

    await waitFor(() => {
      expect(getByText(/low wind speed/i)).toBeTruthy();
    });
  });
});
