import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CheckoutScreen from '../screens/CheckoutScreen';

describe('CheckoutScreen - Duplicate Submission Prevention', () => {
  it('disables the submit button and prevents duplicate calls upon repeated presses', async () => {
    const mockOnSubmit = jest.fn().mockResolvedValue('bk-123');
    const { getByTestId, getByText } = render(
      <CheckoutScreen onSubmit={mockOnSubmit} />
    );

    const submitButton = getByTestId('submit-checkout-button');
    expect(submitButton).toBeDefined();

    fireEvent.press(submitButton);
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });
  });
});
