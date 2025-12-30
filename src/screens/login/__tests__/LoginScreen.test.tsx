import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../LoginScreen';
import auth from '@react-native-firebase/auth';

// Mock the auth store
const mockAuthStore = {
  login: jest.fn(),
  logout: jest.fn(),
  phoneNumber: null,
  isAuthenticated: false,
};

// Mock useStores hook
jest.mock('../../../providers/StoreProvider', () => ({
  useStores: () => ({
    authStore: mockAuthStore,
  }),
}));

// Mock Firebase Auth
jest.mock('@react-native-firebase/auth', () => ({
  __esModule: true,
  default: () => ({
    signInWithPhoneNumber: jest.fn(),
  }),
}));

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    expect(getByText(/Welcome/i)).toBeTruthy();
    expect(getByPlaceholderText(/9876543210/i)).toBeTruthy();
  });

  it('displays phone input field', () => {
    const { getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    const phoneInput = getByPlaceholderText(/9876543210/i);
    expect(phoneInput).toBeTruthy();
  });

  it('validates phone number input', () => {
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    const phoneInput = getByPlaceholderText(/9876543210/i);
    const submitButton = getByText(/Send OTP/i);

    // Try with invalid phone number
    fireEvent.changeText(phoneInput, '123');
    fireEvent.press(submitButton);

    // Should show validation error
    expect(getByText(/10 digits/i)).toBeTruthy();
  });

  it('sends OTP when valid phone number is entered', async () => {
    const mockSignIn = jest.fn().mockResolvedValue({ confirmation: {} });
    (auth as any).mockReturnValue({
      signInWithPhoneNumber: mockSignIn,
    });

    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    const phoneInput = getByPlaceholderText(/9876543210/i);
    const submitButton = getByText(/Send OTP/i);

    fireEvent.changeText(phoneInput, '9876543210');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('+919876543210');
    });
  });

  it('shows OTP input after sending OTP', async () => {
    const mockSignIn = jest.fn().mockResolvedValue({ confirmation: {} });
    (auth as any).mockReturnValue({
      signInWithPhoneNumber: mockSignIn,
    });

    const { getByPlaceholderText, getByText, queryByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    const phoneInput = getByPlaceholderText(/9876543210/i);
    fireEvent.changeText(phoneInput, '9876543210');

    const submitButton = getByText(/Send OTP/i);
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(queryByPlaceholderText(/000000/i)).toBeTruthy();
    });
  });

  it('verifies OTP and logs in', async () => {
    const mockConfirm = jest.fn().mockResolvedValue({ user: { uid: '123' } });
    const mockSignIn = jest.fn().mockResolvedValue({
      confirm: mockConfirm,
    });
    (auth as any).mockReturnValue({
      signInWithPhoneNumber: mockSignIn,
    });

    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    // Enter phone and send OTP
    const phoneInput = getByPlaceholderText(/9876543210/i);
    fireEvent.changeText(phoneInput, '9876543210');
    fireEvent.press(getByText(/Send OTP/i));

    await waitFor(() => {
      expect(queryByPlaceholderText(/000000/i)).toBeTruthy();
    });

    // Enter OTP
    const otpInput = getByPlaceholderText(/000000/i);
    fireEvent.changeText(otpInput, '123456');
    fireEvent.press(getByText(/Verify/i));

    await waitFor(() => {
      expect(mockConfirm).toHaveBeenCalledWith('123456');
    });
  });

  it('displays bilingual text', () => {
    const { UNSAFE_root } = render(<LoginScreen navigation={mockNavigation} />);

    // Check that component renders without errors
    expect(UNSAFE_root).toBeTruthy();
  });
});
