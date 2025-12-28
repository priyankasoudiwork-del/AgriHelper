import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Register from '../../RegisterPage';

describe('Register Component Validation', () => {

  // EMAIL TESTS
  test('shows error when email is empty', () => {
    const { getByTestId, getByText } = render(<Register />);

    fireEvent.press(getByTestId('registerButton'));

    expect(getByText('Email is required')).toBeTruthy();
  });

  test('shows error when email format is invalid', () => {
    const { getByTestId, getByText } = render(<Register />);

    fireEvent.changeText(getByTestId('emailInput'), 'testmail.com');
    fireEvent.press(getByTestId('registerButton'));

    expect(getByText('Email is invalid')).toBeTruthy();
  });

  // PASSWORD TESTS
  test('shows error when password is empty', () => {
    const { getByTestId, getByText } = render(<Register />);

    fireEvent.changeText(getByTestId('emailInput'), 'test@mail.com');
    fireEvent.press(getByTestId('registerButton'));

    expect(getByText('Password is required')).toBeTruthy();
  });

  test('shows error when password is less than 6 characters', () => {
    const { getByTestId, getByText } = render(<Register />);

    fireEvent.changeText(getByTestId('emailInput'), 'test@mail.com');
    fireEvent.changeText(getByTestId('passwordInput'), 'Pa@1');
    fireEvent.press(getByTestId('registerButton'));

    expect(
      getByText('Password must be at least 6 characters')
    ).toBeTruthy();
  });

  test('shows error when password has no number or special character', () => {
    const { getByTestId, getByText } = render(<Register />);

    fireEvent.changeText(getByTestId('emailInput'), 'test@mail.com');
    fireEvent.changeText(getByTestId('passwordInput'), 'Password');
    fireEvent.press(getByTestId('registerButton'));

    expect(
      getByText('Password must contain a number and a special character')
    ).toBeTruthy();
  });

  // SUCCESS CASE
  test('does not show error for valid email and password', () => {
    const { getByTestId, queryByTestId } = render(<Register />);

    fireEvent.changeText(getByTestId('emailInput'), 'test@mail.com');
    fireEvent.changeText(getByTestId('passwordInput'), 'Pass@123');
    fireEvent.press(getByTestId('registerButton'));

    expect(queryByTestId('errorText')).toBeNull();
  });

});
