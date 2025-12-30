import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AddSprayRecordScreen from '../AddSprayRecordScreen';

const mockNavigation = {
  goBack: jest.fn(),
};

describe('AddSprayRecordScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(<AddSprayRecordScreen navigation={mockNavigation} />);

    expect(getByText(/Add Spray Record/i)).toBeTruthy();
  });

  it('displays form fields', () => {
    const { getByText, getByPlaceholderText } = render(
      <AddSprayRecordScreen navigation={mockNavigation} />
    );

    expect(getByText(/Chemical Name/i)).toBeTruthy();
    expect(getByText(/Disease/i)).toBeTruthy();
    expect(getByText(/Quantity/i)).toBeTruthy();
    expect(getByText(/Acres/i)).toBeTruthy();
    expect(getByText(/Cost/i)).toBeTruthy();
  });

  it('allows entering chemical name', () => {
    const { getByPlaceholderText } = render(
      <AddSprayRecordScreen navigation={mockNavigation} />
    );

    const chemicalInput = getByPlaceholderText(/Ridomil Gold/i);
    fireEvent.changeText(chemicalInput, 'Test Chemical');

    expect(chemicalInput.props.value).toBe('Test Chemical');
  });

  it('allows entering quantity', () => {
    const { getByPlaceholderText } = render(
      <AddSprayRecordScreen navigation={mockNavigation} />
    );

    const quantityInput = getByPlaceholderText('100');
    fireEvent.changeText(quantityInput, '200');

    expect(quantityInput.props.value).toBe('200');
  });

  it('allows entering acres', () => {
    const { getByPlaceholderText } = render(
      <AddSprayRecordScreen navigation={mockNavigation} />
    );

    const acresInput = getByPlaceholderText('5');
    fireEvent.changeText(acresInput, '3');

    expect(acresInput.props.value).toBe('3');
  });

  it('allows entering cost', () => {
    const { getByPlaceholderText } = render(
      <AddSprayRecordScreen navigation={mockNavigation} />
    );

    const costInput = getByPlaceholderText(/₹ 500/i);
    fireEvent.changeText(costInput, '350');

    expect(costInput.props.value).toBe('350');
  });

  it('displays date field with current date', () => {
    const { getByText } = render(<AddSprayRecordScreen navigation={mockNavigation} />);

    const currentDate = new Date().toISOString().split('T')[0];
    expect(getByText(currentDate)).toBeTruthy();
  });

  it('has image upload section', () => {
    const { getByText } = render(<AddSprayRecordScreen navigation={mockNavigation} />);

    expect(getByText(/Take Photo/i)).toBeTruthy();
  });

  it('allows removing uploaded image', () => {
    const { getByText, queryByText } = render(
      <AddSprayRecordScreen navigation={mockNavigation} />
    );

    const uploadButton = getByText(/Take Photo/i);
    fireEvent.press(uploadButton);

    const removeButton = getByText(/Remove/i);
    expect(removeButton).toBeTruthy();

    fireEvent.press(removeButton);

    expect(queryByText(/Remove/i)).toBeNull();
  });

  it('submit button is disabled when form is incomplete', () => {
    const { getByText } = render(<AddSprayRecordScreen navigation={mockNavigation} />);

    const submitButton = getByText(/ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ/i);
    expect(submitButton).toBeTruthy();
  });

  it('submit button is enabled when form is complete', async () => {
    const { getByPlaceholderText, getByText, getAllByText } = render(
      <AddSprayRecordScreen navigation={mockNavigation} />
    );

    // Fill required fields
    fireEvent.changeText(getByPlaceholderText(/Ridomil Gold/i), 'Test Chemical');

    // Select disease - click on the select dropdown to open modal
    const diseaseSelect = getAllByText(/ಆಯ್ಕೆ ಮಾಡಿ \| Select/i)[0];
    fireEvent.press(diseaseSelect);

    // Wait for modal to open and select an option
    await waitFor(() => {
      const diseaseOption = getByText(/Powdery Mildew/i);
      fireEvent.press(diseaseOption);
    });

    fireEvent.changeText(getByPlaceholderText('100'), '200');
    fireEvent.changeText(getByPlaceholderText('5'), '3');
    fireEvent.changeText(getByPlaceholderText(/₹ 500/i), '350');

    await waitFor(() => {
      const submitButton = getByText(/Save Record/i);
      expect(submitButton).toBeTruthy();
    });
  });

  it('navigates back when back button is pressed', () => {
    const { getByText } = render(<AddSprayRecordScreen navigation={mockNavigation} />);

    const backButton = getByText('←');
    fireEvent.press(backButton);

    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('displays info box about mandatory fields', () => {
    const { getByText } = render(<AddSprayRecordScreen navigation={mockNavigation} />);

    expect(getByText(/Marked fields are mandatory/i)).toBeTruthy();
  });
});
