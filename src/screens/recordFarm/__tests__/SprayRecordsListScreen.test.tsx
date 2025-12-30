import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SprayRecordsListScreen from '../SprayRecordsListScreen';

const mockNavigation = {
  goBack: jest.fn(),
  navigate: jest.fn(),
};

describe('SprayRecordsListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(<SprayRecordsListScreen navigation={mockNavigation} />);

    expect(getByText(/Spray Records/i)).toBeTruthy();
  });

  it('displays record count and total cost', () => {
    const { getAllByText, getByText } = render(<SprayRecordsListScreen navigation={mockNavigation} />);

    const recordsElements = getAllByText(/Records/i);
    expect(recordsElements.length).toBeGreaterThan(0);
    expect(getByText(/Total Cost/i)).toBeTruthy();
  });

  it('renders filter options', () => {
    const { getByText } = render(<SprayRecordsListScreen navigation={mockNavigation} />);

    expect(getByText(/All/i)).toBeTruthy();
    expect(getByText(/This Week/i)).toBeTruthy();
    expect(getByText(/This Month/i)).toBeTruthy();
  });

  it('displays spray records', () => {
    const { getByText } = render(<SprayRecordsListScreen navigation={mockNavigation} />);

    expect(getByText(/ರಿಡೋಮಿಲ್ ಗೋಲ್ಡ್/i)).toBeTruthy();
    expect(getByText(/ಬವಿಸ್ಟಿನ್/i)).toBeTruthy();
    expect(getByText(/ನೀಮ್ ಎಣ್ಣೆ/i)).toBeTruthy();
  });

  it('shows add new record button', () => {
    const { getByText } = render(<SprayRecordsListScreen navigation={mockNavigation} />);

    expect(getByText(/Add New Record/i)).toBeTruthy();
  });

  it('navigates to add screen when add button is pressed', () => {
    const { getByText } = render(<SprayRecordsListScreen navigation={mockNavigation} />);

    const addButton = getByText(/Add New Record/i);
    fireEvent.press(addButton);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('AddSprayRecord');
  });

  it('navigates back when back button is pressed', () => {
    const { getByText } = render(<SprayRecordsListScreen navigation={mockNavigation} />);

    const backButton = getByText('←');
    fireEvent.press(backButton);

    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('displays record with image badge', () => {
    const { getAllByText } = render(<SprayRecordsListScreen navigation={mockNavigation} />);

    const imageBadges = getAllByText('📷');
    expect(imageBadges.length).toBeGreaterThan(0);
  });

  it('shows record details when card is pressed', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    const { getByText } = render(<SprayRecordsListScreen navigation={mockNavigation} />);

    const recordCard = getByText(/ರಿಡೋಮಿಲ್ ಗೋಲ್ಡ್/i);
    fireEvent.press(recordCard);

    expect(consoleSpy).toHaveBeenCalledWith(
      'View details:',
      expect.objectContaining({
        chemicalName: 'ರಿಡೋಮಿಲ್ ಗೋಲ್ಡ್',
      })
    );

    consoleSpy.mockRestore();
  });

  it('filters records when filter is selected', () => {
    const { getByText } = render(<SprayRecordsListScreen navigation={mockNavigation} />);

    const weekFilter = getByText(/This Week/i);
    fireEvent.press(weekFilter);

    // Records should still be visible after filter
    expect(getByText(/ರಿಡೋಮಿಲ್ ಗೋಲ್ಡ್/i)).toBeTruthy();
  });

  it('displays bilingual header', () => {
    const { getByText } = render(<SprayRecordsListScreen navigation={mockNavigation} />);

    expect(getByText(/ಸ್ಪ್ರೇ ದಾಖಲೆಗಳು/i)).toBeTruthy();
    expect(getByText(/Spray Records/i)).toBeTruthy();
  });

  it('calculates total cost correctly', () => {
    const { getByText } = render(<SprayRecordsListScreen navigation={mockNavigation} />);

    // Total cost: 350 + 280 + 450 = 1080
    expect(getByText(/₹1080/i)).toBeTruthy();
  });
});
