import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from '../HomeScreen';
import { useAuth } from '../../hooks/useAuth';

// Mock dependencies
jest.mock('../../hooks/useAuth');
jest.mock('../../components', () => ({
  Header: ({ title, subtitle, rightIcon, onRightPress }: any) => {
    const { Text, TouchableOpacity, View } = require('react-native');
    return (
      <View>
        <Text>{title}</Text>
        <Text>{subtitle}</Text>
        {rightIcon && (
          <TouchableOpacity onPress={onRightPress} testID="logout-button">
            <Text>{rightIcon}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  },
  Card: ({ children, style }: any) => {
    const { View } = require('react-native');
    return <View style={style}>{children}</View>;
  },
  BilingualText: ({ kannada, english }: any) => {
    const { Text } = require('react-native');
    return (
      <Text>
        {kannada} {english}
      </Text>
    );
  },
  ConfirmDialog: ({ visible, title, message, onConfirm, onCancel }: any) => {
    const { View, Text, TouchableOpacity } = require('react-native');
    if (!visible) return null;
    return (
      <View testID="confirm-dialog">
        <Text>{title}</Text>
        <Text>{message}</Text>
        <TouchableOpacity onPress={onConfirm} testID="confirm-button">
          <Text>Confirm</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onCancel} testID="cancel-button">
          <Text>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  },
}));

const mockNavigation = {
  navigate: jest.fn(),
};

const mockLogout = jest.fn();

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.alert as jest.Mock).mockClear();
    (useAuth as jest.Mock).mockReturnValue({
      logout: mockLogout,
      phoneNumber: '+91 9876543210',
    });
  });

  it('renders correctly', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);

    expect(getByText('ಕೃಷಿ ಸಹಾಯಕ')).toBeTruthy();
  });

  it('displays phone number in header', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);

    expect(getByText(/\+91 9876543210/)).toBeTruthy();
  });

  it('renders feature cards', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);

    expect(getByText(/Weather Forecast/i)).toBeTruthy();
    expect(getByText(/Product Scanner/i)).toBeTruthy();
    expect(getByText(/Spray Records/i)).toBeTruthy();
  });

  it('shows logout dialog when logout button is pressed', async () => {
    const { getByTestId, queryByTestId } = render(<HomeScreen navigation={mockNavigation} />);

    expect(queryByTestId('confirm-dialog')).toBeNull();

    const logoutButton = getByTestId('logout-button');
    fireEvent.press(logoutButton);

    await waitFor(() => {
      expect(queryByTestId('confirm-dialog')).toBeTruthy();
    });
  });

  it('calls logout when confirm button is pressed', async () => {
    const { getByTestId } = render(<HomeScreen navigation={mockNavigation} />);

    const logoutButton = getByTestId('logout-button');
    fireEvent.press(logoutButton);

    await waitFor(() => {
      const confirmButton = getByTestId('confirm-button');
      fireEvent.press(confirmButton);
    });

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
    });
  });

  it('navigates to feature screen when card is pressed', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);

    const weatherCard = getByText(/Weather Forecast/i);
    fireEvent.press(weatherCard);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Weather');
  });

  it('shows coming soon alert for disabled features', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);

    const expenseCard = getByText(/Expense Tracker/i);
    fireEvent.press(expenseCard);

    expect(global.alert).toHaveBeenCalledWith(expect.stringContaining('Coming Soon'));
  });
});
